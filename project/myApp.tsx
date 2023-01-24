import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import SignUp from "./routes/SignUp";
import PrivateRoutes from "./routes/PrivateRoutes";
import PageNotFound from "./routes/PageNotFound";
import Login from "./routes/Login";
import ResetPassword from "./routes/ResetPassword";
import Homepage from "./routes/Homepage";
import UserTournamentsRegistrations from "./routes/UserTournamentsRegistrations";
import NewTournamentRegistration from "./routes/NewTournamentRegistration";
import Results from "./routes/Results";
import Settings from "./routes/Settings";
import { useEffect, useState } from "react";

export default function MyApp() {
  const [deviceDisplay, setDeviceDisplay] = useState("");

  /** Adapt the component return to window's width => RESPONSIVE */
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      entries.forEach(() => {
        if (window.innerWidth < 1000) {
          setDeviceDisplay("mobile");
        } else {
          setDeviceDisplay("desktop");
        }
      });
    });

    if (document.body) observer.observe(document.body);
  }, [deviceDisplay]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Outlet />}>
          <Route path="/se_connecter" element={<Login />} />
          <Route path="/creer_un_compte" element={<SignUp />} />
          <Route path="/reinitialiser_mot_de_passe/*" element={<ResetPassword />} />

          <Route element={<PrivateRoutes />}>
            <Route
              path="/"
              element={
                <Homepage deviceDisplay={deviceDisplay} setDeviceDisplay={setDeviceDisplay} />
              }
            />
            <Route
              path="/tournois"
              element={
                <UserTournamentsRegistrations
                  deviceDisplay={deviceDisplay}
                  setDeviceDisplay={setDeviceDisplay}
                />
              }
            />
            <Route path="/inscription" element={<NewTournamentRegistration />} />
            <Route path="/resultats" element={<Results />} />
            <Route path="/reglages" element={<Settings />} />
          </Route>

          <Route path="/page_introuvable" element={<PageNotFound />} />
          <Route path="*" element={<Navigate to="/page_introuvable" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
