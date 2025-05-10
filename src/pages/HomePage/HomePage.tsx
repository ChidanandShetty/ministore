import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './HomePage.module.css'; // 👈 import CSS module

const fetchProfile = async () => {
  const res = await axios.get('http://localhost:3000/api/v1/auth/profile');
  return res.data;
};

const HomePage = () => {
  const navigate = useNavigate();

  const { data: user, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div className={styles.container}>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h1 className={styles.welcome}>Welcome {user?.name || 'Guest'} 👋</h1>
          <p className={styles.subtext}>
            to <strong>MiniStore</strong> – your one-stop shop for everything!
          </p>
          <button className={styles.button} onClick={() => navigate('/products')}>
            Start Shopping →
          </button>
        </>
      )}
    </div>
  );
};

export default HomePage;
