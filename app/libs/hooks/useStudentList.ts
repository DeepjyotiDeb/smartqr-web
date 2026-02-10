import { useCallback, useEffect, useMemo, useState } from 'react';

interface Student {
  studentId: string;
  studentName: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  studentCode?: string;
}

interface StudentWithStatus extends Student {
  hasAnswered: boolean;
  answer?: string;
  timestamp?: string;
}

interface StudentAnswer {
  studentId: string;
  studentName: string;
  questionId: string;
  answer: string;
  timestamp: string;
}

interface UseStudentListOptions {
  students: Student[] | undefined;
  studentAnswers: StudentAnswer[];
  getStudentAnswer: (studentId: string) => StudentAnswer | undefined;
}

export function useStudentList({
  students,
  studentAnswers,
  getStudentAnswer,
}: UseStudentListOptions) {
  const [studentsWithStatus, setStudentsWithStatus] = useState<StudentWithStatus[]>([]);

  // Combine static student data with real-time answer status
  useEffect(() => {    
    if (students && Array.isArray(students)) {
      const studentsWithStatusData: StudentWithStatus[] = students.map((student: Student) => {
        const answer = getStudentAnswer(student.studentId.toString());
        
        return {
          ...student,
          hasAnswered: answer ? true : false,
          answer: answer?.answer,
          timestamp: answer?.timestamp,
        };
      });

      setStudentsWithStatus(studentsWithStatusData);
    }
  }, [students, studentAnswers, getStudentAnswer]);

  // Get statistics
  const stats = useMemo(() => {
    const total = studentsWithStatus.length;
    const answered = studentsWithStatus.filter(s => s.hasAnswered).length;
    const pending = total - answered;
    const percentage = total > 0 ? Math.round((answered / total) * 100) : 0;

    return {
      total,
      answered,
      pending,
      percentage,
    };
  }, [studentsWithStatus]);

  // Get students by status
  const studentsByStatus = useMemo(() => {
    return {
      answered: studentsWithStatus.filter(s => s.hasAnswered),
      pending: studentsWithStatus.filter(s => !s.hasAnswered),
    };
  }, [studentsWithStatus]);

  // Clear all answers (useful when moving to next question)
  const clearAnswers = useCallback(() => {
    setStudentsWithStatus(prev => 
      prev.map(student => ({
        ...student,
        hasAnswered: false,
        answer: undefined,
        timestamp: undefined,
      }))
    );
  }, []);

  // Get student by ID
  const getStudentById = useCallback((studentId: string) => {
    return studentsWithStatus.find(s => s.studentId === studentId);
  }, [studentsWithStatus]);

  return {
    students: studentsWithStatus,
    stats,
    studentsByStatus,
    clearAnswers,
    getStudentById,
  };
}
