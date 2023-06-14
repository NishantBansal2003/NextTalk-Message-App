import React, { useContext, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";

import { UserContext } from "./UserContext.jsx";
import NextTalkLogo from "./NextTalkLogo.png";
export default function RegisterAndLoginForm() {
  const [username, setUsername] = useState("");
  const [inputType, setinputType] = useState("password");
  const [password, setPassword] = useState("");
  const [isLoginOrRegister, setIsLoginOrRegister] = useState("login");
  const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);
  async function handleSubmit(ev) {
    ev.preventDefault();
    const url = isLoginOrRegister === "register" ? "register" : "login";
    const { data } = await axios.post(url, { username, password });
    setLoggedInUsername(username);
    setId(data.id);
  }
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <form
        className="max-w-screen-xl m-0 sm:m-20 bg-white shadow sm:rounded-lg flex justify-center flex-1"
        onSubmit={handleSubmit}
      >
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div>
            <img src={NextTalkLogo} className="w-32 mx-auto" alt="Logo" />
          </div>
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">
              {isLoginOrRegister === "register" ? "Sign up " : "Log In "} for
              NextTalk
            </h1>
            <div className="w-full flex-1 mt-8">
              <div className="mx-auto max-w-xs">
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  value={username}
                  onChange={(ev) => setUsername(ev.target.value)}
                  type="text"
                  placeholder="Username"
                />
                <div className="flex items-center">
                  <input
                    className="w-full px-8 py-4 rounded-tl-lg rounded-bl-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                    value={password}
                    onChange={(ev) => setPassword(ev.target.value)}
                    type={inputType}
                    placeholder="Password"
                  />

                  <button
                    className="p-4 rounded-br-lg rounded-tr-lg font-medium bg-gray-200 border border-gray-200 placeholder-gray-500 text-sm  mt-5"
                    onClick={(e) => {
                      if (inputType == "password") setinputType("text");
                      else setinputType("password");
                      e.preventDefault();
                    }}
                  >
                    {inputType === "password" ? (
                      <FontAwesomeIcon icon={faEyeSlash} />
                    ) : (
                      <FontAwesomeIcon icon={faEye} />
                    )}
                  </button>
                </div>
                <button className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                  {isLoginOrRegister === "register" ? (
                    <svg
                      fill="none"
                      className="w-6 h-6 -ml-2"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                    </svg>
                  ) : (
                    <svg
                      fill="none"
                      className="w-6 h-6 -ml-2"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  )}

                  <span className="ml-3">
                    {isLoginOrRegister === "register" ? "Sign Up" : "Log In"}
                  </span>
                </button>
                <div class="mt-4 text-sm font-display font-semibold text-gray-700 text-center">
                  {isLoginOrRegister === "register"
                    ? " Already a Member ?"
                    : "Don't have an account ?"}
                  <a
                    class="cursor-pointer text-indigo-600 hover:text-indigo-800 ml-1"
                    onClick={() => {
                      if (isLoginOrRegister === "login")
                        setIsLoginOrRegister("register");
                      else setIsLoginOrRegister("login");
                    }}
                  >
                    {isLoginOrRegister === "register" ? " Sign In" : " Sign up"}
                  </a>
                </div>
                <p className="mt-2 text-xs text-gray-600 text-center">
                  I agree to abide by NextTalk
                  <a
                    href="#"
                    className="border-b border-gray-500 border-dotted ml-1 mr-1"
                  >
                    Terms of Service
                  </a>
                  and its
                  <a
                    href="#"
                    className="border-b border-gray-500 border-dotted ml-1 "
                  >
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
        {isLoginOrRegister === "register" ? (
          <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
            <div
              className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
              style={{
                backgroundImage:
                  'url("https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg")',
              }}
            />
          </div>
        ) : (
          <div class="hidden lg:flex items-center justify-center bg-indigo-100 flex-1 ">
            <div class="max-w-xs transform duration-200 hover:scale-110 cursor-pointer">
              <svg
                class="w-full mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                id="f080dbb7-9b2b-439b-a118-60b91c514f72"
                data-name="Layer 1"
                viewBox="0 0 528.71721 699.76785"
              >
                <title>Login</title>
                <rect y="17.06342" width="444" height="657" fill="#535461" />
                <polygon
                  points="323 691.063 0 674.063 0 17.063 323 0.063 323 691.063"
                  fill="#7f9cf5"
                />
                <circle cx="296" cy="377.06342" r="4" fill="#535461" />
                <polygon
                  points="296 377.66 298.773 382.463 301.545 387.265 296 387.265 290.455 387.265 293.227 382.463 296 377.66"
                  fill="#535461"
                />
                <polygon
                  points="337 691.063 317.217 691 318 0.063 337 0.063 337 691.063"
                  fill="#7f9cf5"
                />
                <g opacity="0.1">
                  <polygon
                    points="337.217 691 317.217 691 318.217 0 337.217 0 337.217 691"
                    fill="#fff"
                  />
                </g>
                <circle cx="296" cy="348.06342" r="13" opacity="0.1" />
                <circle cx="296" cy="346.06342" r="13" fill="#535461" />
                <line
                  x1="52.81943"
                  y1="16.10799"
                  x2="52.81943"
                  y2="677.15616"
                  fill="none"
                  stroke="#000"
                  stroke-miterlimit="10"
                  stroke-width="2"
                  opacity="0.1"
                />
                <line
                  x1="109.81943"
                  y1="12.10799"
                  x2="109.81943"
                  y2="679.15616"
                  fill="none"
                  stroke="#000"
                  stroke-miterlimit="10"
                  stroke-width="2"
                  opacity="0.1"
                />
                <line
                  x1="166.81943"
                  y1="9.10799"
                  x2="166.81943"
                  y2="683"
                  fill="none"
                  stroke="#000"
                  stroke-miterlimit="10"
                  stroke-width="2"
                  opacity="0.1"
                />
                <line
                  x1="223.81943"
                  y1="6.10799"
                  x2="223.81943"
                  y2="687.15616"
                  fill="none"
                  stroke="#000"
                  stroke-miterlimit="10"
                  stroke-width="2"
                  opacity="0.1"
                />
                <line
                  x1="280.81943"
                  y1="3.10799"
                  x2="280.81943"
                  y2="688"
                  fill="none"
                  stroke="#000"
                  stroke-miterlimit="10"
                  stroke-width="2"
                  opacity="0.1"
                />
                <ellipse
                  cx="463.21721"
                  cy="95.32341"
                  rx="39.5"
                  ry="37"
                  fill="#2f2e41"
                />
                <path
                  d="M683.8586,425.93948l-10,14s-48,10-30,25,44-14,44-14l14-18Z"
                  transform="translate(-335.6414 -100.11607)"
                  fill="#ffb8b8"
                />
                <path
                  d="M735.8586,266.93948s-13,0-16,18-6,78-6,78-42,55-35,62,15,20,20,18,48-61,48-61Z"
                  transform="translate(-335.6414 -100.11607)"
                  fill="#7f9cf5"
                />
                <path
                  d="M735.8586,266.93948s-13,0-16,18-6,78-6,78-42,55-35,62,15,20,20,18,48-61,48-61Z"
                  transform="translate(-335.6414 -100.11607)"
                  opacity="0.1"
                />
                <path
                  d="M775.8586,215.93948s-1,39-13,41-8,15-8,15,39,23,65,0l5-12s-18-13-10-31Z"
                  transform="translate(-335.6414 -100.11607)"
                  fill="#ffb8b8"
                />
                <path
                  d="M708.8586,455.93948s-59,110-37,144,55,104,60,104,33-14,31-23-32-76-40-82-4-22-3-23,34-54,34-54-1,84,3,97-1,106,4,110,28,11,32,5,16-97,8-118l15-144Z"
                  transform="translate(-335.6414 -100.11607)"
                  fill="#2f2e41"
                />
                <path
                  d="M762.8586,722.93948l-25,46s-36,26-11,30,40-6,40-6l22-16v-46Z"
                  transform="translate(-335.6414 -100.11607)"
                  fill="#2f2e41"
                />
                <path
                  d="M728.8586,696.93948l13,31s5,13,0,16-19,21-10,23a29.29979,29.29979,0,0,0,5.49538.5463,55.56592,55.56592,0,0,0,40.39768-16.43936l8.10694-8.10694s-27.77007-63.94827-27.385-63.47414S728.8586,696.93948,728.8586,696.93948Z"
                  transform="translate(-335.6414 -100.11607)"
                  fill="#2f2e41"
                />
                <circle cx="465.21721" cy="105.82341" r="34" fill="#ffb8b8" />
                <path
                  d="M820.3586,253.43948l-10.5,10.5s-32,12-47,0c0,0,5.5-11.5,5.5-10.5s-43.5,7.5-47.5,25.5,3,49,3,49-28,132-17,135,114,28,113,9,8-97,8-97l35-67s-5-22-17-29S820.3586,253.43948,820.3586,253.43948Z"
                  transform="translate(-335.6414 -100.11607)"
                  fill="#7f9cf5"
                />
                <path
                  d="M775.8586,448.93948l-13,8s-50,34-24,40,41-24,41-24l10-12Z"
                  transform="translate(-335.6414 -100.11607)"
                  fill="#ffb8b8"
                />
                <path
                  d="M849.8586,301.93948l9,9s6,84-6,101-67,63-70,60-22-18-18-20,57.18287-57.56942,57.18287-57.56942l-4.18287-77.43058Z"
                  transform="translate(-335.6414 -100.11607)"
                  opacity="0.1"
                />
                <path
                  d="M853.8586,298.93948l9,9s6,84-6,101-67,63-70,60-22-18-18-20,57.18287-57.56942,57.18287-57.56942l-4.18287-77.43058Z"
                  transform="translate(-335.6414 -100.11607)"
                  fill="#7f9cf5"
                />
                <path
                  d="M786.797,157.64461s-11.5575-4.20273-27.31774,4.72807l8.40546,2.10136s-12.60819,1.05068-14.18421,17.8616h5.77875s-3.67739,14.70955,0,18.91228l2.364-4.4654,6.82943,13.65887,1.576-6.82944,3.15205,1.05069,2.10137-11.03217s5.25341,7.88012,9.45614,8.40546V195.2065s11.5575,13.13352,15.23489,12.60818l-5.25341-7.35477,7.35477,1.576-3.152-5.25341,18.91228,5.25341-4.20273-5.25341,13.13352,4.20273,6.3041,2.6267s8.9308-20.4883-3.67739-34.67251S798.61712,151.60318,786.797,157.64461Z"
                  transform="translate(-335.6414 -100.11607)"
                  fill="#2f2e41"
                />
              </svg>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
