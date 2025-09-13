import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { SignUp } from "./pages/Signup";
import { Login } from "./pages/Login";

function App() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home token={token} userId={userId} />} />
      </Routes>
  );
}

export default App;
