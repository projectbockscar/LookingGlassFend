import PendingSharpIcon from "@mui/icons-material/PendingSharp";
import RunningWithErrorsIcon from "@mui/icons-material/RunningWithErrors";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const CheckCircleIconColored = ({ color }) => (
  <CheckCircleIcon style={{ color }} />
);
const CancelIconColored = ({ color }) => <CancelIcon style={{ color }} />;
const PendingSharpIconColored = ({ color }) => (
  <PendingSharpIcon style={{ color }} />
);
const RunningWithErrorsIconColored = ({ color }) => (
  <RunningWithErrorsIcon style={{ color }} />
);

const FilingStatuses = {
  FILED: "Filed",
  CANCELLED: "Cancelled",
  NONE: "None",
};

const ReleaseStatuses = {
  RELEASED: true,
  NOT_RELEASED: false,
};

const FilingStatusComponent = ({ flight }) => {
  switch (flight.filingStatus) {
    case FilingStatuses.FILED:
      return <CheckCircleIconColored color="#20de07" />;
    case FilingStatuses.CANCELLED:
      return <CancelIconColored color="#ff4f4f" />;
    case FilingStatuses.NONE:
    default:
      return <PendingSharpIconColored color="#ffd400" />;
  }
};

const ReleaseStatusComponent = ({ flight }) => {
  return flight.released ? (
    <CheckCircleIconColored color="#20de07" />
  ) : (
    <RunningWithErrorsIconColored color="#ff4f4f" />
  );
};