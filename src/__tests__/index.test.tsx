import ReactDOM from "react-dom";
import App from "../Components/App";
import render from "../index";

it("renders without crashing", () => {
  expect.assertions(1);
  const testRoot = document.createElement("div");
  expect(testRoot).not.toBeNull();
  render(App, testRoot);
  ReactDOM.unmountComponentAtNode(testRoot);
});
