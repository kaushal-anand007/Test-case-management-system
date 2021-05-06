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
        let roles = userRole.slice(0,index);
        let roleObj = [];

        try {
            let output1 = await model.find(data).limit(limit).skip(startIndex).exec();
            let output = [];

            if(roles == 'Admin'){
                roleObj = ['Admin','QA Manager','QA Lead','Tester']
            }

            if(roles == 'QA Manager'){
                roleObj = ['QA Manager','QA Lead','Tester']
            }

            if(roles == 'QA Lead'){
                roleObj = ['QA Lead','Tester']
            }

            if(roles == 'Tester'){
                roleObj = ['Tester']
            }

            for(let i=0;i<output1.length;i++){
                let getRole = output1[i].role;
                let index1 = getRole.lastIndexOf(' ');
                let role1 = getRole.slice(0,index1);
                for(let j=0;j<roleObj.length;j++){
                    if(role1 == roleObj[j]){
                        let finalResult = output1[i];
                        output.push(finalResult);
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