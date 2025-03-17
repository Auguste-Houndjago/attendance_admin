
import CourseList from "@/components/courses/CourseList";
import CourseModal from "@/components/ux/CourseModal";
import RoomModal from "@/components/ux/RoomModal";



export default function page() {
  return (
    <div className="flex justify-center flex-col items-center">

<div className="flex flex-row flex-wrap my-2"><CourseModal/> <RoomModal/></div>
<div className="">
<CourseList /> 
</div>

    </div>
  )
}
