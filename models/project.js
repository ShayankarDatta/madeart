const mongoose = require('mongoose');

const project = mongoose.model('project', function () {
    var projects = new mongoose.Schema({
        projectId: {
            type: mongoose.Schema.Types.ObjectId,ref:'post',
            required: '{PATH} is required!',
            // required: true
        },
        projectWorkers:[
            {type: String,
            required: true}
        ]
    }, {
        timestamps: true
    });

    projects.statics.create = function (data, callback) {
        new project(data).save(function (err, response_data) {
            if (err) {
                callback(err)
            }
            if (!err) {
                callback(response_data);
            }
        })
    };

    projects.statics.fetchAll = function (query, callback) {
        project.find().exec(callback)
    };



    return projects
}());
global.models['project'] = project;