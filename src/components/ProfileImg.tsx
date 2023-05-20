import Image from "next/image";
import { UserCircleIcon } from "@heroicons/react/24/solid";

export function ProfileImg({
  src,
  className = "",
  ...props
}: {
  src: string | null | undefined;
  className?: string;
}) {
  if (!src)
    return (
      <UserCircleIcon className={`h-12 w-12 text-gray-500 ${className}`} />
    );
  return (
    <Image
      {...props}
      src={src}
      className={`mt-1 h-12 w-12 rounded-full ${className}}`}
      width={50}
      height={50}
      alt="Profile Image"
    />
  );
}
