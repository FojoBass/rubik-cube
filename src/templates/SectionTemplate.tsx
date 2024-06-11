import { FC, ReactNode } from "react";
import { Section } from "../types";

interface SectionTemplateInt {
  children: ReactNode;
  id: Section;
}

const SectionTemplate: FC<SectionTemplateInt> = ({ children, id }) => {
  return (
    <section id={id} className="center_sect">
      {children}
    </section>
  );
};

export default SectionTemplate;
