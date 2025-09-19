// Student Marks System JavaScript

class StudentMarksSystem {
    constructor() {
        // Initial data from the provided JSON
        this.originalStudents = [
            {"name": "Amit", "marks": 85},
            {"name": "Priya", "marks": 92},
            {"name": "Rahul", "marks": 76},
            {"name": "Sneha", "marks": 88},
            {"name": "Karan", "marks": 95}
        ];
        
        // Current students array (copy of original)
        this.students = [...this.originalStudents];
        
        // DOM elements
        this.studentsTbody = document.getElementById('students-tbody');
        this.totalStudentsEl = document.getElementById('total-students');
        this.resultsDisplay = document.getElementById('results-display');
        this.resultText = document.getElementById('result-text');
        this.addStudentForm = document.getElementById('add-student-form');
        this.studentNameInput = document.getElementById('student-name');
        this.studentMarksInput = document.getElementById('student-marks');
        
        // Initialize the application
        this.init();
    }
    
    init() {
        this.renderTable();
        this.updateTotalCount();
        this.bindEventListeners();
    }
    
    bindEventListeners() {
        // Control buttons
        document.getElementById('show-highest').addEventListener('click', () => this.showHighest());
        document.getElementById('show-average').addEventListener('click', () => this.showAverage());
        document.getElementById('sort-marks').addEventListener('click', () => this.sortByMarks());
        document.getElementById('reset-sample').addEventListener('click', () => this.resetSample());
        document.getElementById('remove-last').addEventListener('click', () => this.removeLast());
        
        // Add student form
        this.addStudentForm.addEventListener('submit', (e) => this.addStudent(e));
        
        // Close result button
        document.getElementById('close-result').addEventListener('click', () => this.hideResults());
    }
    
    renderTable() {
        this.studentsTbody.innerHTML = '';
        
        this.students.forEach((student, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.name}</td>
                <td>${student.marks}</td>
            `;
            this.studentsTbody.appendChild(row);
        });
    }
    
    updateTotalCount() {
        this.totalStudentsEl.textContent = `Total students: ${this.students.length}`;
    }
    
    showHighest() {
        if (this.students.length === 0) {
            this.showResult('No students to display!', 'error');
            return;
        }
        
        const highest = Math.max(...this.students.map(student => student.marks));
        const highestStudent = this.students.find(student => student.marks === highest);
        
        // Clear previous highlights
        this.clearHighlights();
        
        // Highlight the highest scoring student
        const rows = this.studentsTbody.querySelectorAll('tr');
        const highestIndex = this.students.findIndex(student => student.marks === highest);
        if (rows[highestIndex]) {
            rows[highestIndex].classList.add('highlight');
        }
        
        this.showResult(`Highest marks: ${highestStudent.name} with ${highest} marks`);
    }
    
    showAverage() {
        if (this.students.length === 0) {
            this.showResult('No students to calculate average!', 'error');
            return;
        }
        
        const total = this.students.reduce((sum, student) => sum + student.marks, 0);
        const average = (total / this.students.length).toFixed(1);
        
        this.clearHighlights();
        this.showResult(`Class average: ${average} marks`);
    }
    
    sortByMarks() {
        if (this.students.length === 0) {
            this.showResult('No students to sort!', 'error');
            return;
        }
        
        // Sort by marks in descending order
        this.students.sort((a, b) => b.marks - a.marks);
        this.renderTable();
        this.clearHighlights();
        this.showResult('Students sorted by marks (highest to lowest)');
    }
    
    resetSample() {
        this.students = [...this.originalStudents];
        this.renderTable();
        this.updateTotalCount();
        this.clearHighlights();
        this.showResult('Sample data restored');
    }
    
    removeLast() {
        if (this.students.length === 0) {
            this.showResult('No students to remove!', 'error');
            return;
        }
        
        const removedStudent = this.students.pop();
        this.renderTable();
        this.updateTotalCount();
        this.clearHighlights();
        this.showResult(`Removed ${removedStudent.name} from the list`);
    }
    
    addStudent(e) {
        e.preventDefault();
        
        const name = this.studentNameInput.value.trim();
        const marks = parseInt(this.studentMarksInput.value);
        
        // Validation
        if (!name) {
            this.showResult('Please enter a student name!', 'error');
            return;
        }
        
        if (isNaN(marks) || marks < 0 || marks > 100) {
            this.showResult('Please enter valid marks (0-100)!', 'error');
            return;
        }
        
        // Check for duplicate names
        const existingStudent = this.students.find(student => 
            student.name.toLowerCase() === name.toLowerCase()
        );
        
        if (existingStudent) {
            this.showResult('A student with this name already exists!', 'error');
            return;
        }
        
        // Add the new student
        this.students.push({ name, marks });
        this.renderTable();
        this.updateTotalCount();
        this.clearHighlights();
        
        // Clear form
        this.addStudentForm.reset();
        
        this.showResult(`Added ${name} with ${marks} marks to the list`);
    }
    
    showResult(message, type = 'success') {
        this.resultText.textContent = message;
        
        // Update styling based on type
        this.resultsDisplay.className = 'results-display';
        if (type === 'error') {
            this.resultsDisplay.style.backgroundColor = 'rgba(255, 84, 89, 0.1)';
            this.resultsDisplay.style.borderColor = 'rgba(255, 84, 89, 0.3)';
        } else {
            this.resultsDisplay.style.backgroundColor = 'rgba(34, 197, 94, 0.1)';
            this.resultsDisplay.style.borderColor = 'rgba(34, 197, 94, 0.3)';
        }
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.hideResults();
        }, 5000);
    }
    
    hideResults() {
        this.resultsDisplay.classList.add('hidden');
        this.clearHighlights();
    }
    
    clearHighlights() {
        const highlightedRows = this.studentsTbody.querySelectorAll('tr.highlight');
        highlightedRows.forEach(row => row.classList.remove('highlight'));
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new StudentMarksSystem();
});

// Additional utility functions for enhanced user experience
function validateInput(input, min, max) {
    const value = parseInt(input.value);
    if (isNaN(value) || value < min || value > max) {
        input.setCustomValidity(`Please enter a number between ${min} and ${max}`);
    } else {
        input.setCustomValidity('');
    }
}

// Real-time validation for marks input
document.addEventListener('DOMContentLoaded', () => {
    const marksInput = document.getElementById('student-marks');
    if (marksInput) {
        marksInput.addEventListener('input', () => {
            validateInput(marksInput, 0, 100);
        });
    }
});