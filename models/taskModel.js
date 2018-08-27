var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var taskModel = new Schema({
    title: {type: String, required: true},
    description: {type: String},
    due_date: {type: Date, required: true},
    completed: {type: Boolean, required: true},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('tasks', taskModel);
