import React, { Component } from "react";
import { connect } from "react-redux";
import { IRootState } from "../../Modules/ConfigureReduxStore";
import styled from "../AppStyles";

interface IProps {
  alerts?: string[];
}

const AlertContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: auto;
  left: auto;
`;

class AlertWrapper extends Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    return <div>{false && <AlertContainer>Yo</AlertContainer>}</div>;
  }
}

const mapStateToProps = (state: IRootState) => ({});

export default connect(mapStateToProps)(AlertWrapper);
