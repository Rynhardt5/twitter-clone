import { useSession, signIn, signOut } from "next-auth/react";
import {
  HomeIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { IconHoverEffect } from "./IconHoverEffect";

export function SideNav() {
  const session = useSession();
  const user = session.data?.user;
  return (
    <nav className="sticky top-0 px-2 py-4">
      <ul className="flex flex-col items-center gap-2 whitespace-nowrap">
        <li>
          <Link href="/">
            <IconHoverEffect>
              <HomeIcon className="h-8 w-8" />
            </IconHoverEffect>
          </Link>
        </li>
        {user && (
          <li>
            <Link href={`/profiles/${user.id}`}>
              <IconHoverEffect>
                <UserCircleIcon className="h-8 w-8" />
              </IconHoverEffect>
            </Link>
          </li>
        )}
        {!user ? (
          <li>
            <button onClick={() => void signIn()}>
              <IconHoverEffect>
                <ArrowLeftOnRectangleIcon className="h-8 w-8 text-green-700" />
              </IconHoverEffect>
            </button>
          </li>
        ) : (
          <li>
            <button onClick={() => void signOut()}>
              <IconHoverEffect>
                <ArrowRightOnRectangleIcon className="h-8 w-8 text-red-700" />
              </IconHoverEffect>
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
