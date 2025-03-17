import { signOut } from "@/app/auth/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUserInfo } from "@/utils/getUserInfo";

import {
  BoltIcon,
  BookOpenIcon,
  ChevronDownIcon,
  Home,
  Layers2Icon,
  LogOut,
  LogOutIcon,
  PinIcon,
  UserPenIcon,
} from "lucide-react";
import Link from "next/link";


export default async function Profile() {
    const user = await getUserInfo();

  return user? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="ring-0  outline-none focus:ring-0 focus:outline-none">

    
            <div className="border-2 rounded-full p-1">
              <Avatar className="border-1">
                <AvatarImage  src={user.avatarUrl || "/um.png"} alt={user.name} />
                <AvatarFallback>  {user.name.charAt(0) || "U"} </AvatarFallback>
              </Avatar>
            </div>
       
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="text-foreground truncate text-sm font-medium">Mr {user.name}</span>
          <span className="text-muted-foreground truncate text-xs font-normal">
          {user.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link href={"admin/schedule"} className="flex flex-row gap-x-2">
              <Layers2Icon size={16} className="opacity-60" aria-hidden="true" />
              <span>Planning</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Home size={16} className="opacity-60" aria-hidden="true" />
            <span>Salle</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
          <Link href={"admin/location"} className="flex flex-row gap-x-2">
            <PinIcon size={16} className="opacity-60" aria-hidden="true" />
            <span>Localisation</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>


          <Link href={"admin/parametres"} className="flex flex-row gap-x-2">
          <UserPenIcon size={16} className="opacity-60" aria-hidden="true" />
            <span> Profile </span>
            </Link>
      
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
         
          
          <form action={signOut}>

              <button type="submit" className="flex flex-row justify-center gap-x-2"
              >          <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
                 <span>Logout</span>
              </button>
            </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Link
      href="/login"
      className="py-2 px-3 flex rounded-md border-1 no-underline bg-btn-background hover:bg-btn-background-hover"
    >
      Login
    </Link>
  );
}
