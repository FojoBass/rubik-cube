import { Link } from "react-router-dom";
import SectionTemplate from "../templates/SectionTemplate";
import { Section } from "../types";

const About = () => {
  return (
    <SectionTemplate id={Section.about}>
      <p>
        created by{" "}
        <a href="https://devfojo.netlify.app" target="_blank">
          devFojo
        </a>{" "}
      </p>
      <p>
        copyright © {new Date().getFullYear()} <Link to="/">rubikcube1</Link>{" "}
        all rigts reserved.
      </p>
    </SectionTemplate>
  );
};

export default About;
