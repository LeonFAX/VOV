import re

with open('src/data/heroes.ts', 'r') as f:
    content = f.read()

# Extract all biography and feat blocks in order
bios = re.findall(r"biography: ('.*?'),\s*feat:", content, re.DOTALL)
feats = re.findall(r"feat: ('.*?'),\s*images:", content, re.DOTALL)

print(f"Total bios: {len(bios)}, Total feats: {len(feats)}")

# Get hero IDs in order
ids = re.findall(r"id: '(\d+)'", content)
print(f"Total heroes: {len(ids)}")

# Build replacement list
replacements = []
for i in range(len(ids)):
    if i < len(bios) - 1:
        # Shift down by 1
        new_bio = bios[i + 1]
        new_feat = feats[i + 1]
    else:
        # Last hero (id=95, Kryuchkov)
        new_bio = "'Николай Афанасьевич Крючков (1919–1943) — пулемётчик, Герой Советского Союза (посмертно, 1943), младший сержант. Родился в селе Большое Мурашкино Нижегородской области в крестьянской семье. В 1941 году призван в армию. С 1942 года — на фронте, в 957-м стрелковом полку 309-й стрелковой дивизии."
        new_feat = "'21 ноября 1943 года в бою под Киевом Крючков с пулемётом прикрывал отход раненых товарищей. Уничтожил более 80 солдат противника. Был ранен, но продолжал вести огонь до последнего патрона. Погиб в этом бою. Посмертно награждён орденом Ленина и званием Героя Советского Союза."
    replacements.append((new_bio, new_feat))

# Verify mapping
for i in range(min(5, len(ids))):
    print(f"id={ids[i]}: bio will be {replacements[i][0][:60]}...")

# Now replace each hero's bio/feat by finding the specific block
# We process in reverse order to preserve positions
new_content = content

for i in range(len(ids) - 1, -1, -1):
    hid = ids[i]
    new_bio, new_feat = replacements[i]
    
    # Find the specific hero block
    pattern = rf"(id: '{hid}',\s+firstName: '.*?'.*?)biography: ('.*?'),\s*feat: ('.*?'),"
    match = re.search(pattern, new_content, re.DOTALL)
    
    if match:
        old_bio = match.group(2)
        old_feat = match.group(3)
        
        # Replace feat first (comes after bio, so replacing first doesn't affect bio pos)
        # Actually, replace bio first since it's earlier in the string
        # But we need exact string positions
        
        # Find positions
        bio_start = match.start(2)
        bio_end = match.end(2)
        feat_start = match.start(3)
        feat_end = match.end(3)
        
        # Check if feat comes after bio
        if feat_start > bio_end:
            # Replace feat first (later in string)
            new_content = new_content[:feat_start] + new_feat + new_content[feat_end:]
            # Then replace bio
            new_content = new_content[:bio_start] + new_bio + new_content[bio_end:]
        else:
            print(f"Warning: feat before bio for id={hid}")
    else:
        print(f"Warning: Could not find hero {hid}")

with open('src/data/heroes.ts', 'w') as f:
    f.write(new_content)

print("Done!")
