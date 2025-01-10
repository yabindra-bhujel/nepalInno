import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "./Pages/Home";
import Login from "./Pages/Auth/Login";
import { Blog } from "./Pages/Blog";
import { CreateBlog } from "./Pages/CreateBlog";
import { ProtectedRoute } from "./config/ProtectedRoute";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />

          <Route path="/login" element={<Login />} />
          {/* <Route path="/create-blog" element={<ProtectedRoute><CreateBlog /></ProtectedRoute>} /> */}
          <Route path="/create-blog" element={<CreateBlog />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
