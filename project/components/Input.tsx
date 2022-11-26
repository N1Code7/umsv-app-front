type inputType = {
  type?: string;
  placeholder?: string;
  id?: string;
  value?: string;
  css?: string;
  disabled?: boolean;
  action?: (param?: any) => void;
};

const Input = ({ type, placeholder, id, value, css, disabled, action }: inputType) => {
  if (type === "submit") {
    return (
      <input
        type={type}
        placeholder={placeholder}
        id={id}
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
        value={value}
        className={css}
        onChange={action}
      />
    );
  }
};

export default Input;
