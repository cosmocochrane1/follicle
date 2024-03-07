import LucideIcon from "./LucideIcon";

export default function FullSpaceLoading() {
  return (
    <div className="min-h-full min-w-full">
      <div className="absolute inset-0 flex justify-center items-center">
        <LucideIcon
          name="loader-2"
          className="h-14 w-14 animate-spin stroke-primary"
        />
      </div>
    </div>
  );
}
