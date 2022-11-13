import "./App.css";
import React from "react";
import FixtureCard from "./components/FixtureCard";
import { Container } from "@mui/material";




function App() {
  const [data, setData] = React.useState(null);
  React.useEffect(() => {
    fetch("/getScores")
      .then((res) => res.json())
      .then((data) => {
        setData(data.message);
        console.log(data);
      });
  }, []);

  return (
    <Container>
      <FixtureCard></FixtureCard>
    </Container>
  );
}

export default App;
