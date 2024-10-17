import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import config from "@/config";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import { SideNav } from "@/components/SideNav";
// This is a server-side component to ensure the user is logged in.
// If not, it will redirect to the login page.
// It's applied to all subpages of /dashboard in /app/dashboard/*** pages
// You can also add custom static UI elements like a Navbar, Sidebar, Footer, etc..
// See https://shipfa.st/docs/tutorials/private-page
export default async function LayoutPrivate({ children }) {
  // const session = await getServerSession(authOptions);
  // if (!session) {
  //   redirect(config.auth.loginUrl);
  // }
  // await connectMongo();
  // console.log(session);
  // const user = await User.findById(session?.user?.id);

  // // if (!user.hasAccess) {
  // //   redirect("/no-purchase");
  // // }
  // const userHasAccess = user?.hasAccess || false;

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <SideNav />
      </div>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}
