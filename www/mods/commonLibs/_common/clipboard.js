var MATTIE = MATTIE || {};
MATTIE.clipboard = MATTIE.clipboard || {};

MATTIE.clipboard.get = function () {
	let data;
	if (Utils.isNwjs) {
		data = nwGui.Clipboard.get().get();
	} else {
		data = window.navigator.clipboard.readText();
	}
	return data;
};

MATTIE.clipboard.put = function (string) {
	if (Utils.isNwjs) {
		data = nwGui.Clipboard.get().set(string);
	} else {
		data = window.navigator.clipboard.writeText(string);
	}
};
