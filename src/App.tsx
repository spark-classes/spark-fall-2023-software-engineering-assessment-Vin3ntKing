import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { Select, Typography } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import StudentTable from "./components/GradeTable";



/**
 * You will find globals from this file useful!
 */
import { constructApiUrl, GET_DEFAULT_HEADERS, TOKEN } from "./globals";
import { IUniversityClass, IUniversityStudent, IAssignment, IGrade} from "./types/api_types";
import { calcAllFinalGrade } from "./utils/calculate_grade";

function App() {
  // You will need to use more of these!
  const [currClassId, setCurrClassId] = useState<string>("");
  const [classList, setClassList] = useState<IUniversityClass[]>([]);
  const [currClassName, setCurrClassName] = useState<string>("");
  const [studentsInClass, setStudentsInClass] = useState<IUniversityStudent[]>([]);
  //console.log(GET_DEFAULT_HEADERS)
  //console.log(constructApiUrl('/student/findByStatus/enrolled'))

  /**
   * This is JUST an example of how you might fetch some data(with a different API).
   * As you might notice, this does not show up in your console right now.
   * This is because the function isn't called by anything!
   *
   * You will need to lookup how to fetch data from an API using React.js
   * Something you might want to look at is the useEffect hook.
   *
   * The useEffect hook will be useful for populating the data in the dropdown box.
   * You will want to make sure that the effect is only called once at component mount.
   *
   * You will also need to explore the use of async/await.
   *
   */

  const fetchStudentInfo = async (universityId: string): Promise<IUniversityStudent> => {
    const res = await fetch(constructApiUrl('student/getById/' + universityId), {
      method: "GET",
      headers: GET_DEFAULT_HEADERS(),
    });
    const json = await res.json();
    return json;
  };
  //fetchStudentInfo('U125')
  //fetchSomeData()

  //I would use the following function to fetch the class info in the fall2022 semester
  //since in the documentation, we should only fetch class info in fall2022
  const fetchClassInfo = async () => {
    const res = await fetch(constructApiUrl('class/listBySemester/fall2022'), {
      method: "GET",
      headers: GET_DEFAULT_HEADERS(),
    });
    const json = await res.json();
    //feed the return data to setClassList for dropdown box
    setClassList(json);
    //console.log(json)
  }
  

  //create a function to fetch student infomation corresponding to a class:
  const fetchStudentInClass = async (classID: string) => {
    const res = await fetch(constructApiUrl("class/listStudents/" + classID), {
      method: "GET",
      headers: GET_DEFAULT_HEADERS(),
    });
    const json = await res.json();
    const studentPromises = json.map((universityId: string) => fetchStudentInfo(universityId));
    const students = await Promise.all(studentPromises);
    setStudentsInClass(students);
  };
  fetchStudentInClass('C129')

  //for the calculating part: lets start with simple get all the course assignment and student's grade on one class
  const fetchClassAssignment = async (classId: string): Promise<IAssignment> => {
    const res = await fetch(constructApiUrl('class/listAssignments/' + classId), {
      method: "GET",
      headers: GET_DEFAULT_HEADERS(),
    });
    const json = await res.json();
    //console.log(json)
    return json;
  }; 
  //fetchClassAssignment('C129')

  const fetchStudentGradeInClass =async (studentId: string, classId: string): Promise<IGrade> => {
    const res = await fetch(constructApiUrl('student/listGrades/' +studentId + '/'+ classId), {
      method: "GET",
      headers: GET_DEFAULT_HEADERS(),
    });
    const json = await res.json();
    //console.log(json)
    return json;
  }
  //fetchStudentGradeInClass('U123','C129')

  useEffect(() => {
    fetchClassInfo();
  }, []);

  const handleClassChange = (event: SelectChangeEvent<string>) => {
    setCurrClassId(event.target.value);
    fetchStudentInClass(event.target.value);

    const selectedClass = classList.find((classInfo) => classInfo.classId === event.target.value);
    if (selectedClass) {
      setCurrClassName(selectedClass.title);
    } else {
      setCurrClassName("");
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Grid container spacing={2} style={{ padding: "1rem" }}>
        <Grid xs={12} container alignItems="center" justifyContent="center">
          <Typography variant="h2" gutterBottom>
            Spark Assessment
          </Typography>
        </Grid>
        <Grid xs={12} md={4}>
          <Typography variant="h4" gutterBottom>
            Select a class
          </Typography>
          <div style={{ width: "100%" }}>
          <Select
            fullWidth={true}
            label="Class"
            value={currClassId}
            onChange={handleClassChange}
            native
          >
            <option value="">Select a class</option>
            {classList.map((classInfo) => (
              <option key={classInfo.classId} value={classInfo.classId}>
                {classInfo.title}
              </option>
            ))}
          </Select>
          </div>
        </Grid>
        <Grid xs={12} md={8}>
          <Typography variant="h4" gutterBottom>
            Final Grades
          </Typography>
          <div>Place the grade table here
              {/*if the return class has no student or we select back to the null option, we empty the table/does not display any table*/}
              {studentsInClass.length > 0 && currClassId !== "" && (
              <StudentTable student={studentsInClass} classId={currClassId} className={currClassName} />
            )}
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
