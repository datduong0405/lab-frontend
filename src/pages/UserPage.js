import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  FormControl,
  InputLabel,
  NativeSelect,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Refresh } from "@mui/icons-material";
import axios from "axios";
import "./DashboardPage.css";
import { useAlert } from "react-alert";

const baseUrl = "http://localhost:8080/api/lab/";

const DashboardPage = () => {
  const alert = useAlert();
  const [user, setUser] = useState([]);
  const [title, setTitle] = useState("Quản Lý Người Dùng");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModel, setEditModel] = useState(false);
  const [id, setId] = useState();
  const [userEdit, setUserEdit] = useState({});

  const getAllUser = async () => {
    const url = "http://localhost:8080/api/lab/user/";
    axios.get(url).then((res) => {
      setUser(res.data.reverse());
    });
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("authenticated")) {
      navigate("/login");
    }
    getAllUser();
  }, []);

  const deleteUser = (e, row) => {
    const username = row.username;
    axios
      .get(`${baseUrl}user/delete?key=${username}`)
      .then((response) => {
        alert.info("Xoá Thành Công");
        getAllUser();
      })
      .catch((e) => {
        alert.error(
          "Không thể xoá người đùng này, người dùng có thể đang có nhiệm vụ quản lý hoặc đang sử dụng phòng thực hành"
        );
      });
  };

  const columns = [
    { field: "username", headerName: "Tên Đăng Nhập", hide: "true" },
    { field: "password", headerName: "Mật Khẩu", hide: "true" },
    { field: "firstName", headerName: "Họ", width: 70 },
    { field: "lastName", headerName: "Tên", width: 100 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone", headerName: "Số Điện Thoại", width: 130 },
    { field: "department", headerName: "Phòng Ban", hide: "true" },
    { field: "status", headerName: "Trạng Thái", width: 130 },
    {
      field: "role",
      headerName: "Vai Trò",
      width: 130,
      valueGetter: (params) => (params.row.role ? params.row.role.name : "NaN"),
    },
    {
      field: "action",
      headerName: "Hành Động",
      sortable: false,
      width: 160,
      renderCell: (params) => {
        return (
          <Stack direction={"row"} spacing={2}>
            <Button
              color="warning"
              variant="contained"
              onClick={() => {
                setEditModel(true);
                setId(params.row.id);
                setUserEdit(params.row);
              }}
            >
              Sửa
            </Button>

            <Button
              color="error"
              variant="contained"
              onClick={(e) => deleteUser(e, params.row)}
              // disabled={
              //   (params.row.role && params.row.role.name === "SUPER ADMIN") ||
              //   params.row.status === "ACTIVE"
              // }
            >
              Xoá
            </Button>
          </Stack>
        );
      },
    },
  ];
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
        {title}
      </Typography>
      <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
        <Button
          size="small"
          variant="contained"
          color="success"
          onClick={() => setCreateModalOpen(true)}
        >
          Thêm Người Dùng
        </Button>
        <Fab
          color="primary"
          aria-label="refresh"
          size="small"
          onClick={getAllUser}
        >
          <Refresh />
        </Fab>
      </Stack>
      <Box className="content-bottom">
        <Paper
          sx={{
            justifyContent: "center",
            marginLeft: "50px",
            marginTop: "20px",
            height: "600px",
          }}
        >
          <DataGrid
            components={{ Toolbar: GridToolbar }}
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
            sx={{
              width: "1024px",
            }}
            rows={user}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Paper>
        <CreateNewAccountModal
          columns={columns}
          open={createModalOpen}
          onClose={() => {
            setCreateModalOpen(false);
            getAllUser();
          }}
        />
        <EditAccountModal
          columns={columns}
          values={user}
          id={id}
          userEdit={userEdit}
          open={editModel}
          onClose={() => {
            setEditModel(false);
            getAllUser();
          }}
        />
      </Box>
    </Box>
  );
};

export default DashboardPage;

