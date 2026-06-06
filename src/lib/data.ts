import rendang from "@/assets/rendang.jpg";
import sate from "@/assets/sate.jpg";
import nasigoreng from "@/assets/nasigoreng.jpg";
import sotoayam from "@/assets/sotoayam.jpg";
import gadogado from "@/assets/gadogado.jpg";
import esceandol from "@/assets/esceandol.jpg";
import ayambakar from "@/assets/ayambakar.jpg";
import guramegoreng from "@/assets/guramegoreng.jpg";
import sopbuntut from "@/assets/sopbuntut.jpg";
import esteler from "@/assets/esteler.jpg";

export type MenuCategory = "Hidangan Utama" | "Sup & Salad" | "Pencuci Mulut & Minuman";

export interface MenuItem {
  name: string;
  description: string;
  price: number;
  image: string;
  category: MenuCategory;
  tags?: string[];
  signature?: boolean;
}

export const menuItems: MenuItem[] = [
  {
    name: "Rendang Daging Sapi",
    description:
      "Daging sapi empuk dimasak perlahan delapan jam dalam santan dan rempah Minang hingga legit dan kaya rasa.",
    price: 68000,
    image: rendang,
    category: "Hidangan Utama",
    tags: ["Pedas", "Khas Padang"],
    signature: true,
  },
  {
    name: "Sate Ayam Madura",
    description:
      "Sepuluh tusuk ayam panggang arang disiram bumbu kacang gurih, lontong, dan acar segar.",
    price: 45000,
    image: sate,
    category: "Hidangan Utama",
    tags: ["Panggang Arang"],
    signature: true,
  },
  {
    name: "Ayam Bakar Taliwang",
    description:
      "Ayam kampung dibakar dengan bumbu merah khas, disajikan bersama sambal dan lalapan segar.",
    price: 52000,
    image: ayambakar,
    category: "Hidangan Utama",
    tags: ["Pedas", "Panggang Arang"],
    signature: true,
  },
  {
    name: "Gurame Goreng Sambal",
    description:
      "Ikan gurame utuh digoreng renyah, disiram sambal terasi pedas dan ditaburi kemangi.",
    price: 95000,
    image: guramegoreng,
    category: "Hidangan Utama",
    tags: ["Untuk Berbagi", "Seafood"],
  },
  {
    name: "Nasi Goreng Kampung",
    description:
      "Nasi goreng resep nenek dengan terasi, telur ceplok, kerupuk udang, dan irisan timun segar.",
    price: 38000,
    image: nasigoreng,
    category: "Hidangan Utama",
    tags: ["Favorit"],
  },
  {
    name: "Sop Buntut Bakar",
    description:
      "Buntut sapi empuk dalam kuah kaldu bening rempah, disajikan dengan nasi hangat dan emping.",
    price: 78000,
    image: sopbuntut,
    category: "Sup & Salad",
    tags: ["Berkuah", "Spesial"],
    signature: true,
  },
  {
    name: "Soto Ayam Kuning",
    description:
      "Kuah kunyit hangat berisi suwiran ayam, soun, telur rebus, dan taburan bawang goreng.",
    price: 35000,
    image: sotoayam,
    category: "Sup & Salad",
    tags: ["Berkuah"],
  },
  {
    name: "Gado-Gado Siram",
    description:
      "Sayuran rebus, tahu, tempe, dan telur disiram saus kacang ulekan tangan yang creamy.",
    price: 32000,
    image: gadogado,
    category: "Sup & Salad",
    tags: ["Vegetarian"],
  },
  {
    name: "Es Cendol Dawet",
    description:
      "Cendol pandan, santan kental, dan gula aren cair disajikan dengan serutan es yang menyegarkan.",
    price: 22000,
    image: esceandol,
    category: "Pencuci Mulut & Minuman",
    tags: ["Manis", "Dingin"],
  },
  {
    name: "Es Teler Spesial",
    description:
      "Perpaduan alpukat, nangka, kelapa muda, dan susu kental manis dengan serutan es yang segar.",
    price: 28000,
    image: esteler,
    category: "Pencuci Mulut & Minuman",
    tags: ["Manis", "Dingin", "Favorit"],
  },
];

