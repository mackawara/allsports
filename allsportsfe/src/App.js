import "./App.css";
import "./components/Wrapper";
import Wrapper from "./components/Wrapper";
import "./components/Card";
import React from "react";
import "./components/Card";
import CardTemp from "./components/Card";
import { Container } from "@mui/material";
import Typography from "@mui/material/Typography";

const cardContents = {
  imageAlt: "Test Image",
  imageSrc: "./images/test.jpg",
};
function App() {
  return (
    <Container>
      <Typography variant="H2">Hello</Typography>
    </Container>
  );
}

export default App;
