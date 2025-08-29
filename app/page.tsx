import Header from '@/components/Header';
import Hero from '@/components/Hero';
import BestSellers from '@/components/BestSellers';
import Partners from '@/components/partners'; 
import Categories from '@/components/Categories';
import Franchise from '@/components/Franchise';
import About from '@/components/About';
import Testimonials from '@/components/Testimonials';
import Blog from '@/components/Blog';
import FAQ from '@/components/FAQ';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';


export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <BestSellers />
        <Categories />
        <Partners />
        <Franchise />
        <About />
        <Testimonials />
        <Blog />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