export const categories: MenuCategory[] = [
  "Hidangan Utama",
  "Sup & Salad",
  "Pencuci Mulut & Minuman",
];

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "Rendangnya bikin saya kangen masakan ibu di kampung. Sekali suap, langsung pulang ke kenangan.",
    name: "Larasati Wijaya",
    role: "Pelanggan sejak 2019",
    initials: "LW",
  },
  {
    quote:
      "Tempat paling nyaman untuk makan bareng keluarga. Pelayanannya hangat, rasanya autentik.",
    name: "Bima Anandita",
    role: "Food Blogger",
    initials: "BA",
  },
  {
    quote:
      "Sate ayamnya juara! Bumbu kacangnya tebal dan dagingnya empuk. Pasti balik lagi.",
    name: "Citra Halim",
    role: "Tamu undangan acara",
    initials: "CH",
  },
];

export interface Stat {
  value: string;
  label: string;
}

export const stats: Stat[] = [
  { value: "1998", label: "Berdiri sejak" },
  { value: "45+", label: "Resep warisan" },
  { value: "120rb", label: "Tamu setiap tahun" },
  { value: "4.9", label: "Rating pelanggan" },
];

// === Informasi kontak terpusat (mudah diganti) ===
export const contact = {
  // Nomor WhatsApp format internasional tanpa tanda + atau spasi
  whatsapp: "6281234567890",
  whatsappDisplay: "+62 812-3456-7890",
  whatsappMessage:
    "Halo Dapur Harum Rindu, saya ingin memesan/melakukan reservasi meja. 🙏",
  address: "Jl. Melati Wangi No. 17, Kebayoran Baru, Jakarta Selatan 12160",
  hours: "Setiap hari · 10.00 – 22.00 WIB",
  // Query untuk embed Google Maps (ganti dengan alamat/koordinat asli)
  mapsQuery: "Kebayoran Baru, Jakarta Selatan",
};

// === Pengaturan situs (dapat diubah owner lewat Panel Admin) ===
export interface SiteSettings {
  brandName: string;
  brandTagline: string;
  logoUrl: string; // kosong = pakai logo SVG bawaan
  whatsapp: string;
  whatsappDisplay: string;
  whatsappMessage: string;
  address: string;
  hours: string;
  mapsQuery: string;
  instagram: string;
  facebook: string;
  tiktok: string;
}

export const defaultSettings: SiteSettings = {
  brandName: "Dapur Harum Rindu",
  brandTagline: "Rasa Nusantara",
  logoUrl: "",
  whatsapp: contact.whatsapp,
  whatsappDisplay: contact.whatsappDisplay,
  whatsappMessage: contact.whatsappMessage,
  address: contact.address,
  hours: contact.hours,
  mapsQuery: contact.mapsQuery,
  instagram: "#",
  facebook: "#",
  tiktok: "#",
};


// === Informasi pembayaran (mudah diganti dengan data asli) ===
import qris from "@/assets/qris.jpg";

export const payment = {
  banks: [
    { bank: "BCA", number: "1234567890", holder: "Dapur Harum Rindu" },
    { bank: "Mandiri", number: "0987654321", holder: "Dapur Harum Rindu" },
  ],
  qrisImage: qris,
  qrisName: "Dapur Harum Rindu (QRIS)",
};

// === Ketentuan pengiriman & pemesanan (mudah diganti) ===
export const ordering = {
  // Biaya ongkir flat untuk metode "Pesan antar"
  deliveryFee: 15000,
  // Gratis ongkir bila subtotal mencapai nilai ini (set 0 untuk menonaktifkan)
  freeDeliveryMin: 150000,
  // Minimum order khusus untuk pesan antar
  minOrderDelivery: 50000,
};


