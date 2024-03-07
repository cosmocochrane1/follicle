import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function EmptyStateCard({
  className,
  children,
  title,
  actions,
  ...props
}) {
  return (
    <Card className={cn("max-w-2xl", className)} {...props}>
      <CardHeader>
        <CardTitle className="text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center flex items-center justify-center">
        {children}
      </CardContent>
      {actions && actions.length > 0 && (
        <CardFooter className="flex items-center justify-center">
          {actions}
        </CardFooter>
      )}
    </Card>
  );
}
