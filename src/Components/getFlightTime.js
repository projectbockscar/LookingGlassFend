let departureTime = "2020-01-01T00:00:00.000Z";
let arrivalTime = "2020-01-01T00:00:00.000Z";

const getFlightTime = (dt2, dt1) => {
     let diff = new Date(dt2) - new Date(dt1);
     let hours = Math.floor(diff / 1000 / 60 / 60);
     let minutes = Math.floor(diff / 1000 / 60) % 60;
     if (minutes < 10) {
          minutes = "0" + minutes;
     }
     return `${hours}h ${minutes}m`;
}
//     { if (flightTime.minutes < 10 ? "0" + d.getMinutes() : d.getMinutes()) {
//      return flightTime.minutes;
// }
// {
//   let diff =(dt2 - dt1) / 1000;
//   diff /= (60 * 60);
//   return Math.abs(Math.round(diff));
  
//  }

let dt1 = new Date(departureTime);
let dt2 = new Date(arrivalTime);

//getFlightTime returns the number of hours between the two dates in the format of 2 digit hours and 2 digit minutes
// let flightTime = getFlightTime(dt2, dt1);
// if (flightTime < 10) {
//   flightTime + "0" + flightTime;
// }


dt1 = new Date("October 13, 2014 08:11:00");
dt2 = new Date("October 13, 2014 11:13:00");
console.log(getFlightTime(dt1, dt2));

export default getFlightTime;

// < 10 ? "0" + d.getMinutes() : d.getMinutes();