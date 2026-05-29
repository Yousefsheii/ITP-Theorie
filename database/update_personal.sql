-- Einmal ausfuehren, wenn die alten Beispieldaten schon in Supabase sind

update public.persons
set
  full_name = 'Yousef Sheii',
  job_title = 'Schueler 4DHIT – Informationstechnik',
  email = 'yousefsheik2@icloud.com',
  phone = '+43 660 0000000',
  location = 'Wien, Oesterreich (TGM)'
where id = (select id from public.persons order by id limit 1);

delete from public.cv_text_variants
where section_id in (
  select id from public.cv_sections where section_key = 'about'
);

insert into public.cv_text_variants (section_id, content, is_active)
select s.id, v.content, true
from public.cv_sections s
cross join (
  values
    ('Ich bin Yousef Sheii aus der 4DHIT am TGM und entwickle gerne Web-Apps mit Datenbankanbindung.'),
    ('Mein Schwerpunkt liegt auf Java, Webentwicklung und strukturierten IT-Projekten in SEW und ITP.'),
    ('Ich arbeite zuverlaessig im Team, dokumentiere meine Projekte und setze Anforderungen Schritt fuer Schritt um.')
) as v(content)
where s.section_key = 'about';

delete from public.cv_items
where section_id in (
  select id from public.cv_sections
  where section_key in ('experience', 'education', 'skills')
);

insert into public.cv_items (section_id, headline, subline, description, period_from, period_to, sort_order)
select s.id, v.headline, v.subline, v.description, v.period_from, v.period_to, v.sort_order
from public.cv_sections s
cross join (
  values
    ('experience', 'ITP-Projekt: Lebenslauf mit Datenbank', 'TGM Wien', 'Web-App mit Supabase, relationalem Schema und GET-API /api/cv', '2026', '2026', 1),
    ('experience', 'SEW-Projekte (Java)', 'GitHub', 'Expressions, FileSystem-Watcher und objektorientierte Programmierung', '2025', '2026', 2),
    ('experience', 'Roblox FIFA WM 2026', 'Eigenes Spiel', 'Lua-Skripte: Wetter, NPCs, Minispiele, Lootboxen und Stadion-Systeme', '2026', '2026', 3),
    ('education', 'TGM – Die Schule der Technik', 'Klasse 4DHIT', 'Informationstechnik, 4. Jahrgang', '2022', '2026', 1),
    ('education', 'Schwerpunkt Softwareentwicklung', 'HTL', 'Web, Datenbanken, Programmierung und Projektarbeit', '2022', '2026', 2),
    ('skills', 'HTML, CSS, JavaScript', 'Frontend', 'Responsive Websites und API-Anbindung', '', '', 1),
    ('skills', 'SQL / PostgreSQL (Supabase)', 'Datenbank', 'Relationale Tabellen, JOINs, SELECT-Requests', '', '', 2),
    ('skills', 'Java, Lua, Git, Vercel', 'Programmierung & Tools', 'SEW-Projekte, Roblox Studio, Deployment', '', '', 3)
) as v(section_key, headline, subline, description, period_from, period_to, sort_order)
where s.section_key = v.section_key;
