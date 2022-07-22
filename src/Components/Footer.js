import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import get_julian_date from "./get_julian_date";
import HomeIcon from "@material-ui/icons/Home";
import PublicIcon from "@material-ui/icons/Public";
import { AccessTime } from "@material-ui/icons";
import EventIcon from "@material-ui/icons/Event";
import { createTheme } from "@material-ui/core";

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
  icon_bar: {
    display: "flex",
    alignItems: "center",
    // justifyContent: "center",
  },
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
  const classes = useStyles();
  return (
    <React.Fragment>
      <ElevationScroll {...props}>
        <AppBar className={classes.footer_bar}>
          <div>
            <Toolbar className={classes.AppBar_bar}>
              {/* <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="open drawer"
            >
              <MenuIcon />
            </IconButton> */}
              {/* <Icon className={classes.icon}>
              <Flight />
            </Icon>
            <Typography className={classes.title} variant="h6" noWrap>
              Looking Glass
            </Typography> */}

              {/* <Typography className={classes.title} variant="h6" noWrap>
              Last Update -
              </Typography> */}
              {props.lastUpdate && (
                <Typography
                  className={classes.icon_bar}
                  variant="h6"
                  noWrap
                  color="textPrimary"
                >
                  <AccessTime className={classes.icon} />
                  {" LAST UPDATE: "}
                  {` ${new Date(props.lastUpdate).toLocaleTimeString([], {
                    hour12: false,
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`}
                  {"  "}
                </Typography>
              )}

              <Typography className={classes.icon_bar} variant="h6" noWrap>
                <EventIcon className={classes.icon} />
                J-Day:
                <span style={{ marginLeft: "1rem" }}>
                  {get_julian_date(new Date())}
                </span>
              </Typography>

              {props.lastUpdate && (
                <Typography
                  className={classes.icon_bar}
                  variant="h6"
                  noWrap
                  color="textPrimary"
                >
                  <PublicIcon className={classes.icon} />{" "}
                  {`ZULU:  ${new Date(props.lastUpdate).getUTCHours()}`}
                  {`:${
                    new Date(props.lastUpdate).getMinutes() < 10 ? "0" : ""
                  }${new Date(props.lastUpdate).getMinutes()}`}
                </Typography>
              )}

              {/* <Typography className={classes.title} variant="h6" noWrap>
              J-Day  -
              <span style={{ marginLeft: "1rem" }}>
                {get_julian_date(new Date())}
              </span>
            </Typography> */}

              {/* <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>{" "}
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ "aria-label": "search" }}
              />{" "}
            </div> */}
            </Toolbar>
          </div>
        </AppBar>
      </ElevationScroll>
      <Toolbar />
    </React.Fragment>
  );
};

export default Footer;
