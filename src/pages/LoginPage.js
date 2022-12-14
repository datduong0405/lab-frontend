import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";
import { UserContext } from "../App";
import { Header } from "../components";
import "./LoginPage.css";

function LoginPage() {
  const alert = useAlert();

  const { loged, setLoged, setAuthenticate } = useContext(UserContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const enterUsername = (e) => {
    setUsername(e.target.value);
  };
  const login = async () => {
    axios
      .post(
        "http://localhost:8080/api/lab/login",
        {
          username: username,
          password: password,
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        let data = res.data;
        if (data.status === "ACTIVE") {
          localStorage.setItem("authenticated", true);
          reactLocalStorage.set("authenticate", true);
          setAuthenticate(reactLocalStorage.get("authenticate"));
          reactLocalStorage.set("user", JSON.stringify(data));
          setLoged(JSON.parse(reactLocalStorage.get("user")));

          alert.success(
            "Đăng Nhập Thành Công, Đang Định Hướng Tới Trang Tiếp Theo...."
          );

          data.role.name === "SUPER ADMIN"
            ? setTimeout(() => {
                navigate("/admin");
              }, 4000)
            : data.role.name === "LAB ADMIN"
            ? setTimeout(() => {
                navigate("/labAdmin");
              }, 4000)
            : setTimeout(() => {
                navigate("/teacher");
              }, 4000);
        } else {
          alert.error("Tài khoản vô hiệu hoá, liên hệ admin để xử lý");
        }
      })
      .catch((e) => {
        alert.error(
          "Tên đăng nhập hoặc mật khẩu không chính xác, vui lòng nhập lại"
        );
      });
  };

  const [values, setValues] = useState({
    password: "",
    showPassword: false,
  });
  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
    setPassword(event.target.value);
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const navigate = useNavigate();

  useEffect(() => {
    if (loged) {
      loged.role.name === "SUPER ADMIN"
        ? navigate("/admin")
        : loged.role.name === "LAB ADMIN"
        ? navigate("/labAdmin")
        : navigate("/teacher");
    }
  }, []);

  return (
    <Box className="login-contianer">
      <Header />
      <Grid container spacing={2}>
        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Paper
            elevation={1}
            sx={{
              width: "400px",
              height: "70vh",
              marginTop: "20px",
              backgroundColor: "#1d5781",
              borderRadius: "10px",
            }}
          >
            <Stack
              direction="column"
              spacing={8}
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Avatar
                alt="Avatar"
                src=""
                sx={{
                  width: 90,
                  height: 90,
                  justifyContent: "center",
                  marginTop: "30px",
                  marginLeft: "40%",
                }}
                title="Avatar"
              />
              <Box>
                <FormControl
                  sx={{
                    marginLeft: "40px",
                    width: "80%",
                  }}
                >
                  <InputLabel htmlFor="outlined-adornment-username">
                    Tên Đăng Nhập
                  </InputLabel>
                  <OutlinedInput
                    onChange={enterUsername}
                    id="outlined-adornment-username"
                    label="Tên Đăng Nhập"
                    type="text"
                    required
                    sx={{
                      backgroundColor: "#2C72A5",
                      borderRadius: "20px",
                    }}
                  />
                </FormControl>
              </Box>
              <Box>
                <FormControl
                  sx={{ marginLeft: "40px", width: "80%" }}
                  variant="outlined"
                >
                  <InputLabel htmlFor="outlined-adornment-password">
                    Mật Khẩu
                  </InputLabel>
                  <OutlinedInput
                    sx={{
                      backgroundColor: "#2C72A5",
                      borderRadius: "20px",
                    }}
                    id="outlined-adornment-password"
                    type={values.showPassword ? "text" : "password"}
                    value={values.password}
                    onChange={handleChange("password")}
                    required
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {values.showPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Mật Khẩu"
                  />
                </FormControl>
              </Box>
              <Box>
                <Button
                  sx={{
                    marginLeft: "40px",
                    width: "80%",
                    borderRadius: "20px",
                  }}
                  variant="contained"
                  color="error"
                  onClick={login}
                >
                  Log In
                </Button>
              </Box>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper
            elevation={0}
            sx={{
              marginTop: "100px",
            }}
            className="dummy"
          >
            <div className="dummyLeft">
              <p
                style={{
                  fontSize: "20px",
                }}
              >
                Learn at your own pace.
              </p>
              <Avatar
                alt="Avatar"
                src=""
                sx={{
                  width: 200,
                  height: 200,
                  marginTop: "80px",
                }}
                title="Avatar"
              />
            </div>
            <div className="dummyRight">
              <Avatar
                alt="Avatar"
                src=""
                sx={{
                  width: 90,
                  height: 90,
                  marginTop: "80px",
                }}
                title="Avatar"
              />
              <Avatar
                alt="Avatar"
                src=""
                sx={{
                  width: 90,
                  height: 90,
                  marginTop: "80px",
                }}
                title="Avatar"
              />
            </div>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default LoginPage;
