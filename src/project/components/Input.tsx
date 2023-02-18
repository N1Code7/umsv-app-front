import { LegacyRef } from "react";

type inputType = {
  type?: string;
  placeholder?: string;
  id?: string;
  ref?: LegacyRef<HTMLInputElement>;
  value?: string;
  css?: string;
  disabled?: boolean;
  action?: (param?: any) => void;
};

const Input = ({ type, placeholder, id, ref, value, css, disabled, action }: inputType) => {
  if (type === "submit") {
    return (
      <input
        type={type}
        placeholder={placeholder}
        id={id}
        ref={ref}
        value={value}
        className={css}
        onClick={action}
      />
    );
  } else {
    return (
      <input
        type={type}
        placeholder={placeholder}
        id={id}
        ref={ref}
        value={value}
        className={css}
        onChange={action}
      />
    );
  }
};

export default Input;
