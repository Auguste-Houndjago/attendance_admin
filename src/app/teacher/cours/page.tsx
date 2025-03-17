import { TeacherScheduleList } from '@/components/Teacher/TeacherScheduleList';
import { getUserInfo } from '@/utils/getUserInfo';
const Page = async () => {
    const user = await getUserInfo()

    const teacherId = user?.userPId
    return (
        <div>
            <TeacherScheduleList teacherId={teacherId} />
        </div>
    );
}

export default Page;
