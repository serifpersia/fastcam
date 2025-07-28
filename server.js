const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const { exec } = require('child_process');

app.use(express.static('public'));

app.get('/camera', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'camera.html'));
});
app.get('/video', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'video.html'));
});

let latestOffer = null;

io.on('connection', (socket) => {
    if (latestOffer) {
        socket.emit('offer', latestOffer);
    }
    socket.on('post-offer', (offer) => {
        latestOffer = offer;
        socket.broadcast.emit('offer', offer);
    });
    socket.on('answer', (answer) => {
        socket.broadcast.emit('answer', answer);
    });
    socket.on('stream-stopped', () => {
        latestOffer = null;
        socket.broadcast.emit('stream-stopped');
    });
    socket.on('candidate', (candidate) => {
        socket.broadcast.emit('candidate', candidate);
    });
});

const port = 8080;

http.listen(port, () => {
    console.log(`✅ Server is running on http://localhost:${port}`);
    console.log("----------------------------------------------------");
    console.log("⚡ Automating ADB setup...");
    const adbCommand = `adb reverse tcp:${port} tcp:${port}`;

    exec(adbCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ ADB Automation Failed: ${error.message}`);
            console.warn("Please ensure your phone is connected with USB Debugging enabled.");
            console.warn(`You may need to run the command manually: ${adbCommand}`);
            return;
        }
        if (stderr) {
            if (stderr.includes('error')) {
                console.error(`❌ ADB Error: ${stderr}`);
            } else {
                console.log(` ADB Status: ${stderr.trim()}`);
                console.log("✅ ADB reverse tunnel should be active!");
            }
            return;
        }
        console.log(`✅ ADB reverse tunnel active on port ${stdout.trim()}!`);
    });
    console.log("----------------------------------------------------");
});

function cleanupAndExit() {
    console.log("\nCaught interrupt signal. Cleaning up ADB reverse tunnel...");
    exec('adb reverse --remove-all', (error, stdout, stderr) => {
        if (error) {
            console.error(`Failed to remove ADB tunnel: ${error.message}`);
        } else {
            console.log("✅ ADB tunnel cleaned up successfully.");
        }
        process.exit(0);
    });
}

process.on('SIGINT', cleanupAndExit);

process.on('SIGTERM', cleanupAndExit);
