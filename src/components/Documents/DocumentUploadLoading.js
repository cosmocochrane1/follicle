import { Dialog, DialogContent } from "@/components/ui/dialog";
import TextCarouselLoading from "../TextCarouselLoading";

export function DocumentUploadLoading({ onOpenChange, open }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md bg-transparent border-0 shadow-none"
        hideClose={true}
      >
        <TextCarouselLoading />
      </DialogContent>
    </Dialog>
  );
}
