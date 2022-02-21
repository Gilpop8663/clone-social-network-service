import React from 'react';
import { Home, Auth, Profile, EditProfile } from 'pages';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { User } from 'firebase/auth';
import Navigation from 'components/Navigation';

interface AppRouterProps {
  isLoggedIn: User | null | any;
  userObj?: any;
}

export default function AppRouter({ isLoggedIn, userObj }: AppRouterProps) {
  return (
    <BrowserRouter>
      {isLoggedIn && <Navigation />}
      <Routes>
        {isLoggedIn && <Route path="/" element={<Home userObj={userObj} />} />}
        {isLoggedIn && <Route path="/profile" element={<Profile />} />}
        {!isLoggedIn && <Route path="/" element={<Auth />} />}
        <Route path="/" element={<EditProfile />} />
      </Routes>
    </BrowserRouter>
  );
}
