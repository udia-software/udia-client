import React from "react";

export const Home = () => {
  document.title = "UDIA";
  return (
    <div className="pageContainer">
      <p>This is the home page of the application.</p>
      <p>Another iteration.</p>
      <p>Testing <i>italics</i></p>
      <p>Testing <strong>bold text</strong></p>
    </div>
  );
};

export default Home;
