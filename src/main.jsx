import React, { lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './css/index.css';
import initWeb3Onboard from "./libs/initWeb3Onboard";

initWeb3Onboard();

const Home = React.lazy(() => import('./pages/Home'));
const Owner = React.lazy(() => import('./pages/Owner'));
const Dev = React.lazy(() => import('./pages/Dev'));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
    />
    <BrowserRouter basename="">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Owner />} />
        <Route path="/dev" element={<Dev />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);


