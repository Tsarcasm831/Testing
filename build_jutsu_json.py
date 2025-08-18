#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Builds a filter-friendly JSON of all Naruto jutsu that appear in the Anime.

Outputs:
  - jutsu_all.json      : list of normalized jutsu objects
  - facets.json         : aggregated unique values for quick client-side filters

How it works (high level):
  1) Uses MediaWiki API to list every page in Category:Jutsu.
  2) For each page, fetches Semantic MediaWiki RDF (ExportRDF) to read structured fields
     like Chakra Nature, Classification, Rank, Range, Class, Users, Debuts, Appears in, etc.
  3) Filters to keep only jutsu with Appears in including "Anime".
  4) Grabs a short description (from RDF rdfs:comment; falls back to lead paragraph HTML).
  5) Normalizes data into consistent keys/arrays and writes JSON.

Note:
  - Be polite to Fandom: this script sleeps lightly between requests.
  - If you want *all* media (manga, game, etc.), set FILTER_ANIME_ONLY=False.

Source references:
  BrowseData with Anime facet: https://naruto.fandom.com/wiki/Special:BrowseData/Jutsu?limit=5000&offset=0&_cat=Jutsu&Media=Anime
  Example page showing "Facts" + RDF link: https://naruto.fandom.com/wiki/Amaterasu
