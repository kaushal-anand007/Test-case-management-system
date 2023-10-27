const mongoose  = require('mongoose');

const scenarioSchema = new mongoose.Schema({
    title : {
        type : String
    },

    projectId : {
        type : String
    },

    createdBy : {
        type : String
    },

    createdOn : {
        type : Date
    }
});

module.exports = mongoose.model("Scenario", scenarioSchema);