import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Stack, Paper, Badge } from "@mui/material";
import { Link, Outlet } from "react-router-dom";

import { UserContext } from "../App";
import "./DashboardPage.css";
import { reactLocalStorage } from "reactjs-localstorage";
import HomeIcon from "@mui/icons-material/Home";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import DevicesIcon from "@mui/icons-material/Devices";
import HistoryIcon from "@mui/icons-material/History";
import { styled } from "@mui/material/styles";
import { PieChart } from "react-minimal-pie-chart";
import axios from "axios";
import SettingsIcon from "@mui/icons-material/Settings";
import NightlightIcon from "@mui/icons-material/Nightlight";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { Engineering, NotificationsNone } from "@mui/icons-material";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const PageLayout = () => {
  const { loged, setLoged } = useContext(UserContext);

  const [selected, setSelected] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    if (!loged && loged?.role.name !== "SUPER ADMIN") {
      navigate("/login");
    }
  }, []);

  const adminNav = [
    {
      icon: <HomeIcon />,
      title: "Tổng Quan",
      id: 1,
      path: "/admin",
    },
    {
      icon: <SupervisedUserCircleIcon />,
      title: "Người Dùng",
      id: 2,
      path: "/admin/user",
    },
    {
      icon: <ElectricBoltIcon />,
      title: "Phòng Thực Hành",
      id: 3,
      path: "/admin/lab",
    },
    {
      icon: <DevicesIcon />,
      title: "Thiết Bị",
      id: 4,
      path: "/admin/equipment",
    },
    {
      icon: <DevicesIcon />,
      title: "Loại Thiết Bị",
      id: 6,
      path: "/admin/equipmentType",
    },
    {
      icon: <Engineering />,
      title: "Bảo Trì/Bảo Dưỡng",
      id: 7,
      path: "/admin/maintain",
    },
    {
      icon: <HistoryIcon />,
      title: "Lịch Sử",
      id: 5,
      path: "/admin/history",
    },
  ];

  const defaultLabelStyle = {
    fontSize: "5px",
  };

  if (loged?.role.name !== "SUPER ADMIN") {
    return (
      <div>
        <h1>
          Bạn không có quyền vào trang này, xin hãy đăng nhập lại với tài khoản
          admin{" "}
        </h1>
        <Button
          onClick={() => {
            localStorage.removeItem("authenticated");
            localStorage.removeItem("authenticate");
            localStorage.removeItem("user");
            setLoged(null);
            navigate("/login");
          }}
        >
          Login
        </Button>
        <Button
          onClick={() => {
            navigate(-1);
          }}
        >
          Back
        </Button>
      </div>
    );
  }

  return (
    <Box>
      <Box className="header" sx={{ p: 2 }}>
        <Box>
          <Typography
            sx={{
              width: 300,
              height: "50%",
              marginLeft: "10rem",
              color: "white",
              fontWeight: "600",
            }}
            variant="h2"
          >
            LMS
          </Typography>
        </Box>

        <Stack direction={"row"} className="header-left" spacing={1}>
          <Box
            sx={{
              marginRight: "10px",
            }}
          >
            <div className="user-name">
              {loged?.firstName} {loged?.lastName}
            </div>
            <div className="user-role">{loged?.role.name}</div>
          </Box>
          <Box>
            <Button
              variant="contained"
              color="info"
              size="small"
              onClick={() => {
                localStorage.removeItem("authenticated");
                localStorage.removeItem("authenticate");
                localStorage.removeItem("user");
                setLoged(null);
                navigate("/login");
              }}
            >
              Log Out
            </Button>
            <Button color="info">
              <Badge badgeContent={4} color="error">
                <NotificationsNone />
              </Badge>
            </Button>
            <Button color="info">
              <NightlightIcon />
            </Button>
          </Box>
        </Stack>
      </Box>
      <Box className="main">
        <Stack direction="row">
          <Box
            className="sidebar"
            sx={{
              width: "300px",
            }}
          >
            {adminNav.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                style={{
                  textDecoration: "none",
                  backgroundColor: item.id === selected ? "white" : "inherit",

                  borderTopLeftRadius: item.id === selected ? "25px" : "unset",
                  borderBottomLeftRadius:
                    item.id === selected ? "25px" : "unset",
                  "&:hover": {
                    backgroundColor: selected === item.id ? "white" : "inherit",
                    color: "#1D5781",
                    borderTopLeftRadius: "25px",
                    borderBottomLeftRadius: "25px",
                  },
                  marginTop: "20px",
                  marginLeft: "50px",
                }}
              >
                <Button
                  sx={{
                    color: item.id === selected ? "#1D5781" : "white",
                  }}
                  onClick={() => {
                    setSelected(item.id);
                  }}
                >
                  <span style={{ marginRight: "10px" }}>{item.icon}</span>
                  <span>{item.title}</span>
                </Button>
              </Link>
            ))}
          </Box>

          <Outlet />
        </Stack>
      </Box>
    </Box>
  );
};

export default PageLayout;
