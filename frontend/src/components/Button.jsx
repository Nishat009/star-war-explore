import React from "react";

const Button = React.forwardRef(({ children, className = "", ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={` ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
