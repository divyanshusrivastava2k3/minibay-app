"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "./checkout.module.css";
import { MapPin, CreditCard, ChevronRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function CheckoutPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { cart, cartTotal, clearCart } = useCart();

    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        pincode: "",
        paymentMethod: "cod"
    });

    useEffect(() => {
        setMounted(true);
        if (status === "unauthenticated") {
            router.push("/login?callbackUrl=/checkout");
        } else if (status === "authenticated" && session?.user) {
            setFormData(prev => ({
                ...prev,
                name: session.user.name || "",
                email: session.user.email || ""
            }));

            // Fetch saved address from profile
            fetch("/api/user/profile")
                .then(res => res.json())
                .then(data => {
                    if (data.shippingAddress) {
                        setFormData(prev => ({
                            ...prev,
                            address: data.shippingAddress
                        }));
                    }
                })
                .catch(err => console.error("Error fetching profile:", err));
        }
    }, [status, session, router]);

    useEffect(() => {
        if (mounted && cart.length === 0 && !orderPlaced) {
            router.push("/cart");
        }
    }, [mounted, cart.length, router, orderPlaced]);

    if (!mounted || status === "loading") return null;

    if (cart.length === 0 && !orderPlaced) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: cart,
                    total: cartTotal,
                    shippingDetails: formData
                })
            });

            const data = await res.json();

            if (res.ok) {
                setOrderPlaced(true);
                clearCart();
                router.push(`/orders/success/${data.orderId}`);
            } else {
                setError(data.error || "Failed to place order. Please try again.");
            }
        } catch (err) {
            setError("Something went wrong. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main style={{ minHeight: '100vh', background: '#f8f9fa' }}>
            <Navbar />

            <div className={styles.container}>
                <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
                    <span>Cart</span> <ChevronRight size={14} />
                    <span style={{ color: '#000', fontWeight: 600 }}>Checkout</span>
                </div>

                <form onSubmit={handleSubmit} className={styles.checkoutGrid}>
                    <div className={styles.leftColumn}>
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                <MapPin size={20} /> Shipping Details
                            </h2>
                            <div className={styles.formGrid}>
                                <div className={styles.inputGroup}>
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        placeholder="10-digit mobile number"
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Pincode</label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        required
                                        placeholder="6-digit PIN"
                                    />
                                </div>
                                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                    <label>Shipping Address</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                        rows="3"
                                        placeholder="House No, Street, Landmark, Area"
                                    ></textarea>
                                </div>
                                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                    <label>City / State</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g. New Delhi, Delhi"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                <CreditCard size={20} /> Payment Method
                            </h2>
                            <div className={styles.paymentMethods}>
                                <label className={`${styles.paymentOption} ${formData.paymentMethod === 'cod' ? styles.active : ''}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cod"
                                        checked={formData.paymentMethod === 'cod'}
                                        onChange={handleChange}
                                        style={{ display: 'none' }}
                                    />
                                    <CheckCircle2 size={20} color={formData.paymentMethod === 'cod' ? '#000' : '#ccc'} />
                                    <div>
                                        <div style={{ fontWeight: 600 }}>Cash on Delivery (COD)</div>
                                        <div style={{ fontSize: '0.85rem', color: '#666' }}>Pay when you receive the product</div>
                                    </div>
                                </label>

                                <div className={styles.paymentOption} style={{ opacity: 0.6, cursor: 'not-allowed' }}>
                                    <div style={{ width: '20px', height: '20px', border: '2px solid #ccc', borderRadius: '50%' }}></div>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>Online Payment (UPI / Card)</div>
                                        <div style={{ fontSize: '0.85rem', color: '#888' }}>Currently Unavailable</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.rightColumn}>
                        <div className={styles.summary}>
                            <h2 className={styles.summaryTitle}>Order Summary</h2>

                            <div className={styles.itemList}>
                                {cart.map(item => (
                                    <div key={`${item.id}-${item.model}`} className={styles.item}>
                                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                                            <div style={{ width: '40px', height: '40px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', fontSize: '1.2rem' }}>
                                                {item.image}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{item.title}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>Qty: {item.quantity} · {item.model}</div>
                                            </div>
                                        </div>
                                        <div style={{ fontWeight: 600 }}>₹{item.price * item.quantity}</div>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.summaryRow}>
                                <span>Subtotal</span>
                                <span>₹{cartTotal}</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Shipping</span>
                                <span style={{ color: '#4ade80' }}>FREE</span>
                            </div>
                            <div className={styles.summaryRow} style={{ border: 'none', fontSize: '1.25rem', fontWeight: 700, marginTop: '1rem' }}>
                                <span>Total</span>
                                <span>₹{cartTotal}</span>
                            </div>

                            {error && (
                                <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', padding: '1rem', borderRadius: '8px', marginTop: '1.5rem', display: 'flex', gap: '0.5rem', fontSize: '0.875rem', alignItems: 'center' }}>
                                    <AlertCircle size={16} /> {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className={styles.placeOrderBtn}
                                disabled={loading}
                            >
                                {loading ? (
                                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                        <Loader2 className="animate-spin" size={20} /> Processing...
                                    </span>
                                ) : (
                                    `Place Order · ₹${cartTotal}`
                                )}
                            </button>

                            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '1.5rem' }}>
                                By placing your order, you agree to MiniBay's Terms of Service and Privacy Policy.
                            </p>
                        </div>
                    </div>
                </form>
            </div>

            <Footer />
        </main>
    );
}
