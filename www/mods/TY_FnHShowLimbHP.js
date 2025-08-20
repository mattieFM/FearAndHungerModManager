(function () {
/*
	This mod has been made possible
	thanks to the YEP_BattleEngineCore.js
	- by Yanfly -
*/

	//= =========================================================
	// VERSION 1.0.1 -- by Toby Yasha
	//= =========================================================

	// The following settings are meant to be edited by users:

	const valueDrawMode = 1; // 0 | 1 | 2 -- DEFAULT: 1

	/*
	EXPLANATION:

	valueDrawMode -
		This setting determines the way the health number is shown.
		Replace the number inside the "valueDrawMode" setting with
		the option you want:

		Options:
			0 - Draw no health number

			1 - Draw health number

			2 - Draw health as percentage

		How to change the setting, example:
		const valueDrawMode = 2;

		NOTE: If the setting doesn't contain one of the options
		mentioned above, then option no. 1 will be used by default.

*/

	//= =========================================================
	// Mod Configurations
	//= =========================================================

	const VALUE_DRAW_NONE = 0;
	const VALUE_DRAW_WHOLE = 1; // DEFAULT
	const VALUE_DRAW_PERCENT = 2;

	//= =========================================================
	// Window_Help
	//= =========================================================

	Window_Help.prototype.drawBattler = function (battler) {
		const width = this.contents.width;
		const height = this.contents.height;
		const x = 0;
		const y = (height - this.lineHeight() * 2) / 2;

		this.drawBattlerName(battler, x, y, width);
		this.drawBattlerHealth(battler, x, y, width);
	};

	Window_Help.prototype.drawBattlerName = function (battler, x, y, width) {
		this.drawText(battler.name(), x, y, width, 'center');
	};

	Window_Help.prototype.drawBattlerHealth = function (battler, x, y, width) {
		const contentsWidth = width / 4;
		const gaugeWidth = width / 4;
		const gaugeX = x + contentsWidth + (gaugeWidth) / 2;
		const gaugeY = y + this.lineHeight();

		this.drawActorHp(battler, gaugeX, gaugeY, gaugeWidth);
	};

	Window_Help.prototype.drawCurrentAndMax = function (current, max, x, y, width, color1, color2) {
		switch (valueDrawMode) {
		case VALUE_DRAW_NONE:
			// nothing here
			break;
		case VALUE_DRAW_WHOLE:
			this.drawHealthWhole(...arguments);
			break;
		case VALUE_DRAW_PERCENT:
			this.drawHealthPercentage(...arguments);
			break;
		default:
			this.drawHealthWhole(...arguments);
			break;
		}
	};

	Window_Help.prototype.drawHealthWhole = function (current, max, x, y, width, color1, color2) {
		const valueWidth = this.textWidth(max);
		const x1 = x + width - valueWidth;
		this.changeTextColor(color1);
		this.drawText(current, x1, y, valueWidth, 'right');
	};

	Window_Help.prototype.drawHealthPercentage = function (current, max, x, y, width, color1, color2) {
	// [NOTE] "toFixed" corrects weird looking float values
		const value = 100 * (current / max).toFixed(2);
		const valueWidth = this.textWidth(value);

		const percentSymbol = '%';
		const percentWidth = this.textWidth(percentSymbol);

		const text = value + percentSymbol;
		const x1 = x + width - valueWidth - percentWidth;
		const width1 = valueWidth + percentWidth;

		this.changeTextColor(color1);
		this.drawText(text, x1, y, width1, 'right');
	};

	//= =========================================================
	// End of File
	//= =========================================================
}());
