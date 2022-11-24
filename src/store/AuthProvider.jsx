import { useReducer, useCallback } from 'react';
import { AuthContext, INIT_STATE } from './auth-context';

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN': {
      const { name, email } = action.payload;
      localStorage.setItem('AUTH', JSON.stringify({ name, email }));
      return { name, email, authed: true };
    }
    case 'LOGOUT': {
      localStorage.removeItem('AUTH');
      return { name: '', email: '', authed: false };
    }
    case 'UPDATE': {
      console.log('action UPDATE', action);
      return state;
    }
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [auth, dispatchAuth] = useReducer(authReducer, INIT_STATE());

  const loginHandler = useCallback(
    ({ name, email }) => {
      dispatchAuth({ type: 'LOGIN', payload: { name, email } });
    },
    [dispatchAuth]
  );

  const logoutHandler = useCallback(() => {
    dispatchAuth({ type: 'LOGOUT' });
  }, [dispatchAuth]);

  const updateUserHandler = useCallback((data) => {
    console.log('data obj to update user in auth context', data);
  }, []);

  const authContext = {
    authStatus: auth,
    loginHandler,
    logoutHandler,
    updateUserHandler,
  };

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
};