window.addEventListener('DOMContentLoaded', () => {
    $('#message').text('test')

try {
    const socket = new WebSocket("ws://10.0.0.17:81")

    function sendMessage(msg) {
        socket.send(msg)
    }

    socket.onopen = () => {
        $('#message').text('connected')
        sendMessage('test')
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

} catch (error) {
    $('#message').text(JSON.stringify(error))
}

})
