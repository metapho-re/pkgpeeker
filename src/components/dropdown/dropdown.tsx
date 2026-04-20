import "./dropdown.css";

import { useEffect, useRef, useState } from "react";

interface Option<T extends string> {
  key: T;
  label: string;
}

interface Props<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}

export const Dropdown = <T extends string>({
  options,
  value,
  onChange,
}: Props<T>) => {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const selectedLabel = options.find(({ key }) => key === value)?.label ?? "";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggleState = () => {
    setOpen((previousState) => !previousState);
  };

  const handleSelectOption = (key: T) => () => {
    onChange(key);
    setOpen(false);
  };

  return (
    <div className="dropdown" ref={ref}>
      <button className="dropdown__trigger" onClick={handleToggleState}>
        <span className="dropdown__label">{selectedLabel}</span>
        <span
          className={`dropdown__arrow${open ? " dropdown__arrow--open" : ""}`}
        >
          ▾
        </span>
      </button>
      {open && (
        <ul className="dropdown__menu">
          {options.map(({ key, label }) => (
            <li key={key}>
              <button
                className={`dropdown__option${key === value ? " dropdown__option--selected" : ""}`}
                onClick={handleSelectOption(key)}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
