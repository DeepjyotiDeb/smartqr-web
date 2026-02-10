import { useParams } from 'react-router';
import { useQuizSessionByAssignmentId } from '~/libs/api/AssignmentApi';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuizPosition } from '~/libs/hooks/useQuizPosition';

export function meta() {
  return [{ title: 'Quiz - DQR' }, { name: 'description', content: 'Active Quiz' }];
}

export default function AssignmentQuizPage() {
  const { assignmentId } = useParams();
  const { quizSession, error, isLoading } = useQuizSessionByAssignmentId(assignmentId);
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState<boolean>(false);

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
          // Hide correct answer when question changes
          setShowCorrectAnswer(false);
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

  // Helper function to check if an option is the correct answer
  const isCorrectAnswer = useCallback(
    (index: number) => {
      return currentQuestion?.correctAnswer === index + 1;
    },
    [currentQuestion]
  );

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
  return (
    <div className='min-h-screen bg-base-100'>
      {/* Header */}
      <div className='navbar bg-base-200 shadow-sm'>
        <div className='flex-1'>
          <h1 className='text-xl font-bold'>{quizSession.quizName}</h1>
        </div>
        <div className='flex-none gap-4'>
          {/* Show Correct Answer Toggle - Only visible when there's a current question */}
          {!isWaitingForQuestion && (
            <button
              onClick={() => setShowCorrectAnswer(!showCorrectAnswer)}
              className={`btn btn-sm ${showCorrectAnswer ? 'btn-success' : 'btn-outline'}`}
              title={showCorrectAnswer ? 'Hide correct answer' : 'Show correct answer'}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-4 w-4'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                {showCorrectAnswer ? (
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L12 12m-3-3l3 3m-3-3l-3-3'
                  />
                ) : (
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                  />
                )}
              </svg>
              {showCorrectAnswer ? 'Hide Answer' : 'Show Answer'}
            </button>
          )}

          {/* Connection Status */}
          <div className='flex items-center gap-2'>
            <div
              className={`status ${connectionStatus === 'connected'
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
              {answerOptions.map((option, index) => {
                const isSelected = currentQuestion.studentAnswer === index + 1;
                const isCorrect = isCorrectAnswer(index);
                const shouldHighlightCorrect = showCorrectAnswer && isCorrect;

                return (
                  <button
                    key={option.key}
                    className={`btn btn-outline btn-lg justify-start text-left h-auto min-h-16 p-4 relative ${isSelected
                      ? 'btn-primary'
                      : shouldHighlightCorrect
                        ? 'btn-success border-success border-2'
                        : ''
                      }`}
                    onClick={() => handleAnswerClick(option.key, option.text)}
                  >
                    <span className='badge badge-neutral mr-3'>{option.key}</span>
                    <span className='flex-1'>{option.text}</span>

                    {/* Correct Answer Indicator */}
                    {shouldHighlightCorrect && (
                      <div className='absolute top-2 right-2'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-5 w-5 text-success'
                          fill='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            fillRule='evenodd'
                            d='M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
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
