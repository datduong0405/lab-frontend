import React, {
  useEffect,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useNavigate, Link } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import NativeSelect from "@mui/material/NativeSelect";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import {
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField,
  Tooltip,
  Toolbar,
  Select,
} from "@mui/material";

import { ConstructionOutlined, Delete, Edit } from "@mui/icons-material";
import { UserContext } from "../App";
import "./DashboardPage.css";
import { reactLocalStorage } from "reactjs-localstorage";
import HomeIcon from "@mui/icons-material/Home";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import DevicesIcon from "@mui/icons-material/Devices";
import HistoryIcon from "@mui/icons-material/History";
import axios from "axios";
import MaterialReactTable from "material-react-table";

const baseUrl = "http://localhost:8080/api/lab/";
const DashboardPage = () => {
  const { loged, setLoged } = useContext(UserContext);

  const [lab, setLab] = useState([]);

  // const storeUser = reactLocalStorage.get("user");
  // const parseUser = JSON.parse(storeUser);
  const [selected, setSelected] = useState(3);
  const [title, setTitle] = useState("Quản Lý Phòng Thực Hành");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModel, setEditModel] = useState(false);
  const [labId, setLabId] = useState();
  const [labEdit, setLabEdit] = useState({});
  const [user, setUser] = useState([]);
  const [adminId, setAdminId] = useState();
  const [usingLab, setUsingLab] = useState();
  const getAllLab = async () => {
    axios.get(`${baseUrl}user/laboratory`).then((res) => {
      setLab(res.data.reverse());
    });
  };

  const getAllUser = async () => {
    const url = "http://localhost:8080/api/lab/user/";
    axios.get(url).then((res) => {
      setUser(res.data.reverse());
    });
  };

  const getAllUsingLab = async () => {
    axios.get(`${baseUrl}user/reservation/${loged.id}`).then((res) => {
      setUsingLab(res.data);
    });
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("authenticated")) {
      navigate("/login");
    }
    getAllUsingLab();
    getAllLab();
    getAllUser();
  }, []);

  const deleteLab = (e, row) => {
    const id = row.id;
    axios.delete(`${baseUrl}user/laboratory/delete/${id}`).then((response) => {
      getAllLab();
    });
  };

  const columns = [
    { field: "name", headerName: "Tên Phòng", width: "200" },
    { field: "type", headerName: "Loại", width: "200" },
    { field: "status", headerName: "Trạng Thái", width: "200" },
    {
      field: "user",
      headerName: "Lab Admin",
      width: 200,
      valueGetter: (params) =>
        `${params.row.user.firstName}  ${params.row.user.lastName}`,
    },
    {
      field: "action",
      headerName: "Hành Động",
      sortable: false,
      width: 200,
      renderCell: (params) => {
        return (
          <Stack direction={"row"} spacing={2}>
            <Button
              color="warning"
              variant="contained"
              disabled={params.row.status === "IN USE"}
              onClick={() => {
                setEditModel(true);
                setLabId(params.row.id);
                setLabEdit(params.row);
                setAdminId(params.row.user.id);
              }}
            >
              Book
            </Button>
            {/* 
            <Button
              color="error"
              variant="contained"
              onClick={(e) => deleteLab(e, params.row)}
              disabled={params.row.status === "IN USE"}
            >
              Xoá
            </Button> */}
          </Stack>
        );
      },
    },
  ];

  const columnUsing = [
    { field: "name", headerName: "Tên", width: "200" },
    { field: "status", headerName: "Trạng Thái", width: "100" },
    { field: "id", headerName: "Mã", width: "100" },
    { field: "admin", headerName: "Lab Admin", width: "150" },
    { field: "startDate", headerName: "Ngày đặt", width: "200" },
    { field: "endDate", headerName: "Kết thúc", width: "200" },
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
      <DataGrid
        sx={{
          width: "1024px",
          height: "100px",
          marginLeft: "50px",
        }}
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        autoPageSize
        rows={lab}
        columns={columnUsing}
        pageSize={5}
        rowsPerPageOptions={[10]}
        NoRowsOverlay
      />
      <Stack
        direction="row"
        spacing={1}
        sx={{ justifyContent: "flex-end" }}
      ></Stack>
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
            sx={{
              width: "1024px",
            }}
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            NoRowsOverlay
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
            rows={lab}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Paper>
        <CreateLabModel
          columns={columns}
          open={createModalOpen}
          users={user}
          onClose={() => {
            setCreateModalOpen(false);
            getAllLab();
          }}
        />
        <EditLabModel
          columns={columns}
          labId={labId}
          adminId={adminId}
          labEdit={labEdit}
          users={user}
          open={editModel}
          onClose={() => {
            setEditModel(false);
            getAllLab();
          }}
        />
      </Box>
    </Box>
  );
};

