# fastcam

A lightweight, high-performance webcam streaming  using a Node.js

## Prerequisites

1.  **Node.js:** Install Node.js.
2.  **Android Platform Tools (ADB).
3.  **Android Device:** With USB Debugging enabled.

## How to Use

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/serifpersia/fastcam.git
    cd fastcam/
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Connect your phone:** Connect your Android device to your computer via USB and authorize USB Debugging.

4.  **Start the server:**
    ```bash
    node server.js
    ```
    The server will attempt to automatically configure the ADB reverse tunnel.

5.  **Open the pages:**
    - **On your phone:** Open a web browser and navigate to `http://localhost:8080/camera`.
    - **In OBS/Browser/Video Player:**Use URL `http://localhost:8080/video`.

## Advanced Usage: Wireless ADB

1.  Connect your phone via USB and run `adb tcpip 5555`.
2.  Disconnect the USB cable.
3.  Find your phone's local IP address.
4.  Run `adb connect <your-phone-ip>:5555`.
5.  Now, when you run `node server.js`, the automation will work over Wi-Fi.
