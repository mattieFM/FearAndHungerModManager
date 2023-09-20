Game_Interpreter.prototype.setupReservedCommonEvent = function() {
    if ($gameTemp.isCommonEventReserved()) {
        this.setup($gameTemp.reservedCommonEvent().list);
        $gameTemp.clearCommonEvent();
        return true;
    } else {
        return false;
    }
};