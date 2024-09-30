import Image from "next/image";
import styles from "./page.module.css";
import HomePage from "./Home/Home";

export default function Home() {
  return (
    <div className={styles.page}>
    <HomePage />
    </div>
  );
}
