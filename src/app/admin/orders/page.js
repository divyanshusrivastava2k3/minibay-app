"use client";

import { useState, useEffect } from "react";
import styles from "../users/users.module.css"; // Reusing table styles
import { ShoppingBag, Search, Calendar, ChevronRight, User, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("/api/admin/orders")
            .then(async res => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Failed to fetch orders");
                return data;
            })
            .then(data => {
                setOrders(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const filteredOrders = orders.filter(order =>
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        order.user?.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>Order Management</h1>
                    <p>Track and manage all customer orders</p>
                </div>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}><ShoppingBag size={20} /></div>
                    <div className={styles.statInfo}>
                        <h3>{orders.length}</h3>
                        <p>Total Orders</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#fef3c7', color: '#92400e' }}><Calendar size={20} /></div>
                    <div className={styles.statInfo}>
                        <h3>{orders.filter(o => o.status === 'processing').length}</h3>
                        <p>Processing</p>
                    </div>
                </div>
            </div>

            <div className={styles.actionsBar}>
                <div className={styles.searchBox}>
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search by Order ID or Customer..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.tableWrapper}>
                {error ? (
                    <div className={styles.errorMessage}>
                        <p>{error}</p>
                    </div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Total</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className={styles.empty}>Loading...</td></tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr><td colSpan="6" className={styles.empty}>No orders found</td></tr>
                            ) : filteredOrders.map(order => (
                                <tr key={order.id}>
                                    <td>
                                        <div style={{ fontWeight: 700 }}>#{order.id.slice(-6).toUpperCase()}</div>
                                    </td>
                                    <td>
                                        <div className={styles.userInfo}>
                                            <div className={styles.avatar}>
                                                {order.user?.name?.[0]?.toUpperCase() || <User size={14} />}
                                            </div>
                                            <div>
                                                <div className={styles.userName}>{order.user?.name || "Anonymous"}</div>
                                                <div className={styles.userEmail}>{order.user?.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.dateInfo}>
                                            <Calendar size={14} />
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${styles['status' + order.status.toLowerCase()]}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 700 }}>₹{order.total.toLocaleString()}</div>
                                    </td>
                                    <td>
                                        <Link href={`/orders/${order.id}`} className={styles.viewBtn}>
                                            View <ExternalLink size={14} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
