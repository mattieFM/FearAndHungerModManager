/**
 * @description a class for representing a data map model
 * @class
 */
MATTIE.dataMapModel = class {
	constructor() {
		defaultMusic = {
			name: '', pan: 0, pitch: 100, volume: 90,
		};

		/**
     * The map's display name.
     */
		this.displayName = 'none';// : string;

		/**
      * The map's tile set.
      */
		this.tilesetId = 3;// : number;

		/**
      * The map's width.
      */
		this.width = 100;// : number;

		/**
      * The map's height.
      */
		this.height = 100;// : number;

		/**
      * The scroll type (0: No Loop, 1: Vertical Loop, 2: Horizontal Loop, 3: Both Loop).
      */
		this.scrollType = 0;// : number;

		/**
      * The truth value indicating whether the battle background specification is enabled.
      */
		this.specifyBattleback = false;// : boolean;

		/**
      * The file name of the floor graphic if the battle background specification is enabled.
      */
		this.attleback1Name = 'floor1';// : string;

		/**
      * The file name of the wall graphic if the battle background specification is enabled.
      */
		this.battleback2_name = 'ancient_tomb';// : string;

		/**
      * The truth value indicating whether BGM autoswitching is enabled.
      */
		this.autoplayBgm = false;// : boolean;

		/**
      * The name of that BGM (RPG.AudioFile) if BGM autoswitching is enabled.
      */
		this.bgm = defaultMusic;// : rm.types.AudioFile;

		/**
      * The truth value indicating whether BGS autoswitching is enabled.
      */
		this.autoplayBgs = false;// : boolean;

		/**
      * The name of that BGS (RPG.AudioFile) if BGS autoswitching is enabled.
      */
		this.bgs = defaultMusic;// : rm.types.AudioFile;

		/**
      * The truth value of the [Disable Dashing] option.
      */
		this.disableDashing = false;// : boolean;

		/**
      * An encounter list. A RPG.Map.Encounter ID array.
      */
		this.encounterList = [];// : Array<rm.types.MapEncounter>;

		/**
      * The average number of steps between encounters.
      */
		this.encounterStep = 0;// : number;

		/**
      * The file name of the parallax background's graphic.
      */
		this.parallaxName = undefined;// : string;

		/**
      * The truth value of the [Loop Horizontal] option for the parallax background.
      */
		this.parallaxLoopX = false;// : boolean;

		/**
      * The truth value of the [Loop Vertical] option for the parallax background.
      */
		this.parallaxLoopY = false;// : boolean;

		/**
      * The automatic x-axis scrolling speed for the parallax background.
      */
		this.parallaxSx = 0;// : number;

		/**
      * The automatic y-axis scrolling speed for the parallax background.
      */
		this.parallaxSy = 0;// : number;

		/**
      * The truth value of the [Show in the Editor] option for the parallax background.
      */
		this.parallaxShow = false;// : boolean;

		/**
      * The map data. A 3-dimensional tile ID array (Table).
      */
		this.data = [1, 1, 1, 1,
			1, 1, 1, 1,
			2, 2, 2, 2,
			2, 2, 25, 3,
		];// : Array<number>;

		/**
      * The array of RPG.Event data.
      */
		this.events = undefined;// : Array<Event>;
	}
};
