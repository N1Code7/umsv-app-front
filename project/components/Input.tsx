type inputType = {
  type?: string,
  placeholder?: string,
  id?: string,
  value?: string,
}

const Input = ({type, placeholder, id, value}: inputType) => {
  if (type == "submit") {
    return (
      <input 
        type={type}
        placeholder={placeholder}
        id={id}
        value={value}
        className="btn btn-primary"
      />
    )  
  } else {
    return (
      <input 
      type={type}
      placeholder={placeholder}
      id={id}
      value={value}
      />
      )
  }
}

export default Input