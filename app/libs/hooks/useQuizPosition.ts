import { useState, useCallback, useEffect, useMemo } from "react";
import { useServerSentEvents } from "./useServerSentEvents";

interface QuizPosition {
  position: number;
  questionId?: string;
}

interface StudentAnswer {
  studentId: string;
  studentName: string;
  questionId: string;
  answer: string;
  timestamp: string;
}

interface Student {
  studentId: string;
  studentName: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface UseQuizPositionOptions {
  assignmentId: string | undefined;
  enabled?: boolean;
  students?: Student[];
  onStudentAnswer?: (answer: StudentAnswer) => void;
  questions?: any[];
  initialCurrentQuestionId?: number;
}

export function useQuizPosition({
  assignmentId,
  enabled = true,
  students,
  onStudentAnswer,
  questions,
  initialCurrentQuestionId,
}: UseQuizPositionOptions) {
  const url = assignmentId
    ? `${
        import.meta.env.VITE_PUBLIC_BACKEND_API
      }/quiz-sessions/web/${assignmentId}/events`
    : "";

  const [quizCompleted, setQuizCompleted] = useState(false);
  const [studentAnswers, setStudentAnswers] = useState<StudentAnswer[]>([]);

  // Resolve position from questionId
  const resolvePosition = useCallback(
    (questionId: number | undefined): number => {
      if (!questionId || !questions) return -1;

      // First, try to find the question directly in the main questions array
      const directPosition = questions.findIndex(
        (q: any) => q.questionId === questionId
      );

      if (directPosition !== -1) {
        return directPosition;
      }

      // If not found directly, check if it's a question variant
      // If so, return the position of the parent question
      const parentPosition = questions.findIndex((q: any) => {
        return q.questionVariants?.some(
          (variant: any) => variant.questionId === questionId
        );
      });

      return parentPosition;
    },
    [questions]
  );

  // Flatten questions for finding current question
  const flattenedQuestions = useMemo(() => {
    if (!questions) return [];
    return questions.reduce((acc: any[], q: any) => {
      acc.push(q);
      if (q?.questionVariants && q.questionVariants.length > 0) {
        acc.push(...q.questionVariants);
      }
      return acc;
    }, []);
  }, [questions]);

  const sseState = useServerSentEvents<QuizPosition>({
    url,
    enabled: enabled && !!assignmentId,
    reconnectInterval: 5000,
    maxReconnectAttempts: 3,
    onStudentListUpdate: (data) => {
      // Handle batch of student answers
      if (
        data.StudentAnswers &&
        Array.isArray(data.StudentAnswers)
      ) {
        // If empty array, clear all answers for this question
        if (data.StudentAnswers.length === 0) {
          setStudentAnswers((prev) => {
            return prev.filter(
              (answer) => answer.questionId !== data.QuestionId?.toString()
            );
          });
          return;
        }

        data.StudentAnswers.forEach((studentAnswer: any) => {
          // Look up student name from the students array
          const student = students?.find(
            (s) => s.studentId === studentAnswer.StudentId
          );

          const studentName =
            student?.studentName ||
            (student?.firstName && student?.lastName
              ? `${student.firstName} ${student.lastName}`.trim()
              : null) ||
            `Student ${studentAnswer.StudentId}`;

          const newAnswer: StudentAnswer = {
            studentId: studentAnswer.StudentId.toString(),
            studentName: studentName,
            questionId: data.QuestionId?.toString() || "",
            answer: studentAnswer.AnswerValue?.toString() || "",
            timestamp: data.Timestamp || new Date().toISOString(),
          };

          setStudentAnswers((prev) => {
            // Remove any existing answer from this student for this question
            const filtered = prev.filter(
              (answer) =>
                !(
                  answer.studentId === newAnswer.studentId &&
                  answer.questionId === newAnswer.questionId
                )
            );
            return [...filtered, newAnswer];
          });

          onStudentAnswer?.(newAnswer);
        });
      }
    },
    onClose: () => {
      console.log("SSE connection closed for quiz position");
      setQuizCompleted(true);
    },
    onHeartbeat: (data) => {
      console.log("Connection alive");
    },
  });

  // Use SSE currentQuestionId or fallback to initial
  const effectiveQuestionId = sseState.data?.CurrentQuestionId ?? initialCurrentQuestionId;

  // Resolve position from questionId
  const resolvedPosition = useMemo(() => {
    return resolvePosition(effectiveQuestionId);
  }, [effectiveQuestionId, resolvePosition]);

  // Find current question
  const currentQuestion = useMemo(() => {
    if (!effectiveQuestionId || !flattenedQuestions) return null;
    return flattenedQuestions.find((q: any) => q.questionId === effectiveQuestionId);
  }, [flattenedQuestions, effectiveQuestionId]);

  // Clear answers when question changes
  useEffect(() => {
    setStudentAnswers([]);
  }, [effectiveQuestionId]);

  const clearAnswers = useCallback(() => {
    setStudentAnswers([]);
  }, []);

  const getStudentAnswer = useCallback(
    (studentId: string) => {
      return studentAnswers.find((answer) => answer.studentId === studentId);
    },
    [studentAnswers]
  );

  return {
    currentQuestionId: effectiveQuestionId,
    position: resolvedPosition,
    currentQuestion,
    connectionStatus: sseState.connectionStatus,
    error: sseState.error,
    reconnectAttempts: sseState.reconnectAttempts,
    reconnect: (sseState as any).reconnect,
    quizCompleted,
    studentAnswers,
    clearAnswers,
    getStudentAnswer,
  };
}
