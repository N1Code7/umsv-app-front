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
  return (
    <input
      type={type}
      placeholder={placeholder}
      id={id}
      value={value}
      className={css}
      onChange={action}
      disabled={disabled}
    />
  );
};

export default Input;
