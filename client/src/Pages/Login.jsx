import { useState } from "react";
import { ShipWheelIcon } from "lucide-react";
import { Link } from "react-router";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { login } from "../lib/api";

const Login = () => {
  const [LoginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const {
    mutate: LoginMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: login,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });

  const handleLogin = (e) => {
    e.preventDefault();
    LoginMutation(LoginData);
  };
  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      data-theme="forest"
    >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* left side */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          <div className="mb-4 flex items-center justify-start gap-2">
            <ShipWheelIcon className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              VisionChart
            </span>
          </div>

          {/* Error message if any */}
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error.response?.data?.message || "Login failed"}</span>
            </div>
          )}

          <div className="w-full ">
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold"> Login</h2>
                  <p className="text-sm opacity-70">
                    Join VisionChart and Start your language learning
                    adeventure!
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Email Address</span>
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your Email"
                      className="input input-bordered w-full"
                      value={LoginData.email}
                      onChange={(e) =>
                        setLoginData({
                          ...LoginData,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="Enter Your Password"
                      className="input input-bordered w-full"
                      value={LoginData.password}
                      onChange={(e) =>
                        setLoginData({
                          ...LoginData,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-2">
                      <input
                        type="checkbox"
                        placeholder="Your Password"
                        className="checkbox checkbox-sm"
                        required
                      />
                      <span className="text-xs leading-tight">
                        {" "}
                        I agree to the {""}
                      </span>
                      <span className="text-primary hover:underline">
                        {" "}
                        terms of services
                      </span>{" "}
                      and {""}
                      <span className="text-primary hover:underline">
                        {" "}
                        privacy and policy
                      </span>
                    </label>
                  </div>
                </div>
                <button className="btn btn-primary w-full" type="submit">
                  {isPending ? (
                    <>
                      <span className="loading loading-spinner loading-xs">
                        Loading...
                      </span>
                    </>
                  ) : (
                    "Login"
                  )}
                </button>

                <div className="text-center mt-4">
                  <p className="text-sm">
                    Don't have an account? {""}
                    <Link to="/signup" className="text-primary hover:underline">
                      Sign up
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
        {/* Right side  */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            <div className="relative aspect-square max-w-sm mx-auto">
              <img src="/login.png" alt="img" className="w-full h-full" />
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">
                Connect with language partners worldWide
              </h2>
              <p className="opacity-70">
                Practice Converstion, make friends, and improve your language
                skills togther
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
