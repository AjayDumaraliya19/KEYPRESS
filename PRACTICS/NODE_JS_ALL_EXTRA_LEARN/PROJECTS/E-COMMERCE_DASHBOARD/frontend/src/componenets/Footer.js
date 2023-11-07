import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer">
      <div>
        <ul className="navbar">
          <li>
            <Link to="/update">Please follow our term and conditions...</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
