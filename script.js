// Sample data initialization
if (!localStorage.getItem('schedule')) {
    schedule = [
        { name: 'Meeting', time: '9:00-10:00 AM', x: 50, y: 50 },
        { name: 'Break', time: '10:00-10:15 AM', x: 50, y: 110 }
    ];
    localStorage.setItem('schedule', JSON.stringify(schedule));
}
if (!localStorage.getItem('tasks')) {
    tasks = [
        { name: 'Complete Report', priority: 'Medium', completed: false },
        { name: 'Attend Training', priority: 'High', completed: false }
    ];
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Enhanced Sensory Break with Calm Mode
function drawSensoryBreak() {
    let bgColor = currentScene === 'sky' ? '#87CEEB' : '#2ECC40';
    let animate = settingsVisible && !settings.find(s => s.key === 'calmMode').value;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, 800, 600);
    ctx.fillStyle = '#FFF';
    ctx.font = '24px Arial';
    ctx.fillText('Take a Break', 350, 300);

    if (animate) {
        let cloudX = 100;
        function animateElements() {
            ctx.clearRect(0, 0, 800, 600);
            ctx.fillStyle = bgColor;
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
    } else {
        // Static view for Calm Mode
        ctx.beginPath();
        ctx.arc(400, 200, 50, 0, Math.PI * 2);
        ctx.fillStyle = '#E0E0E0';
        ctx.fill();
    }

    // Brightness/Volume Slider (simulated)
    ctx.fillStyle = '#00B4D8';
    ctx.fillRect(50, 500, 200, 50);
    ctx.fillStyle = '#FFF';
    ctx.fillText('Brightness/Volume', 60, 530);
    ctx.fillRect(50, 550, 200, 10); // Slider track
    ctx.fillStyle = '#FFF';
    ctx.fillRect(50, 550, 100, 10); // Slider handle (50% default)
}

// Settings with Calm Mode
let settings = [
    { key: 'timerAnimation', value: true },
    { key: 'notifications', value: true },
    { key: 'calmMode', value: false }
];
