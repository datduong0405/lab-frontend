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
  const { loged } = useContext(UserContext);
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
  }, []);

  const deleteLab = (e, row) => {
    const id = row.id;
    axios.delete(`${baseUrl}user/etype/delete/${id}`).then((response) => {
      alert.info("Xoá Thành Công");
    });
  };

  const columns = [
    { field: "id", headerName: "Mã Loại ", width: "200" },
    { field: "name", headerName: "Tên Loại", width: "300" },
    { field: "quantity", headerName: "Số Lượng", width: "150" },
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
              sx={{
                display: loged.role.name === "SUPER ADMIN" ? "block" : "none",
              }}
              disabled={params.row.quantity > 0}
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
        Quản Lý Phân Loại Thiết Bị
      </Typography>
      <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
        <Button
          size="small"
          variant="contained"
          color="success"
          onClick={() => setCreateModalOpen(true)}
        >
          Thêm Phân Loại
        </Button>
        <Fab
          color="primary"
          aria-label="refresh"
          size="small"
          onClick={getAllType}
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
            rows={types}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Paper>
        <CreateEModel
          open={createModalOpen}
          types={types}
          onClose={() => {
            setCreateModalOpen(false);
            getAllType();
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
            getAllType();
          }}
        />
      </Box>
    </Box>
  );
};

export default EquipmentPage;

export const CreateEModel = ({ open, onClose }) => {
  const [name, setName] = useState();
  const [id, setId] = useState();

  const alert = useAlert();

  const handleSubmit = () => {
    axios
      .post(
        `${baseUrl}user/etype/create`,
        {
          id: id,
          name: name,
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
            <TextField label={"Mã"} onChange={(e) => setId(e.target.value)} />
            <TextField
              label={"Tên Phân Loại"}
              onChange={(e) => setName(e.target.value)}
            />
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
}) => {
  const [name, setName] = useState();

  const alert = useAlert();

  useEffect(() => {
    setName(labEdit.name);
  }, [labEdit]);

  const handleSubmit = () => {
    axios
      .patch(
        `${baseUrl}user/etype/edit/${labId}`,
        {
          name: name,
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
              label={"Tên Phân Loại"}
              name={"name"}
              defaultValue={labEdit.name}
              onChange={(e) => setName(e.target.value)}
            />
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
