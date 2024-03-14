import dynamic from "next/dynamic";
import dynamicIconImports from "lucide-react/dynamicIconImports";

export const LucideIcon = ({ name, ...props }) => {
  const Icon = dynamic(dynamicIconImports[name]);

  return <Icon {...props} />;
};

export default LucideIcon;
