import re

with open('src/data/heroes.ts', 'r') as f:
    content = f.read()

# Mapping: award name pattern -> correct image path
# These replacements target the specific award name within each award block
award_image_map = {
    r"(name: 'Орден [«\"]?Победа[»\"]?',.*?image: )'/awards/[^']+'": r"\1'/awards/order-victory.png'",
    r"(name: 'Орден Суворова.*?',.*?image: )'/awards/[^']+'": r"\1'/awards/order-suvorov-1.png'",
    r"(name: 'Орден Кутузова.*?',.*?image: )'/awards/[^']+'": r"\1'/awards/order-kutuzov-1.png'",
    r"(name: 'Орден Александра Невского',.*?image: )'/awards/[^']+'": r"\1'/awards/order-nevsky.png'",
    r"(name: 'Орден Богдана Хмельницкого.*?',.*?image: )'/awards/[^']+'": r"\1'/awards/order-khmelnitsky-1.png'",
    r"(name: 'Орден Славы.*?',.*?image: )'/awards/[^']+'": r"\1'/awards/order-glory-1.png'",
    r"(name: 'Медаль «За оборону Москвы»',.*?image: )'/awards/[^']+'": r"\1'/awards/medal-defense-moscow.png'",
    r"(name: 'Медаль «За оборону Сталинграда»',.*?image: )'/awards/[^']+'": r"\1'/awards/medal-defense-stalingrad.png'",
    r"(name: 'Медаль «За оборону Ленинграда»',.*?image: )'/awards/[^']+'": r"\1'/awards/medal-defense-leningrad.png'",
    r"(name: 'Медаль «За оборону Кавказа»',.*?image: )'/awards/[^']+'": r"\1'/awards/medal-defense-caucasus.png'",
    r"(name: 'Медаль «За победу над Германией»',.*?image: )'/awards/[^']+'": r"\1'/awards/medal-victory-germany.png'",
    r"(name: 'Медаль «За победу над Японией»',.*?image: )'/awards/[^']+'": r"\1'/awards/medal-victory-japan.png'",
    r"(name: 'Медаль «Партизану Отечественной войны».*?',.*?image: )'/awards/[^']+'": r"\1'/awards/medal-partisan-1.png'",
}

counts = {}
for pattern, replacement in award_image_map.items():
    matches = re.findall(pattern, content, re.DOTALL)
    if matches:
        counts[pattern[:40]] = len(matches)
        content = re.sub(pattern, replacement, content, flags=re.DOTALL)

print("Replacements made:")
for k, v in counts.items():
    print(f"  {k}... -> {v} times")

with open('src/data/heroes.ts', 'w') as f:
    f.write(content)

print("Done!")
