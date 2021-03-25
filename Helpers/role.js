const Role = require('../Models/role')

async function getFeatureAccess(req, res, next){
    try {
        let features = await Role.findOne({ "roleName" : req.user.payload.user.role});
        if(features == null){
            res.status(400).json({ message : "The role provided is not present!!!"});
        }else{
            let getFeature;
            let getModule;
            let module;
            let feature;
            let flag = false;
            let route = req.originalUrl;
            
            route =route.slice(1);
            let index = route.indexOf('/');
            let lastIndex = route.lastIndexOf('/');
            module = route.slice(0,index);
            feature = route.slice(index+1,lastIndex);

            for(let i = 0;i<features.featureList.length;i++){
                getFeature = features.featureList[i].featureName;
                getModule = features.featureList[i].moduleName;
                if( getFeature === feature && getModule === module){
                    flag = true;
                }
            }

            if (flag) {
                next()
            } else {
                res.status(400).json({ message : "you are unauthorized!!! please contact admin."}); 
            }  
        }    
    } catch (err){
        res.status(400).json({ message : "please contact admin."}); 
    }
}
module.exports = {
    getFeatureAccess : getFeatureAccess
};