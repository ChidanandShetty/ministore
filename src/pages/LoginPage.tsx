import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface LoginForm {
  email: string;
  password: string;
}

const LoginPage = () => {
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, status } = useMutation<{ access_token: string }, Error, LoginForm>({
    mutationFn: async (formData) => {
      const response = await axios.post('http://localhost:3000/api/v1/auth/login', formData);
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.access_token);
      queryClient.setQueryData(['auth'], data);
      navigate('/products');
    },
    onError: () => {
      alert('Invalid login credentials');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(form);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        /><br /><br />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        /><br /><br />
        <button type="submit" disabled={status === 'pending'}>
          {status === 'pending' ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
