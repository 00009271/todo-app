//libraries
const { constants } = require('buffer')
const express = require('express')
const app = express()
const fs = require('fs')

const DB = './database/db.json'

//view engine
app.set('view engine', 'pug')
//static styles
app.use('/static', express.static('public'))
//using express url encoder
app.use(express.urlencoded({ extended: false }))
//runing the app on port:
app.listen(9271, (err) => {
    if (err) throw err
    console.log(`App runs on port 9271 http://localhost:9271`)
})
//id generator
function id () {
    return '_' + Math.random().toString(36).substr(2, 9);
}
//geting tasks from db
app.get('/', (req, res) => {
    fs.readFile(DB, (err, data) => {
      if (err) throw err
      const tasks = JSON.parse(data)
      res.render('index', { tasks: tasks })
    })
})
//sending user input to db
app.post('/create', (req, res) => {
    const form_data = req.body
  
    if (form_data.task.trim() == '') {
      fs.readFile(DB, (err, data) => {
        if (err) throw err
  
        const tasks = JSON.parse(data)
  
        res.render('index', { error: true, tasks: tasks })
      })
    } else {
      fs.readFile(DB, (err, data) => {
        if (err) throw err
  
        const tasks = JSON.parse(data)
  
        const task = {
          id: id(),
          text: form_data.task,
          done: false
        }
  
        tasks.push(task)
  
        fs.writeFile(DB, JSON.stringify(tasks), (err) => {
          if (err) throw err
  
          fs.readFile(DB, (err, data) => {
            if (err) throw err
  
            const tasks = JSON.parse(data)//tasks=>tasks
  
            res.render('index', { success: true, tasks: tasks })
          })
        })
      })
    }
})
//deleting the task
app.get('/:id/delete', (req, res) => {
    const id = req.params.id
  
    fs.readFile(DB, (err, data) => {
      if (err) throw err
  
      const tasks = JSON.parse(data)
  
      const filteredtasks = tasks.filter(task => task.id != id)
  
      fs.writeFile(DB, JSON.stringify(filteredtasks), (err) => {
        if (err) throw err
  
        res.render('index', { tasks: filteredtasks, deleted: true })
      })
    })
})
//updating
app.get('/:id/update', (req, res) => {
  const id = req.params.id

  fs.readFile(DB, (err, data) => {
    if (err) throw err
    
    const tasks = JSON.parse(data)
    const task = tasks.filter(task => task.id == id)[0]
    
    const taskIdx = tasks.indexOf(task)
    const splicedtask = tasks.splice(taskIdx, 1)[0]
    
    splicedtask.done = true
    
    tasks.push(splicedtask)

    fs.writeFile(DB, JSON.stringify(tasks), (err) => {
      if (err) throw err

      res.render('home', { tasks: tasks })
    })
  })
    
})