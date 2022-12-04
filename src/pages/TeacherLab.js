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
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";

import { Refresh } from "@mui/icons-material";
import axios from "axios";
import { reactLocalStorage } from "reactjs-localstorage";
import { UserContext } from "../App";
import "./DashboardPage.css";

const baseUrl = "http://localhost:8080/api/lab/";
const DashboardPage = () => {
  const alert = useAlert();
  const { loged, setLoged } = useContext(UserContext);

  const [lab, setLab] = useState([]);
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
  const [res, setRes] = useState({});
  const [editResModel, setEditResMOdel] = useState(false);

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
  const deleteLab = (id) => {
    axios
      .delete(`${baseUrl}user/reservation/delete/${id}`)
      .then((res) => alert.success("Xoá Thành Công"))
      .catch("Xoá Thất Bại");
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("authenticated")) {
      navigate("/login");
    }
    setUserId(JSON.parse(reactLocalStorage.get("user")).id);
    getAllUsingLab();
    getAllLab();
    getAllUser();
  }, []);

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
    {
      field: "id",
      headerName: "Mã",
      width: "100",
    },
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
              onClick={() => {
                setEditResMOdel(true);
                setRes(params.row);
              }}
            >
              Sửa
            </Button>

            <Button
              color="error"
              variant="contained"
              onClick={(e) => deleteLab(params.row.resId)}
              disabled={params.row.status === "IN USE"}
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
        <EditResModel
          columns={columns}
          open={editResModel}
          res={res}
          onClose={() => {
            setEditResMOdel(false);
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
  const alert = useAlert();

  const handleDate = (date) => {
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
        alert.success("Đặt Phòng Thành Công");
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

export const EditResModel = ({ open, onClose, res }) => {
  const [startDate, setStateDate] = useState();
  const [endDate, setEndDate] = useState();

  const [st, setSt] = useState(new Date(res.startDate));
  const [en, setEn] = useState(new Date(res.endDate));
  const [id, setId] = useState(res.resId);

  useEffect(() => {
    setSt(new Date(res.startDate));
    setEn(new Date(res.endDate));
    setId(res.resId);
    console.log(en);
  }, [res]);
  const alert = useAlert();

  const handleDate = (date) => {
    return Math.floor(new Date(date).getTime() / 1000);
  };
  const handleSubmit = () => {
    axios
      .patch(
        `${baseUrl}user/reservation/edit/${id}`,
        {
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
        alert.success("Sua Thanh Cong");
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