export const CreateNewAccountModal = ({ open, columns, onClose, onSubmit }) => {
  const [un, setU] = useState("");
  const [pw, setPw] = useState("");
  const [fn, setF] = useState("");
  const [ln, setL] = useState("");
  const [em, setE] = useState("");
  const [ph, setP] = useState("");
  const [dp, setD] = useState("");
  const [st, setS] = useState("ACTIVE");
  const [rl, setR] = useState("TEACHER");

  const alert = useAlert();

  const handleSubmit = () => {
    console.log(rl);
    axios
      .post(
        `${baseUrl}user/create`,
        {
          username: un,
          password: pw,
          firstName: fn,
          lastName: ln,
          email: em,
          phone: ph,
          department: dp,
          status: st,
          role: rl,
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        alert.success("Thêm Thành Công");
        onClose();
      });
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Thêm Người Dùng</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: "100%",
              minWidth: { xs: "300px", sm: "360px", md: "400px" },
              gap: "1.5rem",
            }}
          >
            <TextField
              label={"Tên Đăng Nhập"}
              onChange={(e) => setU(e.target.value)}
            />
            <TextField
              label={"Mật Khẩu"}
              onChange={(e) => setPw(e.target.value)}
            />
            <TextField label={"Họ"} onChange={(e) => setF(e.target.value)} />
            <TextField label={"Tên"} onChange={(e) => setL(e.target.value)} />

            <TextField label={"Email"} onChange={(e) => setE(e.target.value)} />
            <TextField label={"Phone"} onChange={(e) => setP(e.target.value)} />
            <TextField
              label={"Phòng Ban"}
              onChange={(e) => setD(e.target.value)}
            />

            <FormControl>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Status
              </InputLabel>
              <NativeSelect
                onChange={(e) => setS(e.target.value)}
                value={st}
                inputProps={{
                  name: "status",
                  id: "uncontrolled-native",
                }}
              >
                <option value={"ACTIVE"}>ACTIVE</option>
                <option value={"INACTIVE"}>INACTIVE</option>
              </NativeSelect>
            </FormControl>

            <FormControl>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Role
              </InputLabel>
              <NativeSelect
                onChange={(e) => setR(e.target.value)}
                value={rl}
                inputProps={{
                  name: "role",
                  id: "controlled-native",
                }}
              >
                <option value={"TEACHER"}>TEACHER</option>
                <option value={"LAB ADMIN"}>LAB ADMIN</option>
                <option value={"SUPER ADMIN"}>SUPER ADMIN</option>
              </NativeSelect>
            </FormControl>
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button onClick={onClose}>Huỷ</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          Thêm Người Dùng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const EditAccountModal = ({
  open,
  columns,
  onClose,
  onSubmit,
  id,
  userEdit,
}) => {
  const [fn, setF] = useState(userEdit.firstName);
  const [ln, setL] = useState(userEdit.lastName);
  const [em, setE] = useState(userEdit.email);
  const [ph, setP] = useState(userEdit.phone);
  const [dp, setD] = useState(userEdit.department);
  const [st, setS] = useState(userEdit.status);

  const alert = useAlert();

  useEffect(() => {
    setF(userEdit.firstName);
    setL(userEdit.lastName);
    setE(userEdit.email);
    setD(userEdit.department);
    setP(userEdit.phone);
    setS(userEdit.status);
  }, [userEdit]);

  //   const [values, setValues] = useState(() =>
  //     cols.reduce((acc, column) => {
  //       let key = column.field;
  //       acc[column.field ?? ""] = userEdit[key];
  //       return acc;
  //     }, {})
  //   );

  const handleSubmit = () => {
    axios
      .patch(
        `${baseUrl}user/edit/${id}`,
        {
          firstName: fn,
          lastName: ln,
          email: em,
          phone: ph,
          department: dp,
          status: st,
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        alert.info("Sửa Thành Công");
        onClose();
      });
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Sửa Thông Tin</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: "100%",
              minWidth: { xs: "300px", sm: "360px", md: "400px" },
              gap: "1.5rem",
            }}
          >
            <TextField
              label={"Họ"}
              name={"firstName"}
              defaultValue={userEdit.firstName}
              onChange={(e) => setF(e.target.value)}
            />
            <TextField
              label={"Tên"}
              name={"lastName"}
              defaultValue={userEdit.lastName}
              onChange={(e) => setL(e.target.value)}
            />
            <TextField
              label={"Email"}
              name={"email"}
              defaultValue={userEdit.email}
              onChange={(e) => setE(e.target.value)}
            />
            <TextField
              label={"Số Điện Thoại"}
              name={"phone"}
              defaultValue={userEdit.phone}
              onChange={(e) => setP(e.target.value)}
            />
            <TextField
              label={"Phòng Ban"}
              name={"department"}
              defaultValue={userEdit.department}
              onChange={(e) => setD(e.target.value)}
            />
            <FormControl>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Status
              </InputLabel>
              <NativeSelect
                defaultValue={userEdit.status}
                onChange={(e) => setS(e.target.value)}
                inputProps={{
                  name: "status",
                  id: "uncontrolled-native",
                }}
              >
                <option value={"ACTIVE"}>ACTIVE</option>
                <option value={"INACTIVE"}>INACTIVE</option>
              </NativeSelect>
            </FormControl>
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button onClick={onClose}>Huỷ</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          Sửa Thông Tin
        </Button>
      </DialogActions>
    </Dialog>
  );
};
