import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./routes/Login";
import SignUp from "./routes/SignUp";
import PrivateRoutes from "./routes/PrivateRoutes";

export default function MyApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/nouveau_compte" element={<SignUp />} />
        {/* <Route path="/reinitialiser_mot_de_passe" element={} /> */}
        <Route path="/espace_user/*" element={<PrivateRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}
