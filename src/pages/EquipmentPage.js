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
      alert.info("Xo?? Th??nh C??ng");
      getAllLab();
    });
  };

  const columns = [
    { field: "id", headerName: "M??", width: "50" },

    { field: "name", headerName: "T??n Thi???t B???", width: "100" },
    { field: "type", headerName: "Lo???i Thi???t B???", width: "100" },
    { field: "description", headerName: "M?? t???", width: "200" },
    { field: "status", headerName: "Tr???ng Th??i", width: "100" },
    {
      field: "state",
      headerName: "T??nh Tr???ng Thi???t B???",
      width: "200",
    },
    {
      field: "labName",
      headerName: "Ph??ng s??? d???ng",
      width: "150",
      valueGetter: (params) =>
        params.row.labName ? params.row.labName : "Ch??a s??? d???ng",
    },
    {
      field: "action",
      headerName: "H??nh ?????ng",
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
              S???a
            </Button>

            <Button
              color="error"
              variant="contained"
              onClick={(e) => deleteLab(e, params.row)}
              disabled={params.row.status === "OUT STOCk" || params.row.labName}
            >
              Xo??
            </Button>
          </Stack>
        );
      },
    },
  ];

  const adminNav = [
    {
      icon: <HomeIcon />,
      title: "T???ng Quan",
      id: 1,
      path: "/",
    },
    {
      icon: <SupervisedUserCircleIcon />,
      title: "Ng?????i D??ng",
      id: 2,
      path: "/user",
    },
    {
      icon: <ElectricBoltIcon />,
      title: "Ph??ng Th???c H??nh",
      id: 3,
      path: "/lab",
    },
    {
      icon: <DevicesIcon />,
      title: "Thi???t B???",
      id: 4,
      path: "/equipment",
    },
    {
      icon: <HistoryIcon />,
      title: "L???ch S???",
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
        Qu???n L?? Thi???t B???
      </Typography>
      <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
        <Button
          size="small"
          variant="contained"
          color="success"
          onClick={() => setCreateModalOpen(true)}
        >
          Th??m Thi???t B???
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
        alert.show("Th??m Th??nh C??ng");
        onClose();
      });
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Th??m M???i</DialogTitle>
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
              label={"T??n Thi???t B???"}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label={"M?? T??? Thi???t B???"}
              onChange={(e) => setDes(e.target.value)}
            />
            <TextField
              label={"T??nh Tr???ng Thi???t B???"}
              onChange={(e) => setState(e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel variant="standard" htmlFor="a">
                Tr???ng Th??i
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
                  Ch???n Tr???ng Th??i
                </option>
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="NOT AVAILABLE">NOT AVAILABLE</option>
              </NativeSelect>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel variant="standard" htmlFor="b">
                Lo???i Thi???t B???
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
                  Ch???n Lo???i Thi???t B???
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
        <Button onClick={onClose}>Hu???</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          Th??m M???i
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
        alert.show("S???a Th??nh C??ng");
        onClose();
      });
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">S???a Th??ng Tin</DialogTitle>
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
              label={"T??n Thi???t B???"}
              name={"name"}
              defaultValue={labEdit.name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label={"T??nh Tr???ng Thi???t B???"}
              name={"state"}
              defaultValue={labEdit.state}
              onChange={(e) => setState(e.target.value)}
            />
            <TextField
              label={"M?? T???"}
              name={"description"}
              defaultValue={labEdit.description}
              onChange={(e) => setDes(e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Tr???ng Th??i
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
                  Ch???n Tr???ng Th??i
                </option>
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="NOT AVAILABLE">NOT AVAILABLE</option>
              </NativeSelect>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel variant="standard" htmlFor="b">
                Lo???i Thi???t B???
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
                  Ch???n Lo???i Thi???t B???
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
        <Button onClick={onClose}>Hu???</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          S???a Th??ng Tin
        </Button>
      </DialogActions>
    </Dialog>
  );
};
