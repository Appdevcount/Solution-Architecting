
/* istanbul ignore file */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/User';

interface AuthState {
  token: string | null;
  accessToken:string | null;
  refreshToken: any;
  user: User | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
  accessToken: "",
  refreshToken: ""
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState: (state, action: PayloadAction<AuthState>) => {
      return action.payload;
    },
    clearAuthState: (state) => {
      return initialState;
    },
  },
});

export const { setAuthState, clearAuthState } = authSlice.actions;

export default authSlice.reducer;
