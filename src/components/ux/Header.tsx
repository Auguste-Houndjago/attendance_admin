

import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import Profile from "../NavBar/Profile";



export default function Header() {
  return (


        <div className="w-full px-8 max-w-4xl md:max-w-full flex justify-between items-center p-3 text-sm   border-b border-b-foreground/10 h-16">
          
        <Link
      className="py-2 px-3 flex rounded-md no-underline hover:bg-btn-background-hover border"
      href="/">
    Attendance
    </Link>


   <div className="flex flex-row justify-center items-center gap-x-4">

 
   
   <ModeToggle/>
   <Profile/>
   </div>

     
        </div>


 

  )
}
