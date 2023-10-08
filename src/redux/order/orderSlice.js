

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';

const initialState = {
    carts: [] // Thông tin cart 
};


export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        doAddBookAction: (state, action) => {
            let carts = state.carts;
            const item = action.payload;

            let isExistIndex = carts.findIndex(c => c._id === item._id)
            if (isExistIndex > -1) {
                carts[isExistIndex].quantity = carts[isExistIndex].quantity + item.quantity

                // Nếu số lượng sản phẩm mua lớn hơn trong kho thì sẽ gán nó bằng số lượng trong kho
                if (carts[isExistIndex].quantity > carts[isExistIndex].detail.quantity) {
                    carts[isExistIndex].quantity = carts[isExistIndex].detail.quantity
                }
            } else {
                carts.push({ quantity: item.quantity, _id: item._id, detail: item.detail })
            }

            // update redux
            state.carts = carts
            message.success("Thêm sản phẩm vào giỏ hàng thành công")
        },
        doUpdateCartAction: (state, action) => {
            let carts = state.carts;
            const item = action.payload;

            let isExistIndex = carts.findIndex(c => c._id === item._id)
            if (isExistIndex > -1) {
                carts[isExistIndex].quantity = item.quantity

                // Nếu số lượng sản phẩm mua lớn hơn trong kho thì sẽ gán nó bằng số lượng trong kho
                if (carts[isExistIndex].quantity > carts[isExistIndex].detail.quantity) {
                    carts[isExistIndex].quantity = carts[isExistIndex].detail.quantity
                }
            } else {
                carts.push({ quantity: item.quantity, _id: item._id, detail: item.detail })
            }

            // update redux
            state.carts = carts
        },
        doDeleteBookAction: (state, action) => {
            let carts = state.carts;
            const item = action.payload;

            const newCarts = carts.filter(cart => cart._id !== item._id)
            state.carts = newCarts

        },
        doOrderBookAction: (state, action) => {
            state.carts = []
        }
    },

    extraReducers: (builder) => {

    },
});

export const { doAddBookAction, doUpdateCartAction, doDeleteBookAction, doOrderBookAction } = orderSlice.actions;



export default orderSlice.reducer;
