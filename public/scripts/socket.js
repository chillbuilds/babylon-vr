let x = 0

window.addEventListener('DOMContentLoaded', () => {
  $('#message').text('Trying to connect...')

  try {
    const socket = new WebSocket('wss://render-socket-service.onrender.com')

    socket.onopen = () => {
      $('#message').text('✅ Connected to WebSocket')
      socket.send('test')

      $('#connectBtn').on('click', () => {
        socket.send('test ' + x)
        x++
    })
    }

    socket.onmessage = (event) => {
      $('#message').text('📩 ' + event.data)
    }

    socket.onclose = (event) => {
      $('#message').text('❌ Connection closed: ' + event.reason || event.code)
    }

    socket.onerror = (error) => {
      console.error('WebSocket error:', error)
      $('#message').text('⚠️ WebSocket error – check console')
    }

  } catch (error) {
    console.error('Connection error:', error)
    $('#message').text('❌ Exception: ' + error.message)
  }
})
