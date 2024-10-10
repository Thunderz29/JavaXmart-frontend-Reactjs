import { Box, Grid } from "@mui/material";
import { Buy, Document, User } from "react-iconly";
import CardButton from "../components/Card.jsx";

export default function MainPage() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      margin={30}
    >
      <Grid
        display="flex"
        container
        spacing={4}
        justifyContent="center"
        alignItems="center"
        flexDirection={{ xs: "column", md: "row" }}
      >
        <Grid item>
          <CardButton
            title="Shop Now"
            route="/shop"
            icon={{ name: Buy, size: "xlarge", stroke: "bold" }}
          />
        </Grid>
        <Grid item>
          <CardButton
            title="Customer Profile"
            route="/profile"
            icon={{ name: User, size: "xlarge", stroke: "bold" }}
          />
        </Grid>
        <Grid item>
          <CardButton
            title="Data"
            route="/data"
            icon={{ name: Document, size: "xlarge", stroke: "bold" }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
