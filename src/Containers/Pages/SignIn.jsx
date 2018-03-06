import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import {
  StyledAuthButton,
  StyledAuthContainer,
  StyledAuthForm,
  StyledAuthFormCheckboxField,
  StyledAuthFormContent,
  StyledAuthFormField,
  StyledAuthFormFieldset,
  StyledInput
} from "Components/Styled";

export const SignIn = () => {
  document.title = "Sign In - UDIA";


  return (
    <StyledAuthContainer>
      <h1>Sign In</h1>
      <StyledAuthForm>
        <StyledAuthFormFieldset>
          <legend>Welcome back, User.</legend>
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
              <label htmlFor="pw">Password:</label>
              <StyledInput type="password" id="pw" placeholder="••••••••" />
            </StyledAuthFormField>
            <StyledAuthFormCheckboxField>
              <label htmlFor="remember">Remember Me:</label>
              <input type="checkbox" id="remember" />
            </StyledAuthFormCheckboxField>
            <StyledAuthButton>Sign In</StyledAuthButton>
          </StyledAuthFormContent>
        </StyledAuthFormFieldset>
      </StyledAuthForm>
      <Link to="/sign-up">I don't have an account →</Link>
      <Link to="/forgot_password">I forgot my password.</Link>
    </StyledAuthContainer>
  );
};
export default SignIn;
