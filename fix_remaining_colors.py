import re, os

# Additional color fixes for remaining old colors
color_map = {
    '#1A1A1A': '#1A1612',
    '#242424': '#EDE6D6',
    '#2E2E2E': '#C9B896',
    '#C9A86A': '#8B6914',
    '#F5F5F5': '#F5F0E4',
    '#B0B0B0': '#6A5D50',
    '#707070': '#8A7D6E',
    '#8B0000': '#8B0000',  # keep
    'border-[#2E2E2E]': 'border-[#C9B896]',
    'bg-[#2E2E2E]': 'bg-[#C9B896]',
    'text-[#2E2E2E]': 'text-[#C9B896]',
    'hover:bg-[#2E2E2E]': 'hover:bg-[#C9B896]',
}

files = []
for root, dirs, filenames in os.walk('src'):
    for f in filenames:
        if f.endswith(('.tsx', '.ts', '.css')):
            files.append(os.path.join(root, f))

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
        print(f"Error: {filepath}: {e}")

print("\nDone!")
