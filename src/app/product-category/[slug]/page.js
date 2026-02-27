"use client";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import styles from "@/components/Shop.module.css";

export default function CategoryPage() {
    const { slug } = useParams();
    const { products, loading } = useProducts();

    // Mapping slug back to display name (simple version)
    const categoryName = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    const filteredProducts = products.filter(p => {
        if (!p.category) return false;
        return p.category.toLowerCase().replace(/ & /g, '-and-').replace(/ /g, '-') === slug;
    });

    return (
        <main>
            <Navbar />
            <header className={styles.shopHeader}>
                <div className="container">
                    <h1>{categoryName}</h1>
                    <p style={{ color: 'var(--gray-500)', marginTop: '0.5rem' }}>
                        {filteredProducts.length} Premium cases found in this collection
                    </p>
                </div>
            </header>

            <div className="container section-padding">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>Loading designs...</div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                        gap: '2rem'
                    }}>
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} {...product} />
                        ))}
                    </div>
                )}
                {!loading && filteredProducts.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--gray-400)' }}>
                        No products found in this category yet.
                    </div>
                )}
            </div>
            <Footer />
        </main>
    );
}
