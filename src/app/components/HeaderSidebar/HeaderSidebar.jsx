import Link from "next/link";
import styles from "./HeaderSidebar.module.css";

export default function HeaderSidebar() {
  return (
    <div className={styles.HeaderSidebar}>
      <div className={styles.iconContainer}>
      <a>
        <Link href={`/loja`}>
      
            <img
              src="https://i.imgur.com/fZcOI6u.png"
              title="source: imgur.com"
            />
          
        </Link>
        </a>
        <a>
          <img
            src="https://i.imgur.com/wlzh2cl.png"
            title="source: imgur.com"
          />
        </a>{" "}
        <a>
          <img
            src="https://i.imgur.com/5LHLHq2.png"
            title="source: imgur.com"
          />
        </a>
      </div>

      <div></div>
    </div>
  );
}
