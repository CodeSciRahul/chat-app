import { Separator } from "@/components/ui/separator";
import { Sidebar } from "@/components/sidebar";
import { Outlet } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import FallbackUI from "@/components/fallbackUI";

export default function Dashboard() {

  return (
    <>
    <ErrorBoundary FallbackComponent={FallbackUI}>
     <div className="h-screen overflow-hidden flex flex-col">

        <Separator orientation="horizontal" className="w-full" />

        <div className="flex flex-1 bg-background mb-12">
          <Sidebar className="hidden sm:block h-full w-[30%]" />
          <Separator orientation="vertical" className="h-[100vh]" />
          <div className="flex-grow w-full bg-slate-200">
            <Outlet />
          </div>
        </div>
      </div>
    </ErrorBoundary>
    </>
  );
}
