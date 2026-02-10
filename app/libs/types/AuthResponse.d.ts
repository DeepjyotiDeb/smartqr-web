type LoginResponse = {
	token: string;
	user: {
		userId: number;
		title: string;
		userName: string;
		firstName: string;
		lastName: string;
		verified: boolean;
		studentNumber: string;
		dateJoined: string;
		email: string;
		gender: string;
		dateOfBirth: string;
		misId: string;
		userRole: string;
		studentDetails: StudentDetails;
		teacherDetails: TeacherDetails;
	};
};

type StudentDetails = {
	// Define student details structure if available
};

type TeacherDetails = {
	teacherId: number;
	schoolId: string;
	isSchoolAdministrator: boolean;
	schoolMembershipStatus: string;
	dateCreated: string;
	misId: string;
	cleverId: string;
};
