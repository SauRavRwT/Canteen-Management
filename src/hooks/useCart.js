import { useState, useEffect } from "react";
import { ref, update } from "firebase/database";
import { database } from "../firebase";
import jsPDF from "jspdf";

export const useCart = (
  originalQuantities,
  currentUser,
  updateProductQuantity,
) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Failed to parse cart from localStorage:", error);
      return [];
    }
  });

  const [showCartModal, setShowCartModal] = useState(false);
  const [showCheckoutToast, setShowCheckoutToast] = useState(false);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [cart]);

  const generatePDF = (cartData, total, userName) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();

    // Header
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("CANTEEN RECEIPT", pageWidth / 2, 15, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Date: ${date}`, 10, 30);
    doc.text(`Time: ${time}`, 10, 37);
    doc.text(`Customer: ${userName}`, 10, 44);

    // Line separator
    doc.setLineWidth(0.5);
    doc.line(10, 50, pageWidth - 10, 50);

    // Column headers
    doc.setFont("helvetica", "bold");
    doc.text("Item", 10, 60);
    doc.text("Qty", 120, 60, { align: "right" });
    doc.text("Price", 140, 60, { align: "right" });
    doc.text("Amount", 190, 60, { align: "right" });

    // Items
    doc.setFont("helvetica", "normal");
    let y = 70;
    cartData.forEach((product) => {
      doc.text(product.name, 10, y);
      doc.text(product.quantity.toString(), 120, y, { align: "right" });
      doc.text(product.price.toFixed(2), 140, y, { align: "right" });
      doc.text((product.quantity * product.price).toFixed(2), 190, y, {
        align: "right",
      });
      y += 10;
    });

    // Footer
    const totalY = y + 10;
    doc.line(10, totalY - 5, pageWidth - 10, totalY - 5);
    doc.setFont("helvetica", "bold");
    doc.text("Total Amount:", 140, totalY, { align: "right" });
    doc.text(`$${total.toFixed(2)}`, 190, totalY, { align: "right" });

    // Thank you note
    doc.setFontSize(14);
    doc.setFont("helvetica", "italic");
    doc.text("Thank you for dining with us!", pageWidth / 2, totalY + 20, {
      align: "center",
    });

    doc.save(
      `Canteen-Bill-${date.replace(/\//g, "-")}-${time.replace(/:/g, "-")}.pdf`,
    );
  };

  const addToCart = (product) => {
    setCart((prevCart) => {
      const productInCart = prevCart.find((p) => p.id === product.id);
      if (productInCart) {
        return prevCart.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p,
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setShowCartModal(true);
  };

  const incrementQuantity = (productId) => {
    const availableQuantity =
      originalQuantities[productId] -
      (cart.find((p) => p.id === productId)?.quantity || 0);
    if (availableQuantity > 0) {
      setCart((prevCart) =>
        prevCart.map((p) =>
          p.id === productId ? { ...p, quantity: p.quantity + 1 } : p,
        ),
      );
    }
  };

  const decrementQuantity = (productId) => {
    const productInCart = cart.find((p) => p.id === productId);
    if (productInCart && productInCart.quantity > 1) {
      setCart((prevCart) =>
        prevCart.map((p) =>
          p.id === productId ? { ...p, quantity: p.quantity - 1 } : p,
        ),
      );
    }
  };

  const removeFromCart = (product) => {
    setCart((prevCart) => prevCart.filter((p) => p.id !== product.id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const calculateTotal = () => {
    return cart.reduce(
      (total, product) => total + product.price * product.quantity,
      0,
    );
  };

  const checkout = () => {
    cart.forEach((product) => {
      const originalQuantity = originalQuantities[product.id];
      const updatedQuantity = originalQuantity - product.quantity;

      const productRef = ref(database, `products/${product.id}`);
      update(productRef, { quantity: updatedQuantity })
        .then(() => {
          updateProductQuantity(product.id, updatedQuantity);
        })
        .catch((error) =>
          console.error("Error updating product quantity:", error),
        );
    });

    // Record sales data
    const checkoutDate = new Date().toISOString().split("T")[0];
    const saleRef = ref(database, `sales/${checkoutDate}`);
    const saleId = Date.now().toString();
    const saleData = {
      [saleId]: {
        total: calculateTotal(),
        items: cart.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        userId: currentUser?.uid,
        userEmail: currentUser?.email,
        timestamp: Date.now(),
      },
    };
    update(saleRef, saleData);

    // Generate PDF with current cart data before clearing
    generatePDF(
      cart,
      calculateTotal(),
      currentUser?.displayName || currentUser?.email,
    );

    setCart([]);
    try {
      localStorage.removeItem("cart");
    } catch (error) {
      console.error("Failed to remove cart from localStorage:", error);
    }
    setShowCartModal(false);
    setShowCheckoutToast(true);
    setTimeout(() => setShowCheckoutToast(false), 3000);
  };

  return {
    cart,
    setCart,
    showCartModal,
    setShowCartModal,
    showCheckoutToast,
    setShowCheckoutToast,
    addToCart,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    clearCart,
    calculateTotal,
    checkout,
  };
};
