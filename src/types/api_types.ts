/**
 * This file can be used to store types and interfaces for data received from the API.
 * It's good practice to name your interfaces in the following format:
 * IMyInterfaceName - Where the character "I" is prepended to the name of your interface.
 * This helps remove confusion between classes and interfaces.
 */

/**
 * This represents a class as returned by the API
 */
export interface IUniversityClass {
  classId: string;
  title: string;
  description: string;
  meetingTime: string;
  meetingLocation: string;
  status: string;
  semester: string;
}

export interface IUniversityStudent {
  dateEnrolled: string;
  name:	string;
  status:	string;
  universityId:	string;
}

export interface IAssignment {
  assignmentId:	string;
  classId:	string;
  date:	Date; 
  weight:	number;
}

export interface IGrade {
  classId: string;
  grades: Record<string, string>[];
  name: string;
  studentId: string;
}

