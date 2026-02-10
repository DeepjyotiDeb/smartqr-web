import { useParams } from 'react-router';
import { useQuizSessionByAssignmentId } from '~/libs/api/AssignmentApi';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuizPosition } from '~/libs/hooks/useQuizPosition';

export function meta() {
  return [{ title: 'Quiz - DQR' }, { name: 'description', content: 'Active Quiz' }];
}

export default function QuizPage() {
  const { assignmentId } = useParams();
  const { quizSession, error, isLoading } = useQuizSessionByAssignmentId(assignmentId);
  const [currentPosition, setCurrentPosition] = useState<number>(0);

  const {
    position,
    connectionStatus,
    error: sseError,
    reconnectAttempts,
    reconnect,
  } = useQuizPosition({
    assignmentId,
    enabled: !isLoading && !error,
    questions: quizSession?.questions,
    initialCurrentQuestionId: quizSession?.currentQuestionId,
  });

  // Update position when hook's position changes
  useEffect(() => {
    if (position !== undefined && position !== -1) {
      setCurrentPosition((prev) => {
        if (prev !== position) {
          console.log('Position updated:', position);
          return position;
        }
        return prev;
      });
    }
  }, [position]);

  const currentQuestion = useMemo(() => {
    return quizSession?.questions.find((q: any) => q.order === currentPosition);
  }, [quizSession?.questions, currentPosition]);

  const isWaitingForQuestion = useMemo(() => {
    return currentPosition === 0 || !currentQuestion;
  }, [currentPosition, currentQuestion]);

  // Memoize answer options to prevent recreation on every render
  const answerOptions = useMemo(() => {
    if (!currentQuestion) return [];
    return [
      { key: 'A', text: currentQuestion.answerA },
      { key: 'B', text: currentQuestion.answerB },
      { key: 'C', text: currentQuestion.answerC },
      { key: 'D', text: currentQuestion.answerD },
    ];
  }, [currentQuestion]);

  const handleAnswerClick = useCallback((optionKey: string, optionText: string) => {
    console.log(`Selected answer ${optionKey}: ${optionText}`);
  }, []);

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <span className='loading loading-spinner loading-lg'></span>
          <p className='mt-4 text-base-content'>Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error || !quizSession) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='alert alert-error max-w-md'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='stroke-current shrink-0 h-6 w-6'
            fill='none'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <span>Failed to load quiz session</span>
        </div>
      </div>
    );
  }

  //   const currentQuestion = quizSession.questions.find((q: any) => q.order === currentPosition);
  //   const isWaitingForQuestion = currentPosition === 0 || !currentQuestion;

  return (
    <div className='min-h-screen bg-base-100'>
      {/* Header */}
      <div className='navbar bg-base-200 shadow-sm'>
        <div className='flex-1'>
          <h1 className='text-xl font-bold'>{quizSession.quizName}</h1>
        </div>
        <div className='flex-none gap-4'>
          {/* Connection Status */}
          <div className='flex items-center gap-2'>
            <div
              className={`status ${
                connectionStatus === 'connected'
                  ? 'status-success'
                  : connectionStatus === 'error'
                  ? 'status-error'
                  : 'status-warning'
              }`}
            ></div>
            <span className='text-sm text-base-content/70'>
              {connectionStatus === 'connected' ? (
                'Live'
              ) : connectionStatus === 'error' ? (
                <span className='flex items-center gap-1'>
                  Disconnected
                  {reconnectAttempts > 0 && (
                    <span className='text-xs'>({reconnectAttempts}/5)</span>
                  )}
                </span>
              ) : (
                'Connecting...'
              )}
            </span>

            {/* Manual reconnect button */}
            {connectionStatus === 'error' && (
              <button onClick={reconnect} className='btn btn-xs btn-ghost' title='Retry connection'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Progress */}
          <div className='text-sm text-base-content/70'>
            Question {currentPosition} of {quizSession.totalQuestions}
          </div>
        </div>
      </div>

      <div className='container mx-auto px-4 py-8 max-w-4xl'>
        {/* SSE Error Alert */}
        {sseError && (
          <div className='alert alert-warning mb-6'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='stroke-current shrink-0 h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
              />
            </svg>
            <span>Connection issues detected. Position updates may be delayed.</span>
            <button onClick={reconnect} className='btn btn-sm btn-outline'>
              Retry
            </button>
          </div>
        )}

        {isWaitingForQuestion ? (
          /* Waiting State */
          <div className='text-center py-16'>
            <div className='mb-6'>
              <span className='loading loading-dots loading-lg text-primary'></span>
            </div>
            <h2 className='text-2xl font-bold mb-4'>Waiting for the quiz to begin...</h2>
            <p className='text-base-content/70'>
              The instructor will start the quiz shortly. Please stay on this page.
            </p>
          </div>
        ) : (
          /* Question Display */
          <div className='space-y-6'>
            {/* Question Header */}
            <div className='text-center'>
              <div className='badge badge-primary badge-lg mb-4'>Question {currentPosition}</div>
              <h2 className='text-2xl font-bold mb-6'>{currentQuestion.questionText}</h2>

              {currentQuestion.imageURL && (
                <div className='mb-6'>
                  <img
                    src={currentQuestion.imageURL}
                    alt='Question illustration'
                    className='mx-auto max-w-full h-auto rounded-lg shadow-md'
                  />
                </div>
              )}
            </div>

            {/* Answer Options */}
            <div className='grid gap-4 max-w-2xl mx-auto'>
              {[
                { key: 'A', text: currentQuestion.answerA },
                { key: 'B', text: currentQuestion.answerB },
                { key: 'C', text: currentQuestion.answerC },
                { key: 'D', text: currentQuestion.answerD },
              ].map((option, index) => (
                <button
                  key={option.key}
                  className={`btn btn-outline btn-lg justify-start text-left h-auto min-h-16 p-4 ${
                    currentQuestion.studentAnswer === index + 1 ? 'btn-primary' : ''
                  }`}
                  onClick={() => {
                    // TODO: Implement answer selection logic
                    console.log(`Selected answer ${option.key}: ${option.text}`);
                  }}
                >
                  <span className='badge badge-neutral mr-3'>{option.key}</span>
                  <span className='flex-1'>{option.text}</span>
                </button>
              ))}
            </div>

            {/* Progress Bar */}
            <div className='mt-8'>
              <div className='flex justify-between text-sm text-base-content/70 mb-2'>
                <span>Progress</span>
                <span>{Math.round((currentPosition / quizSession.totalQuestions) * 100)}%</span>
              </div>
              <progress
                className='progress progress-primary w-full'
                value={currentPosition}
                max={quizSession.totalQuestions}
              ></progress>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
