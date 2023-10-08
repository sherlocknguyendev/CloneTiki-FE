
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated: false,
    isLoading: true,
    user: {
        email: "",
        phone: "",
        fullName: "",
        role: "",
        avatar: "",
        id: "",
        tempAvatar: "",
    }
};



export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        doLoginAction: (state, action) => {
            state.isAuthenticated = true;
            state.isLoading = false;
            state.user = action.payload
        },
        doGetAccountAction: (state, action) => {
            state.isAuthenticated = true;
            state.isLoading = false;
            state.user = action.payload.user
        },
        doLogoutAction: (state, action) => {
            localStorage.removeItem('access_token')
            state.isAuthenticated = false;
            state.user = {
                email: "",
                phone: "",
                fullName: "",
                role: "",
                avatar: "",
                id: ""
            }
        },
        doUpdateUserInforAction: (state, action) => {
            state.user.avatar = action.payload.avatar;
            state.user.phone = action.payload.phone;
            state.user.fullName = action.payload.fullName;
        },
        doUploadAvatarAction: (state, action) => {
            state.user.tempAvatar = action.payload.avatar
        }

    },

    extraReducers: (builder) => {

    },
});

export const
    {
        doLoginAction,
        doGetAccountAction,
        doLogoutAction,
        doUpdateUserInforAction,
        doUploadAvatarAction
    } = accountSlice.actions;



export default accountSlice.reducer;
