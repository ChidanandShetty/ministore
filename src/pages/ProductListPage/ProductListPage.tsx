import {
  useQuery,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import type { QueryFunctionContext } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import styles from './ProductListPage.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faUser } from '@fortawesome/free-solid-svg-icons';




const LIMIT = 10;

const fetchCategories = async (): Promise<any[]> => {
  const res = await axios.get('http://localhost:3000/api/v1/categories');
  return res.data;
};

const fetchProducts = async (
  ctx: QueryFunctionContext<string[], number>
): Promise<any[]> => {
  const { pageParam = 0, queryKey } = ctx;
  const [, search, category] = queryKey;

  const params: any = { offset: pageParam, limit: LIMIT };
  if (search) params.title = search;
  if (category) params.categoryId = category;

  const res = await axios.get('http://localhost:3000/api/v1/products', { params });

  const data = res.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.products)) return data.products;

  console.warn('⚠️ Unexpected API response format:', data);
  return [];
};

const fetchProductById = async (id: string) => {
  const res = await axios.get(`http://localhost:3000/api/v1/products/${id}`);
  return res.data;
};

const getNextPageParam = (lastPage: any, allPages: any[]) => {
  if (!lastPage || !Array.isArray(lastPage)) return undefined;
  return lastPage.length === LIMIT ? allPages.length * LIMIT : undefined;
};

const ProductListPage = () => {
  const queryClient = useQueryClient();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timeout);
  }, [search]);

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 60 * 24,
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['products', debouncedSearch, category],
    queryFn: fetchProducts,
    initialPageParam: 0,
    getNextPageParam,
  });

  const products = data?.pages?.flat() || [];

  if (isLoading) return <p>Loading products...</p>;
  if (isError) return <p>Error loading products.</p>;

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        {/* Left: Search + Filter */}
        <div className={styles.searchFilter}>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={styles.categorySelect}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Right: Cart + Profile */}
        <div className={styles.actionButtons}>
          <button onClick={() => navigate('/cart')} className={styles.iconButton}>
            <FontAwesomeIcon icon={faCartShopping} style={{ color: 'inherit' }} />

          </button>

          <button onClick={() => navigate('/profile')} className={styles.iconButton}>
            <FontAwesomeIcon icon={faUser} style={{ color: 'inherit' }} />

          </button>
        </div>
      </div>

      {/* Product Grid */}
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className={styles.productGrid}>
          {products.map((product) => (
            <div className={styles.productCard} key={product.id}>
              <div className={styles.cardHeader}>
                {product.images?.[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className={styles.cardImage}
                  />
                )}
                <div>
                  <h4 className={styles.cardTitle}>{product.title}</h4>
                  <p className={styles.cardPrice}>${product.price}</p>
                </div>
              </div>

              <div className={styles.cardActions}>
                <Link
                  to={`/product/${product.id}`}
                  className={styles.detailsButton}
                  onMouseEnter={() =>
                    queryClient.prefetchQuery({
                      queryKey: ['product', String(product.id)],
                      queryFn: () => fetchProductById(String(product.id)),
                    })
                  }
                >
                  View Details
                </Link>

                <button
                  className={styles.cartAddButton}
                  onClick={() =>
                    addToCart({
                      productId: product.id,
                      title: product.title,
                      price: product.price,
                      image: product.images?.[0] || '',
                    })
                  }
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More */}
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className={styles.loadMoreButton}
        >
          {isFetchingNextPage ? 'Loading more...' : 'Load More'}
        </button>
      )}
    </div>
  );
};

export default ProductListPage;
