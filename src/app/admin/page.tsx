
import CourseList from "@/components/courses/CourseList";
import CourseModal from "@/components/ux/CourseModal";
import RoomModal from "@/components/ux/RoomModal";



export default function page() {
  return (
    <div className="flex justify-center  md:w-screen flex-col items-center">
<div className="border-2 p-20 mb-10 rounded-md cursor-pointer bg-zinc-100 dark:bg-zinc-900 group-hover:ring-1 ring-zinc-400 dark:ring-zinc-500 relative z-20 transition-all duration-300">
    <h1 className="font-semibold text-2xl text-center " >Bienvenue dans votre espace de travail</h1>
</div>
<div className="flex flex-row flex-wrap my-2"><CourseModal/> <RoomModal/></div>
<div className="">
<CourseList /> 
</div>

    </div>
  )
}
