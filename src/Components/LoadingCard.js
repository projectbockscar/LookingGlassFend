import React from "react";
// import PropTypes from "prop-types";
import { LinearProgress, Typography } from "@material-ui/core";

const LoadingCard = () => {
  return (
    <React.Fragment>
      <Typography variant="h3" align="center">Loading...</Typography>
      <LinearProgress/>
    </React.Fragment>
  );
};

// LoadingCard.propTypes = {};

export default LoadingCard;
