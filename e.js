const express = require('express')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html/index.html'))
})

app.use((req, res) => {
    res.status(404).send('Not Found')
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})