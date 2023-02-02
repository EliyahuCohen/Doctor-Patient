import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/Register/RegisterPage";
import SigninPage from "./pages/Signin/SigninPage";
import "./app.css";
const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="register" element={<RegisterPage />} />
          <Route index element={<SigninPage />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
