import React, { createContext, useEffect, useState } from "react";
import {
  Route,
  Routes,
  BrowserRouter as Router,
  useNavigate,
  Link,
} from "react-router-dom";

import {
  DashboardPage,
  LoginPage,
  UserPage,
  LabPage,
  EquipmentPage,
  TeacherDashboard,
  TeacherLab,
} from "./pages";
import axios from "axios";
import PageLayout from "./pages/PageLayout";
import TeacherLayout from "./pages/TeacherLayout";
import { reactLocalStorage } from "reactjs-localstorage";
import NotFound from "./pages/NotFound";

export const UserContext = createContext({});

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
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<PageLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="/admin/user" element={<UserPage />} />
          <Route path="/admin/lab" element={<LabPage />} />
          <Route path="/admin/equipment" element={<EquipmentPage />} />
        </Route>
        <Route path="teacher" element={<TeacherLayout />}>
          <Route index element={<TeacherDashboard />} />
          <Route path="/teacher/lab" element={<TeacherLab />} />
        </Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </UserContext.Provider>
  );
};

export default App;
