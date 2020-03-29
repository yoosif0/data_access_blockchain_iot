import React, { Component } from "react";
import { connect } from 'react-redux';


const mapStateToProps = state => ({ identity: state.identityStore.identity })
const mapDispatchToProps = dispatch => ({
  
})


export class PIdentityPage extends Component {
  render() {
    return (
      <div className="container-fluid mt-5">
        <p>Identity: {this.props.identity} </p>
      </div>
    );
  }
}

export const IdentityPage = connect(mapStateToProps, mapDispatchToProps)(PIdentityPage)