import React, { useEffect, useState, useCallback } from "react";
import Footer from "./Components/Footer";
import Header from "./Components/Header";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Card, Container, Grid, Paper } from "@material-ui/core";
import RunningWithErrorsIcon from "@mui/icons-material/RunningWithErrors";
import FlightTable from "./Components/FlightTable";
import LoadingCard from "./Components/LoadingCard";
// import GetVersions from "./components/getVersions";
import { createClient } from 'contentful';
// Icons
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingSharpIcon from "@mui/icons-material/PendingSharp";

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
    wrap: "nowrap",
    marginTop: "1rem",
  },
  container: {
    padding: "1rem",
    overflowY: "auto",
  },
  table: {},
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
    label: "Departure (Local / Zulu)",
    align: "right",
  },
  {
    id: "flightTime",
    numeric: true,
    date: false,
    disablePadding: false,
    label: "Duration",
    align: "right",
  },
  {
    id: "arrivalTime",
    numeric: true,
    date: true,
    disablePadding: false,
    label: "Arrival (Local / Zulu)",
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
  // {
  //   id: "duplicate_lines",
  //   numeric: false,
  //   disablePadding: false,
  //   label: "Conflicts",
  //   complex: true,
  //   align: "left",
  // },
];

//Departure Time in local time and Zulu time
const departureTime = (flight) => {
  const date = new Date(flight.departureTime);
  return date;
};

//Arival Time in local time and Zulu time
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

//Checks ATC status 
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

//Checks filing status
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

//Checks release status
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
  const [flight_rows, set_flight_rows] = useState(null);
  const [lastUpdate, set_lastUpdate] = useState(new Date());
  const [number_of_flights, set_number_of_flights] = useState(100);
  //  This function is used for the hard coding of versions.
  // const [versions, setVersions] = useState({
  //   iosVersion: 'Loading...',
  //   dfmVersion: 'Loading...',
  //   dmmVersion: 'Loading...',
  //   dfcVersion: 'Loading...'
  // });

  // useEffect(() => {
  //   const client = createClient({
  //     space: 'gush6s9fs1up',
  //     accessToken: 'w7YEK76BONLbrcqWGhFONNUVbmpZIHQmWUrWL2BaXoc'
  //   });

  //   client.getEntries({
  //     content_type: 'versionUpdates'
  //   })
  //   .then((response) => {
  //     const fields = response.items[0].fields;
  //     setVersions({
  //       iosVersion: fields.iosVersion || 'Default iOS Version',
  //       dfmVersion: fields.dfmVersion || 'Default DFM Version',
  //       dmmVersion: fields.dmmVersion || 'Default DMM Version',
  //       dfcVersion: fields.dfcVersion || 'Default DFC Version'
  //     });
  //   })
  //   .catch((error) => console.log(error));
  // }, []);

  const classes = useStyles();

  // const handleVersionsFetched = useCallback((fetchedVersions) => {
  //   console.log("Fetched Versions:", fetchedVersions);
  //   setVersions(fetchedVersions);
  // }, []);

//Gets the flight data 
  const getFlights = useCallback(async () => {
    try {
      const url = `${process.env.REACT_APP_BACKEND}/dispatch`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
      console.log(response);
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
        console.log(aircraftCommander);

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
  }, []);

  //Refresh flight data every 5 minutes
  useEffect(() => {
    getFlights();
  }, [getFlights, lastUpdate]); // Remove lastUpdate if not necessary for triggering getFlights

  useEffect(() => {
    const timer = setInterval(() => {
      set_lastUpdate(new Date());
    }, 1000 * 60 * 5); // Adjust the interval as needed

    return () => clearInterval(timer);
  }, []);

  const filteredFlights = flight_rows?.slice(0, number_of_flights) || [];

  return (
    <Paper className={classes.page_background}>
      {/* <GetVersions onVersionsFetched={handleVersionsFetched} /> */}
      <Header
        // versions={versions}
        lastUpdate={lastUpdate}
        number_of_flights={number_of_flights}
        set_number_of_flights={set_number_of_flights}
      />
      <Container className={classes.container} maxWidth={false}>
        <Grid>
          {filteredFlights.length > 0 ? (
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
      <Footer lastUpdate={lastUpdate} />
    </Paper>
  );
};

export default App;