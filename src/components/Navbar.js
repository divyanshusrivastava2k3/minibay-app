"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";
import { useCart } from "@/context/CartContext";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";

export default function Navbar() {
    const { cartCount } = useCart();
    const { data: session } = useSession();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <motion.nav
            className={styles.navbar}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
            <div className={styles.topBar}>
                <div className={styles.topBarContent}>
                    <span>🇮🇳 Proudly Made in India</span>
                    <span>🔄 7 Days Easy Returns</span>
                    <span>🚚 Free Shipping on All Orders</span>
                </div>
            </div>

            <div className={styles.navMain}>
                <Link href="/" className={styles.logo}>
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        MiniBay
                    </motion.span>
                </Link>

                <ul className={styles.navLinks}>
                    {["Home", "Shop Now", "iPhone 17 Series", "iPhone 16 Series", "Collections"].map((item, i) => (
                        <motion.li
                            key={item}
                            className={styles.navItem}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * i + 0.3 }}
                        >
                            <Link href={item === "Home" ? "/" : "/shop"}>{item}</Link>
                        </motion.li>
                    ))}
                </ul>

                <div className={styles.navActions}>
                    <motion.button whileHover={{ scale: 1.1 }} className={styles.iconBtn}>🔍</motion.button>
                    {mounted && (session ? (
                        <div className={styles.userSection}>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                className={styles.iconBtn}
                                onClick={() => setShowUserMenu(!showUserMenu)}
                            >
                                👤
                            </motion.button>
                            {showUserMenu && (
                                <motion.div
                                    className={styles.userMenu}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className={styles.menuHeader}>
                                        <div className={styles.menuName}>{session.user.name}</div>
                                        <div className={styles.menuEmail}>{session.user.email}</div>
                                    </div>
                                    <div className={styles.menuDivider}></div>
                                    <Link href="/profile" className={styles.menuItem}>My Profile</Link>
                                    {session.user.role === 'admin' && (
                                        <Link href="/admin" className={styles.menuItem}>Admin Panel</Link>
                                    )}
                                    <div className={styles.menuDivider}></div>
                                    <button
                                        className={styles.menuItemLogout}
                                        onClick={() => signOut()}
                                    >
                                        Log Out
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    ) : (
                        <motion.div whileHover={{ scale: 1.1 }}>
                            <Link href="/login" className={styles.iconBtn}>👤</Link>
                        </motion.div>
                    ))}
                    <Link href="/cart">
                        <motion.div whileHover={{ scale: 1.1 }} className={styles.iconBtn} style={{ position: 'relative' }}>
                            🛒 <span className={styles.cartCount}>{cartCount}</span>
                        </motion.div>
                    </Link>
                </div>
            </div>
        </motion.nav>
    );
}
