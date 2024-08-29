/* eslint max-classes-per-file: 0 */
/* eslint no-loop-func: 0 */
/* eslint max-len: 0 */
/* eslint no-const-assign: 0 */

MATTIE.util = MATTIE.util || {};

const logging = false;
const defaultCanvasId = 'viewport';

/** @todo remove this when done testing */
function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

/** @description a class representing a x and y pair. */
class Point {
	/** @description the x cord */
	x;

	/** @description the y cord */
	y;

	/** @description init a new point with an x and a y cord. */
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

/**
 * @description a class representing a single tile on the map
 */
class Tile {
	/**
	 * @description the position of the tile
	 * @type {Point}
	 */
	pos;

	/** a variable for weather the tile is a wall or not */
	isWall = true;

	/**
	 *
	 * @param {number} x the x cord of this tile
	 * @param {number} y the y cord of this tile
	 * @param {boolean} isWall is this tile a wall?
	 */
	constructor(x, y, isWall = true) {
		this.pos = new Point(x, y);
		this.isWall = isWall;
	}
}

/**
 * @description a class representing a region of space on the map.
 */
class Region {
	/**
	 * the upper left corner of the region
	 * @type {Point}
	 * */
	upperLeftCorner;

	/**
	 * the bottom left corner of the region
	 * @type {Point}
	 * */
	bottomRightCorner;

	/** @description a variable that marks if this is the highest layer of the region IE: a region with no parent */
	isRoot = false;

	/** @description a variable that marks if this is the lowest layer of the region IE: a region with no children */
	isLeaf = true;

	/**
	 * @description any child regions that exist within this region
	 * @type {Region[]}
	 */
	children = [];

	/**
	 * @description an array of cords that doors are at
	 * @type {Point[]}
	 */
	doors = [];

	/**
	 * @description the parent region to this region
	 * @type {Region}
	 * */
	parent = false;

	/**
	 * @description make a new region from 4 cords, top left corner then bottom right.
	 * @param {number} topX x cord for top left corner
	 * @param {number} topY y cord for top left corner
	 * @param {number} botX x cord for top right corner
	 * @param {number} botY y cord for top right corner
	 */
	constructor(topX, topY, botX, botY, parent = null) {
		// assign values to class members
		this.upperLeftCorner = new Point(topX, topY);
		this.bottomRightCorner = new Point(botX, botY);
		this.parent = parent;

		// if this has no parent set as root
		this.checkRoot();
	}

	/** @description draw all children onto the canvas */
	drawAllChildrenOnCanvas(canvasId = defaultCanvasId) {
		this.drawOnCanvas(canvasId);
		if (!this.checkLeaf()) {
			this.children.forEach((child) => {
				child.drawAllChildrenOnCanvas();
			});
		}
	}

	drawDoor(canvasId = defaultCanvasId) {
		const canvas = document.getElementById(canvasId);
		const ctx = canvas.getContext('2d');

		this.doors.forEach((door) => {
			ctx.fillRect(door.x, door.y, 2, 2);
		});
	}

	drawAllDoors(canvasId = defaultCanvasId) {
		this.drawDoor(canvasId);
		if (!this.checkLeaf()) {
			this.children.forEach((child) => {
				child.drawAllDoors();
			});
		}
	}

	drawOnCanvas(canvasId = defaultCanvasId) {
		const canvas = document.getElementById(canvasId);
		const ctx = canvas.getContext('2d');

		ctx.rect(this.upperLeftCorner.x, this.upperLeftCorner.y, this.getWidth(), this.getHeight());
		ctx.lineWidth = 2;
		ctx.strokeStyle = `#${(Math.random() * 0xFFFFFF << 0).toString(16)}`;
		ctx.stroke();
	}

