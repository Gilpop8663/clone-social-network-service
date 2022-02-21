import Footer from 'components/Footer';
import { authService } from './firebase';
import { User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import AppRouter from 'router/AppRouter';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userObj, setUserObj] = useState({});
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserObj(user);
      } else {
        setIsLoggedIn(false);
      }
    });
  }, []);

  return (
    <>
      {isLoggedIn ? (
        <AppRouter userObj={userObj} isLoggedIn={isLoggedIn} />
      ) : (
        '생성중입니다...'
      )}
      <Footer />
    </>
  );
}
