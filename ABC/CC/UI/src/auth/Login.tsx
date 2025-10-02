/* istanbul ignore file */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const { handleLogin } = useAuth();
  const [isAuthenticated, setisAuthenticated] = useState<boolean | undefined>(undefined);
  const [isAuthenticating, setisAuthenticating] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      const loginStatus = await handleLogin();
      setisAuthenticated(loginStatus);
      if (loginStatus) {
        navigate('/');
      }
      else{
        navigate('/invalidsession', { state: { message: 'Invalid Session' } });
      }

    };
    initialize();
  }, [navigate]);
  useEffect(() => {
    if (isAuthenticated !== undefined) {
      setisAuthenticating(false);
    }
  }, [isAuthenticated]);

  if (isAuthenticating) {
    return <div>Auth in Progress...</div>;
  }

  return null;
};

export default Login;
