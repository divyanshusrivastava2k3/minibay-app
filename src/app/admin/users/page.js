"use client";

import { useState, useEffect } from "react";
import styles from "./users.module.css";
import { Search, User, Mail, Calendar, Shield, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("/api/admin/users")
            .then(async res => {
                const data = await res.json();
                if (!res.ok) {
                    setError(data.error || "Failed to fetch users");
                    return null;
                }
                return data;
            })
            .then(data => {
                if (data === null) return;

                if (Array.isArray(data)) {
                    setUsers(data);
                } else {
                    console.error("Received non-array data for users:", data);
                    setError("Received invalid data format from server");
                }
            })
            .catch(err => {
                console.error("Error fetching users:", err);
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const filteredUsers = Array.isArray(users) ? users.filter(user =>
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase())
    ) : [];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>Customers & Users</h1>
                    <p>Manage and view all registered users</p>
                </div>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}><User size={20} /></div>
                    <div className={styles.statInfo}>
                        <h3>{users.length}</h3>
                        <p>Total Users</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#e0f2fe', color: '#0369a1' }}><Shield size={20} /></div>
                    <div className={styles.statInfo}>
                        <h3>{users.filter(u => u.role === 'admin').length}</h3>
                        <p>Admins</p>
                    </div>
                </div>
            </div>

            <div className={styles.actionsBar}>
                <div className={styles.searchBox}>
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.tableWrapper}>
                {error ? (
                    <div className={styles.errorMessage}>
                        <Shield size={20} />
                        <p>{error}</p>
                        {error === "Unauthorized" && (
                            <Link href="/login" className={styles.loginLink}>Login as Admin</Link>
                        )}
                    </div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Role</th>
                                <th>Joined Date</th>
                                <th>Orders</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className={styles.empty}>Loading...</td></tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan="5" className={styles.empty}>No users found</td></tr>
                            ) : filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td>
                                        <div className={styles.userInfo}>
                                            <div className={styles.avatar}>
                                                {user.name?.[0]?.toUpperCase() || <User size={14} />}
                                            </div>
                                            <div>
                                                <div className={styles.userName}>{user.name || "Anonymous"}</div>
                                                <div className={styles.userEmail}>{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={user.role === 'admin' ? styles.roleAdmin : styles.roleUser}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.dateInfo}>
                                            <Calendar size={14} />
                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                        </div>
                                    </td>
                                    <td>{user._count?.orders || 0}</td>
                                    <td>
                                        <Link href={`/admin/users/${user.id}`} className={styles.viewBtn}>
                                            Details <ExternalLink size={14} />
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
