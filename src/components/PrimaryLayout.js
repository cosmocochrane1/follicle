import TopBar from "@/components/TopBar";

export default function PrimaryLayout({ children, sidebar, className }) {
  return (
    <>
      <div
        className={`flex justify-center items-center relative h-screen w-screen ${className}`}
      >
        <aside className="z-1 relative right-0 top-0 max-w-[325px] w-1/3 flex flex-col h-screen bg-background border-r border-foreground/10 overflow-hidden">
          <div className="items-center gap-x-3 px-6 justify-between pt-16" />
          <div className="overflow-y-auto flex-grow py-3 pt-0">{sidebar}</div>
          <div className="flex flex-1"></div>
        </aside>
        <main className="relative flex-1 px-12 w-full flex flex-col h-full justify-start items-center mx-auto overflow-y-auto overflow-x-auto">
          <div className="max-w-5xl w-full">
            <div className="items-center gap-x-3 px-6 justify-between pt-16" />
            <div className="items-center gap-x-3 px-6 justify-between pt-8" />
            {children}
          </div>
        </main>
      </div>
      <TopBar />
    </>
  );
}