"""

import json
import re
import time
from html import unescape
from urllib.parse import quote, urlencode

import requests
from bs4 import BeautifulSoup
from xml.etree import ElementTree as ET

BASE = "https://naruto.fandom.com"
API = f"{BASE}/api.php"
EXPORT_RDF = f"{BASE}/wiki/Special:ExportRDF"
USER_AGENT = "AntonJutsuBuilder/1.0 (+for personal research; contact if needed)"

# Keep only anime appearing techniques?
FILTER_ANIME_ONLY = True

# Request pacing
PAUSE_BETWEEN_REQUESTS = 0.15  # seconds
PAUSE_BETWEEN_PAGES = 0.02

session = requests.Session()
session.headers.update({"User-Agent": USER_AGENT, "Accept": "*/*"})


def log(msg):
    print(msg, flush=True)


def list_all_jutsu_titles():
    """Return set of page titles in Category:Jutsu (main namespace only)."""
    titles = set()
    params = {
        "action": "query",
        "list": "categorymembers",
        "cmtitle": "Category:Jutsu",
        "cmlimit": "500",
        "format": "json",
    }
    while True:
        r = session.get(API, params=params, timeout=30)
        r.raise_for_status()
        data = r.json()
        for item in data["query"]["categorymembers"]:
            # ns 0 == article/mainspace
            if item.get("ns") == 0:
                titles.add(item["title"])
        if "continue" in data:
            params.update(data["continue"])
            time.sleep(PAUSE_BETWEEN_REQUESTS)
        else:
            break
    return sorted(titles)


# XML namespaces used by ExportRDF
NS = {
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "swivt": "http://semantic-mediawiki.org/swivt/1.0#",
    "wiki": "http://naruto.fandom.com/Special:URIResolver/",
    "property": "http://naruto.fandom.com/Special:URIResolver/Property-3A",
}

# Mapping of semantic property labels to our output keys and acceptable SMW property IDs.
PROPERTY_MAP = {
    # field_name: [possible SMW property names (spaces->underscored)]
    "chakra_natures": ["Chakra_Nature", "Chakra_nature"],
    "classification": ["Jutsu_classification", "Classification"],
    "rank": ["Rank"],
    "range": ["Jutsu_range", "Range"],
    "class_type": ["Jutsu_class_type", "Class", "Jutsu_class"],
    "clan": ["Clan"],
    "hand_seals": ["Hand_seals", "Hand_Seals", "Handsigns"],
    "users": ["User_tech", "Users", "User_of_technique"],
    "appears_in": ["Appears_in", "Appears_In"],
    "debut_anime": ["Debut_anime"],
    "debut_manga": ["Debut_manga"],
    "debut_game": ["Debut_game"],
    "debut_ova": ["Debut_ova"],
    "romaji_name": ["Romaji_name"],
    "kanji_name": ["Kanji_name"],
}


def _last_segment(uri: str) -> str:
    """Return the last path-like segment of a URI and prettify (underscores->spaces)."""
    if not uri:
        return ""
    seg = uri.rsplit("/", 1)[-1]
    return unescape(seg.replace("_", " "))


def fetch_rdf(title: str) -> ET.Element:
    """Download and parse the ExportRDF XML for a page title."""
    url = f"{EXPORT_RDF}/{quote(title.replace(' ', '_'))}"
    r = session.get(url, timeout=30)
    r.raise_for_status()
    try:
        return ET.fromstring(r.content)
    except ET.ParseError:
        # Occasionally the XML includes HTML entities or other noise; try text cleanup
        cleaned = re.sub(rb"&(?![a-zA-Z#0-9]+;)", b"&amp;", r.content)
        return ET.fromstring(cleaned)


def extract_from_rdf(root: ET.Element) -> dict:
    """Extract structured fields from the SMW RDF export."""
    subject = root.find("swivt:Subject", NS)
    if subject is None:
        return {}

    data = {}
    # URL + title + summary if present
    page_el = subject.find("swivt:page", NS)
    data["url"] = page_el.text if page_el is not None else None

    label_el = subject.find("rdfs:label", NS)
    data["name"] = label_el.text if label_el is not None else None

    # Many pages include a short abstract/summary here:
    comment_el = subject.find("rdfs:comment", NS)
    if comment_el is not None and comment_el.text:
        data["description"] = comment_el.text.strip()

    # Collect each property in PROPERTY_MAP
    for out_key, prop_names in PROPERTY_MAP.items():
        values = []
        for p in prop_names:
            # Try resource-valued nodes
            for el in subject.findall(f"property:{p}", NS):
                # Some props are xsd:string text, others are rdf:resource links
                res = el.get(f"{{{NS['rdf']}}}resource")
                if res:
                    values.append(_last_segment(res))
                elif el.text and el.text.strip():
                    values.append(el.text.strip())
        # Normalize to list or string depending on field
        if out_key in ("romaji_name", "kanji_name", "rank", "range", "class_type"):
            data[out_key] = values[0] if values else None
        else:
            # ensure uniqueness + drop empties
            uniq = sorted({v for v in values if v})
            data[out_key] = uniq

    return data


def fetch_lead_paragraph(title: str) -> str | None:
    """Fallback: scrape the first lead paragraph from the HTML page."""
    url = f"{BASE}/wiki/{quote(title.replace(' ', '_'))}"
    r = session.get(url, timeout=30)
    r.raise_for_status()
    soup = BeautifulSoup(r.text, "html.parser")
    # Find the first paragraph in the content before the table of contents
    content = soup.select_one("#mw-content-text")
    if not content:
        return None
    for p in content.select("p"):
        txt = p.get_text(" ", strip=True)
        if txt and len(txt) > 60:
            return txt
    return None


def normalize_entry(raw: dict) -> dict:
    """Final normalization for consistent filterability."""
    name = (raw.get("name") or "").strip()
    url = raw.get("url")
    description = raw.get("description")

    # Appears-in gate
    appears = {v.lower() for v in raw.get("appears_in") or []}
    if FILTER_ANIME_ONLY and "anime" not in appears:
        return {}  # filter out

    entry = {
        "name": name,
        "url": url,
        "description": description,  # possibly None here; we may fill below
        "classification": raw.get("classification") or [],
        "chakra_natures": raw.get("chakra_natures") or [],
        "rank": raw.get("rank"),
        "range": raw.get("range"),
        "class_type": raw.get("class_type"),
        "clan": raw.get("clan") or [],
        "users": raw.get("users") or [],
        "hand_seals": raw.get("hand_seals") or [],
        "appears_in": list(sorted(appears)) if appears else [],
        "debut": {
            "anime": raw.get("debut_anime"),
            "manga": raw.get("debut_manga"),
            "game": raw.get("debut_game"),
            "ova": raw.get("debut_ova"),
        },
        "names": {
            "romaji": raw.get("romaji_name"),
            "kanji": raw.get("kanji_name"),
        },
        "sources": {
            "export_rdf": f"{EXPORT_RDF}/{quote(name.replace(' ', '_'))}" if name else None,
            "page": url,
        },
    }

    # Deduplicate/clean trivial empties
    for k in ("classification", "chakra_natures", "clan", "users", "hand_seals", "appears_in"):
        entry[k] = sorted({v for v in entry[k] if v})

    return entry


def build_facets(entries: list[dict]) -> dict:
    """Aggregate unique values for common filters."""
    facets = {
        "classification": set(),
        "chakra_natures": set(),
        "rank": set(),
        "range": set(),
        "class_type": set(),
        "clan": set(),
        "appears_in": set(),
        "users": set(),  # large; keep if you want a user filter
    }
    for e in entries:
        for v in e.get("classification", []):
            facets["classification"].add(v)
        for v in e.get("chakra_natures", []):
            facets["chakra_natures"].add(v)
        for v in e.get("clan", []):
            facets["clan"].add(v)
        for v in e.get("appears_in", []):
            facets["appears_in"].add(v)
        for v in e.get("users", []):
            facets["users"].add(v)
        if e.get("rank"):
            facets["rank"].add(e["rank"])
        if e.get("range"):
            facets["range"].add(e["range"])
        if e.get("class_type"):
            facets["class_type"].add(e["class_type"])
    # Sort for stability
    return {k: sorted(v) for k, v in facets.items()}


def main():
    log("Fetching jutsu list from Category:Jutsu …")
    titles = list_all_jutsu_titles()
    log(f"Found {len(titles)} pages in Category:Jutsu")

    results = []
    for i, title in enumerate(titles, 1):
        try:
            root = fetch_rdf(title)
            raw = extract_from_rdf(root)
            entry = normalize_entry(raw)

            if not entry:
                # Either filtered out by media or RDF missing — skip early
                time.sleep(PAUSE_BETWEEN_PAGES)
                continue

            if not entry.get("description"):
                # Fallback lead paragraph scrape if RDF lacked rdfs:comment
                lead = fetch_lead_paragraph(title)
                if lead:
                    entry["description"] = lead

            # If description still None, set a conservative placeholder
            if not entry.get("description"):
                entry["description"] = "—"

            results.append(entry)

            if i % 50 == 0:
                log(f"Processed {i}/{len(titles)} …")
            time.sleep(PAUSE_BETWEEN_PAGES)
        except requests.HTTPError as e:
            log(f"[HTTP {e.response.status_code}] {title} — skipping")
        except Exception as e:
            log(f"[WARN] {title}: {e} — skipping")
        time.sleep(PAUSE_BETWEEN_REQUESTS)

    # Keep only unique names (some pages can alias)
    seen = set()
    deduped = []
    for e in results:
        key = (e["name"] or "").lower()
        if key and key not in seen:
            seen.add(key)
            deduped.append(e)

    log(f"Keeping {len(deduped)} anime jutsu")

    with open("jutsu_all.json", "w", encoding="utf-8") as f:
        json.dump(deduped, f, ensure_ascii=False, indent=2)

    facets = build_facets(deduped)
    with open("facets.json", "w", encoding="utf-8") as f:
        json.dump(facets, f, ensure_ascii=False, indent=2)

    log("Done. Wrote jutsu_all.json and facets.json")


if __name__ == "__main__":
    main()
