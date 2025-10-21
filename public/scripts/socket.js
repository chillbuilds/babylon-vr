try {
    const socket = new WebSocket("ws://10.0.0.17:81")
    socket.onopen = () => {
        $('#message').text(event.data)
    }

    socket.onmessage = (event) => {
        $('#message').text(event.data)
    }

    socket.onclose = (event) => {
        $('#message').text("ESP32 socket connection closed:", event)
    // Handle reconnect logic or UI feedback here
    }

    socket.onerror = (error) => {
        $('#message').text("WebSocket error:", error)
    }

    function sendMessage(msg) {
        socket.send(msg)
    }

    sendMessage('test')
} catch (error) {
    $('#message').text(JSON.stringify(error))
}
