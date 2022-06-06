import React, { useEffect, useState } from "react";
import Header from "./Components/Header";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Card, Container, Grid, Paper } from "@material-ui/core";
import UserTable from "./Components/UserTable";
import FlightTable from "./Components/FlightTable";
import LoadingCard from "./Components/LoadingCard";
import FlightMap from "./Components/FlightMap"
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
    height: "calc(100vh - 64px)",
    padding: "1rem",
    overflowY: "auto",
  },
}));

const App = (props) => {
  const [user_rows, set_user_rows] = useState(null);
  const [flight_rows, set_flight_rows] = useState(null);
  const [lastUpdate, set_lastUpdate] = useState(null);

  useEffect(() => {
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
    getRows();
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
        console.log(response_json);
        set_flight_rows(response_json.flights);
        set_lastUpdate(new Date());
      } catch (error) {
        console.log(error);
      }
    };
    getFlights();
    const timer = setTimeout(() => {
      console.log("Refreshing");
      getRows();
      getFlights();
    }, 1000 * 10);
  }, []);

  const classes = useStyles();
  return (
    <Paper className={classes.page_background}>
      <Header lastUpdate={lastUpdate} />
      <Container className={classes.container} maxWidth={false}>
        <Grid container spacing={2} justify="space-around">
          {user_rows ? (
            <Grid item xs={12} xl={6}>
              <Card elevation={4} className={classes.main_card}>
                <UserTable rows={user_rows} />
              </Card>
            </Grid>
          ) : (
            <Grid item xs={6}>
              <LoadingCard />
            </Grid>
          )}
          {flight_rows ? (
            <Grid item xs={12} xl={6}>
              <Card elevation={4} className={classes.main_card}>
                <FlightTable rows={flight_rows} />
              </Card>
            </Grid>
          ) : (
            <Grid item xs={6}>
              <LoadingCard />
            </Grid>
          )}
          {flight_rows ? (
            <Grid item xs={12} >
              <Card elevation={4} className={classes.main_card}>
                <FlightMap flights={flight_rows} />
              </Card>
            </Grid>
          ) : (
            <Grid item xs={6}>
              <LoadingCard />
            </Grid>
          )}
        </Grid>
      </Container>
    </Paper>
  );
};

export default App;
