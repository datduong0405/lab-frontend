import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Stack, Paper } from "@mui/material";
import { Link } from "react-router-dom";

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

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const DashboardPage = () => {
  const { loged, setLoged } = useContext(UserContext);

  const [user, setUser] = useState([]);
  const [lab, setLab] = useState([]);
  const [equip, setEquip] = useState([]);
  const [activeUser, setActiveUser] = useState();

  // const storeUser = reactLocalStorage.get("user");
  // const parseUser = JSON.parse(storeUser);

  const [selected, setSelected] = useState(1);
  const [chartData, setChartData] = useState([
    {
      type: "test",
      value: 1,
      color: "#E97D30",
    },
    {
      type: "Admin",
      value: 1,
      color: "#62B170",
    },
    {
      type: "Lab Admin",
      value: 1,
      color: "#F1AF13",
    },
  ]);
  const [equipData, setEquipData] = useState([
    {
      type: "Available",
      value: 1,
      color: "#E97D30",
    },
    {
      type: "Not Available",
      value: 1,
      color: "#62B170",
    },
  ]);
  const [labData, setLabData] = useState([
    {
      type: "Available Lab",
      value: 1,
      color: "#E97D30",
    },
    {
      type: "In Use",
      value: 1,
      color: "#62B170",
    },
    {
      type: "Not Available",
      value: 1,
      color: "#62B170",
    },
  ]);

  const baseUrl = "http://localhost:8080/api/lab/";

  const getAllLab = async () => {
    axios.get(`${baseUrl}user/laboratory`).then((res) => {
      setLab(res.data);

      const availableLab = res.data.filter(
        (u) => u.status === "AVAILABLE"
      ).length;
      const inUseLab = res.data.filter((u) => u.status === "IN USE").length;
      const notAvailableLab = res.data.filter(
        (u) => u.status === "NOT AVAILABLE"
      ).length;

      setLabData([
        {
          type: "Available",
          value: availableLab,
          color: "#E97D30",
        },
        {
          type: "In Use",
          value: inUseLab,
          color: "#62B170",
        },
        {
          type: "Not Available",
          value: notAvailableLab,
          color: "#62B170",
        },
      ]);
    });
  };

  const getALlEquip = async () => {
    axios.get(`${baseUrl}user/equipment`).then((res) => {
      setEquip(res.data);
      const availableEquip = res.data.filter(
        (u) => u.status === "AVAILABLE"
      ).length;
      const notAvailableEquip = res.data.filter(
        (u) => u.status === "NOT AVAILABLE"
      ).length;
      setLabData([
        {
          type: "Available Equipment",
          value: availableEquip,
          color: "#E97D30",
        },
        {
          type: "Not Available Equipment",
          value: notAvailableEquip,
          color: "#62B170",
        },
      ]);
    });
  };
  const getAllUser = async () => {
    const url = "http://localhost:8080/api/lab/user/";
    axios.get(url).then((res) => {
      setUser(res.data);

      setActiveUser(res.data.filter((user) => user.status === "ACTIVE").length);

      const teacherNo = res.data.filter(
        (u) => u.role.name === "TEACHER"
      ).length;
      const adminNo = res.data.filter(
        (u) => u.role.name === "SUPER ADMIN"
      ).length;
      const labAdminNo = res.data.filter(
        (u) => u.role.name === "LAB ADMIN"
      ).length;

      setChartData([
        {
          type: "Giáo Viên",
          value: teacherNo,
          color: "#E97D30",
        },
        {
          type: "Admin",
          value: adminNo,
          color: "#62B170",
        },
        {
          type: "Lab Admin",
          value: labAdminNo,
          color: "#F1AF13",
        },
      ]);
    });
  };

  const navigate = useNavigate();

  console.log(loged);

  useEffect(() => {
    if (!loged) {
      navigate("/login");
    }
    getAllUser();
    getAllLab();
    getALlEquip();
  }, []);

  const adminNav = [
    {
      icon: <HomeIcon />,
      title: "Tổng Quan",
      id: 1,
      path: "/",
    },
    {
      icon: <SupervisedUserCircleIcon />,
      title: "Người Dùng",
      id: 2,
      path: "/user",
    },
    {
      icon: <ElectricBoltIcon />,
      title: "Phòng Thực Hành",
      id: 3,
      path: "/lab",
    },
    {
      icon: <DevicesIcon />,
      title: "Thiết Bị",
      id: 4,
      path: "/equipment",
    },
    {
      icon: <HistoryIcon />,
      title: "Lịch Sử",
      id: 5,
      path: "/history",
    },
  ];

  const defaultLabelStyle = {
    fontSize: "5px",
  };

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
                setLoged(null);
                navigate("/login");
              }}
            >
              Log Out
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

          {/* content here */}
        </Stack>
      </Box>
    </Box>
  );
};

export default DashboardPage;
