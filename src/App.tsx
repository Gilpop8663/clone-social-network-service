import Footer from 'components/Footer';
import { authService } from './firebase';
import { User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import AppRouter from 'router/AppRouter';

export default function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  return (
    <>
      {init ? <AppRouter isLoggedIn={isLoggedIn} /> : '생성중입니다...'}
      <Footer />
    </>
  );
}
