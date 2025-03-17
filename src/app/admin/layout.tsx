import { FloatingSidebar } from "@/components/ux/FloatingSidebar";
import { getUserInfo } from "@/utils/getUserInfo";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}


 
const Layout = async ({ children }: LayoutProps) => {
  const user = await getUserInfo();


  if (!user || user.role !== 'ADMIN') {

     redirect('/')
 
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#252528] h-full ">
      <div className="h-10" />
      <FloatingSidebar />
      <main className="flex justify-center items-center p-2 w-screen px-28">{children}</main>
    </div>
  );
};
export default Layout;