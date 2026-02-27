"use client";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategoryGrid from "@/components/Categories";
import ProductCard from "@/components/ProductCard";
import ReviewSection from "@/components/ReviewSection";
import Footer from "@/components/Footer";
import { useProducts } from "@/hooks/useProducts";

export default function Home() {
  const { products, loading } = useProducts();
  const featuredProducts = products.filter(p => p.featured).slice(0, 4);

  return (
    <main>
      <Navbar />
      <Hero />

      <CategoryGrid />

      <section className="container section-padding">
        <h2 style={{ marginBottom: "2rem", textAlign: "center" }}>Trending Designs</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '2rem'
        }}>
          {featuredProducts.map(product => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>

      <ReviewSection />

      <Footer />
    </main>
  );
}
