import os

color_map = [
    # Backgrounds
    ('bg-[#0F1923]', 'bg-[#181410]'),
    ('bg-[#1A2A3A]', 'bg-[#231E15]'),
    ('bg-[#1E3040]', 'bg-[#2A2319]'),
    ('bg-[#2A4050]', 'bg-[#3D3225]'),
    ('bg-[#152030]', 'bg-[#1C1810]'),

    # Text
    ('text-[#D4CFC7]', 'text-[#D4C4A0]'),
    ('text-[#8A9DAD]', 'text-[#8A7D6E]'),
    ('text-[#6A7D8D]', 'text-[#706050]'),
    ('text-[#6B8CAE]', 'text-[#C9A86A]'),
    ('text-[#8BA4BE]', 'text-[#D4B896]'),

    # Borders
    ('border-[#2A4050]', 'border-[#3D3225]'),
    ('border-[#8B3A3A]', 'border-[#8B3A3A]'),
    ('border-[#9A4A4A]', 'border-[#9A4A4A]'),

    # Hover
    ('hover:bg-[#2A4050]', 'hover:bg-[#3D3225]'),
    ('hover:bg-[#1E3040]', 'hover:bg-[#2A2319]'),
    ('hover:text-[#D4CFC7]', 'hover:text-[#D4C4A0]'),
    ('hover:text-[#6B8CAE]', 'hover:text-[#C9A86A]'),
    ('hover:text-[#8BA4BE]', 'hover:text-[#D4B896]'),
    ('hover:border-[#6B8CAE]', 'hover:border-[#C9A86A]'),
    ('hover:border-[#4A6A80]', 'hover:border-[#2E5A3C]'),

    # Red accents
    ('bg-[#8B3A3A]', 'bg-[#8B3A3A]'),
    ('bg-[#9A4A4A]', 'bg-[#9A4A4A]'),
    ('text-[#8B3A3A]', 'text-[#8B3A3A]'),
    ('text-[#9A4A4A]', 'text-[#9A4A4A]'),

    # Placeholder
    ('placeholder:text-[#5A6D7D]', 'placeholder:text-[#706050]'),

    # Input bg
    ('bg-[#E5DED0]', 'bg-[#231E15]'),
    ('bg-[#EDE6D6]', 'bg-[#231E15]'),

    # Layout bg
    ('bg-[#0F1923]', 'bg-[#181410]'),

    # Special blue -> gold
    ('#4A6A80', '#C9A86A'),
    ('#6B8CAE', '#D4B896'),
    ('#8BA4BE', '#E8D5C4'),
]

files_fixed = 0
for root, dirs, filenames in os.walk('src'):
    for f in filenames:
        if not f.endswith('.tsx'):
            continue
        filepath = os.path.join(root, f)

        with open(filepath, 'r') as file:
            content = file.read()

        original = content
        for old, new in color_map:
            content = content.replace(old, new)

        if content != original:
            with open(filepath, 'w') as file:
                file.write(content)
            files_fixed += 1

print(f"Fixed {files_fixed} files")
