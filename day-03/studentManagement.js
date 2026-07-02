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

// Data structure
let students = [
    {
        id: 1,
        name: "Sarah",
        age: 21,
        grades: { math: 85, science: 90, english: 78 },
        city: "Ahmedabad"
    }
]

// 1. Add student using spread operator
const addStudent = (student) => {
    students = [...students, student]
    return students
}

// 2. Remove student by id using filter
const removeStudent = (id) => {
    students = students.filter(student => student.id !== id)
    displayStudents()
    return students
}
// 3. Update student details using spread operator and map function
const updateStudent = (id, updatedDetails) => {
    students = students.map(student => {
        return student.id === id ? { ...student, ...updatedDetails } : student
    })
    return students
}
// 4. Find student by name or id using find method of an Array
const findStudent = (searchTerm) => {
    return students.find(student => student.name === searchTerm || student.id === searchTerm)
}
// 5. Get average grade per student using reduce method on grades object
const getAverageGrade = (id) => {
    const student = students.find(student => student.id === id)
    if (student) {
        const grades = Object.values(student.grades)
        const average = grades.reduce((acc, grade) => acc + grade, 0) / grades.length
        return average
    }
}

//6. Get Top student based on average grade by iterating through the students array using forEach loop and comparing their average grades
const getTopStudent = () => {
    let topStudent = null;
    let highestAverage = -1;
    students.forEach(student => {
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
    return students.filter(student => getAverageGrade(student.id) > threshold)
}

// 7b. Generate the next available id
const getNextId = () => {
    if (students.length === 0) return 1
    const maxId = Math.max(...students.map(student => student.id))
    return maxId + 1
}

// 7c. Calculate average grade across the whole class
const getClassAverage = () => {
    if (students.length === 0) return 0
    const total = students.reduce((sum, student) => sum + getAverageGrade(student.id), 0)
    return total / students.length
}

// 8. Sort students by name or grade
const sortStudents = (criteria) => {
    const sortedStudents = [...students].sort((a, b) => {
        if (criteria === "name") {
            return a.name.localeCompare(b.name) 
        }
        if (criteria === "grade") {
            return getAverageGrade(b.id) - getAverageGrade(a.id)  // highest first
        }
        return 0
    })
    return sortedStudents
}


// 9. Display all students (accepts an optional list, defaults to the full students array)
const displayStudents = (list = students) => {
    // Clear existing rows
    displayRow.innerHTML = '';

    list.forEach(student => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.age}</td>
            <td>${student.city}</td>
            <td>${getAverageGrade(student.id).toFixed(1)}</td>
            <td><button onclick="removeStudent(${student.id})">Remove</button></td>
        `;
        displayRow.appendChild(row);
    })
    refreshStats()
}

// 10. Refresh the statistics displayed on the page so every time a student is added, removed, or updated, the stats are recalculated and displayed
const refreshStats = () => {
    displayTotalStudents.textContent = `${students.length}`
    displayStudentsAboveThreshold.textContent = `${getStudentsAboveThreshold(80).length}`
    displayClassAverage.textContent = `${getClassAverage().toFixed(1)}`

    const topStudent = getTopStudent()
    displayTopStudent.textContent = topStudent ? topStudent.name : "None"
}

// Event listeners for sorting and form handling
sortButton.addEventListener("click", () => {
    const sorted = sortStudents(sortCriteria.value)
    displayStudents(sorted)
});

searchButton.addEventListener("click", () => {
    const searchTerm = searchInput.value.trim()
    const filtered = findStudent(searchTerm) ? [findStudent(searchTerm)] : []
    displayStudents(filtered)
})

addStudentButton.addEventListener("click", () => {
    formWrapper.classList.add("show-overlay");
})

closeFormButton.addEventListener("click", () => {
    form.reset()
    formWrapper.classList.remove("show-overlay");
})

form.addEventListener("submit", (event) => {
    event.preventDefault()

    const name = document.getElementById("name").value.trim()
    const age = Number(document.getElementById("age").value)
    const city = document.getElementById("city").value.trim()
    const math = Number(document.getElementById("maths").value)
    const science = Number(document.getElementById("science").value)
    const english = Number(document.getElementById("english").value)

    const newStudent = {
        id: getNextId(),
        name,
        age,
        city,
        grades: { math, science, english }
    }

    addStudent(newStudent)
    displayStudents()

    form.reset()
    formWrapper.classList.remove("show-overlay")
})

displayStudents()
console.log("\n")
addStudent({ id: 2, name: "John", age: 22, grades: { math: 75, science: 80, english: 88 }, city: "Mumbai" })
addStudent({ id: 3, name: "Alice", age: 20, grades: { math: 95, science: 92, english: 89 }, city: "Delhi" })
addStudent({ id: 4, name: "Bob", age: 23, grades: { math: 65, science: 70, english: 75 }, city: "Bangalore" })
displayStudents()
