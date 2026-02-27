"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function OrderSuccessPage() {
    const params = useParams();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <main style={{ minHeight: '100vh', background: '#fff' }}>
            <Navbar />

            <div style={{
                maxWidth: '600px',
                margin: '100px auto',
                textAlign: 'center',
                padding: '0 1rem'
            }}>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, stiffness: 200 }}
                >
                    <CheckCircle2 size={80} color="#4ade80" style={{ margin: '0 auto 2rem' }} />
                </motion.div>

                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>
                    Order Confirmed!
                </h1>

                <p style={{ color: '#666', fontSize: '1.125rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>
                    Your order <span style={{ fontWeight: 700, color: '#000' }}>#{params.id}</span> has been placed successfully.
                    We've started processing your gadgets and will notify you when they're on the way.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Link href={`/orders/${params.id}`} style={{
                        background: '#000',
                        color: '#fff',
                        padding: '1.25rem',
                        borderRadius: '12px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.75rem',
                        textDecoration: 'none'
                    }}>
                        View Order Status <ShoppingBag size={20} />
                    </Link>

                    <Link href="/shop" style={{
                        background: '#f8f9fa',
                        color: '#000',
                        padding: '1.25rem',
                        borderRadius: '12px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.75rem',
                        textDecoration: 'none',
                        border: '1px solid #eee'
                    }}>
                        Continue Shopping <ArrowRight size={20} />
                    </Link>
                </div>
            </div>

            <Footer />
        </main>
    );
}
