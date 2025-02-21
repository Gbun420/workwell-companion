const canvas = document.getElementById('workCanvas');
const ctx = canvas.getContext('2d');
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let schedule = JSON.parse(localStorage.getItem('schedule')) || [];
let timerProgress = 1;
let isSensoryBreak = false;
let currentScene = 'sky';

// Draw main interface
function drawInterface() {
    ctx.clearRect(0, 0, 800, 600);
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, 800, 600);
    ctx.fillStyle = '#FFF';
    ctx.font = '24px Arial';

    if (!isSensoryBreak) {
        drawSchedule();
        drawTasks();
        drawTimer();
        drawButtons();
        drawSettings();
    } else {
        drawSensoryBreak();
    }
}

// Visual Schedules
function drawSchedule() {
    ctx.fillStyle = '#FFF';
    ctx.fillText('Daily Schedule', 10, 30);
    schedule.forEach((task, index) => {
        ctx.fillStyle = '#00B4D8';
        ctx.fillRect(task.x || 50, task.y || 50 + index * 60, 200, 50);
        ctx.fillStyle = '#FFF';
        ctx.fillText(`${task.time} - ${task.name}`, 60, 80 + index * 60);
    });
}

// Drag and drop for tasks
let isDragging = false;
let draggedTask = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

canvas.addEventListener('mousedown', (e) => {
    const x = e.clientX - canvas.offsetLeft;
    const y = e.clientY - canvas.offsetTop;
    schedule.forEach((task, index) => {
        if (x > (task.x || 50) && x < (task.x || 250) && y > (task.y || 50 + index * 60) && y < (task.y || 100 + index * 60)) {
            isDragging = true;
            draggedTask = { ...task, index };
            dragOffsetX = x - (task.x || 50);
            dragOffsetY = y - (task.y || 50 + index * 60);
        }
    });
});

canvas.addEventListener('mousemove', (e) => {
    if (isDragging && draggedTask) {
        const x = e.clientX - canvas.offsetLeft - dragOffsetX;
        const y = e.clientY - canvas.offsetTop - dragOffsetY;
        schedule[draggedTask.index].x = Math.max(50, Math.min(x, 550));
        schedule[draggedTask.index].y = Math.max(50, Math.min(y, 500));
        drawInterface();
    }
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
    draggedTask = null;
    localStorage.setItem('schedule', JSON.stringify(schedule));
});

