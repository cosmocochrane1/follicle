import DocumentTopBar from "./Documents/DocumentTopBar";

export default function DocumentLayout({ children, sidebar, className }) {
  return (
    <>
      <div
        className={`flex justify-center items-center relative h-screen w-screen ${className}`}
      >
        <aside className="z-1 relative right-0 top-0 max-w-[325px] w-1/3 flex flex-col h-screen bg-background border-r border-foreground/10 overflow-hidden">
          <div className="items-center gap-x-3 px-6 justify-between pt-16" />
          <div className="flex-grow py-3 pt-0">{sidebar}</div>
        </aside>
        <main className="relative flex-1 w-full h-full justify-start items-center mx-auto overflow-hidden">
          <div className=" w-full ">
            <div className="items-center gap-x-3 px-6 justify-between pt-16" />
            <div className="items-center gap-x-3 px-6 justify-between pt-8" />
            {children}
          </div>
        </main>
      </div>
      <DocumentTopBar />
    </>
  );
}
