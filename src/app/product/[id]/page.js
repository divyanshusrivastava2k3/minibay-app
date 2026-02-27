"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "@/components/ProductDetail.module.css";
import { useCart } from "@/context/CartContext";

const iphoneModels = [
    "iPhone 16 Pro Max", "iPhone 16 Pro", "iPhone 16 Plus", "iPhone 16",
    "iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15 Plus", "iPhone 15",
    "iPhone 14 Pro Max", "iPhone 14 Pro", "iPhone 14 Plus", "iPhone 14",
    "iPhone 13 Pro Max", "iPhone 13 Pro", "iPhone 13 Mini", "iPhone 13"
];

export default function ProductPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedModel, setSelectedModel] = useState("");
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setProduct(data);
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!selectedModel) {
            alert("Please select your iPhone model first!");
            return;
        }

        addToCart({
            ...product,
            model: selectedModel
        });
        alert("Added to cart!");
    };

    if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading...</div>;
    if (!product) return <div style={{ padding: '100px', textAlign: 'center' }}>Product not found</div>;

    return (
        <main className={styles.productPage}>
            <Navbar />

            <div className="container">
                <div className={styles.productMain}>
                    <div className={styles.gallery}>
                        <div className={styles.mainImage}>
                            {product.image ? (
                                <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                "📱"
                            )}
                        </div>
                    </div>

                    <div className={styles.details}>
                        <nav style={{ fontSize: '0.8rem', color: 'var(--gray-400)', marginBottom: '1rem' }}>
                            Home / {product.category || 'Collection'} / {product.title}
                        </nav>

                        <h1 className={styles.title}>{product.title}</h1>
                        <div className={styles.priceRow} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                            <span className={styles.price} style={{ fontSize: '1.5rem', fontWeight: '700' }}>₹{product.price}</span>
                            {product.originalPrice && (
                                <span className={styles.originalPrice} style={{ textDecoration: 'line-through', color: 'var(--gray-400)' }}>₹{product.originalPrice}</span>
                            )}
                        </div>
                        <div className={styles.taxInfo}>Inclusive of all taxes</div>

                        <div className={styles.badgesGrid}>
                            <div className={styles.badgeItem}>🚚 Free Delivery (2–4 Days)</div>
                            <div className={styles.badgeItem}>⭐ 5★ Rated • 2.5L+ Customers</div>
                            <div className={styles.badgeItem}>💵 COD Available</div>
                            <div className={styles.badgeItem}>🩷 Soft Silicone • UV Printed</div>
                            <div className={styles.badgeItem}>🔥 Lowest Price Across India🇮🇳</div>
                        </div>

                        <div className={styles.viewingNow}>
                            👁️ <strong>28 people</strong> are viewing this right now
                        </div>

                        <div className={styles.locationInfo}>
                            🇮🇳 Designed & shipped from — <strong>New Delhi</strong>
                        </div>

                        <div className={styles.selectorSection}>
                            <label className={styles.selectorLabel}>MODELS</label>
                            <select
                                className={styles.select}
                                value={selectedModel}
                                onChange={(e) => setSelectedModel(e.target.value)}
                            >
                                <option value="">Choose an option</option>
                                {product.category?.toLowerCase().includes('16') ?
                                    iphoneModels.filter(m => m.includes('16')).map(model => <option key={model} value={model}>{model}</option>)
                                    : iphoneModels.map(model => (
                                        <option key={model} value={model}>{model}</option>
                                    ))}
                            </select>
                        </div>

                        <div className={styles.buyActions}>
                            <button
                                className={`${styles.addToCart} btn-primary`}
                                onClick={handleAddToCart}
                            >
                                ADD TO CART
                            </button>
                        </div>

                        <div className={styles.infoTabs}>
                            <div className={styles.tabItem}>
                                <div className={styles.tabHeader}>
                                    <span>Why you'll love it</span>
                                    <span>+</span>
                                </div>
                                <div className={styles.tabContent}>
                                    {product.description || "Crafted for daily protection with a slim profile and soft-touch grip. Vibrant UV print stays bright and resists scratches while raised edges safeguard your camera and screen."}
                                </div>
                            </div>
                            <div className={styles.tabItem}>
                                <div className={styles.tabHeader}>
                                    <span>Shipping & Returns</span>
                                    <span>+</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
