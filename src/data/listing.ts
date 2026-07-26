const CDN = "https://cdn.syarah.com";
const ASSETS = "https://cdn-frontend-r2.syarah.com/prod/assets/images";

export const assets = {
  imagesGrey: `${ASSETS}/ImagesGGrey.svg`,
  imagesBlue: `${ASSETS}/ImagesBBlue.svg`,
  imagesWhite: `${ASSETS}/ImagesBWhite.svg`,
  whiteArrowBack: `${ASSETS}/whitearrowBack.svg`,
  closeSlider: `${ASSETS}/closeBslider.svg`,
  roundArrow: `${ASSETS}/roundArrow.svg`,
  arithmetic: `${ASSETS}/arithmetic.svg`,
  greyCheck: `${ASSETS}/GreyCheck.svg`,
  callGreen: `${ASSETS}/CallGreen.svg`,
  share: "https://cdn-frontend-r2.syarah.com/prod/assets/bundles/share.svg",
  lightBlueArrow: `${ASSETS}/lightBlueArrow.svg`,
  gasStation: `${ASSETS}/local_gas_station.svg`,
  used: `${ASSETS}/used.svg`,
  warranty: `${CDN}/syarah/bundles/warranty-new.png`,
  bnplAmwalSmall: `${CDN}/syarah/bundles/bnpl-amwal.png`,
  bnplTamaraSmall: `${CDN}/syarah/bundles/bnpl-tamara.png`,
  bnplTabbySmall: `${CDN}/syarah/bundles/bnpl-tabby.png`,
  amwal: `${CDN}/syarah/bundles/bnpl-amwal-logo-v5.png`,
  tamara: `${CDN}/syarah/bundles/tamara-logo-4-ar.png`,
  tabby: `${CDN}/syarah/bundles/bnpl-tabby-logo-v3.png`,
};

const photo = (name: string) =>
  `${CDN}/photos-thumbs/online-v1/0x683/online/posts/309250/${name}?v=3`;

export const galleryImages = [
  "orignal-1784556513-516_cut.jpg",
  "orignal-1784556511-440_cut.jpg",
  "orignal-1784556510-234_cut.jpg",
  "orignal-1784556514-965_cut.jpg",
  "orignal-1784556508-870_cut.jpg",
  "orignal-1784556508-894_cut.jpg",
  "orignal-1784556509-233_cut.jpg",
  "orignal-1784556507-408_cut.jpg",
  "orignal-1784556514-616_cut.jpg",
  "orignal-309250-49-1784546975.jpg",
  "orignal-309250-14-1784546975.jpg",
  "orignal-309250-16-1784546975.jpg",
  "orignal-309250-8-1784546975.jpg",
  "orignal-309250-9-1784546975.jpg",
  "orignal-309250-10-1784546975.jpg",
  "orignal-309250-17-1784546975.jpg",
  "orignal-309250-18-1784546975.jpg",
  "orignal-309250-20-1784546975.jpg",
  "orignal-309250-19-1784546975.jpg",
  "orignal-309250-23-1784546975.jpg",
  "orignal-309250-29-1784546975.jpg",
  "orignal-309250-25-1784546975.jpg",
  "orignal-309250-38-1784546975.jpg",
  "orignal-309250-26-1784546975.jpg",
  "orignal-309250-28-1784546975.jpg",
  "orignal-309250-33-1784546975.jpg",
  "orignal-309250-30-1784546975.jpg",
  "orignal-309250-27-1784546975.jpg",
  "orignal-309250-24-1784546975.jpg",
  "orignal-309250-21-1784546975.jpg",
  "orignal-309250-22-1784546975.jpg",
  "orignal-309250-34-1784546975.jpg",
  "orignal-309250-32-1784546975.jpg",
  "orignal-309250-36-1784546975.jpg",
  "orignal-309250-35-1784546975.jpg",
].map(photo);

export const carTitle = "دونج فينج شاين E1 2026";

const specIcon = (n: string) => `${CDN}/syarah/bundles/post_details/${n}.svg`;

