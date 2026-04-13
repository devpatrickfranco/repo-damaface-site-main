import Header from '@/components/Header';
import Hero from '@/components/Hero';
import BestSellers from '@/components/BestSellers';
import Partners from '@/components/partners';
import Categories from '@/components/Categories';
import Franchise from '@/components/Franchise';
import Copiloto from '@/components/Copiloto';
import Studio from '@/components/Studio';
import About from '@/components/About';
import Testimonials from '@/components/Testimonials';
import Blog from '@/components/Blog';
import FAQ from '@/components/FAQ';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { getAllPosts } from '@/lib/posts';


export default async function Home() {
  const allPosts = await getAllPosts();
  
  // Pegar os 3 posts mais recentes aprovados
  const recentPosts = allPosts
    .filter(post => post.status === 'APROVADO')
    .sort((a, b) => {
      const dateA = new Date(a.published_at || a.created_at).getTime();
      const dateB = new Date(b.published_at || b.created_at).getTime();
      return dateB - dateA;
    })
    .slice(0, 3);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <BestSellers />
        <Categories />
        <Franchise />
        <Copiloto />
        <Studio />
        <About />
        <Partners />
        <Testimonials />
        <Blog posts={recentPosts} />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
