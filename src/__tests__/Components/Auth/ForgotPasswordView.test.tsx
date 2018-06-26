import React from "react";
import renderer from "react-test-renderer";
import ForgotPasswordView from "../../../Components/Auth/ForgotPasswordView";

it("renders ForgotPasswordView correctly", () => {
  const stubHandleMethod = () => null;
  const tree = renderer
    .create(
      <ForgotPasswordView
        loading={false}
        email=""
        errors={[]}
        requestSent={false}
        emailErrors={[]}
        handleChangeEmail={stubHandleMethod}
        handleSubmit={stubHandleMethod}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
