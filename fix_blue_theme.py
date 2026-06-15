import os, re

# Color mapping: old (brown/dark) -> new (blue steel)
color_map = [
    # Backgrounds
    ('bg-[#1A1712]', 'bg-[#0F1923]'),      # main bg
    ('bg-[#231E15]', 'bg-[#1A2A3A]'),      # card bg
    ('bg-[#2A2319]', 'bg-[#1E3040]'),      # lighter card
    ('bg-[#3D3225]', 'bg-[#2A4050]'),      # border/hover
    ('bg-[#1C1812]', 'bg-[#152030]'),      # dark accent
    
    # Text
    ('text-[#E8D5C4]', 'text-[#D4CFC7]'),  # main text
    ('text-[#A09080]', 'text-[#8A9DAD]'),  # secondary text
    ('text-[#706050]', 'text-[#6A7D8D]'),  # muted text
    ('text-[#B8956A]', 'text-[#6B8CAE]'),  # accent gold -> steel blue
    ('text-[#D4B896]', 'text-[#8BA4BE]'),  # lighter accent
    ('text-[#F5F0E4]', 'text-[#D4CFC7]'),  # cream text
    ('text-[#F5F0E8]', 'text-[#D4CFC7]'),  # cream text 2
    
    # Special text that should stay light
    ('text-[#1A1612]', 'text-[#D4CFC7]'),  # was dark-on-dark fix
    ('text-[#1A1712]', 'text-[#D4CFC7]'),  # 
    
    # Borders
    ('border-[#3D3225]', 'border-[#2A4050]'),
    ('border-[#5A1A1A]', 'border-[#8B3A3A]'),  # red borders
    ('border-[#7A2A2A]', 'border-[#9A4A4A]'),  # red borders lighter
    
    # Hover states
    ('hover:bg-[#3D3225]', 'hover:bg-[#2A4050]'),
    ('hover:bg-[#2A2319]', 'hover:bg-[#1E3040]'),
    ('hover:text-[#E8D5C4]', 'hover:text-[#D4CFC7]'),
    ('hover:text-[#B8956A]', 'hover:text-[#6B8CAE]'),
    ('hover:text-[#D4B896]', 'hover:text-[#8BA4BE]'),
    ('hover:border-[#B8956A]', 'hover:border-[#6B8CAE]'),
    ('hover:border-[#2E5A3C]', 'hover:border-[#4A6A80]'),
    
    # Red accents (more muted)
    ('bg-[#5A1A1A]', 'bg-[#8B3A3A]'),
    ('bg-[#8B0000]', 'bg-[#8B3A3A]'),
    ('bg-[#A03030]', 'bg-[#9A4A4A]'),
    ('text-[#8B0000]', 'text-[#9A4A4A]'),
    ('text-[#CC0000]', 'text-[#9A4A4A]'),
    
    # Placeholder
    ('placeholder:text-[#706050]', 'placeholder:text-[#5A6D7D]'),
    ('placeholder:text-[#8A7D6E]', 'placeholder:text-[#5A6D7D]'),
    
    # Divider and accent
    ('#2E5A3C', '#4A6A80'),   # green -> blue
    ('#5A1A1A', '#8B3A3A'),   # red muted
    
    # Input backgrounds
    ('bg-[#E5DED0]', 'bg-[#1A2A3A]'),
    ('bg-[#EDE6D6]', 'bg-[#1A2A3A]'),
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
