import React, {useState, useEffect} from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, TablePagination} from "@mui/material";
import { IUniversityStudent, IUniversityClass } from "../types/api_types";
import { calcAllFinalGrade } from "../utils/calculate_grade";

interface StudentTableProps {
  student: IUniversityStudent[];
  classId: string;
  className: string;
}

interface IFinalGrade {
  studentId: string;
  finalGrade: number;
}

const StudentTable: React.FC<StudentTableProps> = ({ student, classId, className }) => {
  //I think it might be an nice idea to be sort the student in an acceding order base on their BUID
  //I saw that was also what the image did
  //what a stupid shitting bug, the student is an array within an array
  //leave me alone......
  const flattenedStudents = student.flat();
  const sortedStudents = flattenedStudents.filter(student => student && student.universityId).sort((a, b) => a.universityId.localeCompare(b.universityId));

  //console.log(student);
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [finalGrades, setFinalGrades] = useState<IFinalGrade[]>([]);



  useEffect(() => {
    //console.log("classId changed:", classId);
    const fetchFinalGrades = async () => {
      const grades = await calcAllFinalGrade(classId);
      setFinalGrades(grades);
    };
    if (classId) {
      fetchFinalGrades();
    }
  }, [classId]);
  
  //console.log("Final Grades State:", finalGrades);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getFinalGrade = (studentId: string) => {
    console.log("only printing:",typeof(finalGrades))
    const grade = finalGrades.find((g) => g.studentId === studentId);
    return grade ? grade.finalGrade.toString() : "";
  };
  
  
  

  return (
    <div>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Student ID</TableCell>
          <TableCell>Student Name</TableCell>
          <TableCell>Class ID</TableCell>
          <TableCell>Class Name</TableCell>
          <TableCell>Semester</TableCell>
          <TableCell>Final Grade</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sortedStudents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((student) => (
          <TableRow key={student.universityId}>
            <TableCell>{student.universityId}</TableCell>
            <TableCell>{student.name}</TableCell>
            <TableCell>{classId}</TableCell>
            <TableCell>{className}</TableCell>
            <TableCell>fall2022</TableCell>
            <TableCell>{getFinalGrade(student.universityId)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    <TablePagination
    component="div"
    count={sortedStudents.length}
    page={page}
    onPageChange={handleChangePage}
    rowsPerPage={rowsPerPage}
    onRowsPerPageChange={handleChangeRowsPerPage}
    rowsPerPageOptions={[5, 10, 25, 100]}
  />
</div>
  );
};


export default StudentTable;
