import { library } from "@fortawesome/fontawesome-svg-core";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { MemoryRouter } from "react-router";
import renderer from "react-test-renderer";
import SignUpView from "../../../Components/Auth/SignUpView";

beforeAll(() => {
  library.add(faEye);
});

afterAll(() => {
  library.reset();
});

it("renders SignUpView correctly", () => {
  const stubHandleMethod = () => null;
  const tree = renderer
    .create(
      <MemoryRouter>
        <SignUpView
          loading={false}
          emailValidating={false}
          emailValidated={false}
          usernameValidating={false}
          usernameValidated={false}
          passwordValidated={false}
          email=""
          username=""
          password=""
          errors={[]}
          emailErrors={[]}
          usernameErrors={[]}
          passwordErrors={[]}
          showPassword={false}
          handleChangeEmail={stubHandleMethod}
          handleEmailBlur={stubHandleMethod}
          handleChangeUsername={stubHandleMethod}
          handleUsernameBlur={stubHandleMethod}
          handleChangePassword={stubHandleMethod}
          handlePasswordBlur={stubHandleMethod}
          handleTogglePassword={stubHandleMethod}
          handleSubmit={stubHandleMethod}
        />
      </MemoryRouter>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
