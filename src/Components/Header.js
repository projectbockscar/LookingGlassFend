import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import IconButton from "@material-ui/core/IconButton";
import image1 from "../images/bockscar.PNG";
import iosLogo from "../images/ios.png";
import OnlinePredictionIcon from "@mui/icons-material/OnlinePrediction";
import { createClient } from "contentful";

// Example: Versions for hard code compatibility if needed 
// const appleVersion = "17.5";
// const dfmVersion = "2023-263-BG";
// const dmmVersion = "2023-320-AC";
// const dfcVersion = "2023-263-BG";
// Then remove/mute the API calls

// Styles
const useStyles = makeStyles((theme) => ({
  header_bar: {
    backgroundColor: theme.palette.grey[600],
    height: "110px",
    justifyContent: "space-between",
    boxShadow: "5px -2px 5px 2px rgba(0,0,0,0.9)",
  },
  leftSide: {
    display: "flex",
    alignItems: "center",
  },
  rightSide: {
    display: "flex",
    alignItems: "center",
  },
  logo: {
    marginLeft: "1rem",
  },
  title: {
    marginLeft: "2rem",
    fontFamily: "Yellowtail, cursive",
    fontSize: "2.2rem",
    [theme.breakpoints.down(1370)]: { // Use 'sm' breakpoint for iPad-sized screens
      fontSize: '1.7rem', // Adjust font size on smaller screens
    },
  },
  iosVersion: {
    marginLeft: "0.3rem",
    marginRight: "3rem",
    [theme.breakpoints.down(1370)]: { // Use 'sm' breakpoint for iPad-sized screens
      fontSize: '1rem', // Adjust font size on smaller screens
    },
  },
  manuals: {
    marginRight: "3rem",
  },
  onlineStatus: {
    marginLeft: "1.2rem",
    transform: "scale(1.3, 1.3)",
  },
  online: {
    color: "#20de07",
  },
  offline: {
    color: "#FF0000", // red
  },
}));

// Elevation Scroll
function ElevationScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

// Versions are loaded from Contentful here
const Header = (props) => {
  const classes = useStyles();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [versions, setVersions] = useState({
    iosVersion: "Loading...",
    dfmVersion: "Loading...",
    dmmVersion: "Loading...",
    dfcVersion: "Loading...",
  });

  const fetchVersions = () => {
    const client = createClient({
      space: "38r6hx96tbyw",
      accessToken: "ZZck2gzwq1bu0TmzDXyRcDA4bZJzh5BoY19XqhpnbBU",
    });

    client
      .getEntries({
        content_type: "versionUpdates",
      })
      .then((response) => {
        const fields = response.items[0].fields;
        setVersions({
          iosVersion: fields.iosVersion || "Default iOS Version",
          dfmVersion: fields.dfmVersion || "Default DFM Version",
          dmmVersion: fields.dmmVersion || "Default DMM Version",
          dfcVersion: fields.dfcVersion || "Default DFC Version",
        });
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    // Initial fetch
    fetchVersions();

    // Set interval to fetch every 10 minutes
    const interval = setInterval(fetchVersions, 60000); // 1 minutes in milliseconds
   
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Online Status; Online event listener, shows if the app is online or offline
  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  // This is the items displayed in the header
  return (
    <ElevationScroll {...props}>
      <AppBar position={"default"}>
        <Toolbar className={classes.header_bar}>
          <div className={classes.leftSide}>
            <IconButton className={classes.logo}>
              <img src={image1} height={80} width={80} alt="Patch" />
            </IconButton>
            <Typography className={classes.title} noWrap>
              LOOKING GLASS
            </Typography>
            <IconButton
              className={`${classes.onlineStatus} ${
                isOnline ? classes.online : classes.offline
              }`}
            >
              <div>- &nbsp;</div>
              <OnlinePredictionIcon />
            </IconButton>
          </div>
          <div className={classes.rightSide}>
            <IconButton>
              <img src={iosLogo} height={25} width={22} alt="iOS Logo" />
            </IconButton>
            <Typography className={classes.iosVersion} variant="h6" noWrap>
              iOS Version: {versions.iosVersion}
            </Typography>
            <Typography className={classes.manuals} variant="body2">
              DFM: {versions.dfmVersion} <br />
              DMM: {versions.dmmVersion} <br />
              DFC: {versions.dfcVersion}
            </Typography>
          </div>
        </Toolbar>
      </AppBar>
    </ElevationScroll>
  );
};

export default Header;
