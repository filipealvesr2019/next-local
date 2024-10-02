import { useEffect, useRef, useState } from "react";
import styles from "./NavbarMockup.module.css";
import SearchBarMobile from "../SearchBar/SearchBarMobile";
export default function Navbar() {
  const [openCartModal, setOpenCartModal] = useState(false);
  const modalRef = useRef(null);

  const handleClickOpenModal = () => {
    setOpenCartModal(true);
  };

  const handleClickCloseModal = () => {
    setOpenCartModal(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        openCartModal
      ) {
        setOpenCartModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openCartModal]);
  return (
    <div className={styles.cartModalContainer}>
      <a onClick={handleClickOpenModal}>
        <img
          src="https://i.imgur.com/n05IYkV.png"
          title="source: imgur.com"
          style={{ width: "2.5rem" }}
        />
      </a>{" "}
      {openCartModal && (
        <div className={styles.cartModal}>
          <div ref={modalRef} className={styles.cartModalContent}>
            <span className={styles.cartClose} onClick={handleClickCloseModal}>
              X
            </span>

            <span>option 1</span>
            <span>option 2</span>
            <span>option 2</span>
            <SearchBarMobile />
          </div>
        </div>
      )}
    </div>
  );
}
