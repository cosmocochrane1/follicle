import LucideIcon from "./LucideIcon";

export default function FullPageLoading() {
  return (
    <div className="bg-background min-h-screen min-w-screen">
      <div className="absolute inset-0 flex justify-center items-center bg-background">
        <LucideIcon name="loader-2" className="h-14 w-14 animate-spin stroke-primary" />
      </div>
    </div>
  );
}