/* istanbul ignore file */
import {
  createContext,
  PropsWithChildren,
  useContext,
} from 'react';
import { User } from '../types/User';
import { extractUserDetails, getTokenFromUrl, validateToken } from '../utils/authtokenhandler';
import { useDispatch } from 'react-redux';
import { clearAuthState, setAuthState } from '../state/reducers/authSlice';
import { useNavigate } from 'react-router-dom';
import { clearRequestDetails } from '../state/reducers/requestSlice';

type AuthContextType = {
  handleLogin: () => Promise<boolean>;
  handleLogout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: PropsWithChildren) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (): Promise<boolean> => {
    try {
      let token = getTokenFromUrl();
      let refreshToke = await validateToken(token ?? "");
      
        if (token && refreshToke) {
        localStorage.setItem('accessToken', token);
        const user: User|null = await extractUserDetails(token);
        if (!user) {
          dispatch(clearAuthState());
          dispatch(clearRequestDetails());
          return false;
        }
        localStorage.setItem("userName", user ? user.email : '' );
        localStorage.removeItem('accessToken');
        dispatch(setAuthState({
          token, user,
          accessToken: token,
          refreshToken: refreshToke
        }));
        return true;
      } else {
        console.error('No token found in URL');
        return false;
      }
    } catch (error) {
      console.error('handleLogin error:', error);
      dispatch(clearAuthState());
      dispatch(clearRequestDetails());
      localStorage.removeItem('accessToken');
      return false;
    }
  };

  const handleLogout = async (): Promise<void> => {
    dispatch(clearAuthState());
    dispatch(clearRequestDetails());
    navigate('/invalidsession', { state: { message: 'Logged out' } });
  };

  return (
    <AuthContext.Provider
      value={{
        handleLogin,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used inside of a AuthProvider');
  }

  return context;
}
