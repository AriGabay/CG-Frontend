import { useEffect, useState } from 'react';
import { productService } from '../services/productService';

// The redesigned menu is a single flat, client-filtered grid, so the whole
// catalogue is fetched once and shared. It is ~236 products / ~140KB
// uncompressed, and `product/all` is the only endpoint that returns Category
// and Price.SizePrices together without pagination.
//
// The in-flight promise is cached at module scope so several components
// mounting at once (header search + home grid) share a single request.

let catalogPromise = null;
let catalogCache = null;

export function loadCatalog() {
  if (catalogCache) return Promise.resolve(catalogCache);
  if (!catalogPromise) {
    catalogPromise = productService
      .getAllProducts()
      .then((products) => {
        catalogCache = Array.isArray(products) ? products : [];
        return catalogCache;
      })
      .catch((err) => {
        // Let the next caller retry rather than caching a failure forever.
        catalogPromise = null;
        throw err;
      });
  }
  return catalogPromise;
}

export function clearCatalogCache() {
  catalogPromise = null;
  catalogCache = null;
}

export function useCatalog() {
  const [products, setProducts] = useState(catalogCache || []);
  const [loading, setLoading] = useState(!catalogCache);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    if (catalogCache) {
      setProducts(catalogCache);
      setLoading(false);
      return undefined;
    }
    setLoading(true);
    loadCatalog()
      .then((list) => {
        if (!alive) return;
        setProducts(list);
        setLoading(false);
      })
      .catch((err) => {
        if (!alive) return;
        setError(err);
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  return { products, loading, error };
}

export default useCatalog;
