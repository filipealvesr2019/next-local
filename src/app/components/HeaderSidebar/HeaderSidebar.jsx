import { Link } from "react-router-dom";
import styles from "./HeaderSidebar.module.css";

export default function HeaderSidebar() {
  return (
    <div className={styles.HeaderSidebar}>
      <div className={styles.iconContainer}>
      <Link to={`/loja`} >
          <a >
            <img
              src="https://i.imgur.com/fZcOI6u.png"
              title="source: imgur.com"
            />
          </a>
          </Link>
            <a >
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
          
          <div>
       
      </div>
    </div>
  );
}