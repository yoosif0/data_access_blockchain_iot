import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import { userType } from "../../types/userType";

const NavBarLink = ({ to, label }) => (
  <li className="nav-item" style={{ marginRight: "20px" }}>
    <NavLink activeClassName="active" to={to} className="nav-link">
      {label}
    </NavLink>
  </li>
);

export const PNavbar = ({ account, identity }) => (
  <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
    <NavLink className="navbar-brand" to="/">
      {" "}
      DataAccess ©{" "}
    </NavLink>
    <button
      className="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon" />
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav mr-auto">


        <NavBarLink to="/identity" label="Identity" />

        {identity === userType.OWNER ? (
          <React.Fragment>
            <NavBarLink to="/users" label="Users" />
            <NavBarLink to="/document" label="My Document" />
          </React.Fragment>
        ) : identity === userType.DOCTOR_WITH_ACCESS ? (
          <NavBarLink to="/documentForUser" label="Patient's Document" />
          ) : <div></div>
          
          }
      </ul>
      <small className="text-black"><span id="account">{"Your Address: " + account}</span></small>
    </div>
  </nav>
);

const mapStateToProps = state => ({
  identity: state.identityStore.identity,
});

const mapDispatchToProps = dispatch => ({
  logout: () => {

  }
});

export const Navbar = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(PNavbar);
