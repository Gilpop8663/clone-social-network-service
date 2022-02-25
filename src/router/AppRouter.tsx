import { Home, Auth, Profile, ToDos } from 'pages';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from 'components/Navigation';
import { HOME_URL, PROFILE_URL, TODOS_URL } from 'constants/constant';

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
  return (
    <BrowserRouter>
      {isLoggedIn && <Navigation userObj={userObj} />}
      <Routes>
        {isLoggedIn && (
          <Route path={HOME_URL} element={<Home userObj={userObj} />} />
        )}
        {isLoggedIn && (
          <Route
            path={PROFILE_URL}
            element={<Profile refreshUser={refreshUser} userObj={userObj} />}
          />
        )}
        {isLoggedIn && (
          <Route path={TODOS_URL} element={<ToDos userObj={userObj} />} />
        )}
        {!isLoggedIn && <Route path={HOME_URL} element={<Auth />} />}
      </Routes>
    </BrowserRouter>
  );
}
