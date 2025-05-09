import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchProductById = async (id: string) => {
  const res = await axios.get(`http://localhost:3000/api/v1/products/${id}`);
  return res.data;
};

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id!),
    enabled: !!id, // Only run if ID exists
  });

  if (isLoading) return <p>Loading product details...</p>;
  if (isError) return <p>Failed to load product.</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>{product.title}</h2>

      {product.images?.[0] && (
        <img
          src={product.images[0]}
          alt={product.title}
          style={{ width: 300, height: 300, objectFit: 'cover' }}
        />
      )}

      <p><strong>Price:</strong> ${product.price}</p>
      <p><strong>Category:</strong> {product.category?.name || 'N/A'}</p>
      <p>{product.description}</p>
    </div>
  );
};

export default ProductDetailPage;
