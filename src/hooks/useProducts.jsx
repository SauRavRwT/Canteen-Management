import { useState, useEffect } from "react";
import { ref, onValue, update } from "firebase/database";
import { database } from "../firebase";

const useProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const productsRef = ref(database, "products");
    onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      const productList = data
        ? Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }))
        : [];
      setProducts(productList);
    });
  }, []);

  const updateProductQuantity = (id, newQuantity) => {
    const productRef = ref(database, `products/${id}`);
    update(productRef, { quantity: newQuantity })
      .then(() => {
        // console.log("Product quantity updated successfully.");
      })
      .catch((error) => {
        console.error("Error updating product quantity:", error);
      });
  };

  return {
    products,
    updateProductQuantity,
  };
};

export default useProducts;
