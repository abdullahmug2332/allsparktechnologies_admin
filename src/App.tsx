import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import PrivateRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Blog from "./pages/Blog";
import CreateBlogs from "./pages/CreateBlogs";
import EditBlogs from "./pages/EditBlogs";
import AllMessages from "./pages/AllMessages";
import MessagesDetail from "./pages/MessageDetail";
import SubServices from "./pages/SubServices";

const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<Services />} />
          <Route path="/subservices" element={<SubServices />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/createblog" element={<CreateBlogs />} />
          <Route path="/editblog/:urlName" element={<EditBlogs />} />
          <Route path="/messages" element={<AllMessages />} />
          <Route path="/message/:id" element={<MessagesDetail />} />
        </Route>
      </Routes>
      <Sidebar />
    </>
  );
};

export default App;
