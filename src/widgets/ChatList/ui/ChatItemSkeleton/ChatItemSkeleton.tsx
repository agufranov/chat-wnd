import type React from "react";
import style from "./ChatItemSkeleton.module.css";

export const ChatItemSkeleton: React.FC = () => {
  return (
    <div className={style.root}>
      <div className={style.avatar} />
      <div className={style.text}>
        <div className={style.chatName} />
        <div className={style.lastMessage} />
      </div>
    </div>
  );
};
