import * as netController from "../../_multiplayer/netController";;
import * as baseNet from "../../_multiplayer/netControllerV2/netController";;

import EventHandler from "events";
//this file is for dev typings of the netController class, idk why my IDE hates me, but this is how its working for now. This weird and jank structure
//only impacts dev so I dont care much to spend more time fixing it.
declare global {
    var NetController: netController.NetController
    var BaseNetController: baseNet.NetController;
}

