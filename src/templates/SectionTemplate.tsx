import { FC, ReactNode } from "react";
import { Section } from "../types";
import { useCubeContext } from "../contexts/cubeContext";

interface SectionTemplateInt {
  children: ReactNode;
  id: Section;
}

const SectionTemplate: FC<SectionTemplateInt> = ({ children, id }) => {
  const { currentSection } = useCubeContext();

  return (
    <section
      id={id}
      className={`center_sect ${currentSection === id ? "active" : ""}`}
    >
      {children}
    </section>
  );
};

export default SectionTemplate;
