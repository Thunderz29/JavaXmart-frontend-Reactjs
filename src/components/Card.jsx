import { Card, CardActions, CardContent, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

export default function CardButton({ icon, title, route }) {
  return (
    <Link to={route} style={{ textDecoration: "none" }}>
      <Card
        sx={{
          width: 200,
          height: 200,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          transition: "transform 0.3s ease, background-color 0.3s ease",
          "&:hover": {
            backgroundColor: "secondary.light",
            transform: "scale(1.05)",
          },
        }}
        raised
      >
        <CardContent
          sx={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: 0,
          }}
        >
          {icon &&
            React.createElement(icon.name, {
              primaryColor: icon.primaryColor,
              size: icon.size,
              stroke: icon.stroke,
            })}
        </CardContent>
        <CardActions sx={{ justifyContent: "center", marginTop: 2 }}>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </CardActions>
      </Card>
    </Link>
  );
}
