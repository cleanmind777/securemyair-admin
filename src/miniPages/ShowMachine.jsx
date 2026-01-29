/** @format */

import { Button, Divider, Paper, Table, TableCell, TableRow, Typography } from '@mui/material';
import MyDialog from '../dialogs/MyDialog';
import { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UpdateCustomersContext } from '../UpdateCustomersContext';
const headStyle = {
  color: 'black',
  fontWeight: 'bold',
};

const ShowMachine = () => {
  const navigate = useNavigate();
  const [del, setDel] = useState(false);
  const location = useLocation();
  const { setUpdateCustomers } = useContext(UpdateCustomersContext);
  const handleDel = async id => {
    let formData = new FormData();
    formData.append('toDel', id);
    await axios
      .post('delMachine.php', formData)
      .then(result => {
        setUpdateCustomers(pre => !pre);
      })
      .catch(error => console.log(error));
  };
  const machine = location.state;

  return (
    <Paper
      sx={{ p: 2, width: "95%", pt: 0, overflow: "auto", maxHeight: "93vh" }}
    >
      <div
        style={{
          borderBottom: "1px solid black",
          background: "white",
          position: "sticky",
          height: "8vh",
          // marginTop: '5px',
          zIndex: "1",
          top: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Typography
          pl={1}
          display={"inline"}
          sx={{
            fontSize: "2.3vh",

            fontWeight: "bold",
            color: "black",
          }}
        >
          Machine Detail
        </Typography>
        <div style={{ display: "flex" }}>
          <Button
            onClick={() => navigate("/machines")}
            variant="contained"
            sx={{ fontSize: "1vh" }}
          >
            Back to List
          </Button>
          <Divider
            orientation="vertical"
            flexItem
            sx={{ marginInline: "5px" }}
          />
          <Button
            type="submit"
            onClick={() => {
              return setDel(true);
            }}
            variant="contained"
            color="error"
            sx={{ marginInline: "5px", fontSize: "1vh" }}
          >
            Delete
          </Button>
        </div>
      </div>
      <Table sx={{ fontSize: "1.7vh" }}>
        <TableRow>
          <TableCell sx={headStyle}>Name</TableCell>
          <TableCell>{machine.name}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={headStyle}>Customer</TableCell>
          <TableCell>{machine.cName}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={headStyle}>Location</TableCell>
          <TableCell>{machine.location}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={headStyle}>API Token</TableCell>
          <TableCell>{machine.apiToken}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={headStyle}>Customer ID</TableCell>
          <TableCell>{machine.cid}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={headStyle}>Machine ID</TableCell>
          <TableCell>{machine.id}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={{ ...headStyle, borderBottom: 0 }}>
            Next Inspection Date
          </TableCell>
          <TableCell sx={{ borderBottom: 0 }}>{machine.date}</TableCell>
        </TableRow>
      </Table>
      {del && (
        <MyDialog
          title="Alert"
          des={`Are you sure you want to delete ${machine.name}?`}
          actions={[
            {
              onClick: () => {
                handleDel(machine.id);
                return navigate("/machines");
              },
              color: "error",
              text: "Delete",
            },
            { onClick: () => setDel(false), color: "primary", text: "Cancel" },
          ]}
        />
      )}
    </Paper>
  );
};

export default ShowMachine;