export const carInfo: { icon: string; label: string; value: string }[] = [
  { icon: specIcon("car_make"), label: "الماركة", value: "دونج فينج" },
  { icon: specIcon("car_model"), label: "النوع", value: "شاين" },
  { icon: specIcon("car_year"), label: "الموديل", value: "2026" },
  { icon: `${CDN}/syarah/bundles/Extention.svg`, label: "الفئة", value: "E1" },
  { icon: specIcon("ext_color"), label: "اللون الخارجي", value: "رمادي" },
  { icon: specIcon("int_color"), label: "اللون الداخلي", value: "أسود" },
  { icon: specIcon("car_origin"), label: "الوارد", value: "سعودي" },
  { icon: specIcon("fuel_type"), label: "نوع الوقود", value: "بنزين" },
  { icon: `${CDN}/syarah/bundles/Gear.svg`, label: "نوع القير", value: "اوتوماتيك" },
  { icon: specIcon("gear_speed"), label: "سرعات القير", value: "6" },
  { icon: specIcon("cylinder"), label: "عدد السلندرات", value: "4 سيليندر" },
  { icon: specIcon("car_status"), label: "الحالة", value: "جديدة" },
  { icon: `${CDN}/syarah/bundles/engine_size.svg`, label: "حجم المحرك", value: "1.5" },
  { icon: specIcon("car_drivetrain"), label: "نوع الدفع", value: "FWD دفع امامي" },
  { icon: specIcon("car_key"), label: "عدد مفاتيح السيارة", value: "1" },
  { icon: specIcon("car_seats"), label: "عدد المقاعد", value: "5" },
  { icon: specIcon("car_engine_type"), label: "نوع المحرك", value: "تنفس طبيعي" },
  { icon: specIcon("fuel_tank"), label: "سعة خزان الوقود", value: "50 لتر" },
  { icon: specIcon("car_horse_power"), label: "القدرة بالحصان", value: "123 حصان" },
  { icon: assets.gasStation, label: "استهلاك الوقود", value: "20.1 (كم/لتر)" },
];

export const featureGroups: { title: string; items: string[] }[] = [
  {
    title: "الامان",
    items: [
      "وسائد هوائية امامية",
      "فرامل ABS",
      "مراقبة ضغط الاطارات",
      "الثبات الإلكتروني ESP",
      "المساعدة على صعود المرتفعات HAC",
      "أحزمة أمان",
      "EBD توزيع قوة الفرامل الكترونيا",
      "نظام التحكم بالإنزلاق (TRC)",
      "فرامل يد الكترونى",
    ],
  },
  {
    title: "الراحة",
    items: [
      "مقاعد جلد",
      "تشغيل بصمة",
      "تحكم دريكسون",
      "مثبت سرعة",
      "زجاج كهربائي",
      "مكيف أوتوماتيك",
      "تحكم مقاعد يدوى",
      "ISOFIX لتثبيت مقاعد الاطفال",
    ],
  },
  {
    title: "تقنيات",
    items: ["بلوتوث", "مدخل USB", "كاميرا خلفية", "منافذ طاقة", "شاشة وسائط", "راديو"],
  },
  {
    title: "تجهيزات خارجية",
    items: [
      "مرايا تحكم كهربائي",
      "جنوط",
      "اشارات بالمرايا",
      "دخول ذكي",
      "مصابيح ضباب خلفية",
      "أنوار نهارية LED",
      "التحكم بارتفاع الأنوار الأمامية",
    ],
  },
];

export const carDescription =
  "دونج فينج شاين E1 2026 جديدة لون رمادي بسعر 44,275 ريال شامل الضريبة، وتقدر تموّلها بقسط شهري يبدأ من 885 ريال، تتوفر هذه السيارة بمحرك 1.5، 4 سيليندر بنزين ومع ناقل حركة اوتوماتيك، اشترها وأنت متكي ومرتاح وبنوصلها لك لين باب بيتك، احجزها من خلال سيارة الآن.";

export type SimilarCar = {
  title: string;
  cash: string;
  installment: string;
  images: string[];
  href: string;
  ribbon?: string;
  bnpl: boolean;
};

