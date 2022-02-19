import { Home, Auth, Profile, EditProfile } from 'pages';
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/" element={<Auth />} />
        <Route path="/" element={<Profile />} />
        <Route path="/" element={<EditProfile />} />
      </Routes>
    </BrowserRouter>
  );
}
