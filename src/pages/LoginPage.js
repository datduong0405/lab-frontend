import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import "./LoginPage.css";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Input from "@mui/material/Input";
import axios from "axios";
import Button from "@mui/material/Button";
import { UserContext } from "../App";
import { reactLocalStorage } from "reactjs-localstorage";

function LoginPage() {
  const { loged, setLoged, setAuthenticate } = useContext(UserContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [alert, setAlert] = useState(false);

  const enterUsername = (e) => {
    setUsername(e.target.value);
  };
  const login = async () => {
    const res = await axios.post(
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
    );

    let data = res && res.data;
    localStorage.setItem("authenticated", true);

    if (data) {
      reactLocalStorage.set("authenticate", true);
      setAuthenticate(reactLocalStorage.get("authenticate"));
      reactLocalStorage.set("user", JSON.stringify(data));
      setLoged(JSON.parse(reactLocalStorage.get("user")));
      data && setAlert(true);
      data.role.name === "SUPER ADMIN"
        ? setTimeout(() => {
            navigate("/admin");
          }, 2000)
        : data.role.name === "LAB ADMIN"
        ? setTimeout(() => {
            navigate("/labAdmin");
          }, 2000)
        : setTimeout(() => {
            navigate("/teacher");
          }, 2000);
    }
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
      navigate("/");
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

              <p
                style={{
                  display: alert ? "inherit" : "none",
                  marginLeft: "40px",
                }}
              >
                Login Successfully
              </p>

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
