import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import NativeSelect from "@mui/material/NativeSelect";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import RefreshIcon from "@mui/icons-material/Refresh";
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
  TextField,
  Fab,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import { UserContext } from "../App";
import "./DashboardPage.css";

import axios from "axios";

import { useConfirm } from "material-ui-confirm";
import { useAlert } from "react-alert";

const baseUrl = "http://localhost:8080/api/lab/";
const DashboardPage = () => {
  const confirm = useConfirm();
  const alert = useAlert();
  const { loged, setLoged } = useContext(UserContext);

  const [lab, setLab] = useState([]);

  // const storeUser = reactLocalStorage.get("user");
  // const parseUser = JSON.parse(storeUser);
  const [selected, setSelected] = useState(3);
  const [title, setTitle] = useState("Quản Lý Phòng Thực Hành");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModel, setEditModel] = useState(false);
  const [editEquipModel, setEditEquipModel] = useState(false);

  const [labId, setLabId] = useState();
  const [labEdit, setLabEdit] = useState({});
  const [user, setUser] = useState([]);
  const [adminId, setAdminId] = useState();

  const [usingEquip, setUsingEquip] = useState([]);
  const [AvaiEquip, setAvaiEquip] = useState([]);
  const getAllUsingEquip = (id) => {
    axios.get(`${baseUrl}user/equipment/using/${id}`).then((res) => {
      setUsingEquip(res.data);
    });
  };

  const getAllAvailableEquip = () => {
    axios.get(`${baseUrl}user/equipment/available`).then((res) => {
      setAvaiEquip(res.data);
    });
  };

  const getAllLab = async () => {
    axios.get(`${baseUrl}user/laboratory/labadmin/${loged.id}`).then((res) => {
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

  const columns = [
    { field: "id", headerName: "Mã Phòng", width: "100" },
    { field: "name", headerName: "Tên Phòng", width: "200" },
    { field: "type", headerName: "Loại", width: "100" },
    { field: "status", headerName: "Trạng Thái", width: "100" },
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
      width: 360,
      renderCell: (params) => {
        return (
          <Stack direction={"row"} spacing={2}>
            <Button
              color="warning"
              variant="contained"
              onClick={() => {
                setEditModel(true);
                setLabId(params.row.id);
                setLabEdit(params.row);
                setAdminId(params.row.user.id);
              }}
            >
              Sửa
            </Button>
            <Button
              color="info"
              variant="contained"
              onClick={() => {
                setEditEquipModel(true);
                setLabId(params.row.id);
                setLabEdit(params.row);
                setAdminId(params.row.user.id);
                getAllUsingEquip(params.row.id);
                getAllAvailableEquip();
              }}
            >
              Quản Lý Thiết Bị
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
          adminId={adminId}
          labEdit={labEdit}
          users={user}
          open={editModel}
          onClose={() => {
            setEditModel(false);
            getAllLab();
          }}
        />
        <EditEquipModel
          labId={labId}
          adminId={adminId}
          using={usingEquip}
          available={AvaiEquip}
          open={editEquipModel}
          onClose={() => {
            setEditEquipModel(false);
            getAllLab();
            getAllAvailableEquip();
          }}
        />
      </Box>
    </Box>
  );
};

export default DashboardPage;

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

  const alert = useAlert();

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
        alert.success("Sửa Thành Công");
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

export const EditEquipModel = ({
  open,
  onClose,
  labId,
  using,
  users,
  available,
}) => {
  const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = React.useState(using);
  const [right, setRight] = React.useState(available);
  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const [equipId, setEquipId] = useState([]);

  useEffect(() => {
    setLeft(using);
    setRight(available);
  }, [using]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    setEquipId(left?.map((item) => item.id));
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
    setEquipId(left?.map((item) => item.id));
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
    setEquipId(left?.map((item) => item.id));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
    setEquipId(left?.map((item) => item.id));
  };

  const alert = useAlert();

  const customList = (title, items) => (
    <Card>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              numberOfChecked(items) !== items.length &&
              numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{
              "aria-label": "all items selected",
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List
        sx={{
          width: 200,
          height: 230,
          bgcolor: "background.paper",
          overflow: "auto",
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((value) => {
          const labelId = `${value.id}`;

          return (
            <ListItem
              key={value.id}
              role="listitem"
              button
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${value.name}`} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Card>
  );

  const handleSubmit = () => {
    const id = left?.map((item) => item.id);
    axios
      .patch(
        `${baseUrl}user/laboratory/addEquipment/${labId}`,
        {
          equipmentList: id,
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        alert.success("Lưu Thành Công");
        onClose();
      });
  };

  function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
  }

  function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
  }

  function union(a, b) {
    return [...a, ...not(b, a)];
  }

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Quản Lý Thiết Bị</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item>{customList("Đang Sử Dụng", left)}</Grid>
          <Grid item>
            <Grid container direction="column" alignItems="center">
              <Button
                sx={{ my: 0.5 }}
                variant="outlined"
                size="small"
                onClick={handleCheckedRight}
                disabled={leftChecked.length === 0}
                aria-label="move selected right"
              >
                &gt;
              </Button>
              <Button
                sx={{ my: 0.5 }}
                variant="outlined"
                size="small"
                onClick={handleCheckedLeft}
                disabled={rightChecked.length === 0}
                aria-label="move selected left"
              >
                &lt;
              </Button>
            </Grid>
          </Grid>
          <Grid item>{customList("Hiện Có", right)}</Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button onClick={onClose}>Huỷ</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};
