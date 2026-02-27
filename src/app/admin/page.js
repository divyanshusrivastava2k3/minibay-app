"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '@/components/Admin.module.css';
import { ShoppingBag, Package, CreditCard, ExternalLink, Trash2, Edit, Plus } from 'lucide-react';

export default function AdminDashboard() {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, ordersRes] = await Promise.all([
                    fetch('/api/products'),
                    fetch('/api/admin/orders')
                ]);

                const productsData = await productsRes.json();
                const ordersData = await ordersRes.json();

                setProducts(productsData);
                setOrders(Array.isArray(ordersData) ? ordersData : []);
            } catch (error) {
                console.error("Error fetching admin data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        await fetch(`/api/products/${id}`, { method: 'DELETE' });
        // Refresh local state instead of full fetch
        setProducts(products.filter(p => p.id !== id));
    };

    return (
        <div className={styles.adminContainer}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarTitle}>MiniBay Admin</div>
                <nav className={styles.nav}>
                    <Link href="/admin" className={`${styles.navLink} ${styles.navLinkActive}`}>Products</Link>
                    <Link href="/admin/orders" className={styles.navLink}>Orders</Link>
                    <Link href="/admin/users" className={styles.navLink}>Users</Link>
                    <Link href="/" className={styles.navLink}>View Website</Link>
                </nav>
            </aside>

            <main className={styles.main}>
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon} style={{ background: '#f0fdf4', color: '#166534' }}>
                            <CreditCard size={24} />
                        </div>
                        <div className={styles.statInfo}>
                            <h3>₹{totalRevenue.toLocaleString()}</h3>
                            <p>Total Revenue</p>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon} style={{ background: '#eff6ff', color: '#1e40af' }}>
                            <ShoppingBag size={24} />
                        </div>
                        <div className={styles.statInfo}>
                            <h3>{orders.length}</h3>
                            <p>Total Orders</p>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon} style={{ background: '#fff7ed', color: '#9a3412' }}>
                            <Package size={24} />
                        </div>
                        <div className={styles.statInfo}>
                            <h3>{products.length}</h3>
                            <p>Products</p>
                        </div>
                    </div>
                </div>

                <header className={styles.header}>
                    <h1>Manage Products</h1>
                    <Link href="/admin/products/new" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Plus size={18} /> Add New Product
                    </Link>
                </header>

                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Title</th>
                                <th>Price</th>
                                <th>Category</th>
                                <th>Featured</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p.id}>
                                    <td>
                                        <div style={{ width: '40px', height: '40px', background: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
                                            {p.image ? <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '📱'}
                                        </div>
                                    </td>
                                    <td>{p.title}</td>
                                    <td>₹{p.price}</td>
                                    <td>{p.category || 'N/A'}</td>
                                    <td>
                                        {p.featured ? <span className={`${styles.badge} ${styles.badgeSuccess}`}>Yes</span> : 'No'}
                                    </td>
                                    <td style={{ display: 'flex', gap: '1rem' }}>
                                        <Link href={`/admin/products/edit/${p.id}`} style={{ color: '#3b82f6' }}>Edit</Link>
                                        <button onClick={() => handleDelete(p.id)} style={{ color: '#ef4444' }}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {loading && <div style={{ padding: '2rem', textAlign: 'center' }}>Loading products...</div>}
                    {!loading && products.length === 0 && <div style={{ padding: '2rem', textAlign: 'center' }}>No products found.</div>}
                </div>
            </main>
        </div>
    );
}
