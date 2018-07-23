import React from "react";
import { connect } from "react-redux";
import { IRootState } from "../../Modules/ConfigureReduxStore";
import { StatusType } from "../../Modules/Reducers/Transient/Reducer";
import styled from "../AppStyles";
import SimpleLoader from "../Helpers/SimpleLoader";

const StatusContainer = styled.div`
  grid-area: content;
  position: sticky;
  margin-top: auto;
  margin-right: auto;
  width: auto;
  left: 0;
  bottom: 0;
  border: 1px solid ${props => props.theme.primaryColor};
  border-radius: 3px;
`;

interface IProps {
  status?: { type: StatusType; content: string };
}

const Status = ({ status }: IProps) =>
  status ? (
    <StatusContainer>
      <SimpleLoader loading={status.type === "loading"} />{status.content}
    </StatusContainer>
  ) : null;

const mapStateToProps = (state: IRootState) => ({
  status: state.transient.status
});

export default connect(mapStateToProps)(Status);
