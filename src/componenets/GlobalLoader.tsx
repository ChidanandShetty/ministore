import { useIsFetching } from '@tanstack/react-query';

const GlobalLoader = () => {
  const isFetching = useIsFetching();

  if (!isFetching) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      height: '4px',
      width: '100%',
      backgroundColor: '#007bff',
      zIndex: 9999,
      animation: 'loader-blink 1s linear infinite'
    }} />
  );
};

export default GlobalLoader;
