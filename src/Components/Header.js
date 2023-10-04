import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import IconButton from "@material-ui/core/IconButton";

// import MenuIcon from "@material-ui/icons/Menu";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import moment from "moment";
import image from "../images/logo1.png";
import image1 from "../images/bockscar.PNG";
import iosLogo from "../images/ios.png";

// import { TextField } from "@material-ui/core";

const appleversion = "17.0.2";
const dfmVersion = "2023-037-AA";
const dmmVersion = "2023-037-AA";
const dfcVersion = "2023-006-AB";

const useStyles = makeStyles((theme) => ({
  header_bar: {
    backgroundColor: theme.palette.grey[600],
    height: "8vh",
  },
  header_root: {
    justifyContent: "space-around",
  },
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: "none",
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

  navBar: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
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
  // icon: {
  //   width: "2rem",
  //   height: "2rem",
  //   borderRadius: "50%",
  //   marginRight: theme.spacing(1),
  //   display: "block"  ,
  //     /* Other styles here */
  // }
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

//Get the total number of flights from the database
// const get_number_of_flights = () => {
//   fetch("http://localhost:5000/flight")
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(get_number_of_flights);
//       return data.length;
//     });
// };

// const interval = setInterval(function() {
//   // method to be executed;
// }, 5000);
const Header = (props) => {
  const getCurrentDate = () => {
    return moment().format("ddd, DD MMMM YYYY");
  };

  // const number_of_flights = 20;

  const classes = useStyles();
  return (
    <React.Fragment>
      <ElevationScroll {...props}>
        <AppBar classes={{ root: classes.header_bar }} position={"default"}>
          <Toolbar className={classes.header_bar}>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="open drawer"
            >
              {/* <MenuIcon /> */}
            </IconButton>
            <IconButton className={classes.icon}>
              <img src={image} height={60} width={60} alt="Patch" />
            </IconButton>
            <IconButton className={classes.icon}>
              <img src={image1} height={60} width={60} alt="Patch" />
            </IconButton>
            <Typography className={classes.title} variant="h6" noWrap>
              LOOKING GLASS - FOREFLIGHT DISPATCH
            </Typography>

            {/* <Typography variant="h6" noWrap style={{ marginRight: "100px" }}>
              Displaying Next {number_of_flights} Flights 
            </Typography> */}

            {/* <TextField
              value={number_of_flights}
              style={{ marginRight: "20px", maxWidth: "30px" }}
              onChange={(event) =>
                set_number_of_flights(parseInt(event.target.value) || 0)
              } 
            />  */}
            <IconButton
              style={{ paddingBottom: "1.2rem" }}
              className={classes.icon}
            >
              <img src={iosLogo} height={23} width={20} alt="Patch" />
            </IconButton>
            <Typography variant="h6" noWrap>
              EFB iPadOS Version {appleversion}
              <span style={{ marginRight: "5rem" }}></span>
            </Typography>
            <Typography variant="body2">
              <div>
                <span>DFM: {dfmVersion}</span>
              </div>
              <div>
                <span>DMM: {dmmVersion}</span>
              </div>
              <div>
                <span>DFC: {dfcVersion}</span>
              </div>
            </Typography>

            {/* <Typography variant="h5" noWrap>
              <span style={{ marginRight: "1rem", verticalAlign: "middle" }}>
                <CalendarTodayIcon />
              </span>
              <span style={{ marginRight: "1rem" }}>{getCurrentDate()}</span>
            </Typography> */}
          </Toolbar>
        </AppBar>
      </ElevationScroll>
    </React.Fragment>
  );
};
export default Header;
