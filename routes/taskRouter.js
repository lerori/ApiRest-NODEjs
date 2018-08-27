var express = require('express');
var Task = require('../models/taskModel');

var taskRouter = express.Router();

taskRouter.route('/')
	//Getting tasks from database
    .get((req, res) => {
        Task.find({}, (err, tasks) => {
            res.json(tasks);
        })  
    })
    //Adding content to the database
    .post((req, res) => {
        let task = new Task(req.body);
        task.save();
        res.status(201).send(task);
    })

//middleware
taskRouter.use('/:taskId', (req, res, next)=>{
	Task.findById(req.params.taskId, (err, task)=>{
		if(err)
			res.status(500).send(err)
		else {
			req.task =book;
			next()
		}
	})
})

taskRouter.route('/:taskId')
    .get((req, res) => {
        res.json(req.task)
    })
    //Editing tasks in the database
    .put((req,res) => {
        req.task.title = req.body.title
        req.task.description = req.body.description
        req.task.due_date = req.body.due_date
        req.task.completed = req.body.completed
        //req.task.created_at = req.body.created_at
        req.task.updated_at = req.body.updated_at
        req.task.save()
        res.json(req.task);
    })
    //Editing task properties
    .patch((req,res)=>{
        
        if(req.body._id){
           delete req.body._id
        }
        for( let p in req.body ){
            task[p] = req.body[p]
        }
        req.task.save()
        res.json(req.task)
    })
    //delete task
    .delete((req,res)=>{
        
        req.task.remove(err => {
            if(err){
                res.status(500).send(err)
            }
            else{
                res.status(204).send('removed')
            }
        })
    })

module.exports = taskRouter;