import { library } from "@fortawesome/fontawesome-svg-core";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { MemoryRouter } from "react-router";
import renderer from "react-test-renderer";
import SignInView from "../../../Components/Auth/SignInView";

beforeAll(() => {
  library.add(faEye);
});

afterAll(() => {
  library.reset();
});

it("renders ForgotPasswordView correctly", () => {
  const stubHandleMethod = () => null;
  const tree = renderer
    .create(
      <MemoryRouter>
        <SignInView
          loading={false}
          email=""
          password=""
          errors={[]}
          emailErrors={[]}
          passwordErrors={[]}
          showPassword={false}
          handleChangeEmail={stubHandleMethod}
          handleChangePassword={stubHandleMethod}
          handleTogglePassword={stubHandleMethod}
          handleSubmit={stubHandleMethod}
        />
      </MemoryRouter>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
