type inputType = {
  type?: string,
  placeholder?: string,
  id?: string,
  value?: string,
  css?: string,
  action?: (param?:any) => void,
  disabled?: boolean
}

const Input = ({type, placeholder, id, value, css, action, disabled}: inputType) => {
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
  )
}

export default Input