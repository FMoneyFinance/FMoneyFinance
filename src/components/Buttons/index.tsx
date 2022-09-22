import React from "react";
import "./styles.scss";

function Button({
  text,
  className,
  onPress,
  secondary,
  rounded,
  iconRight,
  iconLeft
}: any) {
  return (
    <div
      className={`button ${className} secondary-button-${secondary} rounder-${true}`}
      onClick={onPress}
    >
      {iconLeft && (
        <span className="icon iconLeft">
          <img src={iconLeft} />
        </span>
      )}
      <span className="text">{text}</span>

      {iconRight && (
        <span className="icon iconRight">
          <img src={iconRight} />
        </span>
      )}
    </div>
  );
}

export default Button;
