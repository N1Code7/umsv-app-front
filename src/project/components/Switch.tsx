import { Dispatch, MouseEvent, SetStateAction, useState } from "react";

interface ISwitchProps {
  customName?: string;
  isActive?: boolean;
  setIsActive?: Dispatch<SetStateAction<boolean>>;
  clickAction?: (e: MouseEvent<HTMLButtonElement>) => void;
}

/**
 * Display a customizable switch component.
 * @param {ISwitchProps} param0
 * @param param0.customName name of customization which correspond to class name
 * @param param0.clickAction function to link to the switch
 * @param param0.isActive active state
 * @param param0.setIsActive set the active state
 */
const Switch = ({ customName, isActive, setIsActive, clickAction }: ISwitchProps) => {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsActive?.((prev) => !prev);
  };

  return (
    <button
      className={isActive ? `switch switch-${customName} active` : `switch switch-${customName}`}
      onClick={clickAction || handleClick}
    >
      <div className={`switch-circle switch-circle-${customName}`}></div>
    </button>
  );
};

export default Switch;
