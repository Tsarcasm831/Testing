import json
import shutil
from pathlib import Path

INPUT_PATH = Path(__file__).resolve().parent.parent / 'poeskilltree.json'
OUTPUT_DIR = Path(__file__).resolve().parent.parent / 'poe_tree'
MAX_SIZE_KB = 1000

CATEGORY_MAP = (
    ('ascendancy', lambda node: node.get('ascendancyName')),
    ('masteries', lambda node: node.get('isMastery')),
    ('keystones', lambda node: node.get('isKeystone')),
    ('notables', lambda node: node.get('isNotable')),
    ('jewel_sockets', lambda node: node.get('isJewelSocket')),
    ('ascendancy_starts', lambda node: node.get('isAscendancyStart')),
    ('multiple_choice', lambda node: node.get('isMultipleChoice')),
    ('multiple_choice_options', lambda node: node.get('isMultipleChoiceOption')),
    ('proxy', lambda node: node.get('isProxy')),
    ('blighted', lambda node: node.get('isBlighted')),
    ('attribute_granting', lambda node: any(node.get(k) for k in ('grantedStrength', 'grantedDexterity', 'grantedIntelligence'))),
    ('normal', lambda node: True),
)


def ensure_clean_output():
    if OUTPUT_DIR.exists():
        shutil.rmtree(OUTPUT_DIR)
    OUTPUT_DIR.mkdir()
    (OUTPUT_DIR / 'ascendancies').mkdir()
    (OUTPUT_DIR / 'general').mkdir()


def load_data():
    with INPUT_PATH.open('r', encoding='utf-8') as handle:
        return json.load(handle)


def collect_type_flags(node):
    flags = []
    if node.get('isMastery'):
        flags.append('M')
    if node.get('isKeystone'):
        flags.append('K')
    if node.get('isNotable'):
        flags.append('N')
    if node.get('isJewelSocket'):
        flags.append('J')
    if node.get('isAscendancyStart'):
        flags.append('AS')
    if node.get('isMultipleChoice'):
        flags.append('MC')
    if node.get('isMultipleChoiceOption'):
        flags.append('MCO')
    if node.get('isProxy'):
        flags.append('P')
    if node.get('isBlighted'):
        flags.append('B')
    if node.get('grantedPassivePoints'):
        flags.append('GPP')
    return ','.join(flags)


def format_mastery_effects(effects):
    if not effects:
        return ''
    chunks = []
    for effect in effects:
        effect_id = effect.get('effect', '')
        stats = ';'.join(effect.get('stats', []))
        chunks.append(f"{effect_id}->{stats}")
    return '|'.join(chunks)


def compact_list(items):
    if not items:
        return ''
    return ';'.join(str(item) for item in items)


def format_node_line(node_id, node):
    parts = [f"{node_id}:{node.get('name') or 'Unnamed Node'}"]
    ascendancy = node.get('ascendancyName')
    if ascendancy:
        parts.append(f"A={ascendancy}")
    group = node.get('group')
    if group is not None:
        parts.append(f"G={group}")
    orbit = node.get('orbit')
    orbit_index = node.get('orbitIndex')
    if orbit is not None or orbit_index is not None:
        parts.append(f"O={orbit}/{orbit_index}")
    skill = node.get('skill')
    if skill is not None:
        parts.append(f"S={skill}")
    flags = collect_type_flags(node)
    if flags:
        parts.append(f"F={flags}")
    attr_parts = []
    for key, label in (('grantedStrength', 'Str'), ('grantedDexterity', 'Dex'), ('grantedIntelligence', 'Int')):
        val = node.get(key)
        if val:
            attr_parts.append(f"{label}{val}")
    if attr_parts:
        parts.append(f"Attr={','.join(attr_parts)}")
    passive = node.get('grantedPassivePoints')
    if passive:
        parts.append(f"PP={passive}")
    stats = compact_list(node.get('stats'))
    if stats:
        parts.append(f"Stats={stats}")
    reminder = compact_list(node.get('reminderText'))
    if reminder:
        parts.append(f"Rem={reminder}")
    mastery = format_mastery_effects(node.get('masteryEffects'))
    if mastery:
        parts.append(f"Mastery={mastery}")
    recipe = compact_list(node.get('recipe'))
    if recipe:
        parts.append(f"Recipe={recipe}")
    flavour = node.get('flavourText')
    if flavour:
        if isinstance(flavour, list):
            flavour = ';'.join(flavour)
        flavour = str(flavour).replace('\n', ' ')
        parts.append(f"Flavour={flavour}")
    # Icon metadata is omitted to keep the compact representation below the size limit.
    incoming = compact_list(node.get('in'))
    if incoming:
        parts.append(f"In={incoming}")
    outgoing = compact_list(node.get('out'))
    if outgoing:
        parts.append(f"Out={outgoing}")
    return '- ' + ' | '.join(parts)


