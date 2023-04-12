/**
 * This file contains some function stubs(ie incomplete functions) that
 * you MUST use to begin the work for calculating the grades.
 *
 * You may need more functions than are currently here...we highly encourage you to define more.
 *
 * Anything that has a type of "undefined" you will need to replace with something.
 */
import { IAssignment, IGrade, IUniversityClass, IUniversityStudent } from "../types/api_types";
import { constructApiUrl, GET_DEFAULT_HEADERS } from "../globals";

export interface IFinalGrade {
  studentId: string;
  finalGrade: number;
}

export const fetchClassAssignment = async (classId: string): Promise<IAssignment[]> => {
  const res = await fetch(constructApiUrl("class/listAssignments/" + classId), {
    method: "GET",
    headers: GET_DEFAULT_HEADERS(),
  });
  const json = await res.json();
  return json;
};

export const fetchStudentGradeInClass = async (
  studentId: string,
  classId: string
): Promise<IGrade> => {
  const res = await fetch(constructApiUrl("student/listGrades/" + studentId + "/" + classId), {
    method: "GET",
    headers: GET_DEFAULT_HEADERS(),
  });
  const json = await res.json();
  return json;
};

export const fetchClassDetails = async (classId: string) => {
  const res = await fetch(constructApiUrl('class/listBySemester/fall2022/' + classId), {
    method: "GET",
    headers: GET_DEFAULT_HEADERS(),
  });
  const json = await res.json();
  return json;
};
export const fetchStudentInfo = async (universityId: string): Promise<IUniversityStudent> => {
  const res = await fetch(constructApiUrl('student/getById/' + universityId), {
    method: "GET",
    headers: GET_DEFAULT_HEADERS(),
  });
  const json = await res.json();
  return json;
};
// Modify this function to fetch the list of students in the class by class ID
export const fetchClassStudents = async (classID: string): Promise<string[]> => {
  const res = await fetch(constructApiUrl("class/listStudents/" + classID), {
    method: "GET",
    headers: GET_DEFAULT_HEADERS(),
  });
  const json = await res.json();
  return Object.values(json);
};

export const fetchClass = async (classID: string):Promise<IUniversityClass> => {
  const res = await fetch(constructApiUrl("class/GetById/" + classID), {
    method: "GET",
    headers: GET_DEFAULT_HEADERS(),
  });
  const json = await res.json();
  return json;
};

/**
 * This function might help you write the function below.
 * It retrieves the final grade for a single student based on the passed params.
 * 
 * If you are reading here and you haven't read the top of the file...go back.
 */
export async function calculateStudentFinalGrade(
  studentID: string,
  classAssignments: IAssignment[],
  klass: IUniversityClass
): Promise<number> {
  const studentGrades = await fetchStudentGradeInClass(studentID, klass.classId);
  const gradeObject: Record<string, string> = studentGrades.grades[0];
  let weightedGradeSum = 0;
  
  for (const assignment of classAssignments) {
    const grade = Number(gradeObject[assignment.assignmentId]);
    if (!isNaN(grade)) {
      weightedGradeSum += grade * (assignment.weight/100);
    }
  }

  return weightedGradeSum;
}




//thinking: to calculate the final grade of a student:
/*  
  <classID> first we need a class
  <List of Assignment> with respect to a specfic class: need to weights
  <student>{
    1. we can get list of student with using ​/class​/listStudents​/{classId}
    2. it returns the studentID in the class using classId and studentID => we can get the each assignment's grade of a student and the name of the student
  }
  Then we can calculate the grade base on $grade_{final} = \sum(grade_i*weight_i)$
*/



/**
 * You need to write this function! You might want to write more functions to make the code easier to read as well.
 * 
 *  If you are reading here and you haven't read the top of the file...go back.
 * 
 * @param classID The ID of the class for which we want to calculate the final grades
 * @returns Some data structure that has a list of each student and their final grade.
 */
export async function calcAllFinalGrade(classID: string): Promise<IFinalGrade[]> {
  const finalGrades: IFinalGrade[] = [];

  const studentsInClass = await fetchClassStudents(classID);
  const classAssignments = await fetchClassAssignment(classID);
  const klass = await fetchClass(classID);

  // Use Promise.all to wait for all final grade calculations to complete
  const finalGradePromises = studentsInClass.map(async (student) => {
    const studentID = student;
    const finalGrade = await calculateStudentFinalGrade(studentID, classAssignments, klass);
    finalGrades.push({ studentId: studentID, finalGrade });
  });

  await Promise.all(finalGradePromises);

  return finalGrades;
}








