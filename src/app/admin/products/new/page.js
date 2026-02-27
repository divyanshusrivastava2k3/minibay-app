"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '@/components/Admin.module.css';

export default function NewProduct() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        originalPrice: '',
        description: '',
        category: 'Animals & Wildlife',
        image: '',
        featured: false
    });

    const categories = [
        "Animals & Wildlife", "Divine Collection", "Anime & Pop Culture",
        "Sports", "Biker Collection", "Food Mood"
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                alert('Product saved successfully!');
                router.push('/admin');
            } else {
                const err = await res.json();
                alert('Error: ' + (err.error || 'Failed to save product'));
            }
        } catch (error) {
            console.error(error);
            alert('Something went wrong. check console.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.adminContainer}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarTitle}>MiniBay Admin</div>
                <nav className={styles.nav}>
                    <Link href="/admin" className={styles.navLink}>Products</Link>
                </nav>
            </aside>

            <main className={styles.main}>
                <header className={styles.header}>
                    <h1>Add New Product</h1>
                </header>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Product Title</label>
                        <input
                            className={styles.input}
                            required
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Price (₹)</label>
                            <input
                                className={styles.input}
                                type="number"
                                required
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Original Price (₹)</label>
                            <input
                                className={styles.input}
                                type="number"
                                value={formData.originalPrice}
                                onChange={e => setFormData({ ...formData, originalPrice: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Category</label>
                        <select
                            className={styles.select}
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                        >
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Image Path (e.g. /images/clown_mask_case.png)</label>
                        <input
                            className={styles.input}
                            value={formData.image}
                            onChange={e => setFormData({ ...formData, image: e.target.value })}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Description</label>
                        <textarea
                            className={styles.textarea}
                            rows="4"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                    </div>

                    <div className={styles.formGroup} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                            type="checkbox"
                            id="featured"
                            checked={formData.featured}
                            onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                        />
                        <label htmlFor="featured">Feature this product on homepage</label>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Product'}
                        </button>
                        <Link href="/admin" style={{ padding: '0.75rem 1.5rem', border: '1px solid #ddd', borderRadius: '8px' }}>
                            Cancel
                        </Link>
                    </div>
                </form>
            </main>
        </div>
    );
}
