import React from "react";
import "./Header.css";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const Header = () => {
  return (
    <Box className="header" sx={{ p: 2 }}>
      <Typography
        sx={{
          width: 300,
          height: "50%",
          marginLeft: "10rem",
          color: "white",
          fontWeight: "600",
        }}
        variant="h2"
      >
        LMS
      </Typography>
    </Box>
  );
};

export default Header;
