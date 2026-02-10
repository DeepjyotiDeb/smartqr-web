import { useGroup } from '~/libs/api/GroupApi';
import { Link, NavLink, useParams } from 'react-router';
import { useAssignmentsByGroupId } from '~/libs/api/AssignmentApi';
import type { Route } from '.react-router/types/app/routes/+types/not-found';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Assignments - DQR' },
    { name: 'description', content: 'View and manage class assignments' },
  ];
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'No end date';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getStatusFromDates = (startDate: string, endDate: string | null) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;

  if (now < start) return 'upcoming';
  if (end && now > end) return 'ended';
  return 'active';
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'badge-success';
    case 'upcoming':
      return 'badge-warning';
    case 'ended':
      return 'badge-error';
    default:
      return 'badge-neutral';
  }
};

export default function Assignments() {
  const { classId } = useParams();
  const { groups, error: groupsError, isLoading: groupsLoading } = useGroup();
  const {
    assignments,
    error: assignmentsError,
    isLoading: assignmentsLoading,
  } = useAssignmentsByGroupId(classId as string);

  // Find the current class from the groups data
  const currentClass = groups?.find((group: any) => group.groupId.toString() === classId);

  // Loading states
  if (groupsLoading || assignmentsLoading) {
    return (
      <div className='space-y-6'>
        <div className='skeleton h-6 w-48'></div>
        <div className='skeleton h-8 w-64'></div>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {[...Array(3)].map((_, i) => (
            <div key={i} className='skeleton h-24'></div>
          ))}
        </div>
      </div>
    );
  }

  // Error states
  if (groupsError || assignmentsError) {
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
          <span>Failed to load data. Please try again.</span>
        </div>
      </div>
    );
  }

  // Class not found
  if (!currentClass) {
    return (
      <div className='text-center py-12'>
        <h1 className='text-2xl font-bold text-error mb-4'>Class Not Found</h1>
        <p className='text-base-content/70 mb-6'>The class you're looking for doesn't exist.</p>
        <Link to='/classes' className='btn btn-primary'>
          Back to Classes
        </Link>
      </div>
    );
  }

  const assignmentsList = assignments || [];
  const activeAssignments = assignmentsList.filter(
    (a: any) => getStatusFromDates(a.startDate, a.endDate) === 'active'
  ).length;
  const totalSessions = assignmentsList.reduce(
    (sum: number, a: any) => sum + (a.quizSessionCount || 0),
    0
  );

  return (
    <div className='space-y-6'>
      {/* Breadcrumb */}
      {/* <div className='breadcrumbs text-sm'>
        <ul>
          <li>
            <Link to='/classes'>Classes</Link>
          </li>
          <li>{currentClass.name}</li>
        </ul>
      </div> */}

      {/* Header */}
      <div className='flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-base-content'>{currentClass.name}</h1>
          <p className='text-base-content/70 mt-1'>
            Assignments for this class • {currentClass.students?.length || 0} students
          </p>
        </div>
        {/* <div className='flex gap-2'>
          <button className='btn btn-outline btn-sm'>
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
              />
            </svg>
            Export
          </button>
          <button className='btn btn-primary btn-sm'>
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M12 4v16m8-8H4'
              />
            </svg>
            New Assignment
          </button>
        </div> */}
      </div>

      {/* Stats */}
      <div className='stats stats-horizontal shadow'>
        <div className='stat'>
          <div className='stat-title'>Total Assignments</div>
          <div className='stat-value text-primary'>{assignmentsList.length}</div>
          <div className='stat-desc'>{activeAssignments} currently active</div>
        </div>
        <div className='stat'>
          <div className='stat-title'>Quiz Sessions</div>
          <div className='stat-value text-secondary'>{totalSessions}</div>
          <div className='stat-desc'>Total sessions created</div>
        </div>
        <div className='stat'>
          <div className='stat-title'>Students</div>
          <div className='stat-value text-accent'>{currentClass.students?.length || 0}</div>
          <div className='stat-desc'>In this class</div>
        </div>
      </div>

      {/* Assignments List */}
      <div className='space-y-4'>
        {assignmentsList.length > 0 ? (
          assignmentsList.map((assignment: any) => {
            const status = getStatusFromDates(assignment.startDate, assignment.endDate);

            return (
              <div key={assignment.assignmentId} className='card bg-base-100 shadow-lg'>
                <div className='card-body p-6'>
                  <div className='flex flex-col lg:flex-row lg:items-center gap-4'>
                    <div className='flex-1'>
                      <div className='flex items-start gap-3 mb-2'>
                        <div className='badge border-2 bg-yellow-100 text-yellow-800 border-yellow-200 text-xs font-medium'>
                          QUIZ
                        </div>
                        <div className={`badge ${getStatusColor(status)} badge-sm`}>{status}</div>
                      </div>

                      <NavLink
                        to={`${assignment?.assignmentId}`}
                        className='card-title text-lg mb-2 hover:underline'
                        viewTransition
                      >
                        {assignment.quizName}
                      </NavLink>
                      <p className='text-base-content/70 text-sm mb-3'>
                        Quiz assignment for {assignment.groupName}
                      </p>

                      <div className='flex items-center gap-4 text-sm'>
                        <div className='flex items-center gap-1'>
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
                              d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                            />
                          </svg>
                          <span className='text-base-content/70'>
                            Started: {formatDate(assignment.startDate)}
                          </span>
                        </div>
                        {assignment.endDate && (
                          <div className='flex items-center gap-1'>
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
                                d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                              />
                            </svg>
                            <span className='text-base-content/70'>
                              Ends: {formatDate(assignment.endDate)}
                            </span>
                          </div>
                        )}
                        <div className='flex items-center gap-1'>
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
                              d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                            />
                          </svg>
                          <span className='text-base-content/70'>
                            {assignment.quizSessionCount || 0} sessions
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className='flex flex-col lg:items-end gap-3'>
                      <div className='flex items-center gap-2'>
                        <div className='badge badge-info'>
                          Created {formatDate(assignment.dateCreated)}
                        </div>
                      </div>

                      {/* <div className='flex gap-2'>
                        <button className='btn btn-ghost btn-sm'>
                          <svg
                            className='w-4 h-4'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth='2'
                              d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                            />
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth='2'
                              d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                            />
                          </svg>
                          View
                        </button>
                        <button className='btn btn-ghost btn-sm'>
                          <svg
                            className='w-4 h-4'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth='2'
                              d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                            />
                          </svg>
                          Edit
                        </button>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
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
                  d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                />
              </svg>
              <h3 className='text-lg font-semibold text-base-content mb-2'>No assignments yet</h3>
              <p className='text-base-content/70 mb-4'>Create your first assignment from the app</p>
              {/* <button className='btn btn-primary'>Create Assignment</button> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
