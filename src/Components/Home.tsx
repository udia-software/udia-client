import React from "react";
import styled from "./AppStyles";

const HomeContainer = styled.div`
  display: grid;
  place-content: center;
  place-items: center;
`;

const Home = () => {
  document.title = "UDIA";
  return (
    <HomeContainer>
      <h1>UDIA</h1>
      <p>Work in progress. Don't publish yet.</p>
    </HomeContainer>
  );
};

export default Home;
