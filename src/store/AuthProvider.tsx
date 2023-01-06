import { useReducer, useCallback } from 'react';
import { AuthContext, INIT_STATE, IAuthed } from './authContext';

interface IReducerState {
  name: string;
  email: string;
  token: string;
  photo: string;
  authed: boolean;
}
interface IReducerAction {
  type: string;
  payload?: any;
}

const authReducer = (state: IReducerState, action: IReducerAction) => {
  switch (action.type) {
    case 'LOGIN': {
      const { name, email, token, photo } = action.payload;
      localStorage.setItem('AUTH', JSON.stringify({ name, email, token, photo }));
      return { name, email, token, photo, authed: true };
    }
    case 'LOGOUT': {
      localStorage.removeItem('AUTH');
      return { name: '', email: '', token: '', photo: '', authed: false };
    }
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: any }> = ({
  children,
}) => {
  const [auth, dispatchAuth] = useReducer(authReducer, INIT_STATE());

  const loginHandler = useCallback(
    ({ name, email, token, photo }: IAuthed) => {
      dispatchAuth({ type: 'LOGIN', payload: { name, email, token, photo } });
    },
    [dispatchAuth]
  );

  const logoutHandler = useCallback(() => {
    dispatchAuth({ type: 'LOGOUT' });
  }, [dispatchAuth]);

  const authContext = {
    authStatus: auth,
    loginHandler,
    logoutHandler,
  };

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
};
