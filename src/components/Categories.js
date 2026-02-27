import Link from "next/link";
import styles from "./Categories.module.css";

const categories = [
    { name: "Animals & Wildlife", slug: "animals-and-wildlife-collection", image: "/images/animal_charm_case.png" },
    { name: "Divine Collection", slug: "divine-collection", image: "/images/korean_culture_case.png" },
    { name: "Anime & Pop Culture", slug: "anime-and-pop-culture", image: "/images/clown_mask_case.png" },
    { name: "Sports", slug: "sports", image: "/images/retro_denim_case.png" },
    { name: "Biker Collection", slug: "biker-collection", image: "/images/retro_denim_case.png" },
    { name: "Food Mood", slug: "food-mood-collection", image: "/images/clown_mask_case.png" }
];

export default function CategoryGrid() {
    return (
        <section className="container section-padding">
            <h2 style={{ marginBottom: "2rem", textAlign: "center" }}>Explore Our Collections</h2>
            <div className={styles.categories}>
                {categories.map((cat) => (
                    <Link
                        key={cat.slug}
                        href={`/product-category/${cat.slug}`}
                        className={styles.categoryCard}
                        style={{ backgroundImage: `url(${cat.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    >
                        <div className={styles.categoryOverlay} />
                        <h3 className={styles.categoryTitle}>{cat.name}</h3>
                    </Link>
                ))}
            </div>
        </section>
    );
}
