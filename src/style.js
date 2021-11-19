import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  iconButton1: {
    color: "#1976d2",
    fontSize: "12px",
    padding: "16px 8px",
    backgroundColor: "rgba(248, 249, 250, 0.1)",
    borderRadius: "5px",
    border: "1px solid gray",
    // boxShadow: "0 0.05rem 0.05rem black",
    margin: "4px",
    height: "25px",
  },
  sendButton: {
    color: "#1976d2",
    border: "1px solid gray",
  },
}));

export default useStyles;
