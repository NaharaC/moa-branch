import { createStrictContext } from "./createStrictContext.js";

export const [WishlistContext, useWishlistContext] = createStrictContext("Wishlist", {
  displayName: "WishlistContext",
  errorMessage: "useWishlistContext debe usarse dentro de WishlistProvider",
});