const simPhoto = (post: string, name: string) =>
  `${CDN}/photos-thumbs/online-v1/0x426/online/posts/${post}/${name}?v=3`;

export const similarCars: SimilarCar[] = [
  {
    title: "ام جي 5 STD 2026",
    cash: "45,126",
    installment: "902",
    ribbon: "خصم ١٠٠٠  و غسيل مجاني",
    bnpl: true,
    href: "https://syarah.com/cardetail/mg-5-new-304188",
    images: [
      "orignal-1780817363-173_cut.jpg",
      "orignal-1780817360-479_cut.jpg",
      "orignal-1780817362-957_cut.jpg",
      "orignal-1780817356-853_cut.jpg",
      "orignal-1780817362-435_cut.jpg",
    ].map((n) => simPhoto("304188", n)),
  },
  {
    title: "ام جي 5 STD 2026",
    cash: "45,126",
    installment: "902",
    ribbon: "خصم ١٠٠٠  و غسيل مجاني",
    bnpl: true,
    href: "https://syarah.com/cardetail/mg-5-new-304187",
    images: [
      "orignal-1780814257-542_cut.jpg",
      "orignal-1780814258-207_cut.jpg",
      "orignal-1780814256-412_cut.jpg",
      "orignal-1780814257-322_cut.jpg",
      "orignal-1780814258-303_cut.jpg",
    ].map((n) => simPhoto("304187", n)),
  },
  {
    title: "ام جي 5 STD 2026",
    cash: "45,126",
    installment: "902",
    ribbon: "خصم ١٠٠٠  و غسيل مجاني",
    bnpl: true,
    href: "https://syarah.com/cardetail/mg-5-new-304185",
    images: [
      "orignal-1780837372-310_cut.jpg",
      "orignal-1780814009-76_cut.jpg",
      "orignal-1780814006-410_cut.jpg",
      "orignal-1780814006-248_cut.jpg",
      "orignal-1780814008-511_cut.jpg",
    ].map((n) => simPhoto("304185", n)),
  },
  {
    title: "دونج فينج شاين E1 2026",
    cash: "46,000",
    installment: "920",
    bnpl: false,
    href: "https://syarah.com/cardetail/dongfeng-shine-new-291396",
    images: [
      "orignal-1772571754-986.jpg",
      "orignal-1772571755-685.jpg",
      "orignal-1772571752-503.jpg",
      "orignal-1764406114-916.jpeg",
      "orignal-1764406114-923.jpeg",
    ].map((n) => simPhoto("291396", n)),
  },
];

export const recentCar: SimilarCar = {
  title: "دونج فينج شاين E1 2026",
  cash: "44,275",
  installment: "885",
  ribbon: "غسيل مجاني ٣ اشهر",
  bnpl: true,
  href: "https://syarah.com/cardetail/dongfeng-shine-new-309250",
  images: galleryImages.slice(0, 5),
};

export const faqs = [
  {
    q: "كيف طريقة شراء سيارة؟",
    a: "تتم في البداية عملية شراء السيارة من خلال دفع عربون, هذا العربون مخصوم من سعر السيارة الاجمالي و مسترد في حال عدم اتمام عملية الشراء شرط عدم تثبيت حجز السيارة.",
  },
  {
    q: "كيف أدفع قيمة السيارة؟",
    a: "يمكنك دفع باقي قيمة السيارة وذلك بعد تأكيد حجز السيارة مع موظف المبيعات المختص، ويكون ذلك بواسطة خدمة سداد السعودية وهي الأسهل والأسرع أو حوالة مصرفية لحساب الشركة لدى بنك الرياض. سيساعدك موظفينا في اجراء الدفع بكل يسر ان شاء الله.",
  },
  {
    q: "هل موقعكم معتمد من قبل وزارة التجارة؟",
    a: "نعم! هذا الموقع موثق من وزارة التجارة والاستثمار وبدعم من شركة علم, بسجل تجاري رقم 1010538980.",
  },
];
