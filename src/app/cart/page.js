"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import styles from "@/components/Cart.module.css";
import Link from "next/link";

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

    return (
        <main>
            <Navbar />

            <div className="container">
                <h1 style={{ marginTop: '3rem' }}>Your Shopping Bag</h1>

                {cart.length === 0 ? (
                    <div style={{ padding: '5rem 0', textAlign: 'center' }}>
                        <p>Your cart is currently empty.</p>
                        <Link href="/shop" className="btn-primary" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className={styles.cartGrid}>
                        <div className={styles.cartList}>
                            {cart.map((item) => (
                                <div key={`${item.id}-${item.model}`} className={styles.cartItem}>
                                    <div className={styles.itemImage}>{item.image}</div>
                                    <div className={styles.itemDetails}>
                                        <div className={styles.itemName}>{item.title}</div>
                                        <div className={styles.itemModel}>{item.model}</div>
                                    </div>
                                    <div className={styles.itemControls}>
                                        <button className={styles.qtyBtn} onClick={() => updateQuantity(item.id, item.model, -1)}>-</button>
                                        <span>{item.quantity}</span>
                                        <button className={styles.qtyBtn} onClick={() => updateQuantity(item.id, item.model, 1)}>+</button>
                                    </div>
                                    <div style={{ fontWeight: 700 }}>₹{item.price * item.quantity}</div>
                                    <button onClick={() => removeFromCart(item.id, item.model)} style={{ color: 'red', marginLeft: '1rem' }}>✕</button>
                                </div>
                            ))}
                        </div>

                        <div className={styles.summary}>
                            <h2 className={styles.summaryTitle}>Order Summary</h2>
                            <div className={styles.summaryRow}>
                                <span>Subtotal</span>
                                <span>₹{cartTotal}</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Shipping</span>
                                <span style={{ color: '#4ade80' }}>FREE</span>
                            </div>
                            <div className={styles.summaryRow} style={{ border: 'none', fontSize: '1.25rem', fontWeight: 700 }}>
                                <span>Total</span>
                                <span>₹{cartTotal}</span>
                            </div>
                            <Link href="/checkout" className={styles.checkoutBtn} style={{ textAlign: 'center', display: 'block', textDecoration: 'none' }}>
                                Checkout Securely
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
