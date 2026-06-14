import { Badge } from "@components/Badge/Badge";
import styles from "./UrgentTag.module.css";

export function UrgentTag() {
  return (
    <Badge className={styles.urgent}>
      <span aria-hidden="true">●</span> Urgent
    </Badge>
  );
}