export default DashboardPage;

export const CreateLabModel = ({ open, columns, onClose, onSubmit, users }) => {
  const [name, setName] = useState();
  const [type, setType] = useState();
  const [status, setStatus] = useState("AVAILABLE");
  const [user, setUser] = useState();

  const handleSubmit = () => {
    axios
      .post(
        `${baseUrl}user/laboratory/create`,
        {
          name: name,
          type: type,
          status: status,
          user: user,
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        onClose();
      });
  };
  const labAdmin = users.filter(
    (user) => user.role.name === "LAB ADMIN" && user.status === "ACTIVE"
  );
  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Thêm Mới</DialogTitle>
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
              label={"Tên Phòng"}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label={"Loại Phòng"}
              onChange={(e) => setType(e.target.value)}
            />
            {/* <FormControl fullWidth>
              <InputLabel variant="standard" htmlFor="controlled-native">
                Trạng Thái
              </InputLabel>
              <NativeSelect
                defaultValue={status}
                onChange={(e) => setStatus(e.target.value)}
                inputProps={{
                  name: "status",
                  id: "controlled-native",
                }}
              >
                <option value={"AVAILABLE"}>AVAILABLE</option>
                <option value={"IN USE"}>IN USE</option>
              </NativeSelect>
            </FormControl> */}

            <FormControl fullWidth>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Lab Admin
              </InputLabel>
              <NativeSelect
                defaultValue={"select"}
                value={user}
                onChange={(e) => setUser(e.target.value)}
                inputProps={{
                  name: "user",
                  id: "uncontrolled-native",
                }}
              >
                <option disabled value="select">
                  Select a lab admin
                </option>
                {labAdmin?.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName}
                  </option>
                ))}
              </NativeSelect>
            </FormControl>
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button onClick={onClose}>Huỷ</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          Thêm Mới
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const EditLabModel = ({
  open,
  columns,
  onClose,
  onSubmit,
  labId,
  labEdit,
  users,
  adminId,
}) => {
  //   const cols = [
  //     { field: "name", headerName: "Tên", width: 70 },
  //     { field: "type", headerName: "Loại", width: 100 },
  //     { field: "status", headerName: "Trạng Thái", width: 200 },
  //     { field: "user", headerName: "Admin", width: 130 },
  //   ];
  //   const [values, setValues] = useState(() =>
  //     cols.reduce((acc, column) => {
  //       const key = column.field;
  //       acc[column.field ?? ""] = labEdit[key];
  //       return acc;
  //     }, {})
  //   );

  const [name, setName] = useState();
  const [type, setType] = useState();
  const [status, setStatus] = useState();
  const [user, setUser] = useState();

  useEffect(() => {
    setName(labEdit.name);
    setStatus(labEdit.status);
    setUser(adminId);
    setType(labEdit.type);
  }, [labEdit]);

  const handleSubmit = () => {
    axios
      .patch(
        `${baseUrl}user/laboratory/edit/${labId}`,
        {
          name: name,
          type: type,
          status: status,
          user: user,
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        onClose();
      });
  };

  const labAdmin = users.filter(
    (user) => user.role.name === "LAB ADMIN" && user.status === "ACTIVE"
  );
  //   const handleChange = (e) => {
  //     setValues({ ...values, [e.target.name]: e.target.value });
  //     console.log(values);
  //   };
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
              key={"name"}
              label={"Tên"}
              defaultValue={labEdit.name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              key={"type"}
              label={"Loại Phòng"}
              defaultValue={labEdit.type}
              onChange={(e) => setType(e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel variant="standard" htmlFor="controlled-native">
                Trạng Thái
              </InputLabel>
              <NativeSelect
                defaultValue={status}
                onChange={(e) => setStatus(e.target.value)}
                inputProps={{
                  name: "status",
                  id: "controlled-native",
                }}
              >
                <option value={"AVAILABLE"}>AVAILABLE</option>
                <option value={"IN USE"}>IN USE</option>
              </NativeSelect>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Lab Admin
              </InputLabel>
              <NativeSelect
                defaultValue={
                  Object.keys(labEdit).length === 0 ? "" : labEdit.user.id
                }
                onChange={(e) => setUser(e.target.value)}
                inputProps={{
                  name: "user",
                  id: "uncontrolled-native",
                }}
              >
                {labAdmin?.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName}
                  </option>
                ))}
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