// Add Task (via Canvas click)
canvas.addEventListener('click', (e) => {
    const x = e.clientX - canvas.offsetLeft;
    const y = e.clientY - canvas.offsetTop;
    if (x > 10 && x < 210 && y > 500 && y < 550) { // Add Task button area
        const taskName = prompt('Enter task name (e.g., Meeting):');
        const taskTime = prompt('Enter time (e.g., 9:00-10:00 AM):');
        if (taskName && taskTime) {
            schedule.push({ name: taskName, time: taskTime, x: 50, y: 50 + schedule.length * 60 });
            drawInterface();
            localStorage.setItem('schedule', JSON.stringify(schedule));
        }
    }
    // Task checkbox toggle
    tasks.forEach((task, index) => {
        if (x > 310 && x < 350 && y > 100 + index * 30 && y < 130 + index * 30) {
            tasks[index].completed = !tasks[index].completed;
            ctx.fillText(`☑ ${task.name}`, 310, 100 + index * 30);
            ctx.fill();
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    });
    // Sensory Break button
    if (x > 650 && x < 770 && y > 500 && y < 550) {
        isSensoryBreak = !isSensoryBreak;
        drawInterface();
    }
    // Settings button
    if (x > 700 && x < 790 && y > 10 && y < 40) {
        toggleSettings();
    }
});

// Task Management
function drawTasks() {
    ctx.fillStyle = '#FFF';
    ctx.fillText('Tasks', 310, 30);
    tasks.forEach((task, index) => {
        ctx.fillStyle = task.completed ? '#888' : '#FFF';
        const priorityColor = task.priority === 'High' ? '#FF4136' : task.priority === 'Medium' ? '#FFDC00' : '#2ECC40';
        ctx.fillText(`☐ ${task.name} [${task.priority}]`, 310, 100 + index * 30);
    });
}

// Add Task Button
function drawButtons() {
    ctx.fillStyle = '#00B4D8';
    ctx.fillRect(10, 500, 200, 50);
    ctx.fillStyle = '#FFF';
    ctx.fillText('Add Task', 20, 530);
    ctx.fillRect(650, 500, 120, 50);
    ctx.fillStyle = '#FFF';
    ctx.fillText('Sensory Break', 660, 530);
}

// Timers
function drawTimer() {
    ctx.beginPath();
    ctx.arc(400, 300, 100, -Math.PI / 2, (timerProgress * 2 - 0.5) * Math.PI, false);
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#00B4D8';
    ctx.stroke();
    timerProgress -= 0.001;
    if (timerProgress <= 0) {
        timerProgress = 1;
        canvas.classList.add('vibrate');
        setTimeout(() => canvas.classList.remove('vibrate'), 200);
    }
    requestAnimationFrame(drawTimer);
}

// Sensory Regulation
function drawSensoryBreak() {
    ctx.fillStyle = currentScene === 'sky' ? '#87CEEB' : '#2ECC40'; // Sky or Forest
    ctx.fillRect(0, 0, 800, 600);
    ctx.fillStyle = '#FFF';
    ctx.font = '24px Arial';
    ctx.fillText('Take a Break', 350, 300);

    let cloudX = 100;
    function animateElements() {
        ctx.clearRect(0, 0, 800, 600);
        ctx.fillStyle = currentScene === 'sky' ? '#87CEEB' : '#2ECC40';
        ctx.fillRect(0, 0, 800, 600);
        ctx.beginPath();
        ctx.arc(cloudX, 200, 50, 0, Math.PI * 2);
        ctx.fillStyle = '#E0E0E0';
        ctx.fill();
        cloudX += 0.3;
        if (cloudX > 900) cloudX = -50;
        if (currentScene === 'forest') {
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(300, 400, 200, 100); // Tree trunk
            ctx.fillStyle = '#228B22';
            ctx.fillRect(250, 350, 300, 50); // Tree canopy
        }
        requestAnimationFrame(animateElements);
    }
    animateElements();

    // Audio (simulated, would require actual file in production)
    const audio = new Audio('rain.mp3');
    audio.volume = 0.3;
    audio.loop = true;
    audio.play();

    // Brightness/Volume Slider
    ctx.fillStyle = '#00B4D8';
    ctx.fillRect(50, 500, 200, 50);
    ctx.fillStyle = '#FFF';
    ctx.fillText('Brightness/Volume', 60, 530);
    ctx.fillRect(50, 550, 200, 10); // Slider track
    ctx.fillStyle = '#FFF';
    ctx.fillRect(50, 550, 100, 10); // Slider handle (50% default)
}

// Settings Panel
let settingsVisible = false;
function drawSettings() {
    if (settingsVisible) {
        ctx.fillStyle = '#333';
        ctx.fillRect(300, 100, 400, 400);
        ctx.fillStyle = '#FFF';
        ctx.fillText('Settings', 310, 130);
        ctx.fillText('Toggle Timer Animation: ' + (timerAnimation ? 'On' : 'Off'), 310, 160);
        ctx.fillText('Toggle Notifications: ' + (notifications ? 'On' : 'Off'), 310, 190);
    }
    ctx.fillStyle = '#00B4D8';
    ctx.fillRect(700, 10, 90, 30);
    ctx.fillStyle = '#FFF';
    ctx.fillText('Settings', 710, 30);
}

function toggleSettings() {
    settingsVisible = !settingsVisible;
    drawInterface();
}

let timerAnimation = true;
let notifications = true;

canvas.addEventListener('click', (e) => {
    const x = e.clientX - canvas.offsetLeft;
    const y = e.clientY - canvas.offsetTop;
    if (settingsVisible) {
        if (x > 310 && x < 410 && y > 160 && y < 180) {
            timerAnimation = !timerAnimation;
        }
        if (x > 310 && x < 410 && y > 190 && y < 210) {
            notifications = !notifications;
        }
    }
});

// Keyboard Navigation
canvas.setAttribute('tabindex', '0');
canvas.focus();
canvas.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        e.preventDefault();
        // Cycle through interactive elements (tasks, buttons)
        console.log('Navigating with Tab');
    }
    if (e.key === 'Enter' && document.activeElement === canvas) {
        // Simulate click on current focus (e.g., task or button)
        console.log('Activating element');
    }
});

// Initialize
drawInterface();
