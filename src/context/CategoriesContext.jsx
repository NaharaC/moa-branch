import { useEffect, useState } from "react";
import { productsApi } from "../services/products.api.js";
import { CategoriesContext } from "./categories-context.js";

export const CategoriesProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    productsApi.listCategories().then(setCategories).catch(console.error);
  }, []);

  return <CategoriesContext.Provider value={categories}>{children}</CategoriesContext.Provider>;
};
