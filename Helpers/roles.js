const AccessControl = require("accesscontrol");
const ac = new AccessControl();
 
exports.roles = (function() {
ac.grant("User")
 .readOwn("profile")
 .updateOwn("profile"),
  
ac.grant("Admin")
 .extend("User")
 .createAny("profile")
 .readAny("profile")
 .updateAny("profile")
 .deleteAny("profile")
 
return ac;
})();

