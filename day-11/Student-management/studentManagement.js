"use strict";
// DOM elements
const displayRow = document.getElementById("displayRow");
const displayTotalStudents = document.getElementById("totalStudents");
const displayStudentsAboveThreshold = document.getElementById("studentsAboveThreshold");
const displayTopStudent = document.getElementById("topStudent");
const displayClassAverage = document.getElementById("classAverage");
const sortCriteria = document.getElementById("sortCriteria");
const sortButton = document.getElementById("sortButton");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const addStudentButton = document.getElementById("addStudentButton");
const formWrapper = document.querySelector(".form-wrapper");
const form = document.getElementById("studentForm");
const closeFormButton = document.getElementById("closeFormButton");
let students = [
    {
        id: 1,
        name: "Sarah",
        age: 21,
        gender: "female",
        grades: { math: 85, ss: 80, science: 90, english: 78 },
        city: "Ahmedabad",
    },
];
let editingStudentId = null;
// 1. Add student using spread operator
const addStudent = (student) => {
    students = [...students, student];
    return students;
};
// 2. Remove student by id using filter
const removeStudent = (id) => {
    students = students.filter((student) => student.id !== id);
    displayStudents();
    return students;
};
// 3. Update student details using spread operator and map function
const updateStudent = (id, updatedDetails) => {
    students = students.map((student) => {
        return student.id === id ? { ...student, ...updatedDetails } : student;
    });
    displayStudents(students);
    return students;
};
// 4. Find student by name or id using find method of an Array
const findStudent = (searchTerm) => {
    if (typeof searchTerm === "string") {
        return students.find((student) => student.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    else {
        return students.find((student) => student.id === searchTerm);
    }
    return students;
};
// 5. Get average grade per student using reduce method on grades object
const getAverageGrade = (id) => {
    const student = students.find((student) => student.id === id);
    if (student) {
        const grades = Object.values(student.grades);
        const average = grades.reduce((acc, grade) => acc + grade, 0) / grades.length;
        return average;
    }
    return 0;
};
//6. Get Top student based on average grade by iterating through the students array using forEach loop and comparing their average grades
const getTopStudent = () => {
    let topStudent = null;
    let highestAverage = -1;
    students.forEach((student) => {
        const average = getAverageGrade(student.id);
        if (average > highestAverage) {
            highestAverage = average;
            topStudent = student;
        }
    });
    return topStudent;
};
// 7. Get all students above a grade threshold using filter where average grade is compared to the threshold
const getStudentsAboveThreshold = (threshold) => {
    return students.filter((student) => getAverageGrade(student.id) > threshold);
};
// 7b. Generate the next available id
const getNextId = () => {
    if (students.length === 0)
        return 1;
    const maxId = Math.max(...students.map((student) => student.id));
    return maxId + 1;
};
// 7c. Calculate average grade across the whole class
const getClassAverage = () => {
    if (students.length === 0)
        return 0;
    const total = students.reduce((sum, student) => sum + getAverageGrade(student.id), 0);
    return total / students.length;
};
// 8. Sort students by name or grade
const sortStudents = (criteria) => {
    const sortedStudents = [...students].sort((a, b) => {
        if (criteria === "name") {
            return a.name.localeCompare(b.name);
        }
        if (criteria === "grade") {
            return getAverageGrade(b.id) - getAverageGrade(a.id); // highest first
        }
        return 0;
    });
    return sortedStudents;
};
// 9. Display all students (accepts an optional list, defaults to the full students array)
const displayStudents = (list = students) => {
    // Clear existing rows
    displayRow.innerHTML = "";
    list.forEach((student) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.age}</td>
            <td>${student.gender}</td>
            <td>${student.city}</td>
            <td>${getAverageGrade(student.id).toFixed(1)}</td>
            <td>
              <div class="action-menu">
                  <button class="action-btn">⋮</button>

                  <div class="action-dropdown">
                      <button onclick="showSummary(${student.id})">Summary</button>
                      <button onclick="editStudent(${student.id})">Update</button>
                      <button onclick="removeStudent(${student.id})">Remove</button>
                  </div>
              </div>
          </td>
        `;
        displayRow.appendChild(row);
    });
    refreshStats();
};
displayRow.addEventListener("click", (event) => {
    const target = event.target;
    // Toggle the dropdown open/closed
    const actionBtn = target.closest(".action-btn");
    if (actionBtn) {
        const menu = actionBtn.closest(".action-menu");
        // Close any other open menus first
        document.querySelectorAll(".action-menu").forEach((m) => {
            if (m !== menu)
                m.classList.remove("open");
        });
        menu?.classList.toggle("open");
        return;
    }
});
// Clicking anywhere outside an open menu closes it
document.addEventListener("click", (event) => {
    const target = event.target;
    if (!target.closest(".action-menu")) {
        document
            .querySelectorAll(".action-menu")
            .forEach((m) => m.classList.remove("open"));
    }
});
const showSummary = (id) => {
    const student = students.find((student) => student.id === id);
    if (!student)
        return;
    const summary = {
        id: student.id,
        name: student.name,
    };
    alert(`
    ID : ${summary.id}
    Name : ${summary.name}
    Average : ${getAverageGrade(student.id).toFixed(1)}
    City : ${student.city}
    Gender : ${student.gender}
  `);
};
const editStudent = (id) => {
    const student = students.find((s) => s.id === id);
    if (!student)
        return;
    editingStudentId = id;
    document.getElementById("name").value = student.name;
    document.getElementById("age").value = String(student.age);
    document.getElementById("city").value = student.city;
    document.getElementById("gender").value =
        student.gender;
    document.getElementById("maths").value = String(student.grades.math);
    document.getElementById("ss").value = String(student.grades.ss);
    document.getElementById("science").value = String(student.grades.science);
    document.getElementById("english").value = String(student.grades.english);
    formWrapper.classList.add("show-overlay");
};
// 10. Refresh the statistics displayed on the page so every time a student is added, removed, or updated, the stats are recalculated and displayed
const refreshStats = () => {
    displayTotalStudents.textContent = `${students.length}`;
    displayStudentsAboveThreshold.textContent = `${getStudentsAboveThreshold(80).length}`;
    displayClassAverage.textContent = `${getClassAverage().toFixed(1)}`;
    const topStudent = getTopStudent();
    displayTopStudent.textContent = topStudent ? topStudent.name : "None";
};
// Event listeners for sorting and form handling
sortButton.addEventListener("click", () => {
    const sorted = sortStudents(sortCriteria.value);
    displayStudents(sorted);
});
searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.trim();
    const foundStudent = findStudent(searchTerm);
    const filtered = foundStudent ? [foundStudent] : [];
    displayStudents(filtered);
});
// searchButton.addEventListener("click", () => {});
addStudentButton.addEventListener("click", () => {
    editingStudentId = null;
    form.reset();
    formWrapper.classList.add("show-overlay");
});
closeFormButton.addEventListener("click", () => {
    form.reset();
    editingStudentId = null;
    formWrapper.classList.remove("show-overlay");
});
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("name");
    const age = document.getElementById("age");
    const city = document.getElementById("city");
    const gender = document.getElementById("gender");
    const math = document.getElementById("maths");
    const ss = document.getElementById("ss");
    const science = document.getElementById("science");
    const english = document.getElementById("english");
    if (editingStudentId !== null) {
        updateStudent(editingStudentId, {
            name: name.value.trim(),
            age: Number(age.value),
            city: city.value.trim(),
            gender: gender.value,
            grades: {
                math: Number(math.value),
                ss: Number(ss.value),
                science: Number(science.value),
                english: Number(english.value),
            },
        });
    }
    else {
        const newStudent = {
            id: getNextId(),
            name: name.value.trim(),
            age: Number(age.value),
            city: city.value.trim(),
            gender: gender.value,
            grades: {
                math: Number(math.value),
                ss: Number(ss.value),
                science: Number(science.value),
                english: Number(english.value),
            },
        };
        addStudent(newStudent);
    }
    displayStudents();
    form.reset();
    editingStudentId = null;
    formWrapper.classList.remove("show-overlay");
});
displayStudents();
console.log("\n");
addStudent({
    id: 2,
    name: "John",
    age: 22,
    gender: "male",
    grades: { math: 75, ss: 65, science: 80, english: 88 },
    city: "Mumbai",
});
addStudent({
    id: 3,
    name: "Alice",
    age: 20,
    gender: "female",
    grades: { math: 95, ss: 48, science: 92, english: 89 },
    city: "Delhi",
});
addStudent({
    id: 4,
    name: "Bob",
    age: 23,
    gender: "male",
    grades: { math: 65, ss: 82, science: 70, english: 75 },
    city: "Bangalore",
});
displayStudents();
