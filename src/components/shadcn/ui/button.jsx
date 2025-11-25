import * as React from "react";
import { buttonClasses } from "./button-classes.js";

export const Button = React.forwardRef(
  ({ className, variant = "default", size = "md", ...props }, ref) => (
    <button ref={ref} className={buttonClasses({ variant, size, className })} {...props} />
  )
);
Button.displayName = "Button";
