import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cx } from "../../utils/ui-helpers.js";

const AccordionSection = ({ title, children, defaultOpen = false, className }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <section className={cx("border-b border-[color:var(--color-neutral3)]", className)}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cx(
          "flex w-full items-center justify-between py-4 text-left",
          "text-[color:var(--color-primary1)]",
          "hover:text-[color:var(--color-primary2)]",
          "transition-colors duration-150",
          "focus-visible:outline-2",
          "focus-visible:outline-offset-2",
          "focus-visible:outline-[color:var(--color-primary3)]"
        )}
        aria-expanded={isOpen}
      >
        <span className="text-base font-medium font-sans">{title}</span>
        <ChevronDown
          className={cx(
            "size-4 text-[color:var(--color-text-muted)]",
            "transition-transform duration-200",
            isOpen && "rotate-180",
          )}
          aria-hidden
        />
      </button>
      {isOpen && (
        <div className={cx(
          "pb-6 text-sm leading-relaxed",
          "text-[color:var(--color-text-secondary)]",
          "animate-fade-in"
        )}>
          {children}
        </div>
      )}
    </section>
  );
};

export const Accordion = ({ sections = [], className }) => (
  <div className={cx("space-y-0", className)}>
    {sections.map((section, index) => (
      <AccordionSection
        key={section.key ?? section.title ?? index}
        title={section.title}
        defaultOpen={Boolean(section.defaultOpen)}
      >
        {section.render ? section.render() : section.content}
      </AccordionSection>
    ))}
  </div>
);

export const AccordionItem = AccordionSection;


