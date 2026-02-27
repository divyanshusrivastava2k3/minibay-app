import styles from "./ReviewSection.module.css";

const reviews = [
    {
        id: 1,
        name: "Sayan Ghosh",
        rating: 5,
        title: "Awesome phone case",
        text: "I've received my order of two iPhone 14 Plus cases today and both the products have exceeded my expectations of how awesome they are. Thanks to Minibay!",
        date: "January 9, 2026"
    },
    {
        id: 2,
        name: "Priya Sharma",
        rating: 5,
        title: "Perfect fit",
        text: "The quality is amazing and the print is very crisp. It fits my iPhone 15 Pro Max perfectly. Highly recommended!",
        date: "December 26, 2025"
    },
    {
        id: 3,
        name: "Rahul Verma",
        rating: 4,
        title: "Good quality",
        text: "Same as shown in the images. The grip is good and it feels premium. Shipping was fast too.",
        date: "January 5, 2026"
    }
];

export default function ReviewSection() {
    return (
        <section className={`${styles.reviews} section-padding`}>
            <div className="container">
                <h2 style={{ textAlign: "center" }}>Customer Stories</h2>
                <div className={styles.reviewGrid}>
                    {reviews.map((review) => (
                        <div key={review.id} className={styles.reviewCard}>
                            <div className={styles.reviewRating}>{"★".repeat(review.rating)}</div>
                            <h3 className={styles.reviewTitle}>{review.title}</h3>
                            <p className={styles.reviewText}>"{review.text}"</p>
                            <div className={styles.reviewFooter}>
                                <span>{review.name}</span>
                                <span>{review.date}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.pagination}>
                    <button className={`${styles.pageBtn} ${styles.active}`}>1</button>
                    <button className={styles.pageBtn}>2</button>
                    <button className={styles.pageBtn}>...</button>
                    <button className={styles.pageBtn}>14</button>
                </div>
            </div>
        </section>
    );
}
