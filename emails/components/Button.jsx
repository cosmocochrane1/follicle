import { Link } from "jsx-email";

const variants = {
  default:
    "bg-primary !text-primary-foreground hover:bg-primary/90 border-none",
  destructive:
    "bg-destructive !text-destructive-foreground hover:bg-destructive/90",
  outline:
    "border border-input bg-background hover:bg-accent hover:!text-accent-foreground",
  secondary: "bg-background !text-background-foreground hover:bg-background/80",
  ghost: "hover:bg-accent hover:!text-accent-foreground",
  link: "!text-foreground underline-offset-4 hover:underline",
};

const sizes = {
  default: "py-2 px-4 rounded-lg",
  sm: "py-3 px-3 rounded-lg",
  lg: "py-4 px-8 rounded-lg",
  icon: "py-3 px-10",
};

const initial =
  "inline-flex rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

export const buttonVariant = ({
  variant = "default",
  size = "default",
  className: classNameFromProps,
}) => {
  const className = `${initial} ${variants[variant]} ${sizes[size]} text-decoration-none ${classNameFromProps}`;

  return className;
};

const Button = ({
  className: classNameFromProps,
  variant = "default",
  size = "default",
  href = null,
  ...props
}) => {
  const className = `${initial} ${variants[variant]} ${sizes[size]} text-decoration-none ${classNameFromProps}`;

  if (href) {
    return <Link className={className} href={href} {...props} />;
  }

  return <button className={className} {...props} />;
};

export default Button;
