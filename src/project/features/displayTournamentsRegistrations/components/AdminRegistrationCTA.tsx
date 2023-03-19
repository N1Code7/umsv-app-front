import { MouseEvent } from "react";

interface IProps {
  handleModify: (e: MouseEvent<HTMLButtonElement>) => void;
  handleValidate: (e: MouseEvent<HTMLButtonElement>) => void;
  handleCancel: (e: MouseEvent<HTMLButtonElement>) => void;
  handleRemove: (e: MouseEvent<HTMLButtonElement>) => void;
}

const AdminRegistrationCTA = ({
  handleModify,
  handleValidate,
  handleCancel,
  handleRemove,
}: IProps) => {
  return (
    <div className="cta-container">
      <button onClick={handleModify}>✏️</button>
      <button onClick={handleValidate}>✅</button>
      <button onClick={handleCancel}>↩️</button>
      <button onClick={handleRemove}>🗑️</button>
    </div>
  );
};

export default AdminRegistrationCTA;
