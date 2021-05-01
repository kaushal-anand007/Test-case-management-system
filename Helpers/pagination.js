//Pagination.
function paginationResults (model) {
    return async (req, res, next) => {
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

        let data = { "condition" : "Active" }

        try {
            results.results = await model.find(data).sort({_id : -1}).limit(limit).skip(startIndex).exec();
            res.paginationResults = results;
            next();  
        } catch (error) {
            res.status(500).json({ message: error.message});
        }
    }
}

module.exports = paginationResults;