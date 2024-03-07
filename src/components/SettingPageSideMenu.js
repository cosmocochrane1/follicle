import LucideIcon from "@/components/LucideIcon";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/router";

const menus = [
  {
    link: "/settings/account",
    label: "Account",
    icon: "pencil",
  },
  {
    link: "/settings/team",
    label: "Team",
    icon: "users",
  },
];

const SettingPageSideMenu = () => {
  const router = useRouter();

  return (
    <>
      <h4 className="px-6 py-4 pb-2 border-b border-card/10 text-sm font-medium">
        Settings
      </h4>
      {menus.map((menu) => (
        <Link
          key={`setting_menu_${menu.label}`}
          href={menu.link}
          className={cn(
            "flex items-center px-6 py-3 hover:bg-foreground/20 text-sm",
            {
              "bg-foreground/10": menu.link === router.pathname,
            }
          )}
        >
          <LucideIcon name={menu.icon} className="h-4 w-4 mr-3" />
          <span className="capitalize">{menu.label}</span>
        </Link>
      ))}
    </>
  );
};

export default SettingPageSideMenu;
