import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import PublicIcon from "@material-ui/icons/Public";
import { AccessTime } from "@material-ui/icons";
import EventIcon from "@material-ui/icons/Event";
import { BottomNavigation } from "@material-ui/core";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import moment from "moment";
import LeidosLogo from "../Images/LeidosLogo.png";
import IconButton from "@material-ui/core/IconButton";

//Styles
const useStyles = makeStyles((theme) => ({
  elegantFont: {
    fontFamily: '"Playfair Display", serif',
    [theme.breakpoints.down(1370)]: { // Use 'sm' breakpoint for iPad-sized screens
      fontSize: '0.7rem', // Adjust font size on smaller screens
    },
  },
  footerContainer: {
    backgroundColor: theme.palette.grey[600],
    height: "100px",
    width: "100%",
    position: "fixed", // Position fixed to make it stick at the bottom
    bottom: 0, // Align to the bottom
    left: 0, // Align to the left
    zIndex: 1000, // Ensure it's above other elements
    boxShadow: "0px -2px 5px 0px rgba(0,0,0,0.5)",
    [theme.breakpoints.down('sm')]: {
      height: "120px", // Increase height on smaller screens to accommodate content
      paddingRight: "0", // Remove extra padding on smaller screens
    },
  },
  poweredBy: {
    //backgroundColor: "lightgrey",
    background: "linear-gradient(to right, #cfa54e, #aec1ce)",
    borderRadius: "5px",
    padding: "5px",
    border: "1px solid black",
    textAlign: "center",
    color: "black",
    boxShadow: "0px 0px 8px 0px rgba(0,0,0,0.7)",
    marginRight: "-120px",
    marginLeft: "40px",
    [theme.breakpoints.down('sm')]: {
      marginRight: "0", // Remove negative margin on smaller screens
      marginLeft: "10px", // Adjust left margin on smaller screens
      fontSize: '0.6rem', // Adjust font size on smaller screens
    },
  },
  dateTimeDisplay: {
    display: "flex",
    alignItems: "center",
    "& > svg": {
      marginRight: theme.spacing(1),
    },
    [theme.breakpoints.down(1370)]: {
      fontSize: "0.8rem", // Adjust font size on smaller screens
    },
  },

  middleSide: {
    display: "flex",
    marginLeft: "-120px",
    marginRight: "20px",

    [theme.breakpoints.down('sm')]: {
      marginRight: "0", // Remove negative margin on smaller screens
      marginLeft: "10px", // Adjust left margin on smaller screens
    },
  },

}));

//Footer
const Footer = (props) => {
  const getCurrentDate = () => moment().format("ddd, DD MMM YYYY");
  const classes = useStyles();
  return (
    <BottomNavigation className={classes.footerContainer}>
      <Grid container direction="row" alignItems="center">
        <Grid item className={classes.poweredBy}>
          <Typography
            variant="h7"
            className={classes.elegantFont}
            style={{ fontStyle: "italic" }}
          >
            Powered by
          </Typography>
          <Typography variant="h6" className={classes.elegantFont}>
            BOCKSCAR
          </Typography>
        </Grid>
        <Grid
          item
          xs
          container
          justifyContent="space-evenly"
          alignItems="center"
        >
          <Typography className={classes.dateTimeDisplay} variant="h6" noWrap>
            <CalendarTodayIcon />
            {getCurrentDate()}
          </Typography>

          {props.lastUpdate && (
            <Typography className={classes.dateTimeDisplay} variant="h6" noWrap>
              <AccessTime />
              Updated:{" "}
              {`${new Date(props.lastUpdate).toLocaleTimeString([], {
                hour12: false,
                hour: "2-digit",
                minute: "2-digit",
              })}`}
            </Typography>
          )}

          <Typography className={classes.dateTimeDisplay} variant="h6" noWrap>
            <EventIcon />
            J-Day: {moment().format("DDDD")}
          </Typography>

          {props.lastUpdate && (
            <Typography className={classes.dateTimeDisplay} variant="h6" noWrap>
              <PublicIcon />
              ZULU:{" "}
              {`${new Date(props.lastUpdate).getUTCHours()}:${
                new Date(props.lastUpdate).getMinutes() < 10 ? "0" : ""
              }${new Date(props.lastUpdate).getMinutes()}`}
            </Typography>
          )}
        </Grid>
      </Grid>

      <div className={classes.middleSide}>
            <IconButton className={classes.logo}>
              <img src={LeidosLogo} height={45} width={100} alt="Patch" />
            </IconButton>
          </div>

    </BottomNavigation>
  );
};

export default Footer;
