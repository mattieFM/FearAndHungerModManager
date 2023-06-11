
var EventEmitter = require("events");
class BaseNetController extends EventEmitter {
    
}

//ignore this does nothing, just to get intellisense working. solely used to import into the types file for dev.
try {
    module.exports.NetController = BaseNetController;
} catch (error) {
    module = {}
    module.exports = {}
}
module.exports.NetController = BaseNetController;
