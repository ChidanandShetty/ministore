import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import styles from './ProductDetailPage.module.css';

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
    enabled: !!id,
  });

  if (isLoading) return <p>Loading product details...</p>;
  if (isError) return <p>Failed to load product.</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{product.title}</h2>

      <div className={styles.imageWrapper}>
        {product.images?.[0] && (
          <img
            src={product.images[0]}
            alt={product.title}
            className={styles.productImage}
          />
        )}
      </div>

      <p className={styles.price}>${product.price}</p>
      <p className={styles.category}>
        Category: {product.category?.name || 'N/A'}
      </p>
      <p className={styles.description}>{product.description}</p>
    </div>
  );
};

export default ProductDetailPage;
