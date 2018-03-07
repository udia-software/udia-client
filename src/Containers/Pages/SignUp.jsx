import React from "react";
import { Link } from "react-router-dom";

import {
  StyledAuthButton,
  StyledAuthContainer,
  StyledAuthForm,
  StyledAuthFormContent,
  StyledAuthFormField,
  StyledAuthFormFieldset,
  StyledInput
} from "Components/Styled";

export const SignUp = () => {
  document.title = "Sign Up - UDIA";
  return (
    <StyledAuthContainer>
      <h1>Sign Up</h1>
      <StyledAuthForm>
        <StyledAuthFormFieldset>
          <legend>Hello there, User.</legend>
          <StyledAuthFormContent>
            <StyledAuthFormField>
              <label htmlFor="email">Email:</label>
              <StyledInput
                type="email"
                id="email"
                placeholder="your@email.tld"
              />
            </StyledAuthFormField>
            <StyledAuthFormField>
              <label htmlFor="username">Username:</label>
              <StyledInput type="text" id="username" placeholder="alex" />
            </StyledAuthFormField>
            <StyledAuthFormField>
              <label htmlFor="pw">Password:</label>
              <StyledInput type="password" id="pw" placeholder="••••••••" />
            </StyledAuthFormField>
            <StyledAuthButton>Sign Up</StyledAuthButton>
          </StyledAuthFormContent>
        </StyledAuthFormFieldset>
      </StyledAuthForm>
      <Link to="/sign-in">← I already have an account</Link>
      <Link to="/">Go back home.</Link>
    </StyledAuthContainer>
  );
};
export default SignUp;
