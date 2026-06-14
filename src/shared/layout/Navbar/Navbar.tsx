import { NavLink } from "react-router-dom";
import { cx } from "@shared/utils/cx";
import { BookmarkCount } from "@features/bookmarks/components/BookmarkCount/BookmarkCount";
import styles from "./Navbar.module.css";

export function Navbar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cx(styles.link, isActive && styles.active);

  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <NavLink to="/announcements" className={styles.brand}>
          <span className={styles.brandMark} aria-hidden="true">
            📢
          </span>
          <span>Gov Announcements</span>
        </NavLink>

        <nav className={styles.nav} aria-label="Primary">
          <NavLink to="/announcements" className={linkClass}>
            Feed
          </NavLink>
          <NavLink to="/bookmarks" className={linkClass}>
            Bookmarks
            <BookmarkCount />
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
