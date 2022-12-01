import { Button } from "@mui/material";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <h2>
        Ở đây chưa có gì, chúng tôi sẽ phát triển thêm tính năng trong tương lai
        !!!
      </h2>
      <Button
        variant="contained"
        sx={{
          width: "20px",
          height: "30px",
          marginLeft: "2rem",
          marginTop: "1rem",
        }}
        color="error"
        onClick={() => {
          navigate(-1);
        }}
      >
        Back
      </Button>
    </div>
  );
};

export default NotFound;
