import { useWishlist } from "../hooks/state/useWishlist";
import { WishlistContext } from "./wishlist-context.js";

export const WishlistProvider = ({ children }) => {
  const wishlistState = useWishlist();
  return (
    <WishlistContext.Provider value={wishlistState}>
      {children}
    </WishlistContext.Provider>
  );
};
