import { Link, useParams } from "react-router";
import { usePublicQuizSessionByAssignmentId } from "~/libs/api/AssignmentApi";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuizPosition } from "~/libs/hooks/useQuizPosition";
import { useStudentList } from "~/libs/hooks/useStudentList";
import { UserPen } from "lucide-react";
import Logo from "~/components/Logo";

export function meta() {
  return [
    { title: "Quiz - DQR" },
    { name: "description", content: "Active Quiz" },
  ];
}

export default function AssignmentQuizPage() {
  const { assignmentId } = useParams();
  const { quizSession, error, isLoading } =
    usePublicQuizSessionByAssignmentId(assignmentId);
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const [showStudentList, setShowStudentList] = useState<boolean>(true);
  const [isStudentPanelAnimating, setIsStudentPanelAnimating] =
    useState<boolean>(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState<boolean>(false);
  const [transitionDirection, setTransitionDirection] = useState<
    "left" | "right" | null
  >(null);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [transitionPhase, setTransitionPhase] = useState<
    "idle" | "exit" | "enter"
  >("idle");
  const [nextPosition, setNextPosition] = useState<number>(0);

  // Handle student panel close with animation
  const handleCloseStudentList = useCallback(() => {
    setIsStudentPanelAnimating(true);
    setTimeout(() => {
      setShowStudentList(false);
      setIsStudentPanelAnimating(false);
    }, 300); // Match animation duration
  }, []);

  const {
    position: resolvedPosition,
    currentQuestion,
    connectionStatus,
    error: sseError,
    reconnectAttempts,
    reconnect,
    quizCompleted,
    studentAnswers,
    getStudentAnswer,
  } = useQuizPosition({
    assignmentId,
    enabled: !isLoading && !error,
    students: quizSession?.students,
    questions: quizSession?.questions,
    initialCurrentQuestionId: quizSession?.currentQuestionId,
  });

  // Memo-ise students array to prevent unnecessary re-renders
  const memoStudents = useMemo(() => {
    return quizSession?.students;
  }, [quizSession?.students]);

  // Student list management
  const { students, stats, studentsByStatus, clearAnswers } = useStudentList({
    students: memoStudents,
    studentAnswers,
    getStudentAnswer,
  });

  // Update currentPosition when resolvedPosition changes from the hook
  useEffect(() => {
    if (resolvedPosition !== undefined && resolvedPosition !== -1) {
      setCurrentPosition((prev) => {
        if (prev !== resolvedPosition) {
          // Reset pending students when position changes
          clearAnswers();

          // Determine transition direction and start exit animation
          if (prev > 0 && resolvedPosition > 0) {
            // Only animate if both positions are valid (not initial state)
            const direction = resolvedPosition > prev ? "right" : "left";
            setTransitionDirection(direction);
            setNextPosition(resolvedPosition);
            setIsTransitioning(true);
            setTransitionPhase("exit");

            // Hide correct answer immediately when transition starts
            setShowCorrectAnswer(false);

            // After exit animation completes, update position and start enter animation
            setTimeout(() => {
              setCurrentPosition(resolvedPosition);
              setTransitionPhase("enter");

              // After enter animation completes, reset everything
              setTimeout(() => {
                setIsTransitioning(false);
                setTransitionDirection(null);
                setTransitionPhase("idle");
                setNextPosition(0);
              }, 300); // Duration of enter animation
            }, 300); // Duration of exit animation

            return prev; // Don't update position yet, wait for exit animation
          } else {
            // Initial load or no animation needed
            // Hide correct answer when question changes
            setShowCorrectAnswer(false);
            return resolvedPosition;
          }
        }
        return prev;
      });
    }
  }, [resolvedPosition, clearAnswers]);

  const isWaitingForQuestion = useMemo(() => {
    return !currentQuestion;
  }, [currentPosition, currentQuestion]);

  // Memo-ise filtered students to prevent unnecessary re-renders
  const pendingStudents = useMemo(() => {
    return students?.filter((student) => !student.hasAnswered) || [];
  }, [students]);

  // Helper function to get animation class
  const getAnimationClass = () => {
    if (!isTransitioning || !transitionDirection) return "";

    if (transitionPhase === "exit") {
      return transitionDirection === "right"
        ? "swipe-out-left"
        : "swipe-out-right";
    } else if (transitionPhase === "enter") {
      return transitionDirection === "right"
        ? "swipe-in-right"
        : "swipe-in-left";
    }

    return "";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4 text-base-content">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col gap-4">
          <div className="alert alert-success max-w-md">
            <span>Quiz completed successfully!</span>
          </div>
          <Link to="/" className="btn btn-primary btn-sm">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  if (error || !quizSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="alert alert-error max-w-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0 h-6 w-6 stroke-white"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-white">Failed to load quiz session</span>
        </div>
      </div>
    );
  }
  console.log('log', currentQuestion);
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">

      <div className="relative pt-2" style={{ height: "5rem" }}>
        <progress
          className="progress progress-primary w-full h-2 rounded-none fixed top-0 left-0 z-50"
          value={currentPosition + 1}
          max={quizSession.totalQuestions}
        ></progress>
        <div className="flex justify-between items-center p-4 h-full border-b border-gray-700">
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="group flex items-center justify-center bg-primary rounded-2xl p-2.5 h-12 w-12 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-110 hover:rotate-3 relative overflow-hidden"
            >
              <Logo
                className="w-10 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-lg"
                color="white"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              <div className="absolute inset-0 bg-primary/50 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            </a>
            <h1 className="text-gray-300" style={{ fontSize: "1.25rem" }}>
              {quizSession.quizName}
            </h1>
          </div>
          <div className="flex items-center gap-3">

            <div className="text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl text-base-content/70 text-gray-300">
              Question {currentPosition + 1} of {quizSession.totalQuestions}
            </div>

            {stats?.total && (
              <button
                onClick={() =>
                  showStudentList
                    ? handleCloseStudentList()
                    : setShowStudentList(true)
                }
                className="rounded-lg bg-black/80 p-2"
                title="Toggle student list"
              >
                <span className="text-gray-300">
                  {stats.answered} / {stats.total}
                </span>
              </button>
            )}

            {connectionStatus !== "connected" && (
              <div className="badge rounded-full flex items-center gap-1 md:gap-2 lg:gap-3">
                <div
                  className={`status md:status-md lg:status-lg ${connectionStatus === "error"
                    ? "status-error"
                    : "status-warning"
                    }`}
                ></div>
                <span className="text-xs md:text-sm lg:text-base text-base-content/70">
                  {connectionStatus === "error" ? (
                    <span className="flex items-center gap-1">
                      Disconnected
                      {reconnectAttempts > 0 && (
                        <span className="text-xs">({reconnectAttempts}/3)</span>
                      )}
                    </span>
                  ) : (
                    "Connecting..."
                  )}
                </span>

                {/* Manual reconnect button */}
                {connectionStatus === "error" && (
                  <button
                    onClick={reconnect}
                    className="btn btn-xs md:btn-sm lg:btn-md xl:btn-lg btn-ghost"
                    title="Retry connection"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 xl:h-6 xl:w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area - Below Header */}
      <div className="flex-1 flex">
        {/* Left Pane - Question Content */}
        <div
          className="flex flex-col transition-all duration-300 ease-out"
          style={{
            width: showStudentList ? "calc(100% - 15rem)" : "100%",
            flexShrink: 0,
          }}
        >
          {/* SSE Error Alert */}
          {sseError && (
            <div className="alert alert-warning mb-4 md:mb-6 lg:mb-8 xl:mb-12 text-xs md:text-sm lg:text-base xl:text-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 xl:h-8 xl:w-8"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <span>Connection issues detected.</span>
              <button
                onClick={reconnect}
                className="btn btn-xs md:btn-sm lg:btn-md xl:btn-lg btn-outline"
              >
                Retry
              </button>
            </div>
          )}

          {isWaitingForQuestion ? (
            /* Waiting State */
            <div className="text-center py-12 md:py-16 lg:py-24 xl:py-32 2xl:py-40">
              <div className="mb-4 md:mb-6 lg:mb-8 xl:mb-12">
                <span className="loading loading-dots loading-md md:loading-lg xl:loading-xl text-primary"></span>
              </div>
              <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold mb-3 md:mb-4 lg:mb-6 xl:mb-8">
                Waiting for the quiz to begin...
              </h2>
              <p className="text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl text-base-content/70 max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
                Ensure that the quiz has started from the mobile app
              </p>
            </div>
          ) : (
            /* Question Display */
            <div className="relative overflow-hidden flex-1">
              <div
                key={
                  transitionPhase === "enter" ? nextPosition : currentPosition
                }
                className={`h-full flex flex-col question-transition ${getAnimationClass()}`}
              >
                {/* Question Content */}
                <div className="flex-1 flex items-center justify-center p-8 md:p-12 lg:p-16">
                  <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Illustration - Left Side */}
                    {currentQuestion.sourceImageURL && (
                      <div className="lg:w-1/2 flex items-center justify-center">
                        <img
                          src={currentQuestion.sourceImageURL}
                          alt="Question illustration"
                          className="w-full h-auto max-h-[60vh] object-contain rounded-lg shadow-lg"
                        />
                      </div>
                    )}

                    {/* Question and Options - Right Side (or Full Width if no image) */}
                    <div className={`flex flex-col ${currentQuestion.sourceImageURL ? 'lg:w-1/2' : 'w-full max-w-5xl mx-auto'}`}>
                      {/* Question Text */}
                      <div className="mb-6 md:mb-8 lg:mb-10">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white text-center lg:text-left leading-tight">
                          {currentQuestion.questionText}
                        </h2>
                      </div>

                      {/* Answer Options List */}
                      <div className="space-y-3 md:space-y-4">
                        {/* Option A */}
                        <div className="bg-blue-600/20 border-4 border-blue-500 rounded-2xl p-4 md:p-5 lg:p-6 hover:bg-blue-600/30 transition-colors">
                          <div className="flex items-start gap-3 md:gap-4">
                            <div className="bg-blue-500 text-white font-bold text-xl md:text-2xl lg:text-3xl w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center flex-shrink-0">
                              A
                            </div>
                            <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl text-white font-semibold pt-1 md:pt-2">
                              {currentQuestion.answerA}
                            </p>
                          </div>
                        </div>

                        {/* Option B */}
                        <div className="bg-red-600/20 border-4 border-red-500 rounded-2xl p-4 md:p-5 lg:p-6 hover:bg-red-600/30 transition-colors">
                          <div className="flex items-start gap-3 md:gap-4">
                            <div className="bg-red-500 text-white font-bold text-xl md:text-2xl lg:text-3xl w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center flex-shrink-0">
                              B
                            </div>
                            <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl text-white font-semibold pt-1 md:pt-2">
                              {currentQuestion.answerB}
                            </p>
                          </div>
                        </div>

                        {/* Option C */}
                        <div className="bg-yellow-600/20 border-4 border-yellow-500 rounded-2xl p-4 md:p-5 lg:p-6 hover:bg-yellow-600/30 transition-colors">
                          <div className="flex items-start gap-3 md:gap-4">
                            <div className="bg-yellow-500 text-white font-bold text-xl md:text-2xl lg:text-3xl w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center flex-shrink-0">
                              C
                            </div>
                            <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl text-white font-semibold pt-1 md:pt-2">
                              {currentQuestion.answerC}
                            </p>
                          </div>
                        </div>

                        {/* Option D */}
                        <div className="bg-green-600/20 border-4 border-green-500 rounded-2xl p-4 md:p-5 lg:p-6 hover:bg-green-600/30 transition-colors">
                          <div className="flex items-start gap-3 md:gap-4">
                            <div className="bg-green-500 text-white font-bold text-xl md:text-2xl lg:text-3xl w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center flex-shrink-0">
                              D
                            </div>
                            <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl text-white font-semibold pt-1 md:pt-2">
                              {currentQuestion.answerD}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            // <div className="relative overflow-hidden flex-1">
            //   <div
            //     key={
            //       transitionPhase === "enter" ? nextPosition : currentPosition
            //     }
            //     className={`space-y-4 md:space-y-6 lg:space-y-8 xl:space-y-12 2xl:space-y-16 question-transition ${getAnimationClass()}`}
            //     style={{ padding: "2rem", height: "100%" }}
            //   >
            //     <img
            //       src={currentQuestion.sourceImageURL}
            //       alt="Question illustration"
            //       className="mx-auto h-full w-auto rounded-lg shadow-md object-contain"
            //     />
            //   </div>
            // </div>
          )}
        </div>

        {/* Right Pane - Student List */}
        {showStudentList && (
          <div
            className="w-60"
            style={{
              animation: isStudentPanelAnimating
                ? "slideOutToRight 0.3s ease-out"
                : "slideInFromRight 0.3s ease-out",
            }}
          >
            {/* Student List - Only show students who haven't answered */}
            <div
              className="overflow-y-auto p-4"
              style={{ height: `calc(100vh - 5rem)` }}
            >
              <div className="space-y-2">
                {pendingStudents.map((student) => (
                  <div
                    key={student.studentId}
                    className="flex items-center gap-2 p-2 rounded-lg text-sm bg-gray-700/30 text-gray-300"
                  >
                    {student.studentCode && (
                      <span className="text-xs text-gray-400 rounded-full bg-black/30 p-1 flex items-center justify-center w-6 h-6">
                        {student.studentCode}
                      </span>
                    )}
                    <span className="truncate font-medium">
                      {student.studentName ||
                        `${student.firstName || ""} ${student.lastName || ""
                          }`.trim()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
