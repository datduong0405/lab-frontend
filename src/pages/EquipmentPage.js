import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import NativeSelect from "@mui/material/NativeSelect";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Refresh } from "@mui/icons-material";
import DevicesIcon from "@mui/icons-material/Devices";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import HistoryIcon from "@mui/icons-material/History";
import HomeIcon from "@mui/icons-material/Home";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import axios from "axios";
import { useAlert } from "react-alert";
import { UserContext } from "../App";
import "./DashboardPage.css";

const baseUrl = "http://localhost:8080/api/lab/";
const EquipmentPage = () => {
  const [lab, setLab] = useState([]);
  const alert = useAlert();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModel, setEditModel] = useState(false);
  const [labId, setLabId] = useState();
  const [labEdit, setLabEdit] = useState({});
  const [user, setUser] = useState([]);
  const [adminId, setAdminId] = useState();
  const [labE, setLabE] = useState();
  const [types, setTypes] = useState([]);

  const getAllLab = async () => {
    axios.get(`${baseUrl}user/equipment/labs`).then((res) => {
      setLab(res.data.reverse());
    });
  };

  const getAllType = () => {
    axios.get(`${baseUrl}user/etype`).then((res) => {
      setTypes(res.data);
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
    getAllType();
    getAllLab();
    getAllUser();
  }, []);

  const deleteLab = (e, row) => {
    const id = row.id;
    axios.delete(`${baseUrl}user/equipment/delete/${id}`).then((response) => {
      alert.info("Xoá Thành Công");
      getAllLab();
    });
  };

  const columns = [
    { field: "id", headerName: "Mã", width: "50" },

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
        Quản Lý Thiết Bị
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
        <Fab
          color="primary"
          aria-label="refresh"
          size="small"
          onClick={getAllLab}
        >
          <Refresh />
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
        <CreateEModel
          columns={columns}
          open={createModalOpen}
          types={types}
          onClose={() => {
            setCreateModalOpen(false);
            getAllLab();
          }}
        />
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

export const CreateEModel = ({ open, columns, onClose, types }) => {
  const [name, setName] = useState();
  const [type, setType] = useState();
  const [status, setStatus] = useState();
  const [state, setState] = useState();
  const [des, setDes] = useState();

  const alert = useAlert();

  const handleSubmit = () => {
    axios
      .post(
        `${baseUrl}user/equipment/create`,
        {
          name: name,
          type: type,
          status: status,
          state: state,
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
        alert.show("Thêm Thành Công");
        onClose();
      });
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
            <TextField
              label={"Tên Thiết Bị"}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label={"Mô Tả Thiết Bị"}
              onChange={(e) => setDes(e.target.value)}
            />
            <TextField
              label={"Tình Trạng Thiết Bị"}
              onChange={(e) => setState(e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel variant="standard" htmlFor="a">
                Trạng Thái
              </InputLabel>
              <NativeSelect
                defaultValue={"select"}
                onChange={(e) => setStatus(e.target.value)}
                inputProps={{
                  name: "status",
                  id: "a",
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
                defaultValue={"select"}
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
          Thêm Mới
        </Button>
      </DialogActions>
    </Dialog>
  );
};

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

  const alert = useAlert();

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
        alert.show("Sửa Thành Công");
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
