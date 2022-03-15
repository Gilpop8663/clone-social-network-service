import { Home, Auth, Profile, ToDos } from 'pages';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HOME_URL, PROFILE_URL, TODOS_URL } from 'constants/constant';
import Navigation from 'components/Navigation';

interface AppRouterProps {
  isLoggedIn: boolean;
  userObj?: any;
  refreshUser: () => void;
  changeName: boolean;
}

export default function AppRouter({
  isLoggedIn,
  userObj,
  refreshUser,
  changeName,
}: AppRouterProps) {
  if (!isLoggedIn) {
    return (
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Routes>
          <Route path={HOME_URL} element={<Auth />} />
          <Route path={PROFILE_URL} element={<Auth />} />
          <Route path={TODOS_URL} element={<Auth />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path={HOME_URL} element={<Home userObj={userObj} />} />
        <Route
          path={PROFILE_URL}
          element={<Profile refreshUser={refreshUser} userObj={userObj} />}
        />
        <Route path={TODOS_URL} element={<ToDos userObj={userObj} />} />
      </Routes>
    </BrowserRouter>
  );
}
