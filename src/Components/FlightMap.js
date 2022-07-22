import React from "react";
import PropTypes from "prop-types";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@material-ui/core";
import ReactDOMServer from "react-dom/server";
import L from "leaflet";
import Flight from "@material-ui/icons/Flight";

const useStyles = makeStyles((theme) => ({
  map: {
    height: "50vh",
  },
  popup: {
    "& .leaflet-popup-content-wrapper": {
      backgroundColor: theme.palette.grey[500],
    },
  },
}));

const blueIconFlight = new L.divIcon({
  html: ReactDOMServer.renderToString(
    <Flight height="200px" color="primary" />
  ),
});
const redIconFlight = new L.divIcon({
  html: ReactDOMServer.renderToString(
    <Flight height="200px" color="secondary" />
  ),
});

const FlightMap = (props) => {
  const classes = useStyles();
  const flights = props.flights;
  // console.log(flights);
  const markers = flights.map((flight) => {
    const dep_info = flight.departureInfo;
    const dest_info = flight.destinationInfo;

    if (dep_info && dest_info) {
      const line = [
        [parseFloat(dep_info.lat), parseFloat(dep_info.lon)],
        [parseFloat(dest_info.lat), parseFloat(dest_info.lon)],
      ];
      // console.log(
      //   `departure-${flight.departure}, destination-${flight.destination}`
      // );
      return (
        <React.Fragment>
          <Marker
            icon={blueIconFlight}
            key={flight.flightId + flight.callSign + "-marker"}
            position={[parseFloat(dep_info.lat), parseFloat(dep_info.lon)]}
          >
            <Popup className={classes.popup}>
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Location</TableCell>
                      <TableCell>Departing ICAO</TableCell>
                      <TableCell>Arriving ICAO</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        {dep_info.city} - {dep_info.state}
                      </TableCell>
                      <TableCell>{dep_info.icao}</TableCell>
                      <TableCell>{dest_info.icao}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Popup>
          </Marker>
          <Marker
            icon={redIconFlight}
            key={flight.flightId + "-marker"}
            position={[parseFloat(dest_info.lat), parseFloat(dest_info.lon)]}
          >
            <Popup className={classes.popup}>
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Location</TableCell>
                      <TableCell>Departing ICAO</TableCell>
                      <TableCell>Arriving ICAO</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        {dep_info.city} - {dep_info.state}
                      </TableCell>
                      <TableCell>{dep_info.icao}</TableCell>
                      <TableCell>{dest_info.icao}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Popup>
          </Marker>
          <Polyline positions={line} />
        </React.Fragment>
      );
    } else {
      return null;
    }
  });

  return (
    <MapContainer
      center={[40.05, -108.09]}
      zoom={4}
      scrollWheelZoom={false}
      className={classes.map}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers}
    </MapContainer>
  );
};

FlightMap.propTypes = {
  flights: PropTypes.array.isRequired,
};

export default FlightMap;
