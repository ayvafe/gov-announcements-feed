import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "@shared/utils/cx";
import styles from "./Button.module.css";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leadingIcon?: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  leadingIcon,
  type = "button",
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = cx(styles.button, styles[variant], styles[size], className);

  return (
    // eslint-disable-next-line react/button-has-type
    <button type={type} className={classes} {...rest}>
      {leadingIcon && (
        <span className={styles.icon} aria-hidden="true">
          {leadingIcon}
        </span>
      )}
      {children}
    </button>
  );
}
