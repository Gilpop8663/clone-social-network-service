import React from 'react';
import { Home, Auth, Profile, EditProfile } from 'pages';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { User } from 'firebase/auth';

interface AppRouterProps {
  isLoggedIn: User | null | any;
}

export default function AppRouter({ isLoggedIn }: AppRouterProps) {
  return (
    <BrowserRouter>
      <Routes>
        {isLoggedIn && <Route path="/" element={<Home />} />}
        {!isLoggedIn && <Route path="/" element={<Auth />} />}
        <Route path="/" element={<Profile />} />
        <Route path="/" element={<EditProfile />} />
      </Routes>
    </BrowserRouter>
  );
}
