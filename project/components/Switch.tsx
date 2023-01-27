import { Dispatch, MouseEvent, SetStateAction, useState } from "react";

interface ISwitchProps {
  customName?: string;
  isActive?: boolean;
  setIsActive?: Dispatch<SetStateAction<boolean>>;
}

/**
 * Display a customizable switch component.
 * @param custom name of customization which correspond to class name
 */
const Switch = ({ customName, isActive, setIsActive }: ISwitchProps) => {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsActive?.((prev) => !prev);
  };

  return (
    <button
      className={isActive ? `switch switch-${customName} active` : `switch switch-${customName}`}
      onClick={handleClick}
    >
      <div className={`switch-circle switch-circle-${customName}`}></div>
    </button>
  );
};

export default Switch;
