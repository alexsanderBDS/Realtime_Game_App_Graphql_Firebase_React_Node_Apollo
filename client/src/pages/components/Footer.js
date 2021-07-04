import React from "react";

const Footer = () => {
  return (
    <div>
      <ul
        style={{
          display: "flex",
          flexDirection: "row",
          listStyle: "none",
          gap: "1rem",
          padding: "1rem",
          margin: "0",
          background: "white",
        }}
      >
        <li>
          <a
            href="https://www.linkedin.com/in/alexsander-batista-dos-santos-1524278a/"
            className="btn btn-secondary"
            target="_blank"
            rel="noreferrer"
          >
            <i className="fab fa-linkedin"></i>
            &nbsp;Join Me
          </a>
        </li>
        <li>
          <a
            href="https://github.com/alexsanderBDS"
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary"
          >
            <i className="fab fa-github"></i>
            &nbsp;GitHub
          </a>
        </li>
        <li>
          <a
            href="mailto:alexsanderb5santos@gmail.com?subject=Olá Alexsander"
            className="btn btn-secondary"
          >
            <i className="far fa-envelope"></i>&nbsp;Contact Me
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Footer;
