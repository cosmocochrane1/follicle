import dynamic from "next/dynamic";
import dynamicIconImports from "lucide-react/dynamicIconImports";

export const LucideIcon = ({ name, size = 18, ...props }) => {
  const Icon = dynamic(dynamicIconImports[name]);

  return <Icon size={size} {...props} />;
};

export default LucideIcon;
