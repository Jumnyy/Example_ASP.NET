<<<<<<< Updated upstream
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
=======
﻿import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// 0. IMPORT KHO LƯU TRỮ GIỎ HÀNG (CONTEXT)
import { CartProvider, useCart } from './context/CartContext';

// 1. IMPORT LAYOUT DÙNG CHUNG
import Header from './components/Header';
import Footer from './components/Footer';

// 2. IMPORT CÁC TRANG CHỨC NĂNG
import Home from './pages/home/index';
import ProductDetail from './pages/product-detail';
import Blog from './pages/blog/index';
import BlogDetail from './pages/blog/BlogDetail';

// BIẾN THỂ PHÂN KHU GIỎ HÀNG MỚI THEO CÂY THƯ MỤC CỦA BẠN
import CartPage from './pages/cart/index';
import Profile from './pages/profile/index';
import Checkout from './pages/checkout/index';
/*import OrderHistory from './pages/profile/orderHistory';// BỔ SUNG: Import trang Shop vào đây khi bạn dùng đến
*/import Shop from './pages/shop/index';
import Login from './pages/auth/login';
import Register from './pages/auth/Register';
import './App.css';

// Layout bao bọc website kết nối Context thực tế
const MainLayout = ({ children }) => {
    // Lấy số lượng sản phẩm thực tế đang có trong giỏ tay
    const { cartCount } = useCart();

    return (
        <div className="d-flex flex-column min-vh-100">
            {/* Tự động truyền số lượng đếm xuống thanh Header */}
            <Header cartCount={cartCount} />
            <main className="flex-grow-1">
                {children}
            </main>
            <Footer />
        </div>
    );
};

function AppContent() {
    return (
        <MainLayout>
            <Routes>
                {/* Trang chủ */}
                <Route path="/" element={<Home />} />

                {/* Cấu hình URL /shop mở Component Shop (Mở ra khi cần dùng) */}
                 <Route path="/shop" element={<Shop />} /> 
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/checkout" element={<Checkout />} />
{/*                <Route path="/order-history" element={<OrderHistory />} />
*/}                {/* Trang chi tiết sản phẩm */}
                <Route path="/product/:id" element={
                    <div className="container py-4">
                        <ProductDetail />
                    </div>
                } />

                {/* TUYẾN ĐƯỜNG GIỎ HÀNG (MỚI BỔ SUNG) */}
                <Route path="/cart" element={<CartPage />} />

                {/* Trang blog */}
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogDetail />} />
            </Routes>
        </MainLayout>
    );
}

function App() {
    return (
        // Bọc CartProvider ở lớp ngoài cùng cao nhất để tất cả các trang đều dùng chung một bộ nhớ giỏ hàng
        <CartProvider>
            <Router>
                <AppContent />
            </Router>
        </CartProvider>
    );
>>>>>>> Stashed changes
}

export default App;
