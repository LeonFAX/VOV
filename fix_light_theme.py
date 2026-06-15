import re, os

# Color mapping: current (dark theme) -> new (light newspaper theme)
color_map = {
    'bg-[#1A1712]': 'bg-[#F5F0E4]',           # main background -> old paper
    'bg-[#2A2319]': 'bg-[#EDE6D6]',           # card background -> light folder
    'bg-[#231E15]': 'bg-[#E5DED0]',           # darker card bg
    'border-[#3D3225]': 'border-[#C9B896]',  # borders -> sand
    'text-[#E8D5C4]': 'text-[#1A1612]',       # main text light -> dark
    'text-[#F5F0E8]': 'text-[#1A1612]',       # cream text -> dark
    'text-[#F5F0E4]': 'text-[#1A1612]',       # cream text -> dark
    'text-[#B8956A]': 'text-[#8B6914]',       # gold accent -> dark gold
    'bg-[#5A1A1A]': 'bg-[#8B0000]',           # red accent
    'text-[#A09080]': 'text-[#5A4D3F]',       # secondary text
    'text-[#706050]': 'text-[#8A7D6E]',       # tertiary text
    'text-[#B0B0B0]': 'text-[#6A5D50]',       # gray text
    'hover:bg-[#2A2319]': 'hover:bg-[#E0D8C8]',       # hover dark -> hover light
    'hover:bg-[#3D3225]/50': 'hover:bg-[#C9B896]/50', # hover border
    'hover:bg-[#3D3225]/40': 'hover:bg-[#C9B896]/40',
    'hover:border-[#B8956A]': 'hover:border-[#8B6914]', # hover gold
    'hover:border-[#B8956A]/40': 'hover:border-[#8B6914]/40',
    'border-[#3D3225]/60': 'border-[#C9B896]/60',
    'border-[#5A1A1A]': 'border-[#8B0000]',
    'border-[#5A1A1A]/30': 'border-[#8B0000]/30',
    'border-[#5A1A1A]/20': 'border-[#8B0000]/20',
    'border-[#7A2A2A]': 'border-[#A03030]',
    'border-[#7A2A2A]/50': 'border-[#A03030]/50',
    'bg-[#5A1A1A]/20': 'bg-[#8B0000]/10',
    'bg-[#5A1A1A]/10': 'bg-[#8B0000]/8',
    'bg-[#5A1A1A]/90': 'bg-[#8B0000]/90',
    'bg-[#5A1A1A]/80': 'bg-[#8B0000]/80',
    'bg-[#5A1A1A]/40': 'bg-[#8B0000]/40',
    'bg-[#5A1A1A]/30': 'bg-[#8B0000]/30',
    'text-[#8B0000]': 'text-[#8B0000]',        # keep red
    'text-[#D4B896]': 'text-[#8B6914]',       # lighter gold -> dark gold
    '#1A1712': '#F5F0E4',                       # raw colors
    '#2A2319': '#EDE6D6',
    '#231E15': '#E5DED0',
    '#3D3225': '#C9B896',
    '#E8D5C4': '#1A1612',
    '#F5F0E8': '#1A1612',
    '#F5F0E4': '#1A1612',
    '#B8956A': '#8B6914',
    '#5A1A1A': '#8B0000',
    '#A09080': '#5A4D3F',
    '#706050': '#8A7D6E',
    '#B0B0B0': '#6A5D50',
    '#D4B896': '#8B6914',
}

# Files to update (skip Header and Footer - they stay dark)
files = []
for root, dirs, filenames in os.walk('src'):
    for f in filenames:
        if f.endswith(('.tsx', '.ts', '.css')):
            filepath = os.path.join(root, f)
            # Skip Header and Footer - we handle them manually
            if 'Header.tsx' in filepath or 'Footer.tsx' in filepath:
                continue
            files.append(filepath)

for filepath in files:
    try:
        with open(filepath, 'r') as f:
            content = f.read()
        
        original = content
        for old, new in color_map.items():
            content = content.replace(old, new)
        
        if content != original:
            with open(filepath, 'w') as f:
                f.write(content)
            print(f"Updated: {filepath}")
    except Exception as e:
        print(f"Error with {filepath}: {e}")

print("\nDone!")
