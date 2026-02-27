"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("minibay-cart");
        if (savedCart) setCart(JSON.parse(savedCart));
    }, []);

    // Sync cart to localStorage
    useEffect(() => {
        localStorage.setItem("minibay-cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart((prev) => {
            const existing = prev.find(item => item.id === product.id && item.model === product.model);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id && item.model === product.model
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (id, model) => {
        setCart((prev) => prev.filter(item => !(item.id === id && item.model === model)));
    };

    const updateQuantity = (id, model, delta) => {
        setCart((prev) => prev.map(item => {
            if (item.id === id && item.model === model) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const clearCart = () => {
        setCart([]);
    };

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            cart, addToCart, removeFromCart, updateQuantity, cartCount, cartTotal, clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
