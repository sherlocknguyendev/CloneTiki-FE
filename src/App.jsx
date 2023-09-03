
import React, { useState } from 'react';
import LoginPage from './pages/login';
import ContactPage from './pages/contact';
import BookPage from './pages/book';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { Outlet } from 'react-router-dom'


const Layout = () => {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}


export default function App() {

  const router = createBrowserRouter([
    {

      path: "/",
      element: <Layout />,
      errorElement: <div>404 Not Found</div>,

      children: [
        { index: true, element: <Home /> },
        {
          path: "contact",
          element: <ContactPage />,
        },
        {
          path: "book",
          element: <BookPage />,
        },
      ]

    },

    {
      path: "/login",
      element: <LoginPage />,
    },

  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  )

}
