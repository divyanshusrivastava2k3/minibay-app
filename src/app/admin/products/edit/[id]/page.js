"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import styles from '@/components/Admin.module.css';

export default function EditProduct() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;

    const [formData, setFormData] = useState({
        title: '',
        price: '',
        originalPrice: '',
        category: '',
        description: '',
        image: '',
        featured: false
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            const res = await fetch(`/api/products/${id}`);
            if (res.ok) {
                const data = await res.json();
                setFormData({
                    title: data.title || '',
                    price: data.price || '',
                    originalPrice: data.originalPrice || '',
                    category: data.category || '',
                    description: data.description || '',
                    image: data.image || '',
                    featured: data.featured || false
                });
            }
            setLoading(false);
        };
        fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert('Product updated successfully!');
                router.push('/admin');
            } else {
                const errData = await res.json();
                alert(`Failed to update product: ${errData.details || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Error updating product');
        }
    };

    if (loading) return <div className={styles.adminContainer}>Loading...</div>;

    return (
        <div className={styles.adminContainer}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarTitle}>MiniBay Admin</div>
                <nav className={styles.nav}>
                    <Link href="/admin" className={`${styles.navLink} ${styles.navLinkActive}`}>Products</Link>
                    <Link href="/" className={styles.navLink}>View Website</Link>
                </nav>
            </aside>

            <main className={styles.main}>
                <header className={styles.header}>
                    <h1>Edit Product</h1>
                    <Link href="/admin" className="btn-secondary">Back to List</Link>
                </header>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>Product Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className={styles.formGroup}>
                            <label>Price (₹)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Original Price (₹)</label>
                            <input
                                type="number"
                                name="originalPrice"
                                value={formData.originalPrice}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option value="">Select Category</option>
                            <option value="iphone-16">iPhone 16 Series</option>
                            <option value="iphone-15">iPhone 15 Series</option>
                            <option value="best-sellers">Best Sellers</option>
                            <option value="limited-edition">Limited Edition</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Image URL</label>
                        <input
                            type="text"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="/images/product-name.png"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                        ></textarea>
                    </div>

                    <div className={styles.checkboxGroup}>
                        <input
                            type="checkbox"
                            id="featured"
                            name="featured"
                            checked={formData.featured}
                            onChange={handleChange}
                        />
                        <label htmlFor="featured">Featured Product (Show on homepage)</label>
                    </div>

                    <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
                        Update Product
                    </button>
                </form>
            </main>
        </div>
    );
}
