import React, { useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Collapse from "@material-ui/core/Collapse";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import { Grid, Box, Card } from "@material-ui/core";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import { Title } from "@material-ui/icons";

//Decending and Ascending comparators for the table
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

//Function to get the total number of flights
// function GetFlightCount(flights) {
//   let count = 0;
//   flights.forEach((flight) => {
//     count += flight.flightCount;
//   });
//   console.log(count);
//   return  count;
// }

//Table Head Component
function EnhancedTableHead(props) {
  const headCells = props.headCells;
  const font_variant = props.font_variant;

  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow style={{ backgroundColor: "#363636" }}>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align ? headCell.align : "center"}
            // padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              <Typography variant={font_variant} style={{ fontWeight: "bold" }}>
                {headCell.label}
              </Typography>
              {/* {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null} */}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

//Table Head prototypes
EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

//Styling for toolbar
const useToolbarStyles = makeStyles((theme) => ({
  root: {},
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: "1 1 100%",
    textAlign: "left",
    fontWeight: "bold",
    fontVariant: "small-caps",
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx({
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h5"
          id="tableTitle"
          component="div"
          align="left"
        >
          Flights
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            {/* <FilterListIcon /> */}
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    maxHeight: "79vh",
  },
  paper: {
    maxHeight: "79vh",
    minHeight: "79vh",
  },
  table: {
    overflow: "hidden",
  },
  title: {},
  main_card: {},
}));

// Get UTC time and format it to a dateTime string as a 2 digit hour and 2 digit minute
function zuluTime(time) {
  let d = new Date(time);
  let hours = d.getUTCHours();
  if (hours < 10) {
    hours = "0" + hours;
  }
  let minutes = d.getUTCMinutes();
  if (minutes < 10 ? "0" + minutes : " ") {
    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
  }
}

// Format the JSON date and time  to a dateTime string that is formatted in a 3 digit month and 2 digit day, and a 2 digit hour and 2 digit minute
//get three digit month and two digit day
function departureTime(date) {
  let d = new Date(date);
  let month = d.getMonth() + 1;
  let day = d.getDate();
  let hours = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
  let minutes = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
  return month + "/" + day + " - " + hours + ":" + minutes;
}

const FlightRow = (props) => {
  const headCells = props.headCells;
  const [show_row, set_show_row] = useState(false);
  const row = props.row;
  const classes = useStyles();
  const font_variant = props.font_variant;

  return (
    <React.Fragment>
      <TableRow
        key={row.flightId + "-main"}
        hover
        onClick={() => set_show_row((prev) => !show_row)}
        role="checkbox"
        // aria-checked={isItemSelected}
        tabIndex={-1}
        style={{ cursor: "pointer" }}
        // selected={isItemSelected}
      >
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align ? headCell.align : "center"}
            style={{ paddingBottom: 4, paddingTop: 4 }}
          >
            {headCell.complex ? (
              <Grid container wrap="nowrap" alignItems="center">
                {row[headCell.id]?.icon && (
                  <Grid item style={{ marginRight: "8px", height: "24px" }}>
                    {row[headCell.id]?.icon}
                  </Grid>
                )}
                {headCell.id === "duplicate_lines" &&
                  Boolean(row.duplicate_lines) &&
                  row[headCell.id]?.length > 0 && (
                    <Grid item>
                      <Tooltip title="Flights have conflicting data." arrow>
                        <WarningRoundedIcon style={{ color: "#ffd400" }} />
                      </Tooltip>
                    </Grid>
                  )}

                {row[headCell.id]?.text && (
                  <Grid item>
                    <Typography
                      variant={font_variant}
                      style={
                        row[headCell.id]?.color
                          ? { color: row[headCell.id]?.color }
                          : undefined
                      }
                    >
                      {row[headCell.id].text}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            ) : (
              <Typography variant={font_variant}>
                {headCell.date
                  ? departureTime(row[headCell.id]) +
                    " / " +
                    zuluTime(row[headCell.id]).toLocaleString()
                  : row[headCell.id]}
              </Typography>
            )}
          </TableCell>
        ))}
      </TableRow>
      <TableRow key={row.flightId + "-secondary"}>
        <TableCell colSpan={12} style={{ paddingBottom: 0, paddingTop: 0 }}>
          <Collapse in={show_row} timeout="auto" unmountOnExit>
            <Box>
              <Grid>
                <Grid item xs={12}>
                  <Typography variant="caption">Conflicting Data</Typography>
                </Grid>
                <Grid item>
                  {row.duplicate_lines && (
                    <Card elevation={5}>
                      <Box>
                        <Grid>
                          <Grid item xs={12}>
                            <TableContainer>
                              <Table>
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Callsign</TableCell>
                                    <TableCell>AC</TableCell>
                                    <TableCell>Tail Number</TableCell>
                                    <TableCell>Departure</TableCell>
                                    <TableCell>Arrival</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody width={1}>
                                  {row.duplicate_lines?.map(
                                    (duplicateFlight) => (
                                      <TableRow key={duplicateFlight.flightId}>
                                        <TableCell>
                                          {duplicateFlight.callSign}
                                        </TableCell>
                                        <TableCell>
                                          {duplicateFlight.aircraftCommander}
                                        </TableCell>
                                        <TableCell>
                                          {duplicateFlight.aircraftRegistration}
                                        </TableCell>
                                        <TableCell>
                                          {new Date(
                                            duplicateFlight.departureTime
                                          ).toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                          {new Date(
                                            duplicateFlight.arrivalTime
                                          ).toLocaleString()}
                                        </TableCell>
                                      </TableRow>
                                    )
                                  )}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Grid>
                        </Grid>
                      </Box>
                    </Card>
                  )}
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

// function showRows(props) {
//   const rows = props.rows;
//   const headCells = props.headCells;
//   const font_variant = props.font_variant;
//   // eslint-disable-next-line react-hooks/rules-of-hooks
//   const [show_rows, set_show_rows] = useState(false);
//   if (rows.length > 0) {
//     set_show_rows(true);
//   }
//   return (
//     <React.Fragment>
//       <TableRow>
//         <TableCell colSpan={12} style={{ paddingBottom: 0, paddingTop: 0 }}>
//           <Collapse in={show_rows} timeout="auto" unmountOnExit>
//             <Box>
//               <Grid>
//                 <Grid item xs={12}>
//                   <Typography>Flights</Typography>
//                 </Grid>
//                 <Grid item>
//                   <TableContainer>
//                     <Table>
//                       <TableHead>
//                         <TableRow>
//                           {headCells.map((headCell) => (
//                             <TableCell key={headCell.id}>
//                               <Typography>{headCell.text}</Typography>
//                             </TableCell>
//                           ))}
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         {rows.slice(0, 20).map((row) => (
//                           <FlightRow
//                             key={row.flightId}
//                             row={row}
//                             headCells={headCells}
//                           />
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </TableContainer>
//                 </Grid>
//               </Grid>
//             </Box>
//           </Collapse>
//         </TableCell>
//       </TableRow>
//     </React.Fragment>
//   );
// }

//Main Table Component
const FlightTable = (props) => {
  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const rows = props.rows;
  const headCells = props.headCells;
  const font_variant = props.font_variant;
  const next48hrs = Date.now() + 1000 * 60 * 60 * 48;
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer className={classes.table}>
          <Table
            aria-labelledby="tableTitle"
            size={"small"}
            aria-label="enhanced table"
            stickyHeader={true}
          >
            <EnhancedTableHead
              classes={classes}
              headCells={headCells}
              font_variant={font_variant}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody className={classes.row}>
              {rows &&
                stableSort(rows, getComparator(order, orderBy))
                  // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    // const isItemSelected = isSelected(row.name);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <FlightRow
                        className={classes.row}
                        headCells={headCells}
                        {...props}
                        font_variant={"caption"}
                        row={row}
                        key={index}
                      />
                    );
                  })}
              {/* {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={8} />
                </TableRow>
              )} */}
            </TableBody>
          </Table>
          <Typography variant="h6" align="center">Flights 1 - {rows.length}</Typography>
        </TableContainer>
        {/* <TablePagination
          // rowsPerPageOptions={[15, 20, 25]}
          component="div"
          count={20}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        /> */}
      </Paper>
      {/* <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      /> */}
    </div>
  );
};

FlightTable.propTypes = {
  rows: PropTypes.array.isRequired,
};

export default FlightTable;
