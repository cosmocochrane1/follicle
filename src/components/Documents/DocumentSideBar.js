import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Chat from "@/components/Chat";

import ThreadsResolvedList from "@/components/Threads/ThreadsResolvedList";
import ThreadsList from "@/components/Threads/ThreadsList";
import { useDocument } from "@/lib/hooks/useDocument";
import Room from "../Room";
import { Skeleton } from "../ui/skeleton";

export default function DocumentSideBar() {
  const { document, isLoading } = useDocument();

  return (
    <>
      <Tabs
        defaultValue="chatroom"
        className="flex-1 mt-0 bg-background overflow-hidden"
      >
        <TabsList
          aria-label="toggle-chat-and-comment"
          className="flex justify-center p-3 border-b bg-background h-[45px]"
        >
          <TabsTrigger value="chatroom" className="px-3 text-sm">
            Chatroom
          </TabsTrigger>
          <TabsTrigger value="comments" className="px-3 text-sm">
            Comments
          </TabsTrigger>
          <TabsTrigger value="resolved" className="px-3 text-sm">
            Resolved
          </TabsTrigger>
        </TabsList>
        <>
          {isLoading ? (
            <div className="px-4">
              {[0, 1, 2, 3].map((n) => (
                <Skeleton className="w-full h-12 my-3" key={n} />
              ))}
            </div>
          ) : (
            <Room
              roomId={document?.id || "fallback"}
              fallback={
                <div className="px-4">
                  {[0, 1, 2, 3].map((n) => (
                    <Skeleton className="w-full h-12 my-3" key={n} />
                  ))}
                </div>
              }
            >
              {() =>
                document ? (
                  <>
                    <TabsContent
                      value="chatroom"
                      className="h-[calc(100vh-115px)] overflow-y-auto mt-0"
                    >
                      <Chat />
                    </TabsContent>

                    <TabsContent
                      value="comments"
                      className="relative h-[calc(100vh-115px)] overflow-y-auto mt-0"
                    >
                      <ThreadsList />
                    </TabsContent>
                    <TabsContent
                      value="resolved"
                      className="relative h-[calc(100vh-115px)] overflow-y-auto mt-0"
                    >
                      <ThreadsResolvedList />
                    </TabsContent>
                  </>
                ) : (
                  <div className="h-screen w-screen flex items-center justify-center">
                    No Document
                  </div>
                )
              }
            </Room>
          )}
        </>
      </Tabs>
    </>
  );
}
