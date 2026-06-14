import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Spinner } from "@components/Spinner/Spinner";
import { Navbar } from "@shared/layout/Navbar/Navbar";
import styles from "./Layout.module.css";

/**
 * App shell shared by every route: persistent navbar + a centered content column.
 * The `<Suspense>` boundary provides the fallback while lazily-loaded
 */
export function Layout() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.content}>
          <Suspense
            fallback={
              <div className={styles.routeFallback}>
                <Spinner label="Loading page…" size={32} />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </div>
      </main>
    </>
  );
}
