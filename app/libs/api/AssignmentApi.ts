import useSWR from "swr";
import api from "~/libs/api/api";

async function fetchAssignmentsByGroupId(groupId: string) {
  const response = await api.get(`/assignments?classId=${groupId}`);
  return response.data;
}
async function fetchQuizSessionByAssignmentId(assignmentId: string) {
  const response = await api.get(`/quiz-sessions/${assignmentId}?includeAnswers=false`);
  return response.data;
}
async function fetchPublicQuizSessionByAssignmentId(liveSessionId: string) {
  const response = await api.get(`/quiz-sessions/web/${liveSessionId}`);
  return response.data;
}

export function useAssignmentsByGroupId(classId: string | undefined) {
  const { data, isLoading, error, mutate } = useSWR(`'assignments', ${classId}`, async () =>
    fetchAssignmentsByGroupId(classId as string)
  );

  return {
    assignments: data,
    isLoading,
    error,
    mutate,
  };
}

export function useQuizSessionByAssignmentId(assignmentId: string | undefined) {
  const { data, error, isLoading, mutate } = useSWR(`quizSession, ${assignmentId}`, async () =>
    fetchQuizSessionByAssignmentId(assignmentId as string)
  );

  return {
    quizSession: data,
    error,
    isLoading,
    mutate,
  };
}
export function usePublicQuizSessionByAssignmentId(assignmentId: string | undefined) {
  const { data, error, isLoading, mutate } = useSWR(`quizSession, ${assignmentId}`, async () =>
    fetchPublicQuizSessionByAssignmentId(assignmentId as string)
  );

  return {
    quizSession: data,
    error,
    isLoading,
    mutate,
  };
}

export function useQuizQrNew() {
  const { data, error, isLoading, mutate } = useSWR(
    "quizQrNew",
    async () => {
      const response = await api.get("/quiz-sessions/web/qr");
      return response.data;
    },
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
    }
  );
  // console.count('Fetching QR Code');
  return {
    qrCode: data,
    error,
    isLoading,
    mutate,
  };
}
