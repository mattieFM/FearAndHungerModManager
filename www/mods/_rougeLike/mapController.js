/* eslint max-classes-per-file: 0 */
/* eslint no-loop-func: 0 */
/* eslint max-len: 0 */
/* eslint no-const-assign: 0 */

MATTIE.util = MATTIE.util || {};

// the chance on each wall tile that the rest of the wall will not generate
const chanceForWallToCollapse = 0.05;
/** the min and max amount of wall that can collapse */
const [minCollapse, maxCollapse] = [2, 5];
const wallTile = 1579;
const floorTiles = [1587];
const collapseTiles = [1661, 1662, 1663];
const floorTile = () => floorTiles[Math.floor(Math.random() * floorTiles.length)];
const collapseTile = () => collapseTiles[Math.floor(Math.random() * collapseTiles.length)];
const logging = false;
const defaultCanvasId = 'viewport';
/** the max depth to go to for width/height based splitting */
const maxDepthForWidthSplit = 10;

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
class RougeLikePoint {
	/** @description init a new RougeLikePoint with an x and a y cord. */
	constructor(x, y) {
		/** @description the x cord */
		this.x = x;
		/** @description the y cord */
		this.y = y;
	}
}

/**
 * @description a class representing a single tile on the map
 */
class Tile {
	/**
	 *
	 * @param {number} x the x cord of this tile
	 * @param {number} y the y cord of this tile
	 * @param {boolean} isWall is this tile a wall?
	 */
	constructor(x, y, isWall = true, tileId = floorTile()) {
		/**
		 * @description the position of the tile
		 * @type {RougeLikePoint}
		 */
		this.pos = new RougeLikePoint(x, y);
		/** a variable for weather the tile is a wall or not */
		this.isWall = isWall;
		/** the variable for tile id */
		this.tileId = tileId;
	}
}

/**
 * @description a class representing a region of space on the map.
 */
class Region {
	/**
	 * @description make a new region from 4 cords, top left corner then bottom right.
	 * @param {number} topX x cord for top left corner
	 * @param {number} topY y cord for top left corner
	 * @param {number} botX x cord for top right corner
	 * @param {number} botY y cord for top right corner
	 */
	constructor(topX, topY, botX, botY, parent = null) {
		/**
		 * @description an dict of left,right,up and down arrays of all regions this region directly connects to
		 * @type {{Region[]}}
		 */
		this.connectsTo = {
			left: [],
			right: [],
			up: [],
			down: [],
		};

		/**
		 * the upper left corner of the region
		 * @type {RougeLikePoint}
		 * */
		this.upperLeftCorner = undefined;

		/**
		 * the bottom left corner of the region
		 * @type {RougeLikePoint}
		 * */
		this.bottomRightCorner = undefined;

		/**
		 * @description an array containing all other points that are not in the main rectangle
		 * @type {RougeLikePoint[]}
		 */
		this.otherPoints = [];

		/** @description a variable that marks if this is the highest layer of the region IE: a region with no parent */
		this.isRoot = false;

		/** @description a variable that marks if this is the lowest layer of the region IE: a region with no children */
		this.isLeaf = true;

		/**
		 * @description any child regions that exist within this region
		 * @type {Region[]}
		 */
		this.children = [];

		/**
		 * @description an array of cords that doors are at
		 * @type {RougeLikePoint[]}
		 */
		this.doors = [];

		/**
		 * @description the parent region to this region
		 * @type {Region}
		 * */
		this.parent = false;
		// assign values to class members
		this.upperLeftCorner = new RougeLikePoint(topX, topY);
		this.bottomRightCorner = new RougeLikePoint(botX, botY);
		this.parent = parent;

		// if this has no parent set as root
		this.checkRoot();
	}

	/**
	 *
	 * @param {Region[]} arr
	 * @param {*} canvasId
	 */
	static DrawArrayOntoCanvas(arr, canvasId = defaultCanvasId) {
		arr.forEach((region) => {
			region.drawAllChildrenOnCanvas();
		});
		arr.forEach((region) => {
			region.drawAllDoors();
		});
	}

