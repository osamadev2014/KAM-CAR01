## Goal

Recreate the syarah.com vehicle detail page for "دونج فينج شاين E1 2026" (listing 309250) as a static, pixel-faithful RTL Arabic page at `/`, using the reference's own CDN images, icons, logos, text and layout.

## Page structure (same order as reference)

1. Sticky white header — hamburger menu (right of viewport is logo in RTL: hamburger left, سيارة logo right), thin bottom border/shadow
2. Breadcrumb row — الرئيسية / سيارات و مركبات / دونج فينج / شاين / 2026
3. Two-column body (RTL: gallery column on left ~62%, info column on right ~38%; stacks on mobile)
   - **Right/info column**: title `دونج فينج شاين E1 2026`, `جديدة` badge, divider, price card (سعر الكاش 44,275 with SAR symbol | التقسيط 885 /شهرياً + احسب التمويل link), `السعر يشمل الضريبة المضافة` line, `سوقها الآن، و ادفع لاحقًا !` heading, three BNPL cards (SNB/amwal, tamara, tabby logos + their exact copy), `هل أنت مؤهل للتمويل؟` link, green `احجزها الآن` button, outlined `اتصل بنا للحجز` button with call icon, favourite + share row, `رقم الإعلان: 309250` and the note line
   - **Left/gallery column**: main image with prev/next circular arrows, `اضغط لتكبير الصورة` overlay, `1/35` counter, green promo strip `غسيل مجاني ٣ اشهر` + `اعرف اكثر`, thumbnail strip below
4. `معلومات السيارة` section title, then collapsible cards, each with the round-arrow toggle icon:
   - معلومات السيارة — 19 spec rows in a 2-column icon+label+value grid, plus استهلاك الوقود 20.1 (كم/لتر)
   - الامان (9 items), الراحة (8), تقنيات (6), تجهيزات خارجية (7) — chip/list layout with check bullets
   - تفاصيل السيارة — full description paragraph verbatim
5. `سيارات مشابهة` — horizontal card carousel, 4 cards (MG 5 ×3, Dongfeng Shine ×1) with promo ribbon `خصم ١٠٠٠ و غسيل مجاني`, image, title, cash/installment prices, جديدة badge, ضمان الوكيل warranty logo, BNPL logos
6. `سيارات شوهدت مؤخراً` section heading
7. `اسئلة متكررة` — 3 accordion questions with their exact answers + `المزيد من الاسئلة المتكررة` link
8. Mobile sticky bottom bar (call + book) as on the reference
9. Footer — recreated from the reference footer (links, app badges, payment/social icons)

## Interactions

- Gallery: thumbnail click switches main image, arrow prev/next, counter updates, fullscreen lightbox on main-image click (with close/back/images controls), keyboard arrows
- Accordions: all spec sections expand/collapse with rotating round-arrow icon
- Similar-cars: per-card image dot rotation on hover, horizontal scroll/arrows
- FAQ accordion, favourite toggle, hover states on every button/card/link

## Technical notes

- Single route: rewrite `src/routes/index.tsx`; page composed of reusable components in `src/components/cardetail/` (Header, Breadcrumb, Gallery, PriceCard, BnplCard, SpecCard, FeatureList, SimilarCarCard, Faq, Footer, StickyBar)
- `dir="rtl"` and `lang="ar"` on the root html; Arabic web font matching the reference loaded via `<link>` in `__root.tsx`
- All listing data (35 image URLs, specs, features, similar cars, FAQ) in one typed data module — no backend needed
- Colors/typography added as design tokens in `src/styles.css` (syarah green `#00b45f`-family, blue accents, greys) rather than hardcoded utilities
- Images and icons referenced directly from the reference CDN URLs; nothing regenerated or replaced
- Route `head()` with the listing title/description and og/twitter tags
- Verification: run the page in a headless browser at desktop/tablet/mobile widths and compare screenshots against the reference, iterating on spacing/size deltas
