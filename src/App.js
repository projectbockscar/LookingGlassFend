import React, { useEffect, useState, useMemo } from "react";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Card, Container, Grid, Paper } from "@material-ui/core";
import PendingSharpIcon from "@mui/icons-material/PendingSharp";
import RunningWithErrorsIcon from "@mui/icons-material/RunningWithErrors";
import FlightTable from "./Components/FlightTable";
import LoadingCard from "./Components/LoadingCard";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const useStyles = makeStyles((theme) => ({
  page_background: {
    width: "100vw",
    height: "100vh",
  },
  main_grid: {
    minHeight: "100%",
  },
  main_card: {
    backgroundColor: theme.palette.grey[600],
    padding: "1rem",
  },
  container: {
    padding: "1rem",
    overflowY: "auto",
    height: "86vh",
  },
  table: {
    
  },
}));

const headCells = [
  {
    id: "callSign",
    numeric: false,
    disablePadding: false,
    label: "Call Sign",
    align: "left",
  },
  {
    id: "aircraftCommander",
    numeric: true,
    disablePadding: false,
    label: "AC",
    align: "left",
  },
  {
    id: "aircraftRegistration",
    numeric: true,
    disablePadding: false,
    label: "Tail",
    align: "right",
  },
  // This Info Is Not Being Entered Into API Call By Foreflihgt Dispatch.
  // {
  //   id: "tripId",
  //   numeric: false,
  //   disablePadding: false,
  //   label: "Mission ID",
  // },
  {
    id: "departure",
    numeric: false,
    disablePadding: false,
    complex: false,
    label: "Depart",
    align: "left",
  },
  {
    id: "destination",
    numeric: false,
    disablePadding: false,
    label: "Destination",
    align: "left",
  },

  //Get departureTime in Zulu Time
  {
    id: "departureTime",
    numeric: true,
    date: true,
    disablePadding: false,
    label: "Time (Local / Zulu)",
    align: "right",
  },
  {
    id: "flightTime",
    numeric: true,
    date: false,
    disablePadding: false,
    label: "Flight Time",
    align: "right",
  },
  {
    id: "arrivalTime",
    numeric: true,
    date: true,
    disablePadding: false,
    label: "Arrival Time (Local / Zulu)",
    align: "right",
  },
  {
    id: "released",
    numeric: false,
    date: false,
    disablePadding: false,
    label: "Dispatch",
    complex: true,
    align: "left",
  },
  {
    id: "atcStatus",
    numeric: false,
    date: false,
    disablePadding: false,
    label: "ATC Status",
    complex: true,
    align: "left",
  },
  {
    id: "filingStatus",
    numeric: false,
    date: false,
    disablePadding: false,
    label: "Filing Status",
    complex: true,
    align: "left",
  },
  {
    id: "duplicate_lines",
    numeric: false,
    disablePadding: false,
    label: "Conflicts",
    complex: true,
    align: "left",
  },
];

// const flightTime = (flight) => {
//   let dt1 = new Date(flight.departureTime);
//   let dt2 = new Date(flight.arrivalTime);
//   let diff = (dt2 - dt1) / 1000;
//   diff /= 60 * 60;
//   if (diff < 0) {
//     return Math.abs(Math.round(diff));
//   }
//   return Math.round(diff);
// };

//Departure Time in local time and Zulu time
const departureTime = (flight) => {
  const date = new Date(flight.departureTime);
  return date;
};

const arrivalTime = (flight) => {
  return new Date(flight.arrivalTime);
};

//Mission ID
const tripId = (flight) => {
  return flight.tripId;
};

// If the flights overlap less than one hour, then they are considered to be different flights.
// If the overlap is less than 50% of the flight time, then they are considered to be different flights.
const flights_overlap = (flight1, flight2) => {
  let dt1 = new Date(flight1.departureTime);
  let dt2 = new Date(flight2.departureTime);
  let diff = (dt2 - dt1) / 1000;
  diff /= 60 * 60;
  if (diff <= 1) {
    return false;
  } else {
    return false;
  }
};

//Check Status's of Flight
const atcStatus = (flight) => {
  if (flight.atcStatus === "Acknowledged") {
    return {
      color: "#20de07",
      text: "ACK",
      icon: <CheckCircleIcon style={{ color: "#20de07" }} />,
    };
  } else if (flight.atcStatus === "Cancelled") {
    return {
      color: "red",
      text: "",
      icon: <CancelIcon style={{ color: "#ff4f4f" }} />,
    };
  } else if (flight.atcStatus === "None") {
    return {
      color: "#ffd400",
      text: "None",
      icon: <PendingSharpIcon style={{ color: "#ffd400" }} />,
    };
  } else {
    return {
      color: "#ffd400",
      text: "None",
      icon: <PendingSharpIcon style={{ color: "#ffd400" }} />,
    };
  }
};

const filingStatus = (flight) => {
  if (flight.filingStatus === "Filed") {
    return {
      color: "#20de07",
      text: "Filed",
      icon: <CheckCircleIcon style={{ color: "#20de07" }} />,
    };
  } else if (flight.filingStatus === "Cancelled") {
    return {
      color: "#ff4f4f",
      text: "CNX",
      icon: <CancelIcon style={{ color: "#ff4f4f" }} />,
    };
  } else if (flight.atcStatus === "None") {
    return {
      color: "#ffd400",
      text: "None",
      icon: <PendingSharpIcon style={{ color: "#ffd400" }} />,
    };
  } else {
    return {
      color: "#ffd400",
      text: "None",
      icon: <PendingSharpIcon style={{ color: "#ffd400" }} />,
    };
  }
};

