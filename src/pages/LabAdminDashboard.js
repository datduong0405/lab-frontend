import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  TextField,
  Avatar,
  ButtonGroup,
} from "@mui/material";
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

const LabAdminDashboard = () => {
  const { loged, authenticate, setLoged } = useContext(UserContext);

  const [user, setUser] = useState(JSON.parse(reactLocalStorage.get("user")));
  const [lab, setLab] = useState([]);
  const [equip, setEquip] = useState([]);

  const [fn, setF] = useState(user.firstName);
  const [ln, setL] = useState(user.lastName);
  const [em, setE] = useState(user.email);
  const [ph, setP] = useState(user.phone);
  const [dp, setD] = useState(user.department);
  const [add, setAdd] = useState(user.address);
  const [username, setUsername] = useState(user.username);
  const [password, setPassword] = useState(user.password);

  const [id, setId] = useState(user.id);

  const baseUrl = "http://localhost:8080/api/lab/";

  const [hide, setHide] = useState("hidden");
  const [disable, setDisable] = useState(true);

  const getAllLab = async () => {
    axios.get(`${baseUrl}user/laboratory/labadmin/${loged.id}`).then((res) => {
      setLab(res.data);
    });
  };

  const getALlEquip = async () => {
    axios.get(`${baseUrl}user/equipment`).then((res) => {
      setEquip(res.data);
    });
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!authenticate) {
      navigate("/login");
    }
    setL(user.lastName);
    setF(user.firstName);
    setE(user.email);
    setD(user.department);
    setP(user.phone);
    setAdd(user.address);
    setUsername(user.username);
    setPassword(user.password);
    getAllLab();
    getALlEquip();
  }, []);

  const handleCancel = () => {
    setL(user.lastName);
    setF(user.firstName);
    setE(user.email);
    setD(user.department);
    setP(user.phone);
    setAdd(user.address);
    setUsername(user.username);
    setPassword(user.password);
  };

  const handleSubmit = () => {
    axios
      .patch(
        `${baseUrl}user/own/edit/${id}`,
        {
          username: username,
          password: password,
          firstName: fn,
          lastName: ln,
          email: em,
          phone: ph,
          department: dp,
          address: add,
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        setUser(res.data);
        reactLocalStorage.set("user", JSON.stringify(res.data));
        setLoged(JSON.parse(reactLocalStorage.get("user")));
      });
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
        T???ng Quan
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
            T???ng S??? Ph??ng Th???c H??nh
          </Typography>
          <Typography>{lab.length}</Typography>
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
            T???ng S??? Thi???t B???
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
            height: "520px",
          }}
        >
          <Typography
            sx={{
              fontWeight: "bold",
              margin: "20px",
            }}
          >
            Th??ng Tin C?? Nh??n
          </Typography>

          <Stack
            direction={"row"}
            spacing={0}
            sx={{
              padding: "10px",
            }}
          >
            <Box>
              <TextField
                sx={{
                  marginTop: "10px",
                }}
                disabled={disable}
                id="outlined-disabled"
                label="H???"
                value={fn}
                onChange={(e) => setF(e.target.value)}
              />
              <TextField
                sx={{ marginTop: "30px" }}
                disabled={disable}
                id="outlined-disabled"
                label="Ph??ng Ban"
                value={dp}
                onChange={(e) => setD(e.target.value)}
              />
            </Box>
            <Box>
              <TextField
                sx={{
                  marginTop: "10px",
                }}
                disabled={disable}
                id="outlined-disabled"
                label="T??n"
                value={ln}
                onChange={(e) => setL(e.target.value)}
              />
              <TextField
                sx={{ marginTop: "30px" }}
                disabled={disable}
                id="outlined-disabled"
                label="?????a Ch???"
                value={add}
                onChange={(e) => setAdd(e.target.value)}
              />
            </Box>
            <Box>
              <TextField
                sx={{
                  marginTop: "10px",
                }}
                disabled={disable}
                id="outlined-disabled"
                label="S??? ??i???n Tho???i"
                value={ph}
                onChange={(e) => setP(e.target.value)}
              />
              <TextField
                sx={{ marginTop: "30px" }}
                disabled={disable}
                id="outlined-disabled"
                label="Email"
                value={em}
                onChange={(e) => setE(e.target.value)}
              />
            </Box>
          </Stack>
          <Stack
            direction={"row"}
            spacing={0}
            sx={{
              padding: "10px",
            }}
          >
            <Stack>
              <TextField
                sx={{
                  marginTop: "10px",
                }}
                disabled={disable}
                id="outlined-disabled"
                label="T??i kho???n"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                sx={{ marginTop: "30px" }}
                disabled={disable}
                type={"password"}
                id="outlined-disabled"
                label="M???t Kh???u"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Stack>
            <Box>
              <Avatar
                alt="Avatar"
                src=""
                sx={{
                  width: 200,
                  height: 200,
                  marginTop: "30px",
                  marginLeft: "160px",
                }}
                title="Avatar"
              />
            </Box>
          </Stack>

          <Box sx={{ position: "absolute", right: "0", marginRight: "20px" }}>
            <Button
              variant="contained"
              color="success"
              sx={{ visibility: hide }}
              onClick={() => {
                handleSubmit();
                setHide("hidden");
                setDisable(!disable);
              }}
            >
              L??u
            </Button>
            <Button
              variant="contained"
              color="error"
              sx={{ visibility: hide, marginLeft: "10px" }}
              onClick={() => {
                handleCancel();
                setDisable(!disable);
                setHide("hidden");
              }}
            >
              Hu???
            </Button>
            <Button
              variant="contained"
              sx={{ marginLeft: "10px" }}
              onClick={() => {
                setHide("unset");
                setDisable(!disable);
              }}
            >
              C???p Nh???t
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default LabAdminDashboard;
