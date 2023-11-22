// override inputupdate direction to choose from an array of dirs

(() => {
	const InputUpdateDir = Input._updateDirection;
	/**
     * @static
     * @method _updateDirection
     * @private
     */
	Input._updateDirection = function () {
		InputUpdateDir.call(this);
		const originalDir = this._dir4;

		// override once for forcedDir4
		if (this.forcedDir4) {
			this._dir4 = this.forcedDir4;
			this.forcedDir4 = undefined;
		}
	};
})();
