import * as ClientController from "../../_multiplayer/netControllerV2/client";
import * as HostController from "../../_multiplayer/netControllerV2/host";
import * as BaseNetController from "../../_multiplayer/netControllerV2/baseNetController";

import EventHandler from "events";
//this file is for dev typings of the netController class, idk why my IDE hates me, but this is how its working for now. This weird and jank structure
//only impacts dev so I dont care much to spend more time fixing it.
declare global {
    var BaseNetController: BaseNetController.BaseNetController
    var HostController: HostController.HostController
    var ClientController: ClientController.ClientController;
}
