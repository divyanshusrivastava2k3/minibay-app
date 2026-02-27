"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./profile.module.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
    LayoutDashboard,
    ShoppingBag,
    Download,
    MapPin,
    User as UserIcon,
    LogOut,
    Eye,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("dashboard");
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [apiError, setApiError] = useState("");
    const [message, setMessage] = useState({ type: "", text: "" });
    const [mounted, setMounted] = useState(false);

    // Form states
    const [profileForm, setProfileForm] = useState({
        name: "",
        email: "",
        currentPassword: "",
        newPassword: ""
    });

    const [addressForm, setAddressForm] = useState({
        shippingAddress: "",
        billingAddress: ""
    });

    useEffect(() => {
        setMounted(true);
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated") {
            fetchUserData();
        }
    }, [status, router]);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            setApiError("");
            const res = await fetch("/api/user/profile");
            const data = await res.json();

            if (res.ok) {
                setUserData(data);
                setProfileForm({
                    name: data.name || "",
                    email: data.email || "",
                    currentPassword: "",
                    newPassword: ""
                });
                setAddressForm({
                    shippingAddress: data.shippingAddress || "",
                    billingAddress: data.billingAddress || ""
                });
            } else {
                setApiError(data.error || "Failed to load data");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            setApiError("Network error or server crash");
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: "", text: "" });

        try {
            const res = await fetch("/api/user/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(profileForm)
            });
            const data = await res.json();

            if (res.ok) {
                setMessage({ type: "success", text: "Profile updated successfully!" });
                setProfileForm(prev => ({ ...prev, currentPassword: "", newPassword: "" }));
                fetchUserData();
            } else {
                setMessage({ type: "error", text: data.error || "Update failed" });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Something went wrong" });
        } finally {
            setSaving(false);
        }
    };

    const handleAddressUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: "", text: "" });

        try {
            const res = await fetch("/api/user/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(addressForm)
            });
            const data = await res.json();

            if (res.ok) {
                setMessage({ type: "success", text: "Addresses updated successfully!" });
                fetchUserData();
            } else {
                setMessage({ type: "error", text: data.error || "Update failed" });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Something went wrong" });
        } finally {
            setSaving(false);
        }
    };

    // Hydration match
    if (!mounted) return null;

    if (status === "loading" || (status === "authenticated" && loading)) {
        return (
            <div className={styles.container}>
                <Navbar />
                <div style={{ textAlign: 'center', padding: '100px 0', fontSize: '1.2rem', color: '#666' }}>
                    Loading your profile...
                </div>
                <Footer />
            </div>
        );
    }

    if (status === "unauthenticated") {
        return (
            <div className={styles.container}>
                <Navbar />
                <div style={{ textAlign: 'center', padding: '100px 0', fontSize: '1.2rem', color: '#666' }}>
                    Redirecting to login...
                </div>
                <Footer />
            </div>
        );
    }

    if (!session || apiError) {
        return (
            <div className={styles.container}>
                <Navbar />
                <div className={styles.errorMessage} style={{ maxWidth: '600px', margin: '60px auto', textAlign: 'center', padding: '2rem', border: '1px solid #eee', background: '#fff' }}>
                    <AlertCircle size={24} style={{ marginBottom: '10px', color: '#e53e3e' }} />
                    <p>{apiError || "Unable to load your profile. Please log in again."}</p>
                    <button
                        onClick={() => fetchUserData()}
                        className={styles.saveBtn}
                        style={{ marginTop: '20px' }}
                    >
                        Retry Loading
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    const userDisplayName = userData.name || userData.email.split('@')[0];

    const menuItems = [
        { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
        { id: "orders", label: "Orders", icon: <ShoppingBag size={20} /> },
        { id: "downloads", label: "Downloads", icon: <Download size={20} /> },
        { id: "addresses", label: "Addresses", icon: <MapPin size={20} /> },
        { id: "details", label: "Account details", icon: <UserIcon size={20} /> },
    ];

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.profileCard}>
                    {/* Sidebar */}
                    <aside className={styles.sidebar}>
                        <div className={styles.userSummary}>
                            <div className={styles.avatar}>
                                <UserIcon size={50} />
                            </div>
                            <div className={styles.userName}>{userDisplayName}</div>
                        </div>

                        <nav className={styles.menu}>
                            {menuItems.map((item) => (
                                <button
                                    key={item.id}
                                    className={`${styles.menuItem} ${activeTab === item.id ? styles.activeMenu : ""}`}
                                    onClick={() => {
                                        setActiveTab(item.id);
                                        setMessage({ type: "", text: "" });
                                    }}
                                >
                                    <span className={styles.menuIcon}>{item.icon}</span>
                                    {item.label}
                                </button>
                            ))}
                            <button
                                className={styles.menuItem}
                                onClick={() => signOut({ callbackUrl: '/' })}
                            >
                                <span className={styles.menuIcon}><LogOut size={20} /></span>
                                Log out
                            </button>
                        </nav>
                    </aside>

                    {/* Main Content Area */}
                    <main className={styles.contentArea}>
                        {message.text && (
                            <div className={message.type === "success" ? styles.successMessage : styles.errorMessage}>
                                {message.type === "success" ? <CheckCircle2 size={18} style={{ marginRight: '8px' }} /> : <AlertCircle size={18} style={{ marginRight: '8px' }} />}
                                {message.text}
                            </div>
                        )}

                        {activeTab === "dashboard" && (
                            <div className={styles.dashboardView}>
                                <div className={styles.dashboardGreeting}>
                                    Hello <strong>{userDisplayName}</strong> (not <strong>{userDisplayName}</strong>? <span className={styles.logoutLink} onClick={() => signOut()}>Log out</span>)
                                </div>

                                <div className={styles.description}>
                                    <p>
                                        From your account dashboard you can view your <strong>recent orders</strong>,
                                        manage your <strong>shipping and billing addresses</strong>, and
                                        <strong> edit your password and account details</strong>.
                                    </p>
                                </div>
                            </div>
                        )}

                        {activeTab === "orders" && (
                            <div className={styles.ordersView}>
                                <h2 style={{ marginBottom: '1.5rem' }}>Recent Orders</h2>
                                <div className={styles.tableContainer}>
                                    <table className={styles.table}>
                                        <thead>
                                            <tr>
                                                <th>Order</th>
                                                <th>Date</th>
                                                <th>Status</th>
                                                <th>Total</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {userData.orders?.length === 0 ? (
                                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No orders placed yet.</td></tr>
                                            ) : userData.orders?.map(order => (
                                                <tr key={order.id}>
                                                    <td>#{order.id.slice(-6).toUpperCase()}</td>
                                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                                    <td>
                                                        <span className={`${styles.statusBadge} ${styles['status' + order.status.toLowerCase()]}`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td>₹{order.total.toLocaleString()}</td>
                                                    <td>
                                                        <Link href={`/orders/${order.id}`} className={styles.viewOrderLink}>
                                                            View
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === "downloads" && (
                            <div className={styles.downloadsView}>
                                <h2>Downloads</h2>
                                <p className={styles.infoText} style={{ marginTop: '1rem' }}>No downloads available yet.</p>
                            </div>
                        )}

                        {activeTab === "addresses" && (
                            <div className={styles.addressesView}>
                                <p className={styles.infoText}>The following addresses will be used on the checkout page by default.</p>
                                <form onSubmit={handleAddressUpdate} className={styles.addressGrid}>
                                    <div className={styles.addressBox}>
                                        <h3>Billing address</h3>
                                        <div className={styles.formGroup}>
                                            <textarea
                                                className={styles.input}
                                                style={{ minHeight: '120px' }}
                                                placeholder="Enter billing address"
                                                value={addressForm.billingAddress}
                                                onChange={(e) => setAddressForm({ ...addressForm, billingAddress: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.addressBox}>
                                        <h3>Shipping address</h3>
                                        <div className={styles.formGroup}>
                                            <textarea
                                                className={styles.input}
                                                style={{ minHeight: '120px' }}
                                                placeholder="Enter shipping address"
                                                value={addressForm.shippingAddress}
                                                onChange={(e) => setAddressForm({ ...addressForm, shippingAddress: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <button type="submit" className={styles.saveBtn} disabled={saving}>
                                            {saving ? "Saving..." : "Save Addresses"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab === "details" && (
                            <div className={styles.detailsView}>
                                <h2>Account Details</h2>
                                <form onSubmit={handleProfileUpdate} style={{ marginTop: '1.5rem' }}>
                                    <div className={styles.formGroup}>
                                        <label>Display name *</label>
                                        <input
                                            type="text"
                                            className={styles.input}
                                            value={profileForm.name}
                                            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                            required
                                        />
                                        <span style={{ fontSize: '0.8rem', color: '#888' }}>This will be how your name will be displayed in the account section and in reviews</span>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Email address *</label>
                                        <input
                                            type="email"
                                            className={styles.input}
                                            value={profileForm.email}
                                            onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <fieldset style={{ border: '1px solid #eee', padding: '1.5rem', borderRadius: '4px', marginTop: '2rem' }}>
                                        <legend style={{ padding: '0 10px', fontWeight: '700' }}>Password change</legend>
                                        <div className={styles.formGroup}>
                                            <label>Current password (leave blank to leave unchanged)</label>
                                            <input
                                                type="password"
                                                className={styles.input}
                                                value={profileForm.currentPassword}
                                                onChange={(e) => setProfileForm({ ...profileForm, currentPassword: e.target.value })}
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>New password (leave blank to leave unchanged)</label>
                                            <input
                                                type="password"
                                                className={styles.input}
                                                value={profileForm.newPassword}
                                                onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })}
                                            />
                                        </div>
                                    </fieldset>

                                    <button type="submit" className={styles.saveBtn} disabled={saving}>
                                        {saving ? "Saving..." : "Save changes"}
                                    </button>
                                </form>
                            </div>
                        )}
                    </main>
                </div>
            </div>
            <Footer />
        </>
    );
}
