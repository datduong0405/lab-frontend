import { Box, Button, Stack, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

import { Notifications, Report } from "@mui/icons-material";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import HistoryIcon from "@mui/icons-material/History";
import HomeIcon from "@mui/icons-material/Home";
import NightlightIcon from "@mui/icons-material/Nightlight";
import Badge from "@mui/material/Badge";
import { UserContext } from "../App";
import "./DashboardPage.css";

const PageLayout = () => {
  const { loged, setLoged } = useContext(UserContext);

  const [selected, setSelected] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    if (!loged && loged?.role.name !== "TEACHER") {
      navigate("/login");
    }
  }, [loged]);

  const adminNav = [
    {
      icon: <HomeIcon />,
      title: "Tổng Quan",
      id: 1,
      path: "/teacher",
    },
    {
      icon: <ElectricBoltIcon />,
      title: "Phòng Thực Hành",
      id: 3,
      path: "/teacher/lab",
    },
    {
      icon: <Report />,
      title: "Báo Cáo Sư Cố",
      id: 4,
      path: "/teacher/report",
    },
    {
      icon: <HistoryIcon />,
      title: "Lịch Sử",
      id: 5,
      path: "/teacher/history",
    },
  ];

  const defaultLabelStyle = {
    fontSize: "5px",
  };

  if (loged?.role?.name !== "TEACHER") {
    return (
      <div>
        <h1>
          Bạn không có quyền vào trang này, xin hãy đăng nhập lại với tài khoản
          giáo viên{" "}
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
          Back to login
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
                <Notifications />
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
