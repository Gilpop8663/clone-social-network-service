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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amatic+SC:wght@700&family=Bebas+Neue&family=Do+Hyeon&family=Handlee&family=Lobster&family=Roboto&family=Sacramento&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <AppRouter
        changeName={changeName}
        userObj={userObj}
        refreshUser={refreshUser}
        isLoggedIn={Boolean(userObj)}
      />
    </>
  );
}