	/**
	 * @description split this region into two subregions. This makes this no longer a root and adds 2 regions to its children.
	 * @param {number} numberOfSplits how many sub regions should be created
	 * @param {number} minPercentageLeft [PERCENTAGE OUT OF 100] the minimum percentage of area that the smaller sub region needs to have.
	 * @param {number} forceHorizontal above .5 to force a horizontal split, below to force a vertical
	 */
	split(minPercentageLeft = 20, percentagePadding = 10, forceHorizontal = undefined) {
		// the total percentage of space that is not included in padding
		const workablePercentage = 100 - (percentagePadding * 2);

		const width = this.getWidth();
		const height = this.getHeight();

		if (logging) console.log(`w:${width}`);
		if (logging) console.log(`h:${height}`);

		// the number of tiles that are dedicated to padding on all sides
		const numberOfTilesPaddingX = Math.ceil(width * (percentagePadding / 100));
		const numberOfTilesPaddingY = Math.ceil(height * (percentagePadding / 100));

		// the min number of tiles for x or y
		const minTilesInSubRegionX = Math.ceil(width * (minPercentageLeft / 100));
		const minTilesInSubRegionY = Math.ceil(height * (minPercentageLeft / 100));

		if (logging) console.log(`numberOfTilesPaddingX:${numberOfTilesPaddingX}`);
		if (logging) console.log(`numberOfTilesPaddingY:${numberOfTilesPaddingY}`);

		if (logging) console.log(`minTilesInSubRegionX:${minTilesInSubRegionX}`);
		if (logging) console.log(`minTilesInSubRegionY:${minTilesInSubRegionY}`);

		// randomly check for weather to split horizontally or vertically
		const splitHorizontally = forceHorizontal == undefined ? Math.random() > 0.5 : forceHorizontal;

		const minX = this.upperLeftCorner.x + minTilesInSubRegionX + numberOfTilesPaddingX;
		const maxX = this.bottomRightCorner.x - minTilesInSubRegionX - numberOfTilesPaddingX;
		let minY = this.upperLeftCorner.y + minTilesInSubRegionY + numberOfTilesPaddingY;
		let maxY = this.bottomRightCorner.y - minTilesInSubRegionY - numberOfTilesPaddingY;

		if (splitHorizontally) {
			// clamp to inside parent region bounds
			if (!this.checkRoot()) {
				if (minY < this.parent.upperLeftCorner.y) minY = this.parent.upperLeftCorner.y;
				if (maxY > this.parent.bottomRightCorner.y) maxY = this.parent.bottomRightCorner.y;
			}
			// get the y level to split at
			let splitYLevel = -1;
			if (this.isRoot) {
				splitYLevel = MATTIE.util.randBetween(minY, maxY);
			} else {
				while (splitYLevel < 0 || this.parent.doors.some((door) => door.y == splitYLevel)) {
					splitYLevel = MATTIE.util.randBetween(minY, maxY);
				}
			}

			if (logging) console.log(`ysplit at:${splitYLevel}`);
			if (logging) console.log(`minY:${minY}`);
			if (logging) console.log(`maxY:${maxY}`);

			const topBoxUpperLeftCorner = this.upperLeftCorner;
			const topBoxLowerLeftCorner = new Point(this.bottomRightCorner.x, splitYLevel);
			const topRegion = new Region(topBoxUpperLeftCorner.x, topBoxUpperLeftCorner.y, topBoxLowerLeftCorner.x, topBoxLowerLeftCorner.y, this);

			const bottomBoxUpperLeftCorner = new Point(this.upperLeftCorner.x, splitYLevel);
			const bottomBoxLowerLeftCorner = this.bottomRightCorner;
			const bottomRegion = new Region(bottomBoxUpperLeftCorner.x, bottomBoxUpperLeftCorner.y, bottomBoxLowerLeftCorner.x, bottomBoxLowerLeftCorner.y, this);

			const door = new Point(MATTIE.util.randBetween(minX + 2, maxX - 2), splitYLevel);
			topRegion.doors.push(door);
			bottomRegion.doors.push(door);

			this.children.push(topRegion);
			this.children.push(bottomRegion);
		} else {
			// clamp if parent exists
			if (!this.checkRoot()) {
				if (minX < this.parent.upperLeftCorner.x) minX = this.parent.upperLeftCorner.x;
				if (maxX > this.parent.bottomRightCorner.x) maxX = this.parent.bottomRightCorner.x;
			}

			// get the y level to split at
			let splitXLevel = -1;
			if (this.checkRoot()) {
				splitXLevel = MATTIE.util.randBetween(minX, maxX);
			} else {
				while (splitXLevel < 0 || this.parent.doors.some((door) => door.x == splitXLevel)) {
					splitXLevel = MATTIE.util.randBetween(minX, maxX);
				}
			}

			if (logging) console.log(`xsplit at:${splitXLevel}`);
			if (logging) console.log(`minX:${minX}`);
			if (logging) console.log(`maxX:${maxX}`);

			const leftBoxUpperLeftCorner = this.upperLeftCorner;
			const leftBoxLowerLeftCorner = new Point(splitXLevel, this.bottomRightCorner.y);
			const leftRegion = new Region(leftBoxUpperLeftCorner.x, leftBoxUpperLeftCorner.y, leftBoxLowerLeftCorner.x, leftBoxLowerLeftCorner.y, this);

			const rightBoxUpperLeftCorner = new Point(splitXLevel, this.upperLeftCorner.y);
			const rightBoxLowerLeftCorner = this.bottomRightCorner;
			const rightRegion = new Region(rightBoxUpperLeftCorner.x, rightBoxUpperLeftCorner.y, rightBoxLowerLeftCorner.x, rightBoxLowerLeftCorner.y, this);

			const door = new Point(splitXLevel, MATTIE.util.randBetween(minY + 2, maxY - 2));
			leftRegion.doors.push(door);
			rightRegion.doors.push(door);

			this.children.push(leftRegion);
			this.children.push(rightRegion);
		}

		// update the region as it is no longer a leaf.
		this.checkLeaf();
	}

