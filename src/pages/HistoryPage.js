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

  const getAllLab = async () => {
    axios.get(`${baseUrl}user/history`).then((res) => {
      setLab(res.data);
    });
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("authenticated")) {
      navigate("/login");
    }
    getAllLab();
  }, []);

  const deleteLab = (e, row) => {
    const id = row.id;
    axios.delete(`${baseUrl}user/equipment/delete/${id}`).then((response) => {
      getAllLab();
    });
  };

  const [filterModel, setFilterModel] = React.useState({
    items: [
      {
        columnField: "date",
      },
    ],
  });

  const columns = [
    { field: "id", headerName: "Mã", width: "50" },
    { field: "tableName", headerName: "Tên Bảng", width: "100" },
    { field: "newData", headerName: "Dữ Liệu Mới", width: "300" },
    { field: "oldData", headerName: "Dữ Liệu Cũ", width: "300" },
    { field: "type", headerName: "Loại Thay Đổi", width: "100" },
    {
      field: "date",
      type: "dateTime",
      headerName: "Ngày Thay Đổi",
      width: "200",
      valueGetter: (params) => new Date(params.row.date),
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
            disableColumnSelector
            disableDensitySelector
            rows={lab}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            filterModel={filterModel}
            onFilterModelChange={(newFilterModel) =>
              setFilterModel(newFilterModel)
            }
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default EquipmentPage;
