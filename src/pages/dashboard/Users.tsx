import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/Redux/Hooks/store";
import { getReceivers, addUser } from "@/services/apiService"; 
import { selectReciver } from "@/Redux/feature/cartSlice";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { AxiosResponse } from "axios";
import { Receivers } from "@/types";

export function Users({ className }: { className?: string }) {
  const [emailOrMobile, setEmailOrMobile] = useState<string>("");
  const [receivers, setReceivers] = useState<Receivers | undefined>([]);
  const [isloading, setisloading] = useState<boolean>(true)
  const [isaddLoading, setisaddLoading] = useState<boolean>(false)
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const fetchReceivers = async () => {
    setisloading(true)
    try {
      const response = await getReceivers();
      if (response?.data) {
        const data = response.data as { receivers: Receivers };
        setReceivers(data.receivers); // Update the state with fetched receivers
      }
    } catch (error) {
      console.log(error);
    }finally{
      setisloading(false)
    }
  };

  const handleAddUser = async () => {
    const payload = emailOrMobile.includes('@')
      ? { email: emailOrMobile }
      : { mobile: emailOrMobile };
      setisaddLoading(true)
    try {
      const response: AxiosResponse = await addUser(payload);
      if (response?.data) {
        fetchReceivers();
        setEmailOrMobile(""); 
        toast.success(`${response?.data?.message}}`)
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(`${error.response?.data?.message}`);
      } else {
        toast.error("An unexpected error occurred");
      }
    }finally {
      setisaddLoading(false)
    }
  };

  useEffect(() => {
    fetchReceivers();
  }, []);

  return (
    <div className={cn("pb-12 min-h-full flex justify-center w-full bg-gradient-to-br from-slate-50 to-slate-100", className)}>
      <div className="w-full max-w-2xl space-y-6 py-6 px-4">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Contacts</h1>
          <p className="text-slate-600">Add and manage your chat contacts</p>
        </div>

        {/* Add User Form */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Add New Contact</h2>
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Enter email or mobile number"
                value={emailOrMobile}
                onChange={(e) => setEmailOrMobile(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
            <Button
              onClick={handleAddUser}
              disabled={!emailOrMobile || isaddLoading}
              variant="gradient"
              size="pill"
            >
              {isaddLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Add Contact"
              )}
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isloading && (
          <div className="flex justify-center items-center py-12">
            <div className="flex items-center gap-3 text-slate-500">
              <div className="w-5 h-5 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin"></div>
              <span className="text-lg">Loading contacts...</span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {(receivers?.length === 0 && !isloading) && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No contacts yet</h3>
            <p className="text-slate-600 mb-4">Add recipients using the form above to start chatting</p>
          </div>
        )}

        {/* Contacts List */}
        {receivers && receivers.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">Your Contacts</h2>
              <p className="text-sm text-slate-600">{receivers.length} contact{receivers.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="divide-y divide-slate-100">
              {receivers.map((receiver) => (
                <div
                  key={receiver?._id}
                  className="p-4 hover:bg-slate-50 transition-colors cursor-pointer group"
                  onClick={() => {
                    navigate("/chat");
                    dispatch(selectReciver(receiver));
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-lg">
                        {receiver?.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {receiver?.name}
                      </h3>
                      <p className="text-sm text-slate-600 truncate">{receiver?.email}</p>
                      {receiver?.mobile && (
                        <p className="text-xs text-slate-500">{receiver?.mobile}</p>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
