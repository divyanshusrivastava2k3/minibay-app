"use client";

import { useState, useEffect, use } from "react";
import styles from "./details.module.css";
import { User, Mail, Calendar, Shield, ShoppingBag, CreditCard, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function UserDetails({ params }) {
    const { id } = use(params);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/admin/users/${id}`)
            .then(res => res.json())
            .then(data => {
                setUser(data);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className={styles.loading}>Loading details...</div>;
    if (!user) return <div className={styles.error}>User not found.</div>;

    return (
        <div className={styles.container}>
            <Link href="/admin/users" className={styles.backBtn}>
                <ChevronLeft size={18} /> Back to Users
            </Link>

            <div className={styles.profileHeader}>
                <div className={styles.avatarLarge}>
                    {user.name?.[0]?.toUpperCase() || <User size={30} />}
                </div>
                <div className={styles.profileInfo}>
                    <h1>{user.name || "Anonymous User"}</h1>
                    <p className={styles.email}><Mail size={16} /> {user.email}</p>
                    <div className={styles.badges}>
                        <span className={user.role === 'admin' ? styles.roleAdmin : styles.roleUser}>
                            {user.role}
                        </span>
                        <span className={styles.joinedBadge}>
                            <Calendar size={14} /> Joined {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>
                <div className={styles.headerStats}>
                    <div className={styles.headerStatItem}>
                        <CreditCard size={20} />
                        <div>
                            <span>Total Spent</span>
                            <strong>₹{user.totalSpent?.toLocaleString() || 0}</strong>
                        </div>
                    </div>
                    <div className={styles.headerStatItem}>
                        <ShoppingBag size={20} />
                        <div>
                            <span>Orders</span>
                            <strong>{user._count?.orders || 0}</strong>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.grid}>
                <div className={styles.mainContent}>
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <ShoppingBag size={20} />
                            <h2>Order History</h2>
                        </div>
                        {user.orders?.length > 0 ? (
                            <div className={styles.orderList}>
                                {user.orders.map(order => (
                                    <div key={order.id} className={styles.orderCard}>
                                        <div className={styles.orderMeta}>
                                            <strong>Order #{order.id.slice(-6).toUpperCase()}</strong>
                                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className={styles.orderTotal}>₹{order.total.toLocaleString()}</div>
                                        <div className={`${styles.orderStatus} ${styles[order.status]}`}>
                                            {order.status}
                                        </div>
                                        <Link href={`/admin/orders/${order.id}`} className={styles.orderLink}>
                                            Details
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className={styles.empty}>No orders placed yet.</p>
                        )}
                    </section>
                </div>

                <aside className={styles.sidebar}>
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <Shield size={20} />
                            <h2>Account Details</h2>
                        </div>
                        <div className={styles.detailInfo}>
                            <div className={styles.detailRow}>
                                <span>User ID</span>
                                <code>{user.id}</code>
                            </div>
                            <div className={styles.detailRow}>
                                <span>Role</span>
                                <span>{user.role}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span>Shipping Address</span>
                                <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>{user.shippingAddress || "Not provided"}</p>
                            </div>
                            <div className={styles.detailRow}>
                                <span>Billing Address</span>
                                <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>{user.billingAddress || "Not provided"}</p>
                            </div>
                            <div className={styles.detailRow}>
                                <span>Last Updated</span>
                                <span>{new Date(user.updatedAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
}
