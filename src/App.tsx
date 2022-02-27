import Footer from 'components/Footer';
import { authService } from './firebase';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import AppRouter from 'router/AppRouter';

export default function App() {
  const [userObj, setUserObj] = useState<object | null>(null);
  const [changeName, setChangeName] = useState(false);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setUserObj(user);
      } else {
        setUserObj(null);
      }
    });
  }, []);

  const refreshUser = () => {
    setChangeName((prev) => !prev);
  };

  return (
    <>
      <Helmet>
        <title>Twitter</title>
        <meta name="description" content="twitter clone application" />
      </Helmet>
      <AppRouter
        changeName={changeName}
        userObj={userObj}
        refreshUser={refreshUser}
        isLoggedIn={Boolean(userObj)}
      />
      <Footer />
    </>
  );
}
