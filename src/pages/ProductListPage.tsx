import { useQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import type { QueryFunctionContext } from '@tanstack/react-query';
import { Link } from 'react-router-dom'; // 👈 import Link

const LIMIT = 10;

// Fetch categories
const fetchCategories = async (): Promise<any[]> => {
  const res = await axios.get('http://localhost:3000/api/v1/categories');
  return res.data;
};

// Fetch paginated products
const fetchProducts = async (
  ctx: QueryFunctionContext<string[], number>
): Promise<any[]> => {
  const { pageParam = 0, queryKey } = ctx;
  const [_key, search, category] = queryKey;

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

// Prefetch single product
const fetchProductById = async (id: string) => {
  const res = await axios.get(`http://localhost:3000/api/v1/products/${id}`);
  return res.data;
};

// Safe next page logic
const getNextPageParam = (lastPage: any, allPages: any[]) => {
  if (!lastPage || !Array.isArray(lastPage)) return undefined;
  return lastPage.length === LIMIT ? allPages.length * LIMIT : undefined;
};

const ProductListPage = () => {
  const queryClient = useQueryClient(); // 👈 use query client
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
    <div style={{ padding: 20 }}>
      <h2>Product List</h2>

      {/* Search + Category Filters */}
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: 5, width: 300, marginRight: 10 }}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: 5 }}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Product List */}
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        products.map((product) => (
          <div
            key={product.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
              borderBottom: '1px solid #ccc',
              paddingBottom: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {product.images?.[0] && (
                <img
                  src={product.images[0]}
                  alt={product.title}
                  style={{
                    width: 100,
                    height: 100,
                    objectFit: 'cover',
                    marginRight: 20,
                  }}
                />
              )}
              <div>
                <h4>{product.title}</h4>
                <p>Price: ${product.price}</p>
              </div>
            </div>

            <Link
              to={`/product/${product.id}`}
              onMouseEnter={() =>
                queryClient.prefetchQuery({
                  queryKey: ['product', String(product.id)],
                  queryFn: () => fetchProductById(String(product.id)),
                })
              }
              style={{
                backgroundColor: '#007bff',
                color: '#fff',
                padding: '8px 12px',
                borderRadius: 5,
                textDecoration: 'none',
              }}
            >
              View Details
            </Link>
          </div>
        ))
      )}

      {/* Load More Button */}
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          style={{ marginTop: 20, padding: '10px 20px' }}
        >
          {isFetchingNextPage ? 'Loading more...' : 'Load More'}
        </button>
      )}
    </div>
  );
};

export default ProductListPage;