	/**
	 * @description return an array of all leafs in this region's children
	 * @returns {Region[]}
	 *  */
	getAllLeafs() {
		if (!this.checkLeaf()) {
			let arr = [];
			this.children.forEach((child) => {
				arr = [...child.getAllLeafs(), ...arr];
			});
			return arr;
		}
		return [this];
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
			const topBoxLowerLeftCorner = new RougeLikePoint(this.bottomRightCorner.x, splitYLevel);
			const topRegion = new Region(topBoxUpperLeftCorner.x, topBoxUpperLeftCorner.y, topBoxLowerLeftCorner.x, topBoxLowerLeftCorner.y, this);

			const bottomBoxUpperLeftCorner = new RougeLikePoint(this.upperLeftCorner.x, splitYLevel);
			const bottomBoxLowerLeftCorner = this.bottomRightCorner;
			const bottomRegion = new Region(bottomBoxUpperLeftCorner.x, bottomBoxUpperLeftCorner.y, bottomBoxLowerLeftCorner.x, bottomBoxLowerLeftCorner.y, this);

			// add to eachother's connection array
			bottomRegion.connectsTo.up.push(topRegion);
			topRegion.connectsTo.down.push(bottomRegion);

			const door = new RougeLikePoint(MATTIE.util.randBetween(minX + 2, maxX - 2), splitYLevel);
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
			const leftBoxLowerLeftCorner = new RougeLikePoint(splitXLevel, this.bottomRightCorner.y);
			const leftRegion = new Region(leftBoxUpperLeftCorner.x, leftBoxUpperLeftCorner.y, leftBoxLowerLeftCorner.x, leftBoxLowerLeftCorner.y, this);

			const rightBoxUpperLeftCorner = new RougeLikePoint(splitXLevel, this.upperLeftCorner.y);
			const rightBoxLowerLeftCorner = this.bottomRightCorner;
			const rightRegion = new Region(rightBoxUpperLeftCorner.x, rightBoxUpperLeftCorner.y, rightBoxLowerLeftCorner.x, rightBoxLowerLeftCorner.y, this);

			// add to eachother's connection array
			rightRegion.connectsTo.left.push(leftRegion);
			leftRegion.connectsTo.right.push(rightRegion);

			const door = new RougeLikePoint(splitXLevel, MATTIE.util.randBetween(minY + 2, maxY - 2));
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
	splitTillWidth(width, height, currentDepth = 0) {
		let force;
		const inWidth = MATTIE.util.checkNumberInRange(this.getWidth(), 0, width);
		const inHeight = MATTIE.util.checkNumberInRange(this.getHeight(), 0, height);
		if (logging)console.log(`width:${this.getWidth()}`);
		if (logging)console.log(`Height:${this.getHeight()}`);
		// if close to width goal force split
		if (!inWidth && inHeight && (MATTIE.util.checkNumberInRange(this.getWidth(), 0, width * 1.2) || currentDepth > 3)) force = 0;
		// if close to height goal force split
		if (inWidth && !inHeight && (MATTIE.util.checkNumberInRange(this.getHeight(), 0, height * 1.2) || currentDepth > 2)) force = 1;
		if (inWidth && inHeight) return;
		if (currentDepth >= maxDepthForWidthSplit) return;

		this.split(10, 20, force);
		if (!this.checkLeaf()) {
			this.children.forEach((child) => {
				// decrement by one and recurse
				child.splitTillWidth(width, height, currentDepth + 1);
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

	/**
	 * @description check if a point is within the bounds of the region
	 * @param {*} x
	 * @param {*} y
	 */
	isWithinBounds(x, y) {
		const inBounds = false;
		// check if point in set of other points
		if (this.otherPoints.some((point) => point.x == x && point.y == y)) return true;

		// check if x and y are in bounds
		if (this.bottomRightCorner.x < x && this.upperLeftCorner.y < y) return false;
		if (this.bottomRightCorner.y > y && this.upperLeftCorner.x > x) return false;

		// thus in bounds
		return true;
	}
}

/**
 * @description an object representing the map data itself
 * 1: a map consists of multiple things, A a 2d array of tiles ie: the literal map data.
 * 2: the region data, ie: the subdivisions of the bulk space via the tree splitting algorithm
 * 3: RougeLikePoints of interest
 * 4: an array of events on the map
 * */
class RougeLikeMap {
	/**
	 * @description insatiate a new object of the map controller
	 * @param {number} width INTEGER the width of the map to be generated
	 * @param {number} height INTEGER the width of the map to be generated
	 * @param {number} x (OPTIONAL) x coordinate of the upper left corner
	 * @param {number} y (OPTIONAL) y coordinate of the upper left corner
	 */
	constructor(width = 100, height = 100, x = 0, y = 0) {
		/** @description the width of the map to be generated */
		this.width = 25;

		/** @description the width of the map to be generated */
		this.height = 25;

		/** @description x coordinate of the upper left corner */
		this.upperLeftX = 0;

		/** @description y coordinate of the upper left corner */
		this.upperLeftY = 0;

		/** @description the id of the map as it relates to mod saved data, not game data */
		this.mapId = undefined;

		/**
		 * @description a 1d array of tile objects that represents the map assume y increases by 1 every maxX x
		 * @type {Tile[]}
		 * */
		this.mapTiles = undefined;

		/**
		 * @description the root of the region
		 * @type {Region}
		 * */
		this.rootRegion = undefined;

		/**
		 * @description an array of all regions
		 * @type {Region[]}
		 * */
		this.regions = [];

		/**
		 * @description an array of just leafs
		 * @type {Region}
		 */
		this.rooms = [];

		const targetWidth = 13;
		this.width = width;
		this.height = height;
		this.upperLeftX = x;
		this.upperLeftY = y;
		this.rootRegion = new Region(x, y, width, height);
		this.rootRegion.splitTillWidth(targetWidth, targetWidth);
		this.updateRegions();
		this.updateTiles();
	}

	/** traverse from root region updating the list of regions */
	updateRegions(region = this.rootRegion) {
		// if at root wipe regions
		if (region.checkRoot()) {
			this.regions = [];
		}

		this.regions.push(region);
		if (region.checkLeaf()) { this.rooms.push(region); }
		region.children.forEach((child) => {
			if (child.checkLeaf()) { this.rooms.push(child); }
			this.regions.push(child);
			this.updateRegions(child);
		});
	}

	/**
	 *  @description set a tile in the array based on x,y pair
	 * @param {number} x x cord
	 * @param {number} y y cord
	 * @param {Tile} tile tile obj
	 */
	setTile(x, y, tile) {
		try {
			const realIndex = x + y * this.width;
			this.mapTiles[realIndex] = null;
			this.mapTiles[realIndex] = tile;
		} catch (error) {
			console.log(error);
		}
	}

	/** @description set the array to the correct length of empty tiles */
	makeBlankTileSet() {
		this.mapTiles = [];
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				this.mapTiles.push(new Tile(x, y));
			}
		}
	}

	/** @description rebuild mapTiles */
	updateTiles() {
		this.makeBlankTileSet();
		const rooms = [...this.rooms, this.rootRegion];
		rooms.forEach((region) => {
			// draw top line
			for (let x = region.upperLeftCorner.x; x < region.bottomRightCorner.x; x++) {
				const y = region.upperLeftCorner.y;
				this.setTile(x, y, new Tile(x, y, false, wallTile));
			}

			// draw bottom line
			for (let x = region.upperLeftCorner.x; x < region.bottomRightCorner.x; x++) {
				const y = region.bottomRightCorner.y;
				this.setTile(x, y, new Tile(x, y, false, wallTile));
			}

			// draw left wall
			for (let y = region.upperLeftCorner.y; y < region.bottomRightCorner.y; y++) {
				const x = region.upperLeftCorner.x;
				this.setTile(x, y, new Tile(x, y, false, wallTile));
			}

			// draw right wall
			for (let y = region.upperLeftCorner.y; y < region.bottomRightCorner.y; y++) {
				const x = region.bottomRightCorner.x;
				this.setTile(x, y, new Tile(x, y, false, wallTile));
			}
		});

		// draw doors
		this.regions.forEach((region) => {
			if (region.doors && region.doors.length > 0) {
				region.doors.forEach((door) => {
					console.log(door);
					this.setTile(door.x, door.y, new Tile(door.x, door.y, false, floorTile()));
				});
			}
		});
	}

	/**
	 * @description push the map data from this class to the data map
	 */
	pushToDataMap() {
		$dataMap.data = this.mapTiles.map((tile) => tile.tileId);
	}
}

/**
 * @description the main class for generating and controlling maps
 */
class DungeonMap {
	/**
	 * @description the dungoen map class for rouge like
	 * @param {number} topX top left bound
	 * @param {number} topY top bound
	 * @param {number} bottomX bottom right bound
	 * @param {number} bottomY bottom bound
	 */
	constructor(topX, topY, bottomX, bottomY) {
		/**
		 * @description all the rooms of the dungeon
		 * @type {Region[]}
		 */
		this.rooms = [];

		/**
		 * @description halls
		 * @type {Region[]}
		 */
		this.halls = [];

		/** @description the min size of a room (width or height) */
		this.roomSizeMin = 10;

		/** @description the max size of a room (width or height) */
		this.roomSizeMax = 20;

		/** @description the minimum rooms in the dungeon */
		this.minRoomsInDungeon = 5;

		/** @description the maximum rooms in the dungeon */
		this.maxRoomsInDungeon = 15;

		/** @description the min padding between rooms */
		this.minPaddingBetweenRooms = 3;
		/** @description the max padding between rooms */
		this.maxPaddingBetweenRooms = 8;

		/** @description the region denoting the bounds of the map */
		this.mapBounds = new Region(topX, topY, bottomX, bottomY);

		// the min and max percentages of a region to use as a room
		this.minPercentageUsed = 0.4;
		this.maxPercentageUsed = 1;
	}

	/** @description generate random rooms */
	_generateRandomRooms() {
		const numberOfRoomsToSpawn = MATTIE.util.randBetween(this.minRoomsInDungeon, this.maxRoomsInDungeon);
		for (let index = 0; index < numberOfRoomsToSpawn; index++) {
			let room;

			let i = 0;
			do {
				const xMin = this.mapBounds.upperLeftCorner.x;
				const yMin = this.mapBounds.upperLeftCorner.y;
				const xMax = this.mapBounds.bottomRightCorner.x;
				const yMax = this.mapBounds.bottomRightCorner.y;

				const point1 = new RougeLikePoint(
					MATTIE.util.lerp(xMin, xMax, MATTIE.util.randBetween(0, 1)),
					MATTIE.util.lerp(yMin, yMax, MATTIE.util.randBetween(0, 1)),
				);

				const point2 = new RougeLikePoint(
					MATTIE.util.lerp(xMin, xMax, MATTIE.util.randBetween(0, 1)),
					MATTIE.util.lerp(yMin, yMax, MATTIE.util.randBetween(0, 1)),
				);
				room = new Region(point1.x, point1.y, point2.x, point2.y);
				i++;
			} while (!this.rooms.some((other) => other.isWithinBounds(room)) && i < 4);
			this.rooms.push(room);
		}
	}

	/** @description generate random rooms */
	generateRandomRooms() {
		const numberOfRoomsToSpawn = MATTIE.util.randBetween(this.minRoomsInDungeon, this.maxRoomsInDungeon);

		// split our space if its not split up already
		if (this.mapBounds.children.length == 0) this.mapBounds.splitTillWidth(11, 11);

		// extract all leaves and then randomly choose some
		const arrOfRoomBounds = this.mapBounds.getAllLeafs();

		const arrayOfChosenBounds = [];

		// loop for each room to spawn
		for (let index = 0; index < numberOfRoomsToSpawn; index++) {
			// choose a region that has not been used yet
			let chosenRegion = arrOfRoomBounds[MATTIE.util.randBetween(0, arrOfRoomBounds.length)];
			while (arrayOfChosenBounds.indexOf(chosenRegion) != -1) {
				chosenRegion = arrOfRoomBounds[MATTIE.util.randBetween(0, arrOfRoomBounds.length)];
			}
			arrayOfChosenBounds.push(chosenRegion);

			const xMin = chosenRegion.upperLeftCorner.x;
			const yMin = chosenRegion.upperLeftCorner.y;
			const xMax = chosenRegion.bottomRightCorner.x;
			const yMax = chosenRegion.bottomRightCorner.y;

			const alpha = MATTIE.util.randBetween(0, this.minPercentageUsed);
			const topleftPoint = new RougeLikePoint(
				MATTIE.util.lerp(xMin, xMax, alpha),
				MATTIE.util.lerp(yMin, yMax, alpha),
			);

			const alpha2 = MATTIE.util.randBetween(0, this.minPercentageUsed - alpha);
			const bottomRightPoint = new RougeLikePoint(
				MATTIE.util.lerp(xMax, xMin, alpha2),
				MATTIE.util.lerp(yMax, yMin, alpha2),
			);

			const room = new Region(topleftPoint.x, topleftPoint.y, bottomRightPoint.x, bottomRightPoint.y);
			this.rooms.push(room);
		}
	}
}
