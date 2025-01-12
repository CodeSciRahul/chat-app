//Sign up or register page

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
import { userSignup } from "@/service/apiService";
import toast from "react-hot-toast";
import { AxiosError } from 'axios';

type SignupRes = {
  message: string;
  id: string
};


type SignupFormInputs = {
  name: string;
  email: string;
  mobile: string;
  password: string;
};

export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormInputs>();

  const onSubmit = async (data: SignupFormInputs) => {
    try {
      const response = await userSignup(data) as { data: SignupRes };
      if(response?.data)
      {
      toast.success(`${response?.data?.message}`);
      }
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
          <CardTitle className="text-2xl">Sign up</CardTitle>
          <CardDescription>
            Enter your detail below to create to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              {/* name */}
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  autoComplete="true"
                  placeholder="Enter your Name"
                  {...register("name", {
                    required: "Name is required",
                  })}                  />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>
              {/* email */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="text"
                  autoComplete="true"
                  placeholder="Enter your email"
                  {...register("email", {
                    required: "Email is required",
                  })}                  />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
              {/* mobile */}
              <div className="grid gap-2">
                <Label htmlFor="mobile">Mobile No</Label>
                <Input
                  id="mobile"
                  type="text"
                  autoComplete="true"
                  placeholder="Enter your Mobile No"
                  {...register("mobile", {
                    required: "Mobile is required",
                  })}                  />
                {errors.mobile && (
                  <p className="text-sm text-red-600">{errors?.mobile.message}</p>
                )}
              </div>
              {/* password */}
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="true"
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}                  />
                {errors.password && (
                  <p className="text-xs text-red-600">{errors.password.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Signup"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Have an account?{" "}
              <a href="/login" className="underline underline-offset-4">
                Login
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
