export type Dish = {
  id: string;
  card: string;
  kicker: string;
  lines: [string, string];
  body: string;
  /** Drop a photo here, then set `image` to this path. null keeps the empty frame. */
  image: string | null;
  imageFile: string;
  cutout?: boolean;
};

export const dishes: Dish[] = [
  {
    id: "market",
    card: "The market",
    kicker: "Browse our market",
    lines: ["We are passionate", "about organic food."],
    body: "The shop is full of gourmet goodies, whole foods, fresh fruit and vegetables, and sweet treats. Hundreds of lines, and plenty to look at on the shelves.",
    image: "/assets/product1.jpg",
    imageFile: "public/assets/product1.jpg",
    cutout: true,
  },
  {
    id: "cafe",
    card: "The café",
    kicker: "Enjoy our café",
    lines: ["Healthy food,", "with real flavour."],
    body: "A food lover's delight. Some organic, some conventional, and a simple home-cooked menu with vegan, dairy free, gluten free and sugar free choices.",
    image: "/assets/product2.jpg",
    imageFile: "public/assets/product2.jpg",
    cutout: true,

  },
  {
    id: "online",
    card: "Online shop",
    kicker: "Explore the online store",
    lines: ["Fresh, bulk and", "packaged foods."],
    body: "Vegan, raw, and the “free” options for whatever the diet asks for. Order ahead and collect from the shop in Stirling.",
    image: "/assets/product3.jpg",
    imageFile: "public/assets/product3.jpg",
    cutout: true,

  },
];

export type Story = {
  id: string;
  index: string;
  kicker: string;
  title: string;
  copy: string;
  tags: string[];
  action: string;
  href: string;
  image: string | null;
  imageFile: string;
  alt: string;
};

export type Hours = {
  id: string;
  label: string;
  rows: [string, string][];
};

export const about = {
  kicker: "The true cost",
  title: "We are passionate about providing you with the  widest range of organic & whole foods.",
  body: "It costs a little more to choose what is better for the planet, for animal welfare and for health. That is the ethos: say no to the industrial food system, and wherever possible partner with local suppliers of organic, biodynamic, non-GMO, free-range, seasonal produce.",
  image: "/assets/artichoke.png" as string | null,
  imageFile: "public/assets/artichoke.png",
  alt: "Watercolour artichoke",
};

/** Words pulled from the shop copy — they ride the scrolling band. */
export const marquee = [
  "Whole foods",
  "Fresh produce",
  "Gourmet goodies",
  "Café kitchen",
  "Bulk & packaged",
  "Sweet treats",
];

export const ethos = ["Organic", "Biodynamic", "Non-GMO", "Free range", "Seasonal", "Local suppliers"];

export const stories: Story[] = [
  {
    id: "market",
    index: "01",
    kicker: "In the shop",
    title: "Browse our market",
    copy: "Our store is chock-a-block full of diverse, interesting and delicious gourmet goodies, whole foods, fresh fruit and vegetables and sweet treats galore. With the hundreds of lines we carry, the shelves are a visual feast.",
    tags: ["Whole foods", "Fresh produce", "Gourmet goodies"],
    action: "Head to the Shop",
    href: "#shop",
    image: "/assets/shop.jpg",
    imageFile: "public/assets/shop.jpg",
    alt: "The shopfront at 5 Druid Ave, Stirling",
  },
  {
    id: "cafe",
    index: "02",
    kicker: "At the table",
    title: "Enjoy our café",
    copy: "The café is a food lover’s delight. Healthy food with flavour — some organic, some conventional — and a vegetarian focus that still leaves room for vegan, dairy free, gluten free and sugar free dishes.",
    tags: ["Vegetarian focus", "Vegan", "Gluten free", "Sugar free"],
    action: "See opening hours",
    href: "#find",
    image: "/assets/cf3.jpg",
    imageFile: "public/assets/cf3.jpg",
    alt: "A bowl from the café",
  },
  {
    id: "shop",
    index: "03",
    kicker: "From anywhere",
    title: "Explore our online store",
    copy: "There’s fresh, bulk and packaged food, including a wide selection of vegan, raw and all the “free” options for dietary quirks. Order ahead and collect from the shop in Stirling.",
    tags: ["Fresh", "Bulk", "Packaged"],
    action: "Shop Online",
    href: "#shop",
    image: "/assets/660f6cbe607c46603ec10f5c.png",
    imageFile: "public/assets/660f6cbe607c46603ec10f5c.png",
    alt: "The Organic Market delivery van",
  },
];

export const hours: Hours[] = [
  {
    id: "weekdays",
    label: "Monday – Friday",
    rows: [
      ["Café", "8:00am – 4:30pm"],
      ["Shop", "8:00am – 5:00pm"],
    ],
  },
  {
    id: "weekend",
    label: "Saturday & Sunday",
    rows: [
      ["Café", "8:00am – 4:00pm"],
      ["Shop", "8:00am – 4:30pm"],
    ],
  },
  {
    id: "holidays",
    label: "Public holidays",
    rows: [
      ["Café", "8:30am – 3:30pm"],
      ["Kitchen", "closes 3:00pm"],
      ["Shop", "8:30am – 3:30pm"],
    ],
  },
];

export const nav = [
  { href: "#about", label: "About" },
  { href: "#market", label: "Market" },
  { href: "#cafe", label: "Café" },
  { href: "#find", label: "Find us" },
];

export const contact = {
  name: "The Organic Market and Café",
  address: ["5 Druid Ave", "Stirling SA 5152"],
  email: "hello@organicmarket.com.au",
  phone: "(08) 8339 4835",
  phoneHref: "tel:+61883394835",
  mapImage: "/assets/f66319a86a1bff64316783e2169e4135.jpeg" as string | null,
  mapImageFile: "public/assets/f66319a86a1bff64316783e2169e4135.jpeg",
};

export const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  contact.address.join(", "),
)}`;
