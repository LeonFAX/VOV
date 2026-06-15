import re

with open('src/data/heroes.ts', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = [
    ('lastName: \'Жуков\'', '/images/heroes/zhukov.jpg'),
    ('lastName: \'Рокоссовский\'', '/images/heroes/rokosovsky.jpg'),
    ('lastName: \'Кожедуб\'', '/images/heroes/kozhedub.jpg'),
    ('lastName: \'Покрышкин\'', '/images/heroes/pokryshkin.jpg'),
    ('lastName: \'Зайцев\'', '/images/heroes/zaytsev.jpg'),
    ('lastName: \'Павличенко\'', '/images/heroes/pavlichenko.jpg'),
    ('lastName: \'Гастелло\'', '/images/heroes/gastello.jpg'),
    ('lastName: \'Чуйков\'', '/images/heroes/chuikov.jpg'),
    ('lastName: \'Конев\'', '/images/heroes/konev.jpg'),
    ('lastName: \'Лавриненко\'', '/images/heroes/lavrinenko.jpg'),
    ('lastName: \'Космодемьянская\'', '/images/heroes/kosmodemyanskaya.jpg'),
    ('lastName: \'Ефремов\'', '/images/heroes/efremov.jpg'),
    ('lastName: \'Лобанок\'', '/images/heroes/lobanok.jpg'),
    ('lastName: \'Машеров\'', '/images/heroes/masherov.jpg'),
    ('lastName: \'Матросов\'', '/images/heroes/matrosov.jpg'),
    ('lastName: \'Мазаник\'', '/images/heroes/mazanik.jpg'),
    ('lastName: \'Октябрьская\'', '/images/heroes/oktyabrskaya.jpg'),
    ('lastName: \'Орловский\'', '/images/heroes/orlovsky.jpg'),
    ('lastName: \'Павловский\'', '/images/heroes/pavlovsky.jpg'),
    ('lastName: \'Талалихин\'', '/images/heroes/talalikhin.jpg'),
    ('lastName: \'Высоцкий\'', '/images/heroes/vysotsky.jpg'),
    ('lastName: \'Заслонов\'', '/images/heroes/zaslonov.jpg'),
]

count = 0
for last_name_marker, img_path in replacements:
    pattern = rf"({re.escape(last_name_marker)}.*?images: \[')(/images/heroes/[^']+)(\'])"
    def repl(m):
        return m.group(1) + img_path + m.group(3)
    new_content, num = re.subn(pattern, repl, content, count=1, flags=re.DOTALL)
    if num > 0:
        content = new_content
        count += 1
        print(f"OK: {last_name_marker.split(':')[1].strip()}")

with open('src/data/heroes.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\nDone: {count}")
