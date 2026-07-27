create table public.car_makes (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name_ar     text not null,
  name_en     text not null,
  logo_path   text not null,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

create table public.car_models (
  id          uuid primary key default gen_random_uuid(),
  make_id     uuid not null references public.car_makes(id) on delete cascade,
  name_ar     text not null,
  name_en     text,
  created_at  timestamptz not null default now(),
  unique (make_id, name_ar)
);

create index car_models_make_id_idx on public.car_models (make_id);

alter table public.car_makes  enable row level security;
alter table public.car_models enable row level security;

create policy "public read makes"  on public.car_makes  for select using (true);
create policy "public read models" on public.car_models for select using (true);

create policy "admin write makes"  on public.car_makes  for all to authenticated using (true) with check (true);
create policy "admin write models" on public.car_models for all to authenticated using (true) with check (true);

insert into public.car_makes (slug, name_ar, name_en, logo_path, sort_order) values
('chevrolet','شفروليه','Chevrolet','/logos/chevrolet.png',1),
('haval','هافال','Haval','/logos/haval.png',2),
('mg','ام جي','MG','/logos/mg.png',3),
('suzuki','سوزوكي','Suzuki','/logos/suzuki.png',4),
('mazda','مازدا','Mazda','/logos/mazda.png',5),
('nissan','نيسان','Nissan','/logos/nissan.png',6),
('kia','كيا','Kia','/logos/kia.png',7),
('hyundai','هيونداي','Hyundai','/logos/hyundai.png',8),
('toyota','تويوتا','Toyota','/logos/toyota.png',9),
('renault','رينو','Renault','/logos/renault.png',10),
('chery','شيري','Chery','/logos/chery.png',11),
('mercedes-benz','مرسيدس','Mercedes-Benz','/logos/mercedes-benz.png',12),
('bmw','بي ام دبليو','BMW','/logos/bmw.png',13),
('changan','شانجان','Changan','/logos/changan.png',14),
('geely','جيلي','Geely','/logos/geely.png',15),
('lexus','لكزس','Lexus','/logos/lexus.png',16),
('ford','فورد','Ford','/logos/ford.png',17),
('gac','GAC','GAC','/logos/gac.png',18),
('dodge','دودج','Dodge','/logos/dodge.png',19),
('genesis','جينيسيس','Genesis','/logos/genesis.png',20),
('peugeot','بيجو','Peugeot','/logos/peugeot.png',21),
('faw','فاو','FAW','/logos/faw.png',22),
('mitsubishi','ميتسوبيشي','Mitsubishi','/logos/mitsubishi.png',23),
('land-rover','لاند روفر','Land Rover','/logos/land-rover.png',24),
('gmc','جي إم سي','GMC','/logos/gmc.png',25),
('jeep','جيب','Jeep','/logos/jeep.png',26),
('honda','هوندا','Honda','/logos/honda.png',27),
('mini','میني','MINI','/logos/mini.png',28),
('lucid','لوسيد','Lucid','/logos/lucid.png',29),
('isuzu','ايسوزو','Isuzu','/logos/isuzu.png',30),
('great-wall','جريت وول','Great Wall','/logos/great-wall.png',31),
('baic','باك','BAIC','/logos/baic.png',32),
('audi','اودي','Audi','/logos/audi.png',33),
('jmc','JMC','JMC','/logos/jmc.png',34),
('jetour','جيتور','Jetour','/logos/jetour.png',35),
('volkswagen','فولكس فاجن','Volkswagen','/logos/volkswagen.png',36),
('tesla','تسلا','Tesla','/logos/tesla.png',37),
('rox','روكس','Rox','/logos/rox.png',38),
('lincoln','لينكولن','Lincoln','/logos/lincoln.png',39),
('cmc','سي ام سي','CMC','/logos/cmc.png',40),
('porsche','بورش','Porsche','/logos/porsche.png',41),
('chrysler','كرايسلر','Chrysler','/logos/chrysler.png',42),
('fiat','فيات','Fiat','/logos/fiat.png',43),
('infiniti','انفنتي','Infiniti','/logos/infiniti.png',44),
('cadillac','كاديلاك','Cadillac','/logos/cadillac.png',45),
('baw-212','BAW 212','BAW 212','/logos/baw-212.png',46),
('victory-auto','فكتوريا اوتو','Victory Auto','/logos/victory-auto.png',47),
('maserati','مازيراتي','Maserati','/logos/maserati.png',48),
('dongfeng','دونج فينج','Dongfeng','/logos/dongfeng.png',49),
('hongqi','هونشي','Hongqi','/logos/hongqi.png',50),
('buick','بيوك','Buick','/logos/buick.png',51),
('skoda','سكودا','Skoda','/logos/skoda.png',52),
('omoda','اومودا','Omoda','/logos/omoda.png',53),
('jaecoo','جايكو','Jaecoo','/logos/jaecoo.png',54);
