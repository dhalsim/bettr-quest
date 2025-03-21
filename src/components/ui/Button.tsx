
// This is an alias file to ensure backward compatibility with existing imports
// All functionality is now in the lowercase button.tsx file
import { Button as ButtonComponent, ButtonProps, buttonVariants } from "./button";

export type { ButtonProps };
export { buttonVariants };

// Default export for backward compatibility
export default ButtonComponent;
