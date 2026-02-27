"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
    const [year, setYear] = useState(null);

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);
    return (
        <footer className={styles.footer}>
            <div className={styles.footerGrid}>
                <div className={styles.footerInfoCard}>
                    <span className={styles.footerLogo}>MiniBay</span>
                    <p className={styles.footerDesc}>
                        Soft silicone TPU iPhone covers with crisp UV-printed designs.
                        Printed and shipped from New Delhi.
                    </p>
                    <div className={styles.footerContact}>
                        <span>Email: hello@minibay.in</span>
                        <span>Ships from New Delhi, India</span>
                    </div>
                </div>

                <div>
                    <h4 className={styles.footerColTitle}>Shop</h4>
                    <ul className={styles.footerLinks}>
                        <li><Link href="/shop" className={styles.footerLink}>All designs</Link></li>
                        <li><Link href="/offers" className={styles.footerLink}>Offers</Link></li>
                        <li><Link href="/track" className={styles.footerLink}>Track order</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className={styles.footerColTitle}>Help</h4>
                    <ul className={styles.footerLinks}>
                        <li><Link href="/contact" className={styles.footerLink}>Contact support</Link></li>
                        <li><Link href="/faq" className={styles.footerLink}>FAQs</Link></li>
                        <li><Link href="/returns" className={styles.footerLink}>Returns & refunds</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className={styles.footerColTitle}>Company</h4>
                    <ul className={styles.footerLinks}>
                        <li><Link href="/about" className={styles.footerLink}>About us</Link></li>
                        <li><Link href="/privacy" className={styles.footerLink}>Privacy policy</Link></li>
                        <li><Link href="/terms" className={styles.footerLink}>Terms & conditions</Link></li>
                    </ul>
                </div>
            </div>

            <div className={styles.footerBottom}>
                <p className={styles.footerCopy}>
                    © {year || '2026'} MiniBay. All rights reserved.
                </p>
                <div className={styles.footerSocials}>
                    <a href="#" className={styles.socialBtn}>Instagram</a>
                    <a href="#" className={styles.socialBtn}>YouTube</a>
                </div>
            </div>
        </footer>
    );
}
