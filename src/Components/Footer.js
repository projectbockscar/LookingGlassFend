import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import get_julian_date from "./getJulianDate";
import HomeIcon from "@material-ui/icons/Home";
import PublicIcon from "@material-ui/icons/Public";
import { AccessTime } from "@material-ui/icons";
import EventIcon from "@material-ui/icons/Event";
import { BottomNavigation, createTheme } from "@material-ui/core";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import moment from "moment";

// const theme = createTheme({
//   palette: {
//     type: "dark",
//     primary: {
//       main: "#3b557c",
//     },
//     secondary: {
//       main: "#752d46",
//     },
//   },
// });

const useStyles = makeStyles((theme) => ({
  footer_bar: {
    backgroundColor: theme.palette.grey[600],
    position: "relative",
    fontWeight: "bold",
    textAlign: "center",
    verticalAlign: "middle",
    display: "flex",
    justifyContent: "space-evenly",
  },
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "space-between",
    display: "flex",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: (theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: (theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  },
  AppBar_bar: {
    backgroundColor: theme.palette.grey[600],
    position: "relative",
    justifyContent: "space-evenly",
    alignItems: "center",
    display: "flex",
  },

  navBar: {
    padding: theme.spacing(0, 2),
    // height: "100%",
    // position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
  icon: {
    marginRight: theme.spacing(1),
    alignItems: "center",
    verticalAlign: "middle",
  },
  // icon_bar: {
  //   display: "flex",
  //   alignItems: "center",
  //   // justifyContent: "center",
  // },
}));

function ElevationScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

// const interval = setInterval(function() {
//   // method to be executed;
// }, 5000);
const Footer = (props) => {
  const getCurrentDate = () => {
    return moment().format("ddd, DD MMMM YYYY");
  };
  const classes = useStyles();
  return (
    <BottomNavigation style={{ height: "8vh" }}>
      <Grid
        container
        justifyContent="space-around"
        style={{
          backgroundColor: "#757575",
          height: "6vh",
        }}
        alignItems="center"
      >
        <Grid item>
          <Typography variant="h5" noWrap>
            <span style={{ marginRight: "1rem", verticalAlign: "middle" }}>
              <CalendarTodayIcon />
            </span>
            <span style={{ marginRight: "1rem" }}>{getCurrentDate()}</span>
          </Typography>
        </Grid>
        {props.lastUpdate && (
          <Grid
            item
            container
            alignItems="center"
            spacing={1}
            xs={2}
            justifyContent="center"
          >
            <Grid item>
              <AccessTime />
            </Grid>
            <Grid item>
              <Typography
                className={classes.icon_bar}
                variant="h6"
                noWrap
                color="textPrimary"
              >
                {" LAST UPDATE: "}
                {` ${new Date(props.lastUpdate).toLocaleTimeString([], {
                  hour12: false,
                  hour: "2-digit",
                  minute: "2-digit",
                })}`}
              </Typography>
            </Grid>
          </Grid>
        )}
        <Grid
          item
          container
          alignItems="center"
          spacing={1}
          xs={2}
          justifyContent="center"
        >
          <Grid item>
            <EventIcon />
          </Grid>
          <Grid item>
            <Typography className={classes.icon_bar} variant="h6" noWrap>
              J-Day:
              <span style={{ marginLeft: "1rem" }}>
                {get_julian_date(new Date())}
              </span>
            </Typography>
          </Grid>
        </Grid>
        {props.lastUpdate && (
          <Grid
            item
            container
            alignItems="center"
            spacing={1}
            xs={2}
            justifyContent="center"
          >
            <Grid item>
              <PublicIcon className={classes.icon} />{" "}
            </Grid>
            <Grid item>
              <Typography
                className={classes.icon_bar}
                variant="h6"
                noWrap
                color="textPrimary"
              >
                {`ZULU:  ${new Date(props.lastUpdate).getUTCHours()}`}
                {`:${
                  new Date(props.lastUpdate).getMinutes() < 10 ? "0" : ""
                }${new Date(props.lastUpdate).getMinutes()}`}
              </Typography>
            </Grid>
          </Grid>
        )}
      </Grid>
    </BottomNavigation>
  );
};

export default Footer;
