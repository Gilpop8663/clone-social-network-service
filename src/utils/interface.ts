import { User } from 'firebase/auth';

interface IAuthProps {
  isLoggedIn: User | null;
}
