import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./routes/SignUp";
import PrivateRoutes from "./routes/PrivateRoutes";
import PageNotFound from "./routes/PageNotFound";
import Login from "./routes/Login";
import ResetPassword from "./routes/ResetPassword";

export default function MyApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/se_connecter" element={<Navigate to="/" replace />} />
        <Route path="/creer_un_compte" element={<SignUp />} />
        <Route path="/reinitialiser_mot_de_passe" element={<ResetPassword />} />
        <Route path="/utilisateur/*" element={<PrivateRoutes />} />
        <Route path="/page_introuvable" element={<PageNotFound />} />
        <Route path="*" element={<Navigate to="/page_introuvable" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
