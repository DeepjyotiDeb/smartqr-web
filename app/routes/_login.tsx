import type { Route } from '.react-router/types/app/+types/root';
import axios, { AxiosError } from 'axios';
import { Form, redirect } from 'react-router';
import { useGuestGuard } from '~/libs/auth/useAuthGuard';

export function meta() {
  return [
    { title: 'Login - Welcome to DQR' },
    { name: 'description', content: 'Sign in to your account' },
  ];
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const email = formData.get('email');
  const password = formData.get('password');
  try {
    const response = await axios.post<LoginResponse>(
      `${import.meta.env.VITE_PUBLIC_BACKEND_API}/auth/login`,
      {
        email,
        password,
      }
    );
    const filteredUser = {
      userId: response.data.user.userId,
      userName: response.data.user.userName,
      firstName: response.data.user.firstName,
      lastName: response.data.user.lastName,
      email: response.data.user.email,
      userRole: response.data.user.userRole,
      verified: response.data.user.verified,
      dateJoined: response.data.user.dateJoined,
      teacherDetails: response.data.user.teacherDetails
        ? {
            teacherId: response.data.user.teacherDetails.teacherId,
            dateCreated: response.data.user.teacherDetails.dateCreated,
          }
        : null,
      studentDetails: response.data.user.studentDetails,
    };
    localStorage.setItem('user', JSON.stringify(filteredUser));
    localStorage.setItem('token', response.data.token);
    // Redirect to classes page after successful login
    return redirect('/classes');
  } catch (error) {
    return error as AxiosError;
  }
}

export default function LoginPage({ actionData }: Route.ComponentProps) {
  const isGuest = useGuestGuard();

  // Show loading while redirecting authenticated users
  if (!isGuest) {
    return (
      <div className='min-h-screen bg-base-200 flex items-center justify-center'>
        <div className='loading loading-spinner loading-lg text-primary'></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-base-200 flex items-center justify-center p-4'>
      <div className='card bg-base-100 w-full max-w-sm shadow-lg'>
        <div className='card-body p-6'>
          {/* Header */}
          <div className='text-center mb-4'>
            <h1 className='text-2xl font-bold text-primary'>Welcome to DQR</h1>
            <p className='text-base-content/70 text-sm mt-1'>Sign in to your account</p>
          </div>

          {/* Login Form */}
          <Form method='post' className='space-y-3'>
            <div className='form-control'>
              <label className='label py-1'>
                <span className='label-text text-sm font-medium'>Email</span>
              </label>
              <input
                type='email'
                placeholder='your@email.com'
                name='email'
                className='input input-bordered input-sm'
              />
            </div>

            <div className='form-control'>
              <label className='label py-1'>
                <span className='label-text text-sm font-medium'>Password</span>
              </label>
              <input
                type='password'
                placeholder='••••••••'
                name='password'
                className='input input-bordered input-sm'
              />
              {/* <label className='label py-1'>
                <span className='label-text-alt'></span>
                <span className='label-text-alt'>
                  <a href='#' className='link link-hover text-primary text-xs'>
                    Forgot password?
                  </a>
                </span>
              </label> */}
            </div>

            {/* <div className='form-control'>
              <label className='label cursor-pointer justify-start gap-2 py-1'>
                <input type='checkbox' className='checkbox checkbox-primary checkbox-sm' />
                <span className='label-text text-sm'>Remember me</span>
              </label>
            </div> */}

            <div className='form-control mt-4'>
              <button className='btn btn-primary btn-sm'>Log In</button>
            </div>
          </Form>

          {/* Error section */}
          {actionData && (
            <div className='alert alert-error shadow-lg mt-4'>
              <div>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='stroke-current flex-shrink-0 h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                <span>{'Login failed. Please try again.'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
