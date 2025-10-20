const express = require('express')
    const path = require('path')
    const app = express()
    const port = process.env.PORT || 3000

    app.use(express.json())
    app.use(express.static(path.join(__dirname, 'public')))

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, './public/index.html'))
    })

    app.get('/button-test', (req, res) => {
        console.log('button pushed')
        res.sendStatus(200)
    })

    app.post('/headset-position', (req, res) => {
        const position = req.body
        console.log(position)
        res.sendStatus(200)
    })
    
    app.listen(port, () => {
        console.log('server started')
    })