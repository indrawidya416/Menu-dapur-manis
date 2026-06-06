import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Menu } from "@/components/Menu";
import { Gallery } from "@/components/Gallery";
import { Testimonials } from "@/components/Testimonials";
import { Reservation } from "@/components/Reservation";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CartDrawer } from "@/components/CartDrawer";
import { AdminPanel } from "@/components/AdminPanel";
import { CartProvider } from "@/lib/cart";
import { MenuProvider } from "@/lib/menuStore";
import { useReveal } from "@/lib/useReveal";

export default function App() {
  useReveal();

  return (
    <MenuProvider>
      <CartProvider>
        <div className="min-h-screen bg-coal-900 text-rindu-50">
          <Navbar />
          <main>
            <Hero />
            <About />
            <Menu />
            <Gallery />
            <Testimonials />
            <Reservation />
          </main>
          <Footer />
          <WhatsAppButton />
          <CartDrawer />
        </div>
        <AdminPanel />
      </CartProvider>
    </MenuProvider>
  );
}
