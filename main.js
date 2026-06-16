// Load existing courses from localStorage, or start with empty array
let courses = JSON.parse(localStorage.getItem("courses")) || [];

// Save courses to localStorage whenever we make changes
function saveCourses() {
  localStorage.setItem("courses", JSON.stringify(courses));
}

// Run when page loads
renderTable();
updateStats();

//add courses
function addCourse() {
  // Read values from the form
  const name = document.getElementById("courseName").value.trim();
  const credits = parseInt(document.getElementById("credits").value);
  const grade = parseFloat(document.getElementById("grade").value);

  // Validate — make sure nothing is empty
  if (!name || !credits || isNaN(grade)) {
    alert("Please fill in all fields.");
    return;
  }

  // Add new course to our list
  courses.push({ name, credits, grade });
  saveCourses();

  // Clear the form
  document.getElementById("courseName").value = "";
  document.getElementById("credits").value = "";
  document.getElementById("grade").value = "";

  // Refresh the table and stats
  renderTable();
  updateStats();
}

//calcuate CGPA

function calculateCGPA(courseList) {
  if (courseList.length === 0) return null;

  let totalPoints = 0;
  let totalCredits = 0;

  courseList.forEach(course => {
    totalPoints += course.grade * course.credits;
    totalCredits += course.credits;
  });

  return (totalPoints / totalCredits).toFixed(2);
}

function updateStats() {
  const cgpa = calculateCGPA(courses);
  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);

  document.getElementById("cgpaDisplay").textContent = cgpa || "—";
  document.getElementById("creditsDisplay").textContent = totalCredits;
}

//render table

function renderTable() {
  const tbody = document.getElementById("tableBody");
  const emptyMsg = document.getElementById("emptyMsg");

  tbody.innerHTML = ""; // Clear existing rows

  if (courses.length === 0) {
    emptyMsg.style.display = "block";
    return;
  }

  emptyMsg.style.display = "none";

  const gradeLabels = {
    10: "O", 9: "A+", 8: "A", 7: "B+", 6: "B", 5: "C", 4: "D", 0: "F"
  };

  courses.forEach((course, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${course.name}</td>
      <td>${course.credits}</td>
      <td>${gradeLabels[course.grade] || course.grade}</td>
      <td>${(course.grade * course.credits).toFixed(0)}</td>
      <td><button class="delete-btn" onclick="deleteCourse(${index})">✕</button></td>
    `;
    tbody.appendChild(row);
  });
}

function deleteCourse(index) {
  courses.splice(index, 1); // Remove 1 item at this index
  saveCourses();
  renderTable();
  updateStats();
}

//preditor function
function predict() {
  const futureGrade = parseFloat(document.getElementById("futureGrade").value);
  const futureCredits = parseInt(document.getElementById("futureCredits").value);

  if (!futureCredits || isNaN(futureCredits)) {
    alert("Please enter future credits.");
    return;
  }

  // Create a fake combined list: existing courses + future scenario
  const futureCourse = { name: "Future", credits: futureCredits, grade: futureGrade };
  const combined = [...courses, futureCourse];

  const predicted = calculateCGPA(combined);
  document.getElementById("predictedCgpa").textContent = predicted;
}
