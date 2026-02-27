import "./globals.css";

export const metadata = {
  title: "MiniBay – Premium Mobile Accessories",
  description: "Soft silicone TPU iPhone covers with crisp UV-printed designs. Printed and shipped from New Delhi.",
};

import { CartProvider } from "@/context/CartContext";
import AuthProvider from "@/components/AuthProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
