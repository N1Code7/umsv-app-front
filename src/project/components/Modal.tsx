import { Dispatch, MouseEvent, ReactNode, SetStateAction, useEffect } from "react";

interface IModalProps {
  isModalActive: boolean;
  children: ReactNode;
  setIsModalActive: Dispatch<SetStateAction<boolean>>;
}

const Modal = ({ isModalActive, setIsModalActive, children }: IModalProps) => {
  const handleCloseModal = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsModalActive(false);
  };

  useEffect(() => {
    isModalActive &&
      document.body.querySelector(".modal-backdrop")?.addEventListener("click", () => {
        setIsModalActive(false);
      });
  }, [isModalActive, setIsModalActive]);

  return (
    <>
      <div className="modal-backdrop"></div>
      <div className="modal">
        <button className="close-btn" onClick={handleCloseModal}>
          <i className="fa-solid fa-xmark"></i>
        </button>
        <>{children}</>
      </div>
    </>
  );
};

export default Modal;
