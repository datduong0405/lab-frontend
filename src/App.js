import React, { createContext, useEffect, useState } from "react";
import {
  Route,
  Routes,
  BrowserRouter as Router,
  redirect,
  Navigate,
} from "react-router-dom";

import {
  DashboardPage,
  LoginPage,
  UserPage,
  LabPage,
  EquipmentPage,
  TeacherDashboard,
  TeacherLab,
  LabAdminLayout,
  LabAdminDashboard,
  LabAdminLab,
  LabAdminEquipment,
  HistoryPage,
  TypePage,
  Maintain,
} from "./pages";
import axios from "axios";
import PageLayout from "./pages/PageLayout";
import TeacherLayout from "./pages/TeacherLayout";
import { reactLocalStorage } from "reactjs-localstorage";
import NotFound from "./pages/NotFound";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

export const UserContext = createContext({});
const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_CENTER,
  timeout: 5000,
  offset: "30px",
  width: "300px",
  // you can also just use 'scale'
  transition: transitions.SCALE,
};

const App = () => {
  const [loged, setLoged] = useState(
    reactLocalStorage.get("user") && JSON.parse(reactLocalStorage.get("user"))
  );
  const [lab, setLab] = useState(null);
  const [authenticate, setAuthenticate] = useState(
    reactLocalStorage.get("authenticate")
  );

  return (
    <UserContext.Provider
      value={{ loged, setLoged, authenticate, setAuthenticate }}
    >
      <AlertProvider template={AlertTemplate} {...options}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>

          <Route path="/admin" element={<PageLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="/admin/user" element={<UserPage />} />
            <Route path="/admin/lab" element={<LabPage />} />
            <Route path="/admin/equipment" element={<EquipmentPage />} />
            <Route path="/admin/history" element={<HistoryPage />} />
            <Route path="/admin/type" element={<TypePage />} />
            <Route path="/admin/maintain" element={<Maintain />} />
          </Route>

          <Route path="teacher" element={<TeacherLayout />}>
            <Route index element={<TeacherDashboard />} />
            <Route path="/teacher/lab" element={<TeacherLab />} />
            <Route path="/teacher/history" element={<HistoryPage />} />
            <Route path="/teacher/report" element={<Maintain />} />
          </Route>
          <Route path="labAdmin" element={<LabAdminLayout />}>
            <Route index element={<LabAdminDashboard />} />
            <Route path="/labAdmin/lab" element={<LabAdminLab />} />
            <Route path="/labAdmin/equipment" element={<LabAdminEquipment />} />
            <Route path="/labAdmin/history" element={<HistoryPage />} />
            <Route path="/labAdmin/type" element={<TypePage />} />
            <Route path="/labAdmin/report" element={<Maintain />} />
          </Route>
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </AlertProvider>
    </UserContext.Provider>
  );
};

export default App;
