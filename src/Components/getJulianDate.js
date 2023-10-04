
const get_julian_date = (date) => {
    const first_day_of_this_year = new Date(date.getFullYear(), 0, 1, 0, 0, 0, 0);
    const difference = date.getTime() - first_day_of_this_year.getTime();
    const julian_date = Math.floor(difference / (1000 * 60 * 60 * 24)) + 1;
    return julian_date;
};

export default get_julian_date;