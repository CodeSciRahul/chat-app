import { useEffect, useState} from "react";
import correct from "@/assets/correct.png";
import failed from "@/assets/delete.png"
import { useNavigate } from "react-router-dom";
import Confetti from 'react-confetti';
import { verifyUser } from "@/service/apiService";
import { useSearchParams } from "react-router-dom";


export const VerifyUserByEmailLink = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isLoading, setisLoading] = useState<boolean>(false)
  const [isverified, setisverified] = useState<boolean | null>(null);
  const [message, setmessage] = useState<string>("");

  const token: string | null = searchParams.get('token'); 
  useEffect(() => {
    const verifyUserHandler = async () => {
        setisLoading(true)
      try {
        const response: any = await verifyUser(token);
        console.log(response);
        if (response?.error) {
          setisverified(false);
          setmessage(response?.error?.message);
        } else if (response?.data) {
          setisverified(true);
          setmessage(response?.data?.message);
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        }
      } catch (err: any) {
        setisverified(false);
        console.log(err);
        setmessage(`${err?.response?.data?.message}`);
      } finally {
        setisLoading(false)
      }
    };

    verifyUserHandler();
  }, [token, verifyUser, navigate]);

  return (
    <>
      {isLoading && <p className="text-center"> Loading...</p>}
      <div className="fixed inset-0 flex justify-center items-center flex-col bg-black bg-opacity-50 z-20">
        {isverified !== null && (
          <img
            className="w-[120px] animate-pulse"
            src={isverified ? correct : failed}
            alt={isverified ? "Verified" : "Failed"}
          />
        )}

        <div
          className={`mt-10 text-2xl ${
            isverified === true ? "text-green-800" : "text-red-800"
          }`}
        >
          {message}
        </div>

        {isverified && (
            <Confetti 
            width={window.innerWidth}
            height={window.innerHeight} 
            recycle={true}
            />)}
      </div>
    </>
  );
};
