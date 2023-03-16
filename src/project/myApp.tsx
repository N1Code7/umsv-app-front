import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import SignUp from "./routes/public/SignUp";
import PrivateRoutes from "./routes/private/PrivateRoutes";
import PageNotFound from "./routes/public/PageNotFound";
import Login from "./routes/public/Login";
import ResetPassword from "./routes/public/ResetPassword";
import Homepage from "./routes/private/member/Homepage";
import UserTournamentsRegistrations from "./routes/private/member/UserTournamentsRegistrations";
import NewTournamentRegistration from "./routes/private/member/NewTournamentRegistration";
import Results from "./routes/private/member/Results";
import Settings from "./routes/private/member/Settings";
import { useEffect, useState } from "react";
import Persist from "./routes/private/Persist";
import AdminHomepage from "./routes/private/admin/AdminHomepage";
import Unauthorized from "./routes/public/Unauthorized";
import AdminRegistrationsDemands from "./routes/private/admin/AdminRegistrationsDemands";
import AdminTournamentsHandle from "./routes/private/admin/AdminTournamentsHandle";
import AdminArticlesHandle from "./routes/private/admin/AdminArticlesHandle";
import AdminEventsHandle from "./routes/private/admin/AdminEventsHandle";
import AdminUsersHandle from "./routes/private/admin/AdminUsersHandle";

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
          <Route path="se_connecter" element={<Login />} />
          <Route path="creer_un_compte" element={<SignUp />} />
          <Route path="reinitialiser_mot_de_passe/*" element={<ResetPassword />} />

          <Route element={<Persist />}>
            <Route
              path="/"
              element={
                <PrivateRoutes allowedRoles={["ROLE_MEMBER", "ROLE_ADMIN", "ROLE_SUPERADMIN"]} />
              }
            >
              <Route path="/" element={<Homepage deviceDisplay={deviceDisplay} />} />
              <Route
                path="tournois"
                element={<UserTournamentsRegistrations deviceDisplay={deviceDisplay} />}
              />
              <Route path="nouvelle_inscription" element={<NewTournamentRegistration />} />
              <Route path="resultats" element={<Results deviceDisplay={deviceDisplay} />} />
              <Route path="reglages" element={<Settings />} />
            </Route>
            <Route element={<PrivateRoutes allowedRoles={["ROLE_ADMIN", "ROLE_SUPERADMIN"]} />}>
              <Route path="admin" element={<AdminHomepage />} />
              <Route path="admin/demandes_inscriptions" element={<AdminRegistrationsDemands />} />
              <Route path="admin/gestion_tournois" element={<AdminTournamentsHandle />} />
              <Route path="admin/gestion_articles" element={<AdminArticlesHandle />} />
              <Route path="admin/gestion_evenements" element={<AdminEventsHandle />} />
              <Route path="admin/gestion_utilisateurs" element={<AdminUsersHandle />} />
            </Route>
          </Route>

          <Route path="page_introuvable" element={<PageNotFound />} />
          <Route path="acces_refuse" element={<Unauthorized />} />
          <Route path="*" element={<Navigate to="/page_introuvable" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
