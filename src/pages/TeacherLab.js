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
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
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
  Fab,
} from "@mui/material";

import {
  ConstructionOutlined,
  Delete,
  Edit,
  Refresh,
} from "@mui/icons-material";
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
  const [usingLab, setUsingLab] = useState([]);
  const [userId, setUserId] = useState(
    JSON.parse(reactLocalStorage.get("user")).id
  );

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
    axios.get(`${baseUrl}user/reservation/${userId}`).then((res) => {
      setUsingLab(res.data);
    });
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("authenticated")) {
      navigate("/login");
    }
    console.log(loged.id);
    setUserId(JSON.parse(reactLocalStorage.get("user")).id);
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
    {
      field: "startDate",
      headerName: "Ngày đặt",
      width: "200",
      valueGetter: (params) => new Date(params.row.startDate),
    },
    {
      field: "endDate",
      headerName: "Kết thúc",
      width: "200",
      valueGetter: (params) => new Date(params.row.endDate),
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
        <Fab
          color="primary"
          aria-label="refresh"
          size="small"
          onClick={() => {
            getAllLab();
            getAllUsingLab();
          }}
        >
          <Refresh />
        </Fab>
      </Stack>
      <DataGrid
        sx={{
          width: "1024px",
          height: "200px",
          marginLeft: "50px",
        }}
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        autoPageSize
        rows={usingLab}
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
            height: "500px",
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
        <EditLabModel
          columns={columns}
          labId={labId}
          userId={loged.id}
          open={editModel}
          onClose={() => {
            setEditModel(false);
            getAllLab();
            getAllUsingLab();
          }}
        />
      </Box>
    </Box>
  );
};

export default DashboardPage;

export const EditLabModel = ({ open, onClose, userId, labId }) => {
  const [startDate, setStateDate] = useState();
  const [endDate, setEndDate] = useState();

  const [st, setSt] = useState(dayjs(new Date()));
  const [en, setEn] = useState(dayjs(new Date()));

  const handleDate = (date) => {
    console.log(Math.floor(new Date(date).getTime() / 1000));
    return Math.floor(new Date(date).getTime() / 1000);
  };
  const handleSubmit = () => {
    axios
      .post(
        `${baseUrl}user/reservation/create`,
        {
          userId: userId,
          labId: labId,
          startDate: startDate,
          endDate: endDate,
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        onClose();
      });
  };
  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center"> Đặt Phòng Thực Hành</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack
              sx={{
                marginTop: "20px",
              }}
              spacing={5}
            >
              <DateTimePicker
                label="Chọn Thời Gian Bắt Đầu"
                value={st}
                onChange={(e) => {
                  setSt(e);
                  setStateDate(handleDate(e));
                }}
                renderInput={(params) => <TextField {...params} />}
              />
              <DateTimePicker
                label="Chọn Thời Gian Kết Thúc"
                value={en}
                onChange={(e) => {
                  setEn(e);
                  setEndDate(handleDate(e));
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </Stack>
          </LocalizationProvider>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button onClick={onClose}>Huỷ</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          Đặt Phòng Thực Hành
        </Button>
      </DialogActions>
    </Dialog>
  );
};
