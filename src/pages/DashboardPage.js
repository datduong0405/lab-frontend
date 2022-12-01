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
  const { loged, authenticate } = useContext(UserContext);

  const [user, setUser] = useState([]);
  const [lab, setLab] = useState([]);
  const [equip, setEquip] = useState([]);
  const [activeUser, setActiveUser] = useState();
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
      setEquipData([
        {
          type: "Available",
          value: availableEquip,
          color: "#E97D30",
        },
        {
          type: "Not Available",
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

  useEffect(() => {
    if (!authenticate) {
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
    <Box
      className="content"
      sx={{
        marginLeft: "10px",
      }}
    >
      <Typography
        sx={{
          marginLeft: "80px",
          fontWeight: "600",
        }}
        variant="h4"
        marginTop="20px"
        marginBottom="20px"
        color="#603D08"
      >
        Tổng Quan
      </Typography>
      <Stack
        direction="row"
        spacing={15}
        sx={{
          justifyContent: "center",
          marginLeft: "20px",
        }}
      >
        <Item
          sx={{
            justifyContent: "center",
            textAlign: "center",
            width: "250px",
            color: "#603D08",
          }}
        >
          <Typography
            sx={{
              fontWeight: "bold",
            }}
          >
            Tổng Số Phòng Thực Hành
          </Typography>
          <Typography>{lab.length}</Typography>
        </Item>
        <Item
          sx={{
            justifyContent: "center",
            textAlign: "center",
            width: "250px",
            color: "#603D08",
          }}
        >
          <Typography
            sx={{
              fontWeight: "bold",
            }}
          >
            Tổng Số Người Dùng
          </Typography>
          <Typography>
            {user.length > 0
              ? ` ${user.length} (Active: ${activeUser} )`
              : "Loading..."}
          </Typography>
        </Item>
        <Item
          sx={{
            width: "250px",
            color: "#603D08",
          }}
        >
          <Typography
            sx={{
              fontWeight: "bold",
            }}
          >
            Tổng Số Thiết Bị
          </Typography>
          <Typography>
            {equip.length > 0 ? equip.length : "Loading..."}
          </Typography>
        </Item>
      </Stack>

      <Box className="content-bottom">
        <Paper
          sx={{
            justifyContent: "center",
            marginLeft: "50px",
            marginTop: "20px",
            height: "500px",
          }}
        >
          <Stack
            direction={"row"}
            spacing={15}
            sx={{
              padding: "10px",
            }}
          >
            <PieChart
              data={labData}
              label={({ dataEntry }) =>
                dataEntry.value === 0
                  ? ""
                  : dataEntry.type + " " + dataEntry.value
              }
              labelStyle={{
                ...defaultLabelStyle,
              }}
              style={{ height: "250px", marginTop: "100px" }}
            />
            <PieChart
              data={chartData}
              label={({ dataEntry }) =>
                dataEntry.value === 0
                  ? ""
                  : dataEntry.type + " " + dataEntry.value
              }
              labelStyle={{
                ...defaultLabelStyle,
              }}
              style={{ height: "250px", marginTop: "100px" }}
            />
            <PieChart
              data={equipData}
              label={({ dataEntry }) =>
                dataEntry.value === 0
                  ? ""
                  : dataEntry.type + " " + dataEntry.value
              }
              labelStyle={{
                ...defaultLabelStyle,
              }}
              style={{ height: "250px", marginTop: "100px" }}
            />
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};

export default DashboardPage;
