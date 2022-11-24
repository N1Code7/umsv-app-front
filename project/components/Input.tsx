type inputType = {
  type?: string,
  placeholder?: string,
  id?: string,
  value?: string,
  css?: string
}

const Input = ({type, placeholder, id, value, css}: inputType) => {
  return (
    <input 
    type={type}
    placeholder={placeholder}
    id={id}
    value={value}
    className={css}
    />
  )
}

export default Input