import { ArrowDownIcon } from "@src/assets/icons/index";
import clsx from "clsx";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import uniqid from "uniqid";

interface AccordionContextType {
  open: string | null;
  setOpen: (id: string) => void;
}

const Context = createContext<AccordionContextType | null>(null);

interface AccordionProps {
  children: ReactNode;
}

function Accordion({ children }: AccordionProps) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full gap-2">
      <Context.Provider value={{ open, setOpen }}>{children}</Context.Provider>
    </div>
  );
}

interface AccordionPanelProps {
  children: ReactNode;
  title: ReactNode;
  defaultExpanded?: boolean;
  disabled?: boolean;
  iconSrc?: string;
}

function Panel({
  children,
  title,
  defaultExpanded = false,
  disabled = false,
  iconSrc = "/assets/icons/defaultIcon.svg",
}: AccordionPanelProps) {
  const context = useContext(Context);
  if (!context)
    throw new Error("Accordion.Panel must be used within Accordion");

  const { open, setOpen } = context;
  const [id] = useState(uniqid());

  useEffect(() => {
    if (defaultExpanded && !disabled) setOpen(id);
  }, [defaultExpanded, disabled, id]);

  const handleOpen = () => {
    if (disabled) return;
    setOpen(id);
  };

  return (
    <div
      className={clsx(
        "h-[56px] flex shrink-0 flex-col px-4 rounded-lg border border-c-neutral-700 bg-c-neutral-800 overflow-hidden duration-200",
        { grow: open === id }
      )}
    >
      <div className="flex items-center py-2" onClick={handleOpen}>
        <span className="mr-4">
          <img src={iconSrc} alt="icon" className="mr-4 m-2 w-6 h-6" />
        </span>
        <span className="grow">{title}</span>

        {!disabled && (
          <span className="ml-4">
            <img
              src={ArrowDownIcon}
              alt="Open"
              className={clsx(
                open === id ? "opacity-0 top-3" : " top-0",
                "transition-all invert size-3 duration-200 relative"
              )}
            />
          </span>
        )}
      </div>

      <div className={clsx("py-2", { "grow overflow-hidden": open === id })}>
        {children}
      </div>
    </div>
  );
}

Accordion.Panel = Panel;

export default Accordion;
