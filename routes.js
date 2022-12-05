const express = require('express')
const router = express.Router()
const Model = require('./model')

const modelData = (res) => {
    const data = new Model({
        title: res.title,
        is_completed: res.is_completed || false
    })
    return data
}
// POST Multiple / Single task
router.post('/tasks', async (req, res) => {
    const body = req.body
    try {
        if(!body['tasks']){
            const data = modelData(body)
            const dataSave = await data.save()
            res.status(201).json({id: dataSave.id})
        } else {
            const tempId = new Array()
            body['tasks'].forEach(async task => {
                const data = modelData(task)
                tempId.push({id: data.id})
                const dataSave = await data.save()
            })
            res.status(201).json({tasks: tempId})
        }

    } catch (error) { 
        res.status(400).json({message: error})
    }
})

// GET All tasks
router.get('/tasks', async (req,res) => {
    try {
        const data = await Model.find()
        res.status(200).json({tasks: data})
    } catch (error) {
        res.status(400).json({message: error})
    }
})

// GET Specific task by id
router.get('/tasks/:id', async (req,res) => {
    try {
        const data = await Model.findById(req.params.id)
        res.status(200).json(data)
    } catch (error) {
        res.status(404).json({error: "There is no task at that id"})
    }
})

// DELETE task by id
router.delete('/tasks/:id', async (req,res) => {
    try {
        const id = req.params.id
        const data = await Model.findByIdAndDelete(id)
        res.status(204).send('None')
    } catch (error) {
        res.status(404).json({error: "There is no task at that id"})
    }
})

// DELETE multiple task
router.delete('/tasks', async (req,res) => {
    try {
        const body = req.body
        body['tasks'].forEach(async task => {
            const data = await Model.findByIdAndDelete(task.id)
        })
        res.status(204).send('None')
    } catch (error) {
        res.status(400).json({message: error})
    }
})

// PUT Edit specific task by id
router.put('/tasks/:id', async (req,res) => {
    try {
        const id = req.params.id
        const updatedData = req.body
        const options = { new: true }
        const result = await Model.findByIdAndUpdate(id, updatedData, options)

        res.status(204).send('None')

    } catch (error) {
        res.status(404).json({error: "There is no task at that id"})
    }
})

module.exports = router