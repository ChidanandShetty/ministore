import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const ProductListPage = lazy(() => import('./pages/ProductListPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
// const CartPage = lazy(() => import('./pages/CartPage'));
// const ProfilePage = lazy(() => import('./pages/ProfilePage'));
// const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<div>Welcome to MiniStore</div>} />
         <Route path="/login" element={<LoginPage />} />
          <Route path="/products" element={<ProductListPage />} />
           <Route path="/product/:id" element={<ProductDetailPage />} />
          {/*<Route path="/cart" element={<CartPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
