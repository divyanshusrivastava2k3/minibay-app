"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ChevronLeft, Package, MapPin, Calendar, CreditCard, Clock } from "lucide-react";

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { status } = useSession();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (status === "unauthenticated") {
            router.push("/login?callbackUrl=/orders/" + params.id);
        } else if (status === "authenticated") {
            fetchOrder();
        }
    }, [status, params.id, router]);

    const fetchOrder = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/orders/${params.id}`);
            const data = await res.json();

            if (res.ok) {
                setOrder(data);
            } else {
                setError(data.error || "Order not found");
            }
        } catch (err) {
            setError("Failed to fetch order details");
        } finally {
            setLoading(false);
        }
    };

    if (!mounted || status === "loading") return null;

    return (
        <main style={{ minHeight: '100vh', background: '#f8f9fa' }}>
            <Navbar />

            <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 1rem' }}>
                <Link href="/profile" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#666',
                    textDecoration: 'none',
                    marginBottom: '2rem',
                    fontSize: '0.875rem'
                }}>
                    <ChevronLeft size={16} /> Back to My Orders
                </Link>

                {error ? (
                    <div style={{ background: '#fff', padding: '3rem', textAlign: 'center', borderRadius: '12px', border: '1px solid #eee' }}>
                        <p style={{ color: '#e53e3e', fontSize: '1.125rem', marginBottom: '1.5rem' }}>{error}</p>
                        <Link href="/profile" className="btn-primary" style={{ display: 'inline-block' }}>Go to Profile</Link>
                    </div>
                ) : loading ? (
                    <div style={{ textAlign: 'center', padding: '5rem' }}>Loading details...</div>
                ) : (
                    <>
                        <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #eee', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                                <div>
                                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                                        Order #{order.id.slice(-6).toUpperCase()}
                                    </h1>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: '#666', fontSize: '0.875rem' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <Calendar size={14} /> {new Date(order.createdAt).toLocaleDateString()}
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <Package size={14} /> {order.items.length} Items
                                        </span>
                                    </div>
                                </div>
                                <div style={{
                                    background: '#f0fdf4',
                                    color: '#166534',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '99px',
                                    fontSize: '0.875rem',
                                    fontWeight: 700,
                                    textTransform: 'uppercase'
                                }}>
                                    {order.status}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', borderTop: '1px solid #eee', paddingTop: '2rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#999', textTransform: 'uppercase', marginBottom: '1rem' }}>
                                        Shipping Address
                                    </h3>
                                    <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                                        <MapPin size={18} style={{ color: '#666', flexShrink: 0 }} />
                                        <p>{order.user?.shippingAddress || "N/A"}</p>
                                    </div>
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#999', textTransform: 'uppercase', marginBottom: '1rem' }}>
                                        Payment Method
                                    </h3>
                                    <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                                        <CreditCard size={18} style={{ color: '#666', flexShrink: 0 }} />
                                        <p>Cash on Delivery (COD)</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #eee', overflow: 'hidden' }}>
                            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #eee', background: '#fdfdfd' }}>
                                <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Order Items</h2>
                            </div>
                            <div style={{ padding: '0 2rem' }}>
                                {order.items.map((item, idx) => (
                                    <div key={idx} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '1.5rem 0',
                                        borderBottom: idx === order.items.length - 1 ? 'none' : '1px solid #f0f0f0'
                                    }}>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <div style={{ width: '50px', height: '50px', background: '#f8f9fa', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                                                📱
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: '1rem' }}>{item.title}</div>
                                                <div style={{ fontSize: '0.875rem', color: '#666' }}>{item.model} · Qty: {item.quantity}</div>
                                            </div>
                                        </div>
                                        <div style={{ fontWeight: 700 }}>₹{(item.price * item.quantity).toLocaleString()}</div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ background: '#fdfdfd', padding: '1.5rem 2rem', borderTop: '1px solid #eee' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#666' }}>
                                    <span>Subtotal</span>
                                    <span>₹{order.total.toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#666' }}>
                                    <span>Shipping</span>
                                    <span style={{ color: '#166534', fontWeight: 600 }}>FREE</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800, borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                                    <span>Total</span>
                                    <span>₹{order.total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                            <Link href="/shop" style={{
                                padding: '0.75rem 1.5rem',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                fontWeight: 700,
                                background: '#000',
                                color: '#fff'
                            }}>Continue Shopping</Link>
                            <button style={{
                                padding: '0.75rem 1.5rem',
                                borderRadius: '8px',
                                background: '#fff',
                                border: '1px solid #ccc',
                                fontWeight: 700,
                                cursor: 'pointer'
                            }}>Need Help?</button>
                        </div>
                    </>
                )}
            </div>

            <Footer />
        </main>
    );
}
