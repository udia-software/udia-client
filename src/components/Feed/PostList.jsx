import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPosts } from '../../actions';

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  posts: PropTypes.array.isRequired
}

class PostList extends Component {
  constructor(props) {
    super(props);
    this.props.dispatch(getPosts());
  }
  render = () => (
    <div>
      This is a post list.
    </div>
  );
}

PostList.propTypes = propTypes;

function mapStateToProps(state) {
  return state.postList;
}

export default connect(mapStateToProps)(PostList);