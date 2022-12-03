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
import RefreshIcon from "@mui/icons-material/Refresh";
import Fab from "@mui/material/Fab";
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

  const [title, setTitle] = useState("Quản Lý Thiết Bị");

  const [editModel, setEditModel] = useState(false);
  const [labId, setLabId] = useState();
  const [labEdit, setLabEdit] = useState({});

  const [types, setTypes] = useState([]);

  const getAllLab = async () => {
    axios.get(`${baseUrl}user/equipment/labs`).then((res) => {
      setLab(res.data);
    });
  };

  const getAllType = () => {
    axios.get(`${baseUrl}user/etype`).then((res) => {
      setTypes(res.data);
    });
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("authenticated")) {
      navigate("/login");
    }
    getAllType();
    getAllLab();
  }, []);

  const deleteLab = (e, row) => {
    const id = row.id;
    axios.delete(`${baseUrl}user/equipment/delete/${id}`).then((response) => {
      getAllLab();
    });
  };

  const columns = [
    { field: "id", headerName: "Mã Thiết Bị", width: "50" },

    { field: "name", headerName: "Tên Thiết Bị", width: "100" },
    { field: "type", headerName: "Loại Thiết Bị", width: "100" },
    { field: "description", headerName: "Mô tả", width: "200" },
    { field: "status", headerName: "Trạng Thái", width: "100" },
    {
      field: "state",
      headerName: "Tình Trạng Thiết Bị",
      width: "200",
    },
    {
      field: "labName",
      headerName: "Phòng sử dụng",
      width: "150",
      valueGetter: (params) =>
        params.row.labName ? params.row.labName : "Chưa sử dụng",
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
          onClick={getAllLab}
        >
          <RefreshIcon />
        </Fab>
      </Stack>
      <Box className="content-bottom">
        <Paper
          sx={{
            justifyContent: "center",
            marginLeft: "20px",
            marginTop: "20px",
            height: "600px",
          }}
        >
          <DataGrid
            components={{ Toolbar: GridToolbar }}
            sx={{
              width: "1100px",
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
        <EditLabModel
          columns={columns}
          labId={labId}
          labEdit={labEdit}
          types={types}
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

export const EditLabModel = ({
  open,

  onClose,

  labId,
  labEdit,

  types,
}) => {
  const [name, setName] = useState();
  const [type, setType] = useState();
  const [status, setStatus] = useState();
  const [state, setState] = useState();
  const [des, setDes] = useState();

  useEffect(() => {
    setName(labEdit.name);
    setStatus(labEdit.status);
    setType(labEdit.type);
    setState(labEdit.state);
    setDes(labEdit.description);
  }, [labEdit]);

  const handleSubmit = () => {
    axios
      .patch(
        `${baseUrl}user/equipment/edit/${labId}`,
        {
          name: name,
          status: status,
          state: state,
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
              label={"Tình Trạng Thiết Bị"}
              name={"state"}
              defaultValue={labEdit.state}
              onChange={(e) => setState(e.target.value)}
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
                defaultValue={labEdit.status}
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
            <FormControl fullWidth>
              <InputLabel variant="standard" htmlFor="b">
                Loại Thiết Bị
              </InputLabel>
              <NativeSelect
                defaultValue={labEdit.type}
                onChange={(e) => setType(e.target.value)}
                inputProps={{
                  name: "type",
                  id: "b",
                }}
              >
                <option disabled value={"select"}>
                  Chọn Loại Thiết Bị
                </option>
                {types?.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
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
