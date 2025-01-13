import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/Redux/Hooks/store";
import { getReceivers, addUser } from "@/service/apiService"; 
import { selectReciver } from "@/Redux/feature/cartSlice";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { AxiosResponse } from "axios";

type Receiver = {
  _id: string;
  name: string;
  email: string;
  mobile: string;
};

type Receivers = Receiver[];

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
    <div className={cn("pb-12 min-h-full flex justify-center w-full", className)}>
      <div className="space-y-4 py-4 h-full">
        <div className="px-3 py-2">
          {/* User Input Form for Email or Mobile */}
          <div className="space-y-2 mb-4 flex gap-2 flex-wrap w-full">
            <input
              type="text"
              placeholder="Enter email or mobile"
              value={emailOrMobile}
              onChange={(e) => setEmailOrMobile(e.target.value)} // Capture user input
              className="p-2 border border-gray-300 rounded"
            />
            <Button
              variant="default"
              onClick={handleAddUser} // Call the function to add user
              disabled={!emailOrMobile || isaddLoading} // Disable if no input is provided
            >
              Add
            </Button>
          </div>
          {isloading && <div className="text-md text-center">Loading...</div>}
          {(receivers?.length === 0 && !isloading) && <div className="text-md text-center">Please add recipients using the search above to proceed with the chat.</div>}

          {/* Display List of Receivers */}
          <div className="space-y-1">
            {receivers?.map((receiver) => (
              <div
                key={receiver?._id}
                className="relative w-full"
                onClick={() => {
                  navigate("/chat");
                  dispatch(selectReciver(receiver));
                }}
              >
                <Button
                  variant="ghost"
                  className={`w-full justify-start flex gap-2 text-[#001F3F] font-semibold border-2 border-solid
                  }`}
                >
                  <span>{receiver?.name}</span>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
