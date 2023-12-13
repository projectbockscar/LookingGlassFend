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

// Versions
const appleversion = "17.2";
const dfmVersion = "2023-263-BG";
const dmmVersion = "2023-320-AC";
const dfcVersion = "2023-263-BG";

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
    marginLeft: "1.5rem",
  },
  title: {
    marginLeft: "2rem",
  },
  iosVersion: {
    marginLeft: "0.3rem",
    marginRight: "3rem",
  },
  manuals: {
    marginRight: "3rem",
  },
  onlineStatus: {
    marginLeft: "2rem",
    transform: "scale(1.3, 1.3)",
  },
  online: {
    color: "#20de07",
  },
  offline: {
    color: "#FF0000", // red
  },
}));

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

const Header = (props) => {
  const classes = useStyles();

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);
  return (
    <ElevationScroll {...props}>
      <AppBar position={"default"}>
        <Toolbar className={classes.header_bar}>
          <div className={classes.leftSide}>
            <IconButton className={classes.logo}>
              <img src={image1} height={80} width={80} alt="Patch" />
            </IconButton>
            <Typography className={classes.title} variant="h4" noWrap>
              LOOKING GLASS
            </Typography>
            <IconButton
              className={`${classes.onlineStatus} ${
                isOnline ? classes.online : classes.offline
              }`}
            >
              <OnlinePredictionIcon />
            </IconButton>
          </div>
          <div className={classes.rightSide}>
            <IconButton>
              <img src={iosLogo} height={20} width={20} alt="iOS Logo" />
            </IconButton>
            <Typography className={classes.iosVersion} variant="h6" noWrap>
              EFB iPadOS Version {appleversion}
            </Typography>
            <Typography className={classes.manuals} variant="body2">
              DFM: {dfmVersion} <br />
              DMM: {dmmVersion} <br />
              DFC: {dfcVersion}
            </Typography>
          </div>
        </Toolbar>
      </AppBar>
    </ElevationScroll>
  );
};

export default Header;
