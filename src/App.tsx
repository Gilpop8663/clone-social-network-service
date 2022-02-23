import Footer from 'components/Footer';
import { authService } from './firebase';
import { User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import AppRouter from 'router/AppRouter';

export default function App() {
  const [userObj, setUserObj] = useState({});
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setUserObj(user);
      }
    });
  }, []);

  return (
    <>
      {userObj ? (
        <AppRouter
          userObj={userObj}
          isLoggedIn={Boolean(userObj !== undefined)}
        />
      ) : (
        '생성중입니다...'
      )}
      <Footer />
    </>
  );
}
