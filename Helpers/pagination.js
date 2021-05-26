//Pagination.

function paginationResults (model) {
    return async (req, res, next) => {
        let userRole = req.user.payload.user.role;
        let page = parseInt(req.query.page);
        let limit = parseInt(req.query.limit);
        let startIndex = (page - 1) * limit;
        let endIndex = page * limit;
        let results = {};

        if(endIndex < model.length) {
            results.next = {
                page: page+1,
                limit: limit                    
            }
        }

        if(startIndex > 0){
            results.previous = {
                page: page -1,
                limit: limit
            }
        }

        let data = { "condition" : "Active" };
        let index = userRole.lastIndexOf(' ');
        let role = userRole.slice(0,index);
        let roleObj = [];

        try {
            
            let modelOutput = await model.find(data).limit(limit).skip(startIndex).sort({_id : -1});
            let output = [];

            if(role == 'Admin'){
                roleObj = ['Admin','QA Manager','QA Lead','Tester']
            }

            if(role == 'QA Manager'){
                roleObj = ['QA Manager','QA Lead','Tester']
            }

            if(role == 'QA Lead'){
                roleObj = ['QA Lead','Tester']
            }

            if(role == 'Tester'){  
                roleObj = ['Tester']
            }
            
            for(let i=0;i<modelOutput.length;i++){
                let getRole = modelOutput[i].role;
                if(getRole == null){
                    output.push(modelOutput[i]);
                    continue;
                }else{
                    let indexOfRoleObj = getRole.lastIndexOf(' ');
                    let roleFromRoleObj = getRole.slice(0,indexOfRoleObj);
                    for(let j=0;j<roleObj.length;j++){
                        if(roleFromRoleObj == roleObj[j]){
                            output.push(modelOutput[i]);
                        }
                    }
                }
            }
            res.paginationResults = output;
            next();  
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error.message});
        }
    }
}

module.exports = paginationResults;