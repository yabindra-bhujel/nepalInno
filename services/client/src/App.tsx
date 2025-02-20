import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "./Pages/Home";
import Login from "./Pages/Auth/Login";
import { Blog } from "./Pages/BlogById";
import { CreateBlog } from "./Pages/CreateBlog";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog/:id" element={<Blog />} />

          <Route path="/login" element={<Login />} />
          <Route path="/create-blog" element={<CreateBlog />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
