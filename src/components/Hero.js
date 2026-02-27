import Link from "next/link";
import styles from "./Hero.module.css";
import { motion } from "framer-motion";

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className={styles.heroImage} />

            <motion.div
                className={styles.heroContent}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <motion.h1
                    className={styles.heroTitle}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    Premium iPhone <br /><span>Personalization.</span>
                </motion.h1>
                <motion.p
                    className={styles.heroSubtitle}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    Elevate your daily carry with our precision-printed silicone cases.
                    Designed for protection, crafted for expression.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <Link href="/shop" className="btn-primary" style={{ padding: '1rem 2.5rem', borderRadius: '50px' }}>
                        Explore Collection
                    </Link>
                </motion.div>
            </motion.div>
        </section>
    );
}
