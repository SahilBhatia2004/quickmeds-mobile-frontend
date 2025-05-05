
import { useMemo } from "react";
import { products, Product } from "@/data/products";

export const useAllProducts = () => {
  return products;
};

export const useProductById = (id: string | undefined): Product | undefined => {
  return useMemo(() => {
    if (!id) return undefined;
    return products.find(product => product.id === id);
  }, [id]);
};

export const usePopularProducts = (): Product[] => {
  return useMemo(() => {
    return products.filter(product => product.popular);
  }, []);
};

export const useCategoryProducts = (categoryId: string): Product[] => {
  return useMemo(() => {
    return products.filter(product => 
      product.category.includes(categoryId)
    );
  }, [categoryId]);
};

export const useSearchProducts = (query: string): Product[] => {
  return useMemo(() => {
    if (!query || query.trim() === '') return [];
    
    const lowercasedQuery = query.toLowerCase().trim();
    return products.filter(product => 
      product.name.toLowerCase().includes(lowercasedQuery) ||
      product.description.toLowerCase().includes(lowercasedQuery) ||
      product.category.some(cat => cat.toLowerCase().includes(lowercasedQuery))
    );
  }, [query]);
};
