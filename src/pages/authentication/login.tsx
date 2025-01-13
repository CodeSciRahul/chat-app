//Login Page 

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { userLogin } from "@/service/apiService";
import { useAppDispatch } from "@/Redux/Hooks/store";
import { setUserInfo } from "@/Redux/feature/authSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"
import { AxiosError } from "axios";

type loginRes = {
  message: string;
  user: {
    _id: string,
    name: string,
    email: string,
    mobile: string,
    isVerified: boolean,
    googleId: null | string,
    facebookId: null | string,
    linkedinId: null | string,
    createdAt: string,
    updatedAt: string,
  };
  token: string;
};

type LoginFormInputs = {
  email: string;
  password: string;
};

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>();

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await userLogin(data)  as { data: loginRes };
      if(response?.data)
      {
      toast.success(`${response?.data?.message}`);
      dispatch(setUserInfo(response?.data));
      const screenWidth = window.innerWidth;
      if (screenWidth < 768) {
        navigate("/users");
      } else {
        navigate("/chat");
      }      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(`${error.response?.data?.message}`);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center h-screen w-screen p-4",
        className
      )}
      {...props}
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email and password below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="Enter your email"
                  autoComplete="true"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="true"
                  placeholder="Enter your password"
                  {...register("password", { required: "Password is required" }, )}
                />
                {errors.password && (
                  <p className="text-xs text-red-600">{errors.password.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="/signup" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
