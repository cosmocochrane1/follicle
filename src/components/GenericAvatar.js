import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";

function generateAvatarURL(email) {
  return `https://source.boringavatars.com/bauhaus/120/${email}`;
}

export function GenericAvatar({ src, email, name, className }) {
  const fallbackAvatar = generateAvatarURL(email || name || "fallback");

  return (
    <Avatar className={cn("h-8 w-8 aspect-square", className)}>
      <AvatarImage src={src} />
      <AvatarFallback>
        <Image
          className="fill-white text-foreground object-cover"
          fill
          objectFit="contain"
          alt="User Menu"
          unoptimized={true}
          draggable
          onDragStart={(e) => e.preventDefault()}
          src={fallbackAvatar}
        />
      </AvatarFallback>
    </Avatar>
  );
}
