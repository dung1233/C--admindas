import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './compoment/pages/Home';
import Commerce from './compoment/pages/Products/Commerce';
import Product from './compoment/pages/Products/Product';
import Addproduct from './compoment/pages/Products/Addproduct';
import Catenorylist from './compoment/pages/Products/Catenorylist';
import Oderlist from './compoment/pages/Oder/Oderlist';
import Login from './compoment/pages/Login/Login';
import Oderdetails from './compoment/pages/Oder/Oderdetails';
import Review from './compoment/pages/Review/Review';
import Chat from './compoment/pages/Chat';
import Userlist from './compoment/pages/User/Userlist';
import UserAc from './compoment/pages/User/UserAc';
import Invoice from './compoment/pages/User/Invoice';
import Customer from './compoment/pages/User/Customer'
const App = () => {
  return (
    <Router>
      {/* Định nghĩa Routes */}
      <Routes>
        {/* Trang Home */}
        <Route path="/" element={<Commerce />} />
        <Route path="/Commerce" element={<Commerce />} />
        <Route path="/Product" element={<Product />} />
        <Route path="/Addproduct" element={<Addproduct />} />
        <Route path="/Catenorylist" element={<Catenorylist />} />
        <Route path="/Oderlist" element={<Oderlist />} />
        <Route path="/Login" element={<Login />} />
        <Route path='/Oderdetails' element={<Oderdetails />} />
        <Route path='/Review' element={<Review />} />
        <Route path='/Chat' element={<Chat />} />
        <Route path='/Userlist' element={<Userlist />} />
        <Route path='/UserAc' element={<UserAc />} />
        <Route path='/Invoice' element={<Invoice />} />
        <Route path='/Customer' element={<Customer />} />
      </Routes>
    </Router>
  )
}

export default App