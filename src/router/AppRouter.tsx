import React from 'react';
import { Home, Auth, Profile } from 'pages';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { User } from 'firebase/auth';
import Navigation from 'components/Navigation';
import ToDos from 'pages/ToDos';

interface AppRouterProps {
  isLoggedIn: User | null | any;
  userObj?: any;
  refreshUser: () => void;
}

export default function AppRouter({
  isLoggedIn,
  userObj,
  refreshUser,
}: AppRouterProps) {
  return (
    <BrowserRouter>
      {isLoggedIn && <Navigation userObj={userObj} />}
      <Routes>
        {isLoggedIn && <Route path="/" element={<Home userObj={userObj} />} />}
        {isLoggedIn && (
          <Route
            path="/profile"
            element={<Profile refreshUser={refreshUser} userObj={userObj} />}
          />
        )}
        {isLoggedIn && (
          <Route path="/todos" element={<ToDos userObj={userObj} />} />
        )}
        {!isLoggedIn && <Route path="/" element={<Auth />} />}
      </Routes>
    </BrowserRouter>
  );
}
