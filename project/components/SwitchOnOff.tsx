import { useState } from "react";

const SwitchOnOff = () => {
const [isActive, setIsActive] = useState(false)

  const handleSwitch = () => {
    isActive === false ? setIsActive(true) : setIsActive(false)
  }

  return (
  <button className="switch" onClick={handleSwitch}>
    <div className={isActive ? "circle circle-right" : "circle circle-left"}></div>
  </button>
  )
}

export default SwitchOnOff