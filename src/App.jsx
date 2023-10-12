

import React, { useEffect, useState } from 'react';
import {
  createBrowserRouter,
  RouterProvider,

} from "react-router-dom";

import LoginPage from './pages/login';
import RegisterPage from './pages/register'
import ContactPage from './pages/contact';
import BookPage from './pages/book';

import Home from './components/Home';

import OrdersPage from './pages/orders/OrdersPage';
import HistoryPage from './pages/history/HistoryPage';

import { callFetchAccount } from './service/api';
import { useDispatch, useSelector } from 'react-redux';
import { doGetAccountAction } from './redux/account/accountSlice';

import Loading from './components/Loading';
import NotFound from './components/NotFound';
import AdminPage from './pages/admin';
import ProtectedRoute from './components/ProtectedRoute';

import DashBoard from './components/Admin/Dashboard';
import LayoutNormal from './components/LayoutNormal'
import LayoutAdmin from './components/Admin/LayoutAdmin';

import './styles/reset.css'
import './styles/global.scss'

import UserTable from './components/Admin/User/UserTable';
import BookTable from './components/Admin/Book/BookTable';
import OrderTable from './components/Admin/Orders/OrderTable';









export default function App() {

  const dispatch = useDispatch()
  const isAuthenticated = useSelector(state => state.account.isAuthenticated)
  const isLoading = useSelector(state => state.account.isLoading)



  const getAccount = async () => {
    if (window.location.pathname === '/login' ||
      window.location.pathname === '/register'
    ) return;

    const res = await callFetchAccount() // Lấy dữ liệu từ BE khi re-load trang (đã gán token vào axios rồi)
    if (res && res.data) {
      dispatch(doGetAccountAction(res.data)) // Lấy dữ liệu nhận đc và nạp vào redux
    }
  }

  useEffect(() => {
    getAccount()
  }, [])

  const router = createBrowserRouter([
    {

      path: "/",
      element: <LayoutNormal />,
      errorElement: <NotFound />,

      children: [
        { index: true, element: <Home /> },
        // {
        //   path: "contact",
        //   element: <ContactPage />,
        // },
        {
          path: "book/:slug", // Có dấu ":" có nghĩa là đang định nghĩa Params (tham số); slug là kiểu covert của url mà mỗi từ cách nhau = dấu "-" (ở đây slug chỉ là tên đại diện)
          element: <BookPage />,
        },
        {
          path: "order",
          element: <ProtectedRoute> <OrdersPage /> </ProtectedRoute>,
        },
        {
          path: "history",
          element: <ProtectedRoute> <HistoryPage /> </ProtectedRoute>,
        },
      ]

    },

    {
      path: "/admin",
      element: <LayoutAdmin />,
      errorElement: <NotFound />,

      children: [
        {
          index: true, element:
            <ProtectedRoute>
              <DashBoard />
            </ProtectedRoute>
        },
        {
          path: "user",
          element:
            <ProtectedRoute>
              <UserTable />
            </ProtectedRoute>,
        },
        {
          path: "book",
          element:
            <ProtectedRoute>
              <BookTable />
            </ProtectedRoute>,
        },
        {
          path: "orders",
          element:
            <ProtectedRoute>
              <OrderTable />
            </ProtectedRoute>,
        },
        // {
        //   path: "history",
        //   element:
        //     <ProtectedRoute>
        //       <HistoryPage />
        //     </ProtectedRoute>,
        // },
      ]

    },

    {
      path: "/login",
      element: <LoginPage />,
    },

    {
      path: "/register",
      element: <RegisterPage />,
    },

  ]);

  return (
    <>
      {isLoading === false ||
        window.location.pathname === '/login' ||
        window.location.pathname === '/register' ||
        window.location.pathname === '/'
        ?
        <RouterProvider router={router} />
        :
        <Loading />
      }


    </>
  )

}
