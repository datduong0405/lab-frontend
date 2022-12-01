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
import { styled } from "@mui/material/styles";
import { PieChart } from "react-minimal-pie-chart";
import axios from "axios";
import MaterialReactTable from "material-react-table";

const baseUrl = "http://localhost:8080/api/lab/";
const EquipmentPage = () => {
  const [lab, setLab] = useState([]);

  const { loged, setLoged } = useContext(UserContext);

  //   const storeUser = reactLocalStorage.get("user");
  //   const parseUser = JSON.parse(storeUser);
  const [selected, setSelected] = useState(4);
  const [title, setTitle] = useState("Quản Lý Thiết Bị");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModel, setEditModel] = useState(false);
  const [labId, setLabId] = useState();
  const [labEdit, setLabEdit] = useState({});
  const [user, setUser] = useState([]);
  const [adminId, setAdminId] = useState();
  const [labE, setLabE] = useState();

  const getAllLab = async () => {
    axios.get(`${baseUrl}user/equipment/labs`).then((res) => {
      setLab(res.data.reverse());
    });
  };

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
    getAllLab();
    getAllUser();
  }, []);

  const deleteLab = (e, row) => {
    const id = row.id;
    axios.delete(`${baseUrl}user/equipment/delete/${id}`).then((response) => {
      getAllLab();
    });
  };

  const columns = [
    { field: "name", headerName: "Tên Thiết Bị", width: "200" },
    { field: "type", headerName: "Loại", width: "100" },
    { field: "quantity", headerName: "Số lượng", width: "80" },
    { field: "description", headerName: "Mô tả", width: "80" },

    { field: "status", headerName: "Trạng Thái", width: "100" },
    {
      field: "usedStatus",
      headerName: "Trạng thái sử dụng",
      width: "250",
      valueGetter: (params) =>
        params.row.labName ? "Đang sử dụng" : "Không sử dụng",
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
              disabled={params.row.status === "IN USE"}
              onClick={() => {
                setEditModel(true);
                setLabId(params.row.id);
                setLabEdit(params.row);
              }}
            >
              Sửa
            </Button>

            <Button
              color="error"
              variant="contained"
              onClick={(e) => deleteLab(e, params.row)}
              disabled={params.row.status === "OUT STOCk" || params.row.labName}
            >
              Xoá
            </Button>
          </Stack>
        );
      },
    },
  ];

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
          Thêm Thiết Bị
        </Button>
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
            sx={{
              width: "1024px",
            }}
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
            rows={lab}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Paper>
        <CreateEModel
          columns={columns}
          open={createModalOpen}
          onClose={() => {
            setCreateModalOpen(false);
            getAllLab();
          }}
        />
        <EditLabModel
          columns={columns}
          labId={labId}
          labEdit={labEdit}
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

export default EquipmentPage;

export const CreateEModel = ({ open, columns, onClose, onSubmit }) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.field ?? ""] = "";
      return acc;
    }, {})
  );

  const handleSubmit = () => {
    console.log(values);
    axios
      .post(`${baseUrl}user/equipment/create`, values, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        onClose();
      });
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

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
            {columns.map((column) =>
              column.field === "action" ? null : (
                <TextField
                  key={column.field}
                  label={column.headerName}
                  name={column.field}
                  onChange={handleChange}
                />
              )
            )}
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
  const [name, setName] = useState();
  const [type, setType] = useState();
  const [status, setStatus] = useState("AVAILABLE");
  const [quantity, setQ] = useState();
  const [des, setDes] = useState();

  useEffect(() => {
    setName(labEdit.name);
    setStatus(labEdit.status);
    setType(labEdit.type);
    setQ(labEdit.quantity);
    setDes(labEdit.description);
  }, [labEdit]);

  const handleSubmit = () => {
    axios
      .patch(
        `${baseUrl}user/equipment/edit/${labId}`,
        {
          name: name,
          status: status,
          quantity: quantity,
          type: type,
          description: des,
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
              label={"Tên Thiết Bị"}
              name={"name"}
              defaultValue={labEdit.name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label={"Loại Thiết Bị"}
              name={"type"}
              defaultValue={labEdit.type}
              onChange={(e) => setType(e.target.value)}
            />
            <TextField
              label={"Số Lượng"}
              name={"quantity"}
              defaultValue={labEdit.quantity}
              onChange={(e) => setQ(e.target.value)}
            />
            <TextField
              label={"Mô Tả"}
              name={"description"}
              defaultValue={labEdit.description}
              onChange={(e) => setDes(e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Trạng Thái
              </InputLabel>
              <NativeSelect
                defaultValue={"select"}
                onChange={(e) => setStatus(e.target.value)}
                inputProps={{
                  name: "status",
                  id: "uncontrolled-native",
                }}
              >
                <option disabled value={"select"}>
                  Chọn Trạng Thái
                </option>
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="NOT AVAILABLE">NOT AVAILABLE</option>
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
