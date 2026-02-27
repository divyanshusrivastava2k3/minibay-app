import Link from "next/link";
import styles from "./ProductCard.module.css";

export default function ProductCard({ id, title, price, originalPrice, image, rating, reviews }) {
    return (
        <Link href={`/product/${id}`} className={styles.card}>
            <div className={styles.imageWrapper}>
                {image ? (
                    <img src={image} alt={title} className={styles.image} />
                ) : (
                    <div
                        className={styles.image}
                        style={{
                            background: `linear-gradient(45deg, var(--gray-100) 0%, var(--gray-200) 100%)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2rem'
                        }}
                    >
                        📱
                    </div>
                )}
            </div>

            <div className={styles.content}>
                <h3 className={styles.title}>{title}</h3>

                <div className={styles.rating}>
                    {"★".repeat(Math.floor(rating))}
                    <span className={styles.reviewCount}>({reviews})</span>
                </div>

                <div className={styles.priceRow}>
                    <span className={styles.price}>₹{price}</span>
                    {originalPrice && (
                        <span className={styles.originalPrice}>₹{originalPrice}</span>
                    )}
                </div>
            </div>
        </Link>
    );
}
