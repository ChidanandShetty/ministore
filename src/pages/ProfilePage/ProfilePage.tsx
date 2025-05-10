import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import styles from './ProfilePage.module.css';

const fetchProfile = async () => {
  const res = await axios.get('http://localhost:3000/api/v1/auth/profile');
  return res.data;
};

const ProfilePage = () => {
  const {
    data: profile,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    staleTime: 1000 * 60,
  });

  if (isLoading) return <p>Loading profile...</p>;
  if (isError) return <p>Error fetching profile: {(error as Error).message}</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Your Profile</h2>

      {profile.avatar && (
        <img
          src={profile.avatar}
          alt="User Avatar"
          className={styles.avatar}
        />
      )}

      <p className={styles.info}><strong>Name:</strong> {profile.name}</p>
      <p className={styles.info}><strong>Email:</strong> {profile.email}</p>
      <p className={styles.info}><strong>Role:</strong> {profile.role}</p>
    </div>
  );
};

export default ProfilePage;
