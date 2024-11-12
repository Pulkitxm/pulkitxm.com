import Image, { StaticImageData } from "next/image";

import hacktoberFest from "@/assets/hacktoberfest.png";
import myImage from "@/assets/me.png";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Header() {
  return (
    <>
      <div className="relative">
        <div className="block">
          <ImageDialog
            src={hacktoberFest}
            className="rounded-lg object-cover"
          />
          <div className="absolute -bottom-20">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-background bg-background">
              <ImageDialog src={myImage} fill={true} className="object-cover" />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-20 pl-5 text-xl font-semibold text-white">Pulkit</div>
    </>
  );
}

function ImageDialog({
  src: image,
  className,
  fill,
}: {
  src: StaticImageData;
  className?: string;
  fill?: boolean;
}) {
  return (
    <Dialog>
      <DialogTrigger>
        <Image
          fill={fill}
          src={image}
          alt="Profile picture"
          className={className}
        />
      </DialogTrigger>
      <DialogContent className="overflow-hidden rounded-2xl p-0">
        <DialogHeader>
          <DialogDescription className="p-0">
            <Image src={image} alt="Profile picture" width={550} />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