def write_ascendancy_files(data):
    nodes = data['nodes']
    per_ascendancy = {}
    for node_id, node in nodes.items():
        name = node.get('ascendancyName')
        if not name:
            continue
        per_ascendancy.setdefault(name, []).append((node_id, node))
    for ascendancy, items in sorted(per_ascendancy.items()):
        lines = [f"# {ascendancy}"]
        for node_id, node in sorted(items, key=lambda entry: entry[0]):
            lines.append(format_node_line(node_id, node))
        output_path = OUTPUT_DIR / 'ascendancies' / f"{ascendancy.replace(' ', '_')}.md"
        output_path.write_text('\n'.join(lines) + '\n', encoding='utf-8')


def write_general_files(data):
    nodes = data['nodes']
    remaining = set(nodes.keys())
    for node_id, node in nodes.items():
        if node.get('ascendancyName'):
            remaining.discard(node_id)
    for category, predicate in CATEGORY_MAP:
        if category == 'ascendancy':
            continue
        lines = [f"# {category}"]
        matched = []
        for node_id in sorted(remaining):
            node = nodes[node_id]
            if predicate(node):
                matched.append(node_id)
        if not matched:
            continue
        for node_id in matched:
            node = nodes[node_id]
            lines.append(format_node_line(node_id, node))
            remaining.discard(node_id)
        (OUTPUT_DIR / 'general' / f"{category}.md").write_text('\n'.join(lines) + '\n', encoding='utf-8')


def write_groups_file(data):
    lines = ['# groups']
    for group_id, group in sorted(data['groups'].items(), key=lambda entry: int(entry[0])):
        nodes_list = compact_list(group.get('nodes'))
        x = group.get('x')
        y = group.get('y')
        orbit = compact_list(group.get('orbit')) if isinstance(group.get('orbit'), list) else group.get('orbit')
        cls_idx = group.get('classStartIndex')
        chunk = f"- {group_id}|x={x}|y={y}|orbit={orbit}|classStartIndex={cls_idx}|nodes={nodes_list}"
        lines.append(chunk)
    (OUTPUT_DIR / 'groups.md').write_text('\n'.join(lines) + '\n', encoding='utf-8')


def write_readme():
    readme = """# Path of Exile Passive Skill Tree (Compact)

This tree is a compact representation derived from `poeskilltree.json`. It lists every
passive skill node, its requirements, metadata, and connections while keeping the
overall footprint under 1000 kB.

- `ascendancies/`: Nodes that belong to each ascendancy.
- `general/`: Non-ascendancy nodes arranged by gameplay-relevant categories.
- `groups.md`: Positional groups with layout metadata from the original tree.
"""
    (OUTPUT_DIR / 'README.md').write_text(readme.strip() + '\n', encoding='utf-8')


def enforce_size_limit():
    size_kb = sum(p.stat().st_size for p in OUTPUT_DIR.rglob('*')) / 1024
    if size_kb > MAX_SIZE_KB:
        raise RuntimeError(f"Generated tree exceeds {MAX_SIZE_KB} kB (actual: {size_kb:.2f} kB)")


def main():
    data = load_data()
    ensure_clean_output()
    write_ascendancy_files(data)
    write_general_files(data)
    write_groups_file(data)
    write_readme()
    enforce_size_limit()


if __name__ == '__main__':
    main()
