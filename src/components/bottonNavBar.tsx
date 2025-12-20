import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/Redux/Hooks/store";
import { removeUserInfo } from "@/Redux/feature/authSlice";

export const BottomNavbar = ({ className }: { className: string }) => {
  const [activeState, setActiveState] = useState<string>("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Array of menu options
  const menuOptions = [
    { id: "", label: "Menu" },
    { id: "order", label: "Order" },
  ];

  return (
    <>
      <div className={cn("", className)}>
        <div className="fixed bottom-0 w-[77%] bg-white border-t border-slate-200 shadow-lg">
          <div className="px-4 py-2">
            <div className="flex items-center justify-between">
              {menuOptions.map((item) => (
                <div
                  key={item.id}
                  className="relative flex-1"
                  onClick={() => {
                    navigate(`/${item?.id}`);
                    setActiveState(item.id);
                  }}
                >
                  <Button
                    variant="ghostStrong"
                    className={`w-full flex flex-col items-center gap-1 py-3 px-2 transition-all duration-200 ${
                      activeState === item.id
                        ? "text-blue-600 bg-blue-50"
                        : "text-slate-600 hover:text-slate-800 hover:bg-slate-50"
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      activeState === item.id
                        ? "bg-blue-100"
                        : "bg-slate-100"
                    }`}>
                      <span className="text-sm">
                        {item.id === "" ? "🏠" : "📋"}
                      </span>
                    </div>
                    <span className="text-xs font-medium">{item.label}</span>
                  </Button>
                  {/* Active indicator */}
                  {activeState === item.id && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-500 rounded-t-full"></div>
                  )}
                </div>
              ))}

              <div
                className="relative flex-1"
                onClick={() => {
                  dispatch(removeUserInfo());
                  window.location.href = "/login";
                }}
              >
                <Button
                  variant="dangerGhost"
                  className="w-full flex flex-col items-center gap-1 py-3 px-2"
                >
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                    <span className="text-sm">🚪</span>
                  </div>
                  <span className="text-xs font-medium">Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
