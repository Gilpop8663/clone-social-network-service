import Footer from 'components/Footer';
import { authService } from './firebase';
import { useEffect, useState } from 'react';
import AppRouter from 'router/AppRouter';

export default function App() {
  const [userObj, setUserObj] = useState({});
  const [changeName, setChangeName] = useState(false);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setUserObj(user);
      }
    });
  }, []);

  const refreshUser = () => {
    setChangeName((prev) => !prev);
  };

  return (
    <>
      {userObj ? (
        <AppRouter
          userObj={userObj}
          refreshUser={refreshUser}
          isLoggedIn={Boolean(userObj !== undefined)}
        />
      ) : (
        '생성중입니다...'
      )}
      <Footer />
    </>
  );
}
