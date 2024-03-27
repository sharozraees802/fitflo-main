import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import LogoDark from '../../images/logo/logo.png';
import Logo from '../../images/logo/logo.png';
import logingymimg from '../../../src/images/gymimages/GYM-Management-System2.jpg';
import { token } from '../UiElements/host';
import {
  auth,
  signInWithEmailAndPassword,
} from '../../firestoreConfig/firestore';
import { useState } from 'react';

interface loginModel {
  email: string;
  password: string;
}

const SignIn = () => {
  const [form, setForm] = useState({} as loginModel);
  const [isEmailValidation, setIsEmailValidation] = useState('');
  const [isPasswordValidation, setIsPasswordValidation] = useState('');
  const navigate = useNavigate();
  const handleForm = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      if (!form.email) {
        setIsEmailValidation('Email is required');
      }
      if (!form.password) {
        setIsPasswordValidation('Password is required');
      }
      console.log('Please fill in all required fields');
      return;
    }

    signInWithEmailAndPassword(auth, form.email, form.password)
      .then(async (userCredential) => {
        // // Signed in
        const user = userCredential.user;
        const idToken = await user.getIdToken();

        // Parse the ID token payload to get the expiration duration
        const decodedToken = jwtDecode(idToken);
        if (decodedToken.exp && decodedToken.iat) {
          const expiresIn = decodedToken.exp - decodedToken.iat; // Expiration duration in seconds

          // Calculate expiration time by adding the expiration duration to the current time
          const expirationTime = new Date().getTime() + expiresIn * 1000; // Convert seconds to milliseconds

          token(idToken); // Update the token dynamically
          localStorage.setItem('authToken', idToken);
          localStorage.setItem('expiryTime', expirationTime.toString());
          localStorage.setItem(
            'loginTime',
            Math.floor(Date.now() / 1000).toString(),
          );
        }
        else {
          console.log("Expiration time or issued-at time is missing in the decoded token.");
          // Handle the case where expiration time or issued-at time is missing
        }
    

        // Store or use the ID token and expiration time as needed
        navigate('/');
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log('🚀 ~ handleSubmit ~ errorCode:', errorCode);
        const errorMessage = error.message;
        console.log('🚀 ~ handleSubmit ~ errorMessage:', errorMessage);
      });

    setForm({ email: '', password: '' });
  };
  return (
    <>
      <div className="overflow-y-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          <div className="w-full lg:h-[42rem] border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <span className="mb-1.5 block font-medium">
                <Link className="mb-5.5 inline-block" to="/">
                  <img className="hidden dark:block" src={Logo} alt="Logo" />
                  <img className="dark:hidden" src={LogoDark} alt="Logo" />
                </Link>
              </span>
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Sign In
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black text-[14px] dark:text-white">
                    Email<span className="text-meta-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      className="w-full rounded-lg border border-grayf bg-transparent py-2 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      name="email"
                      value={form.email || ''}
                      onChange={(e: any) => {
                        handleForm(e);
                        setIsEmailValidation('');
                      }}
                      autoComplete="on"
                    />
                    {isEmailValidation && (
                      <small className="text-danger">
                        {isEmailValidation}.
                      </small>
                    )}
                  </div>
                </div>

                <div className="">
                  <label className="mb-2.5 block font-medium text-[14px] text-black dark:text-white">
                    Password<span className="text-meta-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      className="w-full rounded-lg border border-grayf bg-transparent py-2 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      name="password"
                      value={form.password || ''}
                      onChange={(e: any) => {
                        handleForm(e);
                        setIsPasswordValidation('');
                      }}
                      autoComplete="on"
                    />
                    {isPasswordValidation && (
                      <small className="text-danger">
                        {isPasswordValidation}
                      </small>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex">
                    <input type="checkbox" /> &nbsp;
                    <div className="flex justify-between mt-2.5 w-full">
                      <label className="mb-2.5 text-[14px] font-medium text-grayf dark:text-white">
                        Remember me
                      </label>
                      <label className="mb-2.5 underline text-[14px] font-medium text-grayf dark:text-white">
                        Forgot password?
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mb-5">
                  <input
                    type="submit"
                    value="Log in"
                    className="w-full cursor-pointer rounded-lg border border-[#0891B2] bg-[#0891B2] p-2 text-white transition hover:bg-opacity-90"
                  />
                </div>

                <div className="flex items-center mb-5">
                  <hr className="flex-1 border-t border-stroke" />
                  <span className="mx-4 text-[14px] text-black dark:text-white font-medium">
                    Or
                  </span>
                  <hr className="flex-1 border-t border-stroke" />
                </div>

                <button className="flex w-full text-[14px] text-black font-medium items-center justify-center gap-3.5 rounded-lg border border-stroke bg-white p-2 hover:bg-opacity-50 dark:border-strokedark dark:bg-meta-4 dark:hover:bg-opacity-50">
                  <span>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_191_13499)">
                        <path
                          d="M19.999 10.2217C20.0111 9.53428 19.9387 8.84788 19.7834 8.17737H10.2031V11.8884H15.8266C15.7201 12.5391 15.4804 13.162 15.1219 13.7195C14.7634 14.2771 14.2935 14.7578 13.7405 15.1328L13.7209 15.2571L16.7502 17.5568L16.96 17.5774C18.8873 15.8329 19.9986 13.2661 19.9986 10.2217"
                          fill="#4285F4"
                        />
                        <path
                          d="M10.2055 19.9999C12.9605 19.9999 15.2734 19.111 16.9629 17.5777L13.7429 15.1331C12.8813 15.7221 11.7248 16.1333 10.2055 16.1333C8.91513 16.1259 7.65991 15.7205 6.61791 14.9745C5.57592 14.2286 4.80007 13.1801 4.40044 11.9777L4.28085 11.9877L1.13101 14.3765L1.08984 14.4887C1.93817 16.1456 3.24007 17.5386 4.84997 18.5118C6.45987 19.4851 8.31429 20.0004 10.2059 19.9999"
                          fill="#34A853"
                        />
                        <path
                          d="M4.39899 11.9777C4.1758 11.3411 4.06063 10.673 4.05807 9.99996C4.06218 9.32799 4.1731 8.66075 4.38684 8.02225L4.38115 7.88968L1.19269 5.4624L1.0884 5.51101C0.372763 6.90343 0 8.4408 0 9.99987C0 11.5589 0.372763 13.0963 1.0884 14.4887L4.39899 11.9777Z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M10.2059 3.86663C11.668 3.84438 13.0822 4.37803 14.1515 5.35558L17.0313 2.59996C15.1843 0.901848 12.7383 -0.0298855 10.2059 -3.6784e-05C8.31431 -0.000477834 6.4599 0.514732 4.85001 1.48798C3.24011 2.46124 1.9382 3.85416 1.08984 5.51101L4.38946 8.02225C4.79303 6.82005 5.57145 5.77231 6.61498 5.02675C7.65851 4.28118 8.9145 3.87541 10.2059 3.86663Z"
                          fill="#EB4335"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_191_13499">
                          <rect width="20" height="20" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </span>
                  Continue With Google
                </button>

                <div className="mt-3 text-center ">
                  <p className="text-[14px] font-medium">
                    Don’t have any account?{' '}
                    <Link
                      to="/auth/signup"
                      className="text-[#0891B2] font-medium text-[18px]"
                    >
                      Sign Up
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>

          <div className="hidden w-full xl:block xl:w-1/2">
            <img className="img-fluid" src={logingymimg} alt="Logo" />
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
