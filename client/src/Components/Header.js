import React, { Fragment, useRef, useState } from "react";
import { Container, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import {
  AiOutlineCheckCircle,
  AiOutlineEdit,
  AiOutlineLogout,
  AiOutlineMenuUnfold,
  AiOutlineUser,
} from "react-icons/ai";
import { FaRegUser } from "react-icons/fa";
import logo from "../assets/images/logo.png";
import { RiDashboardLine } from "react-icons/ri";
import { getUserDetails, removeSessions } from "../Helper/sessionHelper";

const Header = (props) => {
  let contentRef,
    sideNavRef = useRef();

  const onLogout = () => {
    removeSessions();
  };

  const MenuBarClickHandler = () => {
    let sideNav = sideNavRef;
    let content = contentRef;
    if (sideNav.classList.contains("side-nav-open")) {
      sideNav.classList.add("side-nav-close");
      sideNav.classList.remove("side-nav-open");
      content.classList.add("content-expand");
      content.classList.remove("content");
    } else {
      sideNav.classList.remove("side-nav-close");
      sideNav.classList.add("side-nav-open");
      content.classList.remove("content-expand");
      content.classList.add("content");
    }
  };

  ////////////////////////////////////////////////////////////////
  //stripe checkout
  ////////////////////////////////////////////////////////////////
  const userDetailsString = localStorage.getItem("userDetails");
  const userDetails = JSON.parse(userDetailsString);
  console.log(userDetails)

  const stripeCustomerId = userDetails?.stripeCustomerId;
  console.log(stripeCustomerId);

  return (
    <Fragment>
      <Navbar className="fixed-top px-0 shadow-sm ">
        <Container fluid={true}>
          <Navbar.Brand className="d-flex">
            <a className="icon-nav m-0 h5" onClick={MenuBarClickHandler}>
              <AiOutlineMenuUnfold />
            </a>

            <img
              className="nav-logo mx-2"
              style={{ marginTop: "5px" }}
              src={logo}
              alt="logo"
            />
          </Navbar.Brand>

          <div className="float-right h-auto d-flex">
            <div className="user-dropdown">
              <img
                className="icon-nav-img icon-nav"
                src={getUserDetails()["photo"]}
                alt=""
              />
              <div className="user-dropdown-content ">
                <div className="mt-4 text-center">
                  <img
                    className="icon-nav-img"
                    src={getUserDetails()["photo"]}
                    alt=""
                  />
                  <h6>{getUserDetails()["firstName"]} </h6>
                  <hr className="user-dropdown-divider  p-0" />
                </div>
                <NavLink to="/settings/profile" className="side-bar-item">
                  <AiOutlineUser className="side-bar-item-icon" />
                  <span className="side-bar-item-caption">Settings</span>
                </NavLink>
                <a onClick={onLogout} className="side-bar-item">
                  <AiOutlineLogout className="side-bar-item-icon" />
                  <span className="side-bar-item-caption">Logout</span>
                </a>
              </div>
            </div>
          </div>
        </Container>
      </Navbar>
      {console.log(window.location.href)}
      {window.location.href.includes("http://localhost:3000/settings") ? (
        <>
          <div
            ref={(div) => {
              sideNavRef = div;
            }}
            className="side-nav-open"
          >
            <NavLink
              className={(navData) =>
                navData.isActive
                  ? "side-bar-item-active side-bar-item mt-2"
                  : "side-bar-item mt-2"
              }
              to="/"
              end
            >
              <FaRegUser className="side-bar-item-icon" />
              <span className="side-bar-item-caption">Home</span>
            </NavLink>
            <NavLink
              className={(navData) =>
                navData.isActive
                  ? "side-bar-item-active side-bar-item mt-2"
                  : "side-bar-item mt-2"
              }
              to="/settings/profile"
              end
            >
              <FaRegUser className="side-bar-item-icon" />
              <span className="side-bar-item-caption">User Profile</span>
            </NavLink>

            {stripeCustomerId ? (
              <NavLink
                className={(navData) =>
                  navData.isActive
                    ? "side-bar-item-active side-bar-item mt-2"
                    : "side-bar-item mt-2"
                }
                to="/settings/driver"
              >
                <AiOutlineEdit className="side-bar-item-icon" />
                <span className="side-bar-item-caption">Driver Profile</span>
              </NavLink>
            ) : (
              <NavLink
                className={(navData) =>
                  navData.isActive
                    ? "side-bar-item-active side-bar-item mt-2"
                    : "side-bar-item mt-2"
                }
                to="/settings/Create"
              >
                <AiOutlineEdit className="side-bar-item-icon" />
                <span className="side-bar-item-caption">Become a Driver</span>
              </NavLink>
            )}
          </div>
        </>
      ) : (
        <>
          <div
            ref={(div) => {
              sideNavRef = div;
            }}
            className="side-nav-open"
          >
            <NavLink
              className={(navData) =>
                navData.isActive
                  ? "side-bar-item-active side-bar-item mt-2"
                  : "side-bar-item mt-2"
              }
              to="/"
              end
            >
              <RiDashboardLine className="side-bar-item-icon" />
              <span className="side-bar-item-caption">HomePage</span>
            </NavLink>

            {/* <NavLink
          className={(navData) =>
            navData.isActive
              ? "side-bar-item-active side-bar-item mt-2"
              : "side-bar-item mt-2"
          }
          to="/Create"
        >
          <AiOutlineEdit className="side-bar-item-icon" />
          <span className="side-bar-item-caption">Create New</span>
        </NavLink> */}
          </div>
        </>
      )}

      <div ref={(div) => (contentRef = div)} className="content">
        {props.children}
      </div>
    </Fragment>
  );
};

export default Header;
