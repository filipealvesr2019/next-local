import Link from "next/link";
import styles from "./Header.module.css";
import NavBar from './NavBar'
export default function Header(){
    return (
        <>
         <header className={styles.header}>
        <NavBar />
        <div className={styles.navContainer}>
          <nav className={styles.nav}>
            <ul className={styles.ul}>
              <a href="https://imgur.com/eIsbYKG">
                <img
                  src="https://i.imgur.com/eIsbYKG.jpg"
                  title="source: imgur.com"
                  className={styles.img}
                />
              </a>
              <li className={styles.li}>
                <a href="#planos" className={styles.a}>Planos</a>
              </li>
              <li className={styles.li}>
                <a href="#sobre" className={styles.a}>Sobre</a>
              </li>
              <li className={styles.li}>
                <a href="#contato" className={styles.a}>Contato</a>
              </li>
            </ul>
            <ul className={styles.ul}>
            <Link href={'/login'}>
              <li className={styles.li}>
                <button href="#Login" className={styles.button}>
                  Login
                </button>
              </li>
            </Link>
              <li className={styles.li}>
                <button href="#Cadastro" className={styles.button}>
                  Cadastro
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>
        </>
    )
}