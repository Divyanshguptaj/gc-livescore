import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  email: '',
  password: '',
};

const signupSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {
    setSignupData: (state, action) => {
      const { name, email, password } = action.payload;
      state.name = name;
      state.email = email;
      state.password = password;
    },
    clearSignupData: (state) => {
      state.name = '';
      state.email = '';
      state.password = '';
    },
  },
});

export const { setSignupData, clearSignupData } = signupSlice.actions;
export default signupSlice.reducer;
