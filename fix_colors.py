import re

# Color mapping for the military sepia theme
# old_color -> new_color
color_map = {
    '#1A1A1A': '#1A1712',
    '#242424': '#2A2319',
    '#2E2E2E': '#3D3225',
    '#F5F5F5': '#E8D5C4',
    '#C9A86A': '#B8956A',
    '#8B0000': '#5A1A1A',
    '#B0B0B0': '#A09080',
    '#707070': '#706050',
    '#707070\'': '#706050\'',  # handle with quotes
}

# Files to update
files = [
    'src/pages/HomePage.tsx',
    'src/pages/AboutPage.tsx',
    'src/pages/AdminPage.tsx',
    'src/pages/EventDetailPage.tsx',
    'src/pages/EventsPage.tsx',
    'src/pages/LetterDetailPage.tsx',
    'src/pages/LettersPage.tsx',
    'src/pages/LoginPage.tsx',
    'src/pages/MonumentDetailPage.tsx',
    'src/pages/MonumentsPage.tsx',
    'src/pages/SearchPage.tsx',
    'src/pages/TimelinePage.tsx',
    'src/components/cards/EventCard.tsx',
    'src/components/cards/LetterCard.tsx',
    'src/components/cards/MonumentCard.tsx',
]

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
        else:
            print(f"No changes: {filepath}")
    except FileNotFoundError:
        print(f"Not found: {filepath}")
    except Exception as e:
        print(f"Error with {filepath}: {e}")

print("\nDone!")
