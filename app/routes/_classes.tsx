import { useGroup } from '~/libs/api/GroupApi';

import { Link } from 'react-router';
import { AssignmentModal } from '~/components/AssignmentModal';
import type { Route } from '.react-router/types/app/+types/root';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Classes - DQR' }, { name: 'description', content: 'Manage your classes' }];
}

// Color palette for classes
const colorPalette = [
  { color: 'bg-blue-100 border-blue-200', textColor: 'text-blue-800' },
  { color: 'bg-green-100 border-green-200', textColor: 'text-green-800' },
  { color: 'bg-purple-100 border-purple-200', textColor: 'text-purple-800' },
  { color: 'bg-orange-100 border-orange-200', textColor: 'text-orange-800' },
  { color: 'bg-red-100 border-red-200', textColor: 'text-red-800' },
  { color: 'bg-indigo-100 border-indigo-200', textColor: 'text-indigo-800' },
  { color: 'bg-pink-100 border-pink-200', textColor: 'text-pink-800' },
  { color: 'bg-yellow-100 border-yellow-200', textColor: 'text-yellow-800' },
];

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export default function Classes() {
  const { groups, error, isLoading } = useGroup();

  const handleQuiz = () => {
    document?.getElementById('my_modal_2')?.setAttribute('open', 'true');
  };

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div className='flex justify-between items-center'>
          <div>
            <div className='skeleton h-8 w-48'></div>
            <div className='skeleton h-4 w-64 mt-2'></div>
          </div>
          <div className='skeleton h-10 w-24'></div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {[...Array(3)].map((_, i) => (
            <div key={i} className='card bg-base-100 shadow-lg'>
              <div className='card-body p-6'>
                <div className='skeleton h-6 w-3/4 mb-2'></div>
                <div className='skeleton h-4 w-full mb-4'></div>
                <div className='skeleton h-4 w-1/2'></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-center py-12'>
        <div className='alert alert-error max-w-md mx-auto'>
          <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <span>Failed to load classes. Please try again.</span>
        </div>
      </div>
    );
  }

  const classes = groups || [];
  const totalStudents = classes.reduce(
    (sum: any, cls: { students: string | any[] }) => sum + cls.students.length,
    0
  );
  const averageClassSize = classes.length > 0 ? Math.round(totalStudents / classes.length) : 0;
  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold text-base-content'>My Classes</h1>
          <p className='text-base-content/70 mt-1'>Manage your classes and view assignments</p>
        </div>
        <button className='btn btn-primary' onClick={handleQuiz}>
          Go to Quiz
        </button>
        {/* <button className='btn btn-primary'>
          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 4v16m8-8H4' />
          </svg>
          Add Class
        </button> */}
      </div>

      {/* Stats */}
      <div className='stats stats-horizontal shadow'>
        <div className='stat'>
          <div className='stat-title'>Total Classes</div>
          <div className='stat-value text-primary'>{classes.length}</div>
          <div className='stat-desc'>Active classes</div>
        </div>
        <div className='stat'>
          <div className='stat-title'>Total Students</div>
          <div className='stat-value text-secondary'>{totalStudents}</div>
          <div className='stat-desc'>Enrolled across all classes</div>
        </div>
        <div className='stat'>
          <div className='stat-title'>Average Class Size</div>
          <div className='stat-value text-accent'>{averageClassSize}</div>
          <div className='stat-desc'>Students per class</div>
        </div>
      </div>

      {/* Classes Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {classes.map((classItem: any, index: number) => {
          const colorScheme = colorPalette[index % colorPalette.length];
          const teacherCount = classItem.teachers?.length || 0;
          const studentCount = classItem.students?.length || 0;

          return (
            <div
              key={classItem.groupId}
              className={`card bg-base-100 shadow-lg border-2 ${colorScheme.color} hover:shadow-xl transition-shadow`}
            >
              <div className='card-body p-6'>
                <div className='flex items-start justify-between mb-4'>
                  <div
                    className={`badge ${colorScheme.color} ${colorScheme.textColor} border-0 text-xs`}
                  >
                    Created {formatDate(classItem.dateCreated)}
                  </div>
                  {/* <div className='dropdown dropdown-end'>
                    <div tabIndex={0} role='button' className='btn btn-ghost btn-sm btn-circle'>
                      <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                        <path d='M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z' />
                      </svg>
                    </div>
                    <ul className='dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow'>
                      <li>
                        <a>Edit Class</a>
                      </li>
                      <li>
                        <a>View Reports</a>
                      </li>
                      <li>
                        <a>Export Data</a>
                      </li>
                      <li className='border-t border-base-300 mt-2 pt-2'>
                        <a className='text-error'>Archive Class</a>
                      </li>
                    </ul>
                  </div> */}
                </div>

                <h2 className='card-title text-lg mb-2'>{classItem.name}</h2>
                <p className='text-base-content/70 text-sm mb-4'>
                  {classItem.dateArchived ? 'Archived class' : 'Active class'}
                </p>

                <div className='space-y-2 text-sm'>
                  <div className='flex items-center gap-2'>
                    <svg
                      className='w-4 h-4 text-base-content/50'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                      />
                    </svg>
                    <span className='text-base-content/70'>
                      {teacherCount} teacher{teacherCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <svg
                      className='w-4 h-4 text-base-content/50'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                      />
                    </svg>
                    <span className='text-base-content/70'>
                      {studentCount} student{studentCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                  {classItem.schoolId && (
                    <div className='flex items-center gap-2'>
                      <svg
                        className='w-4 h-4 text-base-content/50'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
                        />
                      </svg>
                      <span className='text-base-content/70'>School ID: {classItem.schoolId}</span>
                    </div>
                  )}
                </div>

                <div className='card-actions justify-end mt-6'>
                  <Link
                    to={`/classes/${classItem.groupId}/assignments`}
                    className='btn btn-primary btn-sm'
                    viewTransition
                  >
                    View Assignments
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {classes.length === 0 && (
        <div className='text-center py-12'>
          <div className='max-w-md mx-auto'>
            <svg
              className='w-16 h-16 mx-auto text-base-content/30 mb-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='1'
                d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
              />
            </svg>
            <h3 className='text-lg font-semibold text-base-content mb-2'>No classes yet</h3>
            <p className='text-base-content/70 mb-4'>Get started by creating your first class</p>
            <button className='btn btn-primary'>Create First Class</button>
          </div>
        </div>
      )}
      <AssignmentModal />
    </div>
  );
}
