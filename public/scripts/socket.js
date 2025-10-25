let deviceInfo = {device_type: 'browser', device_name: 'babylon-vr', description: 'babylon-vr test stuff'}

let x = 0
const socket = new WebSocket('wss://render-socket-service.onrender.com')
// const socket = new WebSocket('ws://10.0.0.88:10000')


window.addEventListener('DOMContentLoaded', () => {
  $('#message').text('Trying to connect...')

    socket.onopen = () => {
      socket.send(JSON.stringify(deviceInfo))
      $('#message').text('✅ Connected to WebSocket')

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
})
