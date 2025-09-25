import React from 'react';
import Header from './Header';
import Footer from './Footer';

// 全局布局组件 - 简洁的页面结构
export default function Layout({ children }) {
  return (
    <div className="layout">
      <Header />
      <main className="layout__main">
        {children}
      </main>
      <Footer />
    </div>
  );
}
