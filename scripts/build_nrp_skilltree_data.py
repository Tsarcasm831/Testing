import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA_ROOT = ROOT / "NRPskilltree_split"

classes_dir = DATA_ROOT / "01_classes"
groups_dir = DATA_ROOT / "02_groups"


def load_classes():
    classes = []
    for path in sorted(classes_dir.glob("*.json")):
        data = json.loads(path.read_text(encoding="utf-8"))
        children = []
        for specialization in data.get("specializations", []):
            spec_children = []
            techniques = specialization.get("signature_techniques", [])
            if techniques:
                spec_children.append(
                    {
                        "name": "Signature Techniques",
                        "type": "collection",
                        "children": [
                            {"name": technique, "type": "technique"}
                            for technique in techniques
                        ],
                    }
                )
            members = specialization.get("notable_members", [])
            if members:
                spec_children.append(
                    {
                        "name": "Notable Members",
                        "type": "collection",
                        "children": [
                            {"name": member, "type": "person"}
                            for member in members
                        ],
                    }
                )
            children.append(
                {
                    "name": specialization.get("name", "Unnamed Specialization"),
                    "type": "specialization",
                    "metadata": {
                        "description": specialization.get("description"),
                    },
                    "children": spec_children,
                }
            )

        classes.append(
            {
                "name": data.get("name", path.stem.replace("_", " ")),
                "type": "class",
                "metadata": {
                    "village": data.get("village"),
                    "base_chakra_control": data.get("base_chakra_control"),
                    "base_ninjutsu": data.get("base_ninjutsu"),
                    "base_taijutsu": data.get("base_taijutsu"),
                },
                "children": children,
            }
        )
    return classes


def load_groups():
    categories = {}
    for path in sorted(groups_dir.glob("*.json")):
        data = json.loads(path.read_text(encoding="utf-8"))
        category_name = data.get("category", "Uncategorized").replace("-", " ").title()
        entries = data.get("entries", [])
        cat_entries = categories.setdefault(category_name, [])
        for entry in entries:
            cat_entries.append(
                {
                    "name": entry.get("title", "Unnamed Entry"),
                    "type": "jutsu",
                    "metadata": {
                        "summary": entry.get("summary"),
                        "source_file": entry.get("file"),
                    },
                }
            )
    groups = []
    for category_name in sorted(categories):
        groups.append(
            {
                "name": category_name,
                "type": "category",
                "children": categories[category_name],
            }
        )
    return groups


def build_tree():
    return {
        "name": "NRP Skill Tree",
        "type": "root",
        "children": [
            {"name": "Classes", "type": "section", "children": load_classes()},
            {"name": "Technique Groups", "type": "section", "children": load_groups()},
        ],
    }


def main():
    tree = build_tree()
    output_path = ROOT / "web" / "nrp_skilltree_data.json"
    output_path.write_text(json.dumps(tree, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {output_path}")


if __name__ == "__main__":
    main()