	/** @description split this region into subregions, then split those into subregions and so on for x depth */
	splitXDeep(x) {
		if (x <= 0) return;
		this.split();
		if (!this.checkLeaf()) {
			this.children.forEach((child) => {
				// decrement by one and recurse
				child.splitXDeep(x - 1);
			});
		}
	}

	/**
	 * @description split this region into subregions, then split those into subregions and so on till regions are all within desired width and height
	 * @param {*} width the target width
	 * @param {*} height the target height
	 * @returns null
	 */
	splitTillWidth(width, height) {
		let force;
		if (MATTIE.util.checkNumberInRange(this.getWidth(), 0, width)) return; force = 0;
		if (MATTIE.util.checkNumberInRange(this.getHeight(), 0, height)) return; force = 1;
		this.split(force);
		if (!this.checkLeaf()) {
			this.children.forEach((child) => {
				// decrement by one and recurse
				child.splitTillWidth(width, height);
			});
		}
	}

	/**
	 * @description check if this is a leaf and update accordingly
	 */
	checkLeaf() {
		this.isLeaf = this.children.length == 0;
		return this.isLeaf;
	}

	/**
	 * @description check if this is a root and update accordingly
	 */
	checkRoot() {
		this.isRoot = this.parent == null;
		return this.isRoot;
	}

	/** @description returns the width of this region */
	getWidth() {
		return Math.abs(this.upperLeftCorner.x - this.bottomRightCorner.x);
	}

	/** @description returns the height of this region */
	getHeight() {
		return Math.abs(this.upperLeftCorner.y - this.bottomRightCorner.y);
	}
}

/**
 * @description an object representing the map data itself
 * 1: a map consists of multiple things, A a 2d array of tiles ie: the literal map data.
 * 2: the region data, ie: the subdivisions of the bulk space via the tree splitting algorithm
 * 3: points of interest
 * 4: an array of events on the map
 * */
class Map {
	/** @description the width of the map to be generated */
	width = 50;

	/** @description the width of the map to be generated */
	height = 50;

	/** @description x coordinate of the upper left corner */
	upperLeftX = 0;

	/** @description y coordinate of the upper left corner */
	upperLeftY = 0;

	/** @description the id of the map as it relates to mod saved data, not game data */
	mapId;

	/**
	 * @description a 2d array of tile objects that represents the map
	 * @type {Tile[][]}
	 * */
	mapTiles;

	/**
	 * @description an array of region objects representing the larger regions
	 * @type {Tile[][]}
	 * */
	mapRegions;

	/**
	 * @description an array of room objects representing the lowest level of region, ie: a room. This is an array of all individual rooms
	 * @type {Tile[][]}
	 * */
	mapRooms;

	/**
	 * @description insatiate a new object of the map controller
	 * @param {number} width INTEGER the width of the map to be generated
	 * @param {number} height INTEGER the width of the map to be generated
	 * @param {number} x (OPTIONAL) x coordinate of the upper left corner
	 * @param {number} y (OPTIONAL) y coordinate of the upper left corner
	 */
	constructor(width, height, x = 0, y = 0) {
		this.width = width;
		this.height = height;
		this.upperLeftX = x;
		this.upperLeftY = y;
	}
}
