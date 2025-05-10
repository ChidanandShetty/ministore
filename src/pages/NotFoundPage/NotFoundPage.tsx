// src/pages/NotFoundPage.tsx
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/products" style={{ color: '#007bff' }}>
        Go back to Product List
      </Link>
    </div>
  );
};

export default NotFoundPage;
