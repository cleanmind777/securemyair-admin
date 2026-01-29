/** @format */

import  React, {useState} from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const rows = [
  "Frozen yoghurt",
  "Ice cream sandwich",
  "Eclair",
  "Cupcake",
  "Gingerbread",
  "Frozen yoghurt",
  "Ice cream sandwich",
  "Eclair",
  "Cupcake",
  "Gingerbread",
];
let newRows = rows.slice();
function Customers() {
  const [searchTerm, setSearchTerm] = useState("");

  function handleSearch(e) {
    newRows = [];
    setSearchTerm(e.target.value);
    console.log(newRows);
    rows.forEach((val) => {
      if (searchTerm === "") newRows.push(val);
      if (val.toLowerCase().includes(searchTerm.toLowerCase()))
        newRows.push(val);
    });
  }
  return (
    <>
      <div
        style={{
          border: '1px solid black',
          borderRadius: 5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <Typography variant='h6' display={"inline"}>
          CUSTOMERS
        </Typography>
        <TextField
          variant='outlined'
          onChange={handleSearch}
          label='Search Customer'
          sx={{ bgcolor: "white", padding: 0 }}
        />
      </div>

      <TableContainer sx={{ height: "47vh" }}>
        <Table aria-label='customized table'>
          
          <TableBody component={Paper}>
            {newRows.map((row, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell component='th' scope='row'>
                  {row}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default Customers;

