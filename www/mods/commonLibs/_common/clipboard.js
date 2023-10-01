/**
 * @namespace MATTIE.clipboard
 * @description a simple wrapper for interacting with the clipboard
 * */
MATTIE.clipboard = MATTIE.clipboard || {};

/**
 * @description get the current contents of the clipboard
 * @returns {string} the current contents of the clipboard
 */
MATTIE.clipboard.get = function () {
	let data;
	if (Utils.isNwjs) {
		data = nwGui.Clipboard.get().get();
	} else {
		data = window.navigator.clipboard.readText();
	}
	return data;
};

/**
 * @description set the clipboard to a new value
 * @param {string} string the string to place into the clipboard
 */
MATTIE.clipboard.put = function (string) {
	if (Utils.isNwjs) {
		data = nwGui.Clipboard.get().set(string);
	} else {
		data = window.navigator.clipboard.writeText(string);
	}
};
