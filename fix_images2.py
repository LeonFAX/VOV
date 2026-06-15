import re, os

with open('src/data/heroes.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Map: lastName -> real image path (only if file exists)
photo_map = {
    'Жуков': '/images/heroes/zhukov.jpg',
    'Рокоссовский': '/images/heroes/rokosovsky.jpg',
    'Василевский': '/images/heroes/vasilevsky.jpg',
    'Конев': '/images/heroes/konev.jpg',
    'Чуйков': '/images/heroes/chuikov.jpg',
    'Кожедуб': '/images/heroes/kozhedub.jpg',
    'Покрышкин': '/images/heroes/pokryshkin.jpg',
    'Зайцев': '/images/heroes/zaytsev.jpg',
    'Павличенко': '/images/heroes/pavlichenko.jpg',
    'Гастелло': '/images/heroes/gastello.jpg',
    'Брежнев': '/images/heroes/brezhnev.jpg',
    'Лавриненко': '/images/heroes/lavrinenko.jpg',
    'Панфилов': '/images/heroes/panfilov.jpg',
    'Маринеско': '/images/heroes/marinesko.jpg',
    'Ковпак': '/images/heroes/kovpak.jpg',
    'Катуков': '/images/heroes/katukov.jpg',
    'Космодемьянская': '/images/heroes/kosmodemyanskaya.jpg',
    'Октябрьская': '/images/heroes/oktyabrskaya.jpg',
    'Ефремов': '/images/heroes/efremov.jpg',
    'Лобанок': '/images/heroes/lobanok.jpg',
    'Машеров': '/images/heroes/masherov.jpg',
    'Матросов': '/images/heroes/matrosov.jpg',
    'Мазаник': '/images/heroes/mazanik.jpg',
    'Орловский': '/images/heroes/orlovsky.jpg',
    'Павловский': '/images/heroes/pavlovsky.jpg',
    'Талалихин': '/images/heroes/talalikhin.jpg',
    'Высоцкий': '/images/heroes/vysotsky.jpg',
    'Заслонов': '/images/heroes/zaslonov.jpg',
    'Литвяк': '/images/heroes/litvyak.jpg',
    'Баграмян': '/images/heroes/bagramyan.jpg',
    'Гризодубова': '/images/heroes/grizodubova.jpg',
    'Ротмистров': '/images/heroes/rotmistrov.jpg',
    'Колобанов': '/images/heroes/kolobanov.jpg',
    'Маресьев': '/images/heroes/maresev.jpg',
    'Буданова': '/images/heroes/budanova.jpg',
    'Гаврилов': '/images/heroes/gavrilov.jpg',
}

count = 0
for last_name, img_path in photo_map.items():
    # Check if file exists
    full_path = 'public' + img_path
    if not os.path.exists(full_path):
        print(f"SKIP (not found): {last_name}")
        continue
    
    pattern = rf"(lastName: '{re.escape(last_name)}',.*?images: \[')(/images/heroes/[^']+)(\'])"
    def repl(m):
        return m.group(1) + img_path + m.group(3)
    new_content, num = re.subn(pattern, repl, content, count=1, flags=re.DOTALL)
    if num > 0:
        content = new_content
        count += 1
        print(f"OK: {last_name}")
    else:
        print(f"NOT FOUND: {last_name}")

with open('src/data/heroes.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\nDone: {count} heroes updated")
