import Footer from 'components/Footer';
import { authService } from './firebase';
import { User } from 'firebase/auth';
import { useState } from 'react';
import AppRouter from 'router/AppRouter';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<User | null>(
    authService.currentUser
  );

  return (
    <>
      <AppRouter isLoggedIn={isLoggedIn} />
      <Footer />
    </>
  );
}
