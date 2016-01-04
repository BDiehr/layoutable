import React, { Component, PropTypes } from 'react';
import { Navbar } from 'react-bootstrap';
/** styles */
require('./layout.scss');

const propTypes = {
  children: PropTypes.any,
};

class Layout extends Component {
  render() {
    return (
        <div>
          <Navbar>
            <Navbar.Header>
              <Navbar.Brand>
                <a href="#">Open Layout</a>
              </Navbar.Brand>
            </Navbar.Header>
          </Navbar>
          <div>
            {this.props.children}
          </div>
          <div className="footer">
            <hr />
            <div className="footer__title">Open Layout | Brian Diehr</div>
            <a title="GitHub" className="social-icon" href="https://github.com/BDiehr"><i className="fa fa-3x fa-github"/></a>
            <a title="LinkedIn" className="social-icon" href="https://www.linkedin.com/in/brian-diehr-6873b5b9">
              <i className="fa fa-3x fa-linkedin-square"/>
            </a>
          </div>
        </div>
    );
  }
}

Layout.propTypes = propTypes;
export default Layout;
