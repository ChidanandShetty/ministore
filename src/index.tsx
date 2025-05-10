
import ReactDOM from 'react-dom/client';
import App from './App';
import axios from 'axios';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { CartProvider } from './context/CartContext'; // 👈 added this
import { ToastContainer } from 'react-toastify';

import './styles/theme.css';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const queryClient = new QueryClient();

const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

persistQueryClient({
  queryClient,
  persister,
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <App />
       <ToastContainer position="top-right" autoClose={3000} />
    </CartProvider>
  </QueryClientProvider>
);
