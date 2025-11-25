import { useState, useEffect } from "react";
import UserInfoSection from "../components/UserInfoSection.jsx";
import WishlistSection from "../components/WishlistSection.jsx";
import OrderSection from "../components/MyOrdersSection.jsx";
import { useProducts } from "../../products/hooks/useProducts.js";
import { useAuth } from "../../../context/auth-context.js";
import { apiClient } from "@/services/api-client.js";

const PROFILE_PRODUCT_FILTERS = Object.freeze({ limit: 12 });

export const ProfilePage = () => {
  const { isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) return;

    apiClient.private
      .get("/wishlist")
      .then((res) => {
        setWishlistItems(res?.items ?? []);
      })
      .catch((err) => console.error("Error cargando wishlist:", err));
  }, [isAuthenticated]);

  const {
    products = [],
    isLoading,
    error,
  } = useProducts(PROFILE_PRODUCT_FILTERS);

  return (
    <div>
      <UserInfoSection />

      <WishlistSection
        products={wishlistItems}
        isLoading={isLoading}
        error={error}
      />

      <OrderSection
        products={products}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};


