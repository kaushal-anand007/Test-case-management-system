const Log = require('../Models/log');

function toCreateMessageforLog (actedBy, action, actedOn) {
       let result;
       let date = new Date();
        try {
            switch (action) {
                case "Added new user":
                    result = `${actedBy} added ${actedOn} at ${date}`
                    break;
                case "Created Password":
                    result = `${actedBy} created new password at ${date}`
                    break;
                case "User has been unblocked!!":
                    result = `${actedBy} has blocked by ${actedOn} at ${date}`
                    break;
                case "User has been blocked!!":
                    result = `${actedBy} has unblocked by ${actedOn} at ${date}`
                    break;
                case "Updated user itself":
                    result = `${actedBy} updated itself at ${date}`
                    break;
                case "Updated user":
                    result = `${actedBy} updated ${actedOn} at ${date}`
                    break;
                case "The User Activated":
                    result = `${actedOn} activated by ${actedBy} at ${date}`
                    break;
                case "The User Inactived":
                    result = `${actedOn} inactivated by ${actedBy} at ${date}`
                    break;
                case "Deleted user":
                    result = `${actedBy} deleted user ${actedOn} at ${date}`
                    break;        
                case "Logout":
                    result = `${actedBy} logout at ${date}`
                    break;
                case "Login":
                    result = `${actedBy} login at ${date}`
                    break;  
                case "Password updated":
                    result = `${actedBy} updated password at ${date}`
                    break;
                case "Added role":
                    result = `${actedBy} added role at ${date}`
                    break;
                case "Updated role":
                    result = `${actedBy} updated role at ${date}`
                    break;
                case "The role Activated":
                    result = `${actedOn} activated by ${actedBy} at ${date}`
                    break;
                case "The role Inactived":
                    result = `${actedOn} inactivated by ${actedBy} at ${date}`
                    break; 
                case "Deleted role":
                    result = `${actedBy} deleted role ${actedOn} at ${date}`
                    break;     
                case "Added Feature":
                    result = `${actedBy} added feature at ${date}`
                    break;
                case "Updated Feature":
                    result = `${actedBy} updated feature at ${date}`
                    break;
                case "The feature Activated":
                    result = `${actedOn} activated by ${actedBy} at ${date}`
                    break;
                case "The feature Inactived":
                    result = `${actedOn} inactivated by ${actedBy} at ${date}`
                    break;     
                case "Deleted Feature":
                    result = `${actedBy} deleted feature ${actedOn} at ${date}`
                    break;
                case "Added project":
                    result = `${actedBy} added project at ${date}`
                    break;
                case "Added scenario":
                    result = `${actedBy} added scenario at ${date}`
                    break;
                case "Add test Case":
                    result = `${actedBy} added test case at ${date}`
                    break;
                case "Added run log":
                    result = `${actedBy} added run log at ${date}`
                    break;  
                case "Updated project":
                    result = `${actedBy} upadted project details at ${date}`
                    break;      
                case "Updated test Case":
                    result = `${actedBy} added test case at ${date}`
                    break;    
                case "Updated run log":
                    result = `${actedBy} added test case at ${date}`
                    break; 
                case "Generated pdf of run log and send it to mail":
                    result = `${actedBy} added test case at ${date}`
                    break;             
                case "Deleted Project":
                    result = `${actedBy} deleted project ${actedOn} at ${date}`
                    break;
                case "The project Activated":
                    result = `${actedOn} activated by ${actedBy} at ${date}`
                    break;
                case "The project Inactived":
                    result = `${actedOn} inactivated by ${actedBy} at ${date}`
                    break;    
                case "Added Report":
                    result = `${actedBy} added report at ${date}`
                    break;
                case "Updated Report":
                    result = `${actedBy} updated report at ${date}`
                    break;
                case "Deleted Report":
                    result = `${actedBy} deleted report at ${date}`
                    break;                                              
                default:
                    break;
                case "The report Activated":
                    result = `${actedOn} activated by ${actedBy} at ${date}`
                    break;
                case "The report Inactived":
                    result = `${actedOn} inactivated by ${actedBy} at ${date}`
                break;    
            }
            return result;
        } catch (error) {
            console.log("error ---  > ", error);
            return result;
    }
}

module.exports = toCreateMessageforLog;