const released = (flight) => {
  if (flight.released === true) {
    return {
      color: "#20de07",
      text: "Released",
      icon: <CheckCircleIcon style={{ color: "#20de07" }} />,
    };
  } else if (flight.released === false) {
    return {
      color: "#ff4f4f",
      text: "Not Released",
      icon: <RunningWithErrorsIcon style={{ color: "#ff4f4f" }} />,
    };
  }
};

const App = (props) => {
  const [set_user_rows] = useState(null);
  const [flight_rows, set_flight_rows] = useState(null);
  const [lastUpdate, set_lastUpdate] = useState(new Date());
  const [number_of_flights, set_number_of_flights] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      set_lastUpdate(new Date());
    }, 1000 * 60);
    return () => clearInterval(timer);
  }, [flight_rows]);
  const getRows = async () => {
    try {
      const url = `${process.env.REACT_APP_BACKEND}/get_rows`;
      const response = await fetch(url, {
        method: "GET",
      });
      // console.log(response)
      if (!response.ok) {
        const response_json = await response.json();
        throw new Error(response_json.message);
      }
      const response_json = await response.json();
      console.log(response_json);
      set_user_rows(response_json.users);
    } catch (error) {
      console.log(error.message);
    }
  };
  const getFlights = async () => {
    try {
      const url = `${process.env.REACT_APP_BACKEND}/dispatch`;
      const response = await fetch(url, {
        method: "GET",
      });
      // console.log(response)
      if (!response.ok) {
        const response_json = await response.json();
        throw new Error(response_json.message);
      }
      const response_json = await response.json();

      const callSigns = new Set();

      const flights = [];

      response_json.flights.forEach((flight) => {
        const hours = Math.floor(
          (new Date(flight.arrivalTime).getTime() -
            new Date(flight.departureTime).getTime()) /
            1000 /
            60 /
            60
        );

        const minutes =
          Math.floor(
            new Date(flight.arrivalTime).getTime() -
              new Date(flight.departureTime).getTime() / 1000 / 60 / 60
          ) % 60;

        const flightTime = `${hours} + ${minutes < 10 ? "0" : ""}${minutes}`;

        const aircraftCommander = flight.crew.find(
          (crew) => crew.position === "PIC"
        )?.fullname;

        if (callSigns.has(flight?.callSign || "...")) {
          for (let i = 0; i < flights.length; i++) {
            if (
              (flights[i].callSign === flight.callSign ||
                flights[i].callSign === "...") &&
              flights[i].aircraftRegistration === flight.aircraftRegistration &&
              flights_overlap(flights[i], flight)
            ) {
              if (flights.duplicate_lines) {
                flights[i].duplicate_lines.push(flight);
              } else {
                flights[i].duplicate_lines = [flight];
              }

              console.log("found", flight);
              return;
            }
          }

          if (
            departureTime(flight).getTime() <
            new Date(new Date().getTime() + 3600000 * 48).getTime()
          ) {
            flights.push({
              ...flight,
              callSign: flight.callSign || "...",
              aircraftRegistration: flight.aircraftRegistration,
              aircraftCommander: aircraftCommander || "...",
              tripId: tripId(flight) || "...",
              departureTime: departureTime(flight) || "...",
              arrivalTime: arrivalTime(flight) || "...",
              flightTime,
              atcStatus: atcStatus(flight),
              filingStatus: filingStatus(flight),
              released: released(flight),
            });
          }
        } else {
          if (
            departureTime(flight).getTime() <
            new Date(new Date().getTime() + 3600000 * 48).getTime()
          ) {
            callSigns.add(flight.callSign || "...");

            flights.push({
              ...flight,
              callSign: flight.callSign || "...",
              aircraftRegistration: flight.aircraftRegistration,
              aircraftCommander: aircraftCommander || "...",
              tripId: tripId(flight) || "...",
              departureTime: departureTime(flight) || "...",
              arrivalTime: arrivalTime(flight) || "...",
              flightTime,
              atcStatus: atcStatus(flight),
              filingStatus: filingStatus(flight),
              released: released(flight),
            });
          }
        }
      });

      console.log(flights);
      set_flight_rows(flights);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRows();
    getFlights();
  }, [lastUpdate]);

  const filteredFlights = useMemo(() => {
    if (flight_rows) {
      const temp_flights = [...flight_rows].splice(0, number_of_flights);
      return temp_flights;
    } else {
      return [];
    }
  }, [flight_rows, number_of_flights]);
  console.log(filteredFlights);

  const classes = useStyles();
  return (
    <Paper className={classes.page_background}>
      <Header
        lastUpdate={lastUpdate}
        number_of_flights={number_of_flights}
        set_number_of_flights={set_number_of_flights}
      />
      <Container className={classes.container} maxWidth={false}>
        <Grid>
          {filteredFlights ? (
            <Grid item xs={12} xl={12}>
              <Card elevation={5} className={classes.main_card}>
                <FlightTable
                  rows={filteredFlights}
                  headCells={headCells}
                  font_variant="caption"
                />
              </Card>
            </Grid>
          ) : (
            <Grid item xs={12}>
              <LoadingCard />
            </Grid>
          )}
        </Grid>
      </Container>
      <Footer lastUpdate={lastUpdate} />{" "}
    </Paper>
  );
};

export default App;
