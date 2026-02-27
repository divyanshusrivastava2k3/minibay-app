"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import styles from "@/components/Shop.module.css";

const collections = [
    "All designs", "Animals & Wildlife", "Divine Collection",
    "Biker Collection", "Flower Collection", "Sports", "Anime"
];

const devices = [
    "iPhone 16 Series", "iPhone 15 Series", "iPhone 14 Series", "iPhone 13 Series"
];

import { useState, useMemo } from "react";
import { useProducts } from "@/hooks/useProducts";

export default function ShopPage() {
    const { products, loading } = useProducts();
    const [selectedCollection, setSelectedCollection] = useState("All designs");
    const [selectedDevice, setSelectedDevice] = useState("All");

    const filteredProducts = useMemo(() => {
        if (!products) return [];
        return products.filter(p => {
            const matchesCollection = selectedCollection === "All designs" ||
                (p.category && p.category.toLowerCase() === selectedCollection.toLowerCase()) ||
                p.title.toLowerCase().includes(selectedCollection.toLowerCase().split(' ')[0]);

            const matchesDevice = selectedDevice === "All" ||
                (p.title && p.title.toLowerCase().includes(selectedDevice.toLowerCase().split('iPhone')[1]?.trim() || ""));

            return matchesCollection && matchesDevice;
        });
    }, [selectedCollection, selectedDevice, products]);

    return (
        <main>
            <Navbar />

            <header className={styles.shopHeader}>
                <div className="container">
                    <h1>Explore {selectedCollection !== "All designs" ? selectedCollection : "All Designs"}</h1>
                    <p style={{ color: 'var(--gray-500)', marginTop: '0.5rem' }}>
                        {filteredProducts.length} Premium cases found for your style
                    </p>
                </div>
            </header>

            <div className="container">
                <div className={styles.shopGrid}>
                    <aside className={styles.filters}>
                        <div className={styles.filterGroup}>
                            <span className={styles.filterTitle}>Collections</span>
                            <div className={styles.filterList}>
                                {collections.map(c => (
                                    <span
                                        key={c}
                                        className={`${styles.filterItem} ${selectedCollection === c ? styles.activeFilter : ''}`}
                                        onClick={() => setSelectedCollection(c)}
                                        style={selectedCollection === c ? { color: 'var(--foreground)', fontWeight: '700' } : {}}
                                    >
                                        {c}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className={styles.filterGroup}>
                            <span className={styles.filterTitle}>Device</span>
                            <div className={styles.filterList}>
                                {["All", ...devices].map(d => (
                                    <span
                                        key={d}
                                        className={`${styles.filterItem} ${selectedDevice === d ? styles.activeFilter : ''}`}
                                        onClick={() => setSelectedDevice(d)}
                                        style={selectedDevice === d ? { color: 'var(--foreground)', fontWeight: '700' } : {}}
                                    >
                                        {d}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </aside>

                    <section className={styles.products}>
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} {...product} />
                        ))}
                    </section>
                </div>
            </div>

            <Footer />
        </main>
    );
}
