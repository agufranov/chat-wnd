import type React from "react";
import style from "./ScrollDownButton.module.css";
import Chevron from "./assets/chevron.svg";

type ScrollDownButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  unreadCount: number;
};

export const ScrollDownButton: React.FC<ScrollDownButtonProps> = ({
  unreadCount,
  ...rest
}) => {
  return (
    <button {...rest} className={`${style.root} ${rest.className}`}>
      {unreadCount !== 0 && <div className={style.badge}>{unreadCount}</div>}
      <Chevron className={style.icon} />
    </button>
  );
};
