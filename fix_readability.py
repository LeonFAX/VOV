import re, os

# Fix 1: HomePage StatsSection
def fix_homepage(content):
    # Stats section background: light -> dark
    content = content.replace('py-20 bg-[#EDE6D6]', 'py-20 bg-[#1A1712]')
    # Stats heading text
    content = content.replace("text-3xl md:text-4xl font-bold text-[#1A1612]", "text-3xl md:text-4xl font-bold text-[#E8D5C4]")
    return content

# Fix 2: LettersPage
def fix_letters_page(content):
    # Heading text
    content = content.replace("text-4xl md:text-5xl font-bold text-[#1A1612]", "text-4xl md:text-5xl font-bold text-[#E8D5C4]")
    # Description text
    content = content.replace('text-[#5A4D3F] text-lg max-w-2xl', 'text-[#A09080] text-lg max-w-2xl')
    # Search input
    content = content.replace('bg-[#EDE6D6] border-[#C9B896] text-[#1A1612] placeholder:text-[#8A7D6E]', 
                               'bg-[#231E15] border-[#3D3225] text-[#E8D5C4] placeholder:text-[#706050]')
    # Search icon
    content = content.replace('text-[#5A4D3F]"', 'text-[#706050]"', 1)
    return content

# Fix 3: LetterCard
def fix_letter_card(content):
    # Title text on dark overlay
    content = content.replace('text-[#1A1612] font-bold text-sm', 'text-[#E8D5C4] font-bold text-sm')
    # Badge text
    content = content.replace('bg-[#8B0000]/80 rounded text-[#1A1612]', 'bg-[#5A1A1A]/80 rounded text-[#E8D5C4]')
    return content

# Fix 4: EventsPage
def fix_events_page(content):
    # Heading text
    content = content.replace("text-4xl md:text-5xl font-bold text-[#1A1612]", "text-4xl md:text-5xl font-bold text-[#E8D5C4]")
    # Description text
    content = content.replace('text-[#5A4D3F] text-lg max-w-2xl', 'text-[#A09080] text-lg max-w-2xl')
    # Search input
    content = content.replace('bg-[#EDE6D6] border-[#C9B896] text-[#1A1612] placeholder:text-[#8A7D6E]', 
                               'bg-[#231E15] border-[#3D3225] text-[#E8D5C4] placeholder:text-[#706050]')
    # Search icon
    content = content.replace('text-[#5A4D3F]"', 'text-[#706050]"', 1)
    return content

# Fix 5: MonumentsPage
def fix_monuments_page(content):
    # Heading text
    content = content.replace("text-4xl md:text-5xl font-bold text-[#1A1612]", "text-4xl md:text-5xl font-bold text-[#E8D5C4]")
    # Description text
    content = content.replace('text-[#5A4D3F] text-lg max-w-2xl', 'text-[#A09080] text-lg max-w-2xl')
    # Search input
    content = content.replace('bg-[#EDE6D6] border-[#C9B896] text-[#1A1612] placeholder:text-[#8A7D6E]', 
                               'bg-[#231E15] border-[#3D3225] text-[#E8D5C4] placeholder:text-[#706050]')
    # Search icon  
    content = content.replace('text-[#5A4D3F]"', 'text-[#706050]"', 1)
    return content

# Fix 6: EventCard
def fix_event_card(content):
    # Card background
    content = content.replace("bg-[#EDE6D6] rounded-lg overflow-hidden border-l-4", 
                               "bg-[#231E15] rounded-lg overflow-hidden border-l-4")
    content = content.replace("hover:bg-[#C9B896]", "hover:bg-[#2A2319]")
    # Title text
    content = content.replace("text-[#1A1612] font-semibold mb-2 group-hover:text-[#8B6914]", 
                               "text-[#E8D5C4] font-semibold mb-2 group-hover:text-[#B8956A]")
    # Description text
    content = content.replace("text-[#5A4D3F] text-sm leading-relaxed mb-3", 
                               "text-[#A09080] text-sm leading-relaxed mb-3")
    content = content.replace("text-[#5A4D3F] text-sm mb-4", 
                               "text-[#A09080] text-sm mb-4")
    # Location text
    content = content.replace("text-[#5A4D3F] text-xs", "text-[#706050] text-xs", 1)
    return content

# Fix 7: MonumentCard
def fix_monument_card(content):
    # Card background
    content = content.replace("group bg-[#EDE6D6] rounded-lg overflow-hidden", 
                               "group bg-[#231E15] rounded-lg overflow-hidden")
    content = content.replace("border-[#C9B896] hover:border-[#8B6914]/30", 
                               "border-[#3D3225] hover:border-[#2E5A3C]/30")
    # Title text
    content = content.replace("text-[#1A1612] font-semibold text-lg mb-2 group-hover:text-[#8B6914]", 
                               "text-[#E8D5C4] font-semibold text-lg mb-2 group-hover:text-[#B8956A]")
    # Description text
    content = content.replace("text-[#5A4D3F] text-sm leading-relaxed mb-4", 
                               "text-[#A09080] text-sm leading-relaxed mb-4")
    # Meta text
    content = content.replace("text-[#5A4D3F] text-xs", "text-[#706050] text-xs", 1)
    # Border bottom
    content = content.replace("border-t border-[#C9B896]", "border-t border-[#3D3225]")
    return content

# Process all files
fixes = {
    'src/pages/HomePage.tsx': fix_homepage,
    'src/pages/LettersPage.tsx': fix_letters_page,
    'src/components/cards/LetterCard.tsx': fix_letter_card,
    'src/pages/EventsPage.tsx': fix_events_page,
    'src/pages/MonumentsPage.tsx': fix_monuments_page,
    'src/components/cards/EventCard.tsx': fix_event_card,
    'src/components/cards/MonumentCard.tsx': fix_monument_card,
}

for filepath, fix_fn in fixes.items():
    try:
        with open(filepath, 'r') as f:
            content = f.read()
        
        original = content
        content = fix_fn(content)
        
        if content != original:
            with open(filepath, 'w') as f:
                f.write(content)
            print(f"Fixed: {filepath}")
        else:
            print(f"No changes: {filepath}")
    except Exception as e:
        print(f"Error: {filepath}: {e}")

print("\nDone!")
