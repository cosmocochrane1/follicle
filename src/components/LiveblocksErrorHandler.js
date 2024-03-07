import { useErrorListener } from "@/lib/liveblocks";
import { useRouter } from "next/navigation";

export default ({ children }) => {
  const router = useRouter();
  useErrorListener((error) => {
    switch (error.code) {
      case -1:
        // Authentication error
        router.replace("/");
        break;

      case 4001:
        router.replace("/");
        // Could not connect because you don't have access to this room
        break;

      case 4005:
        router.replace("/");
        // Could not connect because room was full
        break;

      default:
        router.replace("/");
        // Unexpected error
        break;
    }
  });

  return children;
};
