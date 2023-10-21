// Type definitions for Pixi.js 4.5
// Project: https://github.com/pixijs/pixi.js/tree/dev
// Definitions by: clark-stevenson <https://github.com/pixijs/pixi-typescript>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.1

declare namespace PIXI {
    // from CONST
    const VERSION: typeof CONST.VERSION;
    const PI_2: typeof CONST.PI_2;
    const RAD_TO_DEG: typeof CONST.RAD_TO_DEG;
    const DEG_TO_RAD: typeof CONST.DEG_TO_RAD;
    const RENDERER_TYPE: typeof CONST.RENDERER_TYPE;
    const BLEND_MODES: typeof CONST.BLEND_MODES;
    const DRAW_MODES: typeof CONST.DRAW_MODES;
    const SCALE_MODES: typeof CONST.SCALE_MODES;
    const WRAP_MODES: typeof CONST.WRAP_MODES;
    const TRANSFORM_MODE: typeof CONST.TRANSFORM_MODE;
    const PRECISION: typeof CONST.PRECISION;
    const GC_MODES: typeof CONST.GC_MODES;
    const SHAPES: typeof CONST.SHAPES;
    const TEXT_GRADIENT: typeof CONST.TEXT_GRADIENT;
    const UPDATE_PRIORITY: typeof CONST.UPDATE_PRIORITY;

    function autoDetectRenderer(width: number, height: number, options?: PIXI.RendererOptions, forceCanvas?: boolean): PIXI.WebGLRenderer | PIXI.CanvasRenderer;
    function autoDetectRenderer(options?: PIXI.RendererOptions): PIXI.WebGLRenderer | PIXI.CanvasRenderer;
    const loader: PIXI.loaders.Loader;

    //////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////SETTINGS///////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////

    namespace settings {
        let TARGET_FPMS: number;
        let MIPMAP_TEXTURES: boolean;
        let RESOLUTION: number;
        let FILTER_RESOLUTION: number;
        let SPRITE_MAX_TEXTURES: number;
        let SPRITE_BATCH_SIZE: number;
        let RETINA_PREFIX: RegExp;
        const RENDER_OPTIONS: {
            view: HTMLCanvasElement | null,
            antialias: boolean,
            forceFXAA: boolean,
            autoResize: boolean,
            transparent: boolean,
            backgroundColor: number,
            clearBeforeRender: boolean,
            preserveDrawingBuffer: boolean,
            roundPixels: boolean
            width: number,
            height: number,
            legacy: boolean,
        };
        let TRANSFORM_MODE: number;
        let GC_MODE: number;
        let GC_MAX_IDLE: number;
        let GC_MAX_CHECK_COUNT: number;
        let WRAP_MODE: number;
        let SCALE_MODE: number;
        let PRECISION_VERTEX: string;
        let PRECISION_FRAGMENT: string;
        let PRECISION: string;
        let UPLOADS_PER_FRAME: number;
        let CAN_UPLOAD_SAME_BUFFER: boolean;
    }

    //////////////////////////////////////////////////////////////////////////////
    /////////////////////////////ACCESSIBILITY////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////

    namespace accessibility {
        // accessibility
        class AccessibilityManager {
            constructor(renderer: CanvasRenderer | WebGLRenderer);
            activate(): void;
            deactivate(): void;
            protected div: HTMLElement;
            protected pool: HTMLElement[];
            protected renderId: number;
            debug: boolean;
            renderer: SystemRenderer;
            protected children: AccessibleTarget[];
            protected isActive: boolean;

            protected updateAccessibleObjects(displayObject: DisplayObject): void;
            protected update(): void;
            protected capHitArea(hitArea: HitArea): void;
            protected addChild(displayObject: DisplayObject): void;
            protected _onClick(e: interaction.InteractionEvent): void;
            protected _onFocus(e: interaction.InteractionEvent): void;
            protected _onFocusOut(e: interaction.InteractionEvent): void;
            protected _onKeyDown(e: interaction.InteractionEvent): void;
            protected _onMouseMove(): void;

            destroy(): void;
        }
        interface AccessibleTarget {
            accessible: boolean;
            accessibleTitle: string | null;
            accessibleHint: string | null;
            tabIndex: number;
        }
    }

    //////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////CORE//////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////

    // const

    namespace CONST {
        const VERSION: string;
        const PI_2: number;
        const RAD_TO_DEG: number;
        const DEG_TO_RAD: number;
        const TARGET_FPMS: number;
        const RENDERER_TYPE: {
            UNKNOWN: number;
            WEBGL: number;
            CANVAS: number;
        };
        const BLEND_MODES: {
            NORMAL: number;
            ADD: number;
            MULTIPLY: number;
            SCREEN: number;
            OVERLAY: number;
            DARKEN: number;
            LIGHTEN: number;
            COLOR_DODGE: number;
            COLOR_BURN: number;
            HARD_LIGHT: number;
            SOFT_LIGHT: number;
            DIFFERENCE: number;
            EXCLUSION: number;
            HUE: number;
            SATURATION: number;
            COLOR: number;
            LUMINOSITY: number;
            NORMAL_NPM: number;
            ADD_NPM: number;
            SCREEN_NPM: number;
        };
        const DRAW_MODES: {
            POINTS: number;
            LINES: number;
            LINE_LOOP: number;
            LINE_STRIP: number;
            TRIANGLES: number;
            TRIANGLE_STRIP: number;
            TRIANGLE_FAN: number;
        };
        const SCALE_MODES: {
            LINEAR: number,
            NEAREST: number
        };
        const GC_MODES: {
            AUTO: number;
            MANUAL: number;
        };
        const WRAP_MODES: {
            CLAMP: number;
            MIRRORED_REPEAT: number;
            REPEAT: number;
        };
        const TRANSFORM_MODE: {
            DEFAULT: number;
            DYNAMIC: number;
            STATIC: number;
        };
        const URL_FILE_EXTENSION: RegExp | string;
        const DATA_URI: RegExp | string;
        const SVG_SIZE: RegExp | string;
        const SHAPES: {
            POLY: number;
            RECT: number;
            CIRC: number;
            ELIP: number;
            RREC: number;
        };
        const PRECISION: {
            LOW: string;
            MEDIUM: string;
            HIGH: string;
        };
        const TEXT_GRADIENT: {
            LINEAR_VERTICAL: number;
            LINEAR_HORIZONTAL: number;
        };
        const UPDATE_PRIORITY: {
            INTERACTION: number;
            HIGH: number;
            NORMAL: number;
            LOW: number;
            UTILITY: number;
        };
    }

    // display

    class Application {
        constructor(options?: ApplicationOptions)
        constructor(width?: number, height?: number, options?: ApplicationOptions, noWebGL?: boolean, sharedTicker?: boolean, sharedLoader?: boolean);

        private _ticker: ticker.Ticker;

        renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
        stage: Container;
        ticker: ticker.Ticker;
        readonly screen: Rectangle;

        stop(): void;
        start(): void;
        render(): void;
        destroy(removeView?: boolean): void;
        readonly view: HTMLCanvasElement;
    }

    interface DestroyOptions {
        children?: boolean;
        texture?: boolean;
        baseTexture?: boolean;
    }
    class Bounds {
        minX: number;
        minY: number;
        maxX: number;
        maxY: number;
        rect: Rectangle;

        isEmpty(): boolean;
        clear(): void;

        getRectangle(rect?: Rectangle): Rectangle;
        addPoint(point: Point): void;
        addQuad(vertices: number[]): Bounds | undefined;
        addFrame(transform: Transform, x0: number, y0: number, x1: number, y1: number): void;
        addVertices(transform: Transform, vertices: number[], beginOffset: number, endOffset: number): void;
        addBounds(bounds: Bounds): void;
        addBoundsMask(bounds: Bounds, mask: Bounds): void;
        addBoundsArea(bounds: Bounds, area: Rectangle): void;
    }
    class Container extends DisplayObject {
        // begin extras.getChildByName
        getChildByName(name: string): DisplayObject;
        // end extras.getChildByName

        children: DisplayObject[];
        width: number;
        height: number;

        protected onChildrenChange: (...args: any[]) => void;
        addChild<T extends DisplayObject>(child: T, ...additionalChildren: DisplayObject[]): T;
        addChildAt<T extends DisplayObject>(child: T, index: number): T;
        swapChildren(child: DisplayObject, child2: DisplayObject): void;
        getChildIndex(child: DisplayObject): number;
        setChildIndex(child: DisplayObject, index: number): void;
        getChildAt(index: number): DisplayObject;
        removeChild(child: DisplayObject): DisplayObject;
        removeChildAt(index: number): DisplayObject;
        removeChildren(beginIndex?: number, endIndex?: number): DisplayObject[];
        updateTransform(): void;
        calculateBounds(): void;
        protected _calculateBounds(): void;
        protected containerUpdateTransform(): void;
        renderWebGL(renderer: WebGLRenderer): void;
        renderAdvancedWebGL(renderer: WebGLRenderer): void;
        protected _renderWebGL(renderer: WebGLRenderer): void;
        protected _renderCanvas(renderer: CanvasRenderer): void;
        renderCanvas(renderer: CanvasRenderer): void;
        destroy(options?: DestroyOptions | boolean): void;

        once(event: "added" | "removed", fn: (displayObject: DisplayObject) => void, context?: any): this;
        //tslint:disable-next-line:ban-types forbidden-types
        once(event: string, fn: Function, context?: any): this;
        on(event: "added" | "removed", fn: (displayObject: DisplayObject) => void, context?: any): this;
        //tslint:disable-next-line:ban-types forbidden-types
        on(event: string, fn: Function, context?: any): this;
        //tslint:disable-next-line:ban-types forbidden-types
        off(event: "added" | "removed" | string, fn?: Function, context?: any): this;
    }
    class DisplayObject extends utils.EventEmitter implements interaction.InteractiveTarget, accessibility.AccessibleTarget {
        // begin extras.cacheAsBitmap
        protected _cacheAsBitmap: boolean;
        protected _cacheData: boolean;
        cacheAsBitmap: boolean;
        protected _renderCachedWebGL(renderer: WebGLRenderer): void;
        protected _initCachedDisplayObject(renderer: WebGLRenderer): void;
        protected _renderCachedCanvas(renderer: CanvasRenderer): void;
        protected _initCachedDisplayObjectCanvas(renderer: CanvasRenderer): void;
        protected _calculateCachedBounds(): Rectangle;
        protected _getCachedLocalBounds(): Rectangle;
        protected _destroyCachedDisplayObject(): void;
        protected _cacheAsBitmapDestroy(options: boolean | any): void;
        // end extras.cacheAsBitmap

        // begin extras.getChildByName
        name: string | null;
        // end extras.getChildByName

        // begin extras.getGlobalPosition
        getGlobalPosition(point?: Point, skipUpdate?: boolean): Point;
        // end extras.getGlobalPosition

        // begin accessible target
        accessible: boolean;
        accessibleTitle: string | null;
        accessibleHint: string | null;
        tabIndex: number;
        // end accessible target

        // begin interactive target
        interactive: boolean;
        interactiveChildren: boolean;
        hitArea: PIXI.Rectangle | PIXI.Circle | PIXI.Ellipse | PIXI.Polygon | PIXI.RoundedRectangle;
        buttonMode: boolean;
        cursor: string;
        trackedPointers(): { [key: number]: interaction.InteractionTrackingData; };
        // depricated
        defaultCursor: string;
        // end interactive target

        transform: TransformBase;
        alpha: number;
        visible: boolean;
        renderable: boolean;
        parent: Container;
        worldAlpha: number;
        filterArea: Rectangle;
        protected _filters: Filter[] | null;
        protected _enabledFilters: Filter[] | null;
        protected _bounds: Bounds;
        protected _boundsID: number;
        protected _lastBoundsID: number;
        protected _boundsRect: Rectangle;
        protected _localBoundsRect: Rectangle;
        protected _mask: PIXI.Graphics | PIXI.Sprite;
        protected readonly _destroyed: boolean;
        x: number;
        y: number;
        worldTransform: Matrix;
        localTransform: Matrix;
        position: Point | ObservablePoint;
        scale: Point | ObservablePoint;
        pivot: Point | ObservablePoint;
        skew: ObservablePoint;
        rotation: number;
        worldVisible: boolean;
        mask: PIXI.Graphics | PIXI.Sprite;
        filters: Filter[] | null;

        updateTransform(): void;
        protected displayObjectUpdateTransform(): void;
        protected _recursivePostUpdateTransform(): void;
        getBounds(skipUpdate?: boolean, rect?: Rectangle): Rectangle;
        getLocalBounds(rect?: Rectangle): Rectangle;
        //creates and returns a new point
        toGlobal(position: PointLike): Point;
        //modifies the x and y of the passed point and returns it
        toGlobal<T extends PointLike>(position: PointLike, point?: T, skipUpdate?: boolean): T;
        //creates and returns a new point
        toLocal(position: PointLike, from?: DisplayObject): Point;
        //modifies the x and y of the passed point and returns it
        toLocal<T extends PointLike>(position: PointLike, from?: DisplayObject, point?: T, skipUpdate?: boolean): T;
        renderWebGL(renderer: WebGLRenderer): void;
        renderCanvas(renderer: CanvasRenderer): void;
        setParent(container: Container): Container;
        setTransform(x?: number, y?: number, scaleX?: number, scaleY?: number, rotation?: number, skewX?: number, skewY?: number, pivotX?: number, pivotY?: number): DisplayObject;
        destroy(): void;

        on(event: interaction.InteractionEventTypes, fn: (event: interaction.InteractionEvent) => void, context?: any): this;
        once(event: interaction.InteractionEventTypes, fn: (event: interaction.InteractionEvent) => void, context?: any): this;
        removeListener(event: interaction.InteractionEventTypes, fn?: (event: interaction.InteractionEvent) => void, context?: any): this;
        removeAllListeners(event: interaction.InteractionEventTypes): this;
        off(event: interaction.InteractionEventTypes, fn?: (event: interaction.InteractionEvent) => void, context?: any): this;
        addListener(event: interaction.InteractionEventTypes, fn: (event: interaction.InteractionEvent) => void, context?: any): this;
    }
    class TransformBase {
        static IDENTITY: TransformBase;

        worldTransform: Matrix;
        localTransform: Matrix;
        protected _worldID: number;
        updateLocalTransform(): void;
        updateTransform(parentTransform: TransformBase): void;
        updateWorldTransform(parentTransform: TransformBase): void;
    }
    class TransformStatic extends TransformBase {
        position: ObservablePoint;
        scale: ObservablePoint;
        pivot: ObservablePoint;
        skew: ObservablePoint;

        protected _rotation: number;
        protected _sr?: number;
        protected _cr?: number;
        protected _cy?: number;
        protected _sy?: number;
        protected _nsx?: number;
        protected _cx?: number;
        protected _currentLocalID: number;

        protected onChange(): void;
        updateSkew(): void;
        updateLocalTransform(): void;
        updateTransform(parentTransform: TransformBase): void;
        setFromMatrix(matrix: Matrix): void;
        rotation: number;
    }
    class Transform extends TransformBase {
        constructor();

        position: Point;
        scale: Point;
        skew: ObservablePoint;
        pivot: Point;

        protected _rotation: number;
        protected _sr?: number;
        protected _cr?: number;
        protected _cy?: number;
        protected _sy?: number;
        protected _nsx?: number;
        protected _cx?: number;

        updateSkew(): void;
        setFromMatrix(matrix: Matrix): void;

        rotation: number;
    }
    // graphics
    class GraphicsData {
        constructor(
            lineWidth: number,
            lineColor: number,
            lineAlpha: number,
            fillColor: number,
            fillAlpha: number,
            fill: boolean,
            nativeLines: boolean,
            shape: Circle | Rectangle | Ellipse | Polygon | RoundedRectangle | any);
        lineWidth: number;
        nativeLines: boolean;
        lineColor: number;
        lineAlpha: number;
        protected _lineTint: number;
        fillColor: number;
        fillAlpha: number;
        protected _fillTint: number;
        fill: boolean;
        protected holes: Circle[] | Rectangle[] | Ellipse[] | Polygon[] | RoundedRectangle[] | any[];
        shape: Circle | Rectangle | Ellipse | Polygon | RoundedRectangle | any;
        type?: number;
        clone(): GraphicsData;
        addHole(shape: Circle | Rectangle | Ellipse | Polygon | RoundedRectangle | any): void;
        destroy(options?: DestroyOptions | boolean): void;
    }
    class Graphics extends Container {
        constructor(nativeLines?: boolean);

        fillAlpha: number;
        lineWidth: number;
        nativeLines: boolean;
        lineColor: number;
        protected graphicsData: GraphicsData[];
        tint: number;
        protected _prevTint: number;
        blendMode: number;
        currentPath: GraphicsData;
        protected _webGL: any;
        isMask: boolean;
        boundsPadding: number;
        protected _localBounds: Bounds;
        dirty: number;
        fastRectDirty: number;
        clearDirty: number;
        boundsDirty: number;
        protected cachedSpriteDirty: boolean;
        protected _spriteRect: Rectangle;
        protected _fastRect: boolean;

        static _SPRITE_TEXTURE: Texture;

        clone(): Graphics;
        lineStyle(lineWidth?: number, color?: number, alpha?: number): Graphics;
        moveTo(x: number, y: number): Graphics;
        lineTo(x: number, y: number): Graphics;
        quadraticCurveTo(cpX: number, cpY: number, toX: number, toY: number): Graphics;
        bezierCurveTo(cpX: number, cpY: number, cpX2: number, cpY2: number, toX: number, toY: number): Graphics;
        arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): Graphics;
        arc(cx: number, cy: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): Graphics;
        beginFill(color: number, alpha?: number): Graphics;
        endFill(): Graphics;
        drawRect(x: number, y: number, width: number, height: number): Graphics;
        drawRoundedRect(x: number, y: number, width: number, height: number, radius: number): Graphics;
        drawCircle(x: number, y: number, radius: number): Graphics;
        drawEllipse(x: number, y: number, width: number, height: number): Graphics;
        drawPolygon(path: number[] | Point[]): Graphics;
        clear(): Graphics;
        isFastRect(): boolean;
        protected _renderCanvas(renderer: CanvasRenderer): void;
        protected _calculateBounds(): Rectangle;
        protected _renderSpriteRect(renderer: PIXI.SystemRenderer): void;
        containsPoint(point: Point): boolean;
        updateLocalBounds(): void;
        drawShape(shape: Circle | Rectangle | Ellipse | Polygon | RoundedRectangle | any): GraphicsData;
        generateCanvasTexture(scaleMode?: number, resolution?: number): Texture;
        protected closePath(): Graphics;
        protected addHole(): Graphics;
        destroy(options?: DestroyOptions | boolean): void;
    }
    class CanvasGraphicsRenderer {
        constructor(renderer: SystemRenderer);
        render(graphics: Graphics): void;
        protected updateGraphicsTint(graphics: Graphics): void;
        protected renderPolygon(points: Point[], close: boolean, context: CanvasRenderingContext2D): void;
        destroy(): void;
    }
    class GraphicsRenderer extends ObjectRenderer {
        constructor(renderer: PIXI.CanvasRenderer);

        protected graphicsDataPool: GraphicsData[];
        protected primitiveShader: PrimitiveShader;
        gl: WebGLRenderingContext;

        CONTEXT_UID: number;

        destroy(): void;
        render(graphics: Graphics): void;
        protected updateGraphics(graphics: PIXI.Graphics): void;
        getWebGLData(webGL: WebGLRenderingContext, type: number, nativeLines: number): WebGLGraphicsData;
    }
    class WebGLGraphicsData {
        constructor(gl: WebGLRenderingContext, shader: glCore.GLShader, attribsState: glCore.AttribState);

        gl: WebGLRenderingContext;
        color: number[];
        points: Point[];
        indices: number[];
        buffer: WebGLBuffer;
        indexBuffer: WebGLBuffer;
        dirty: boolean;
        glPoints: number[];
        glIndices: number[];
        shader: glCore.GLShader;
        vao: glCore.VertexArrayObject;
        nativeLines: boolean;

        reset(): void;
        upload(): void;
        destroy(): void;
    }
    class PrimitiveShader extends glCore.GLShader { }

    // math

    namespace GroupD8 {
        const E: number;
        const SE: number;
        const S: number;
        const SW: number;
        const W: number;
        const NW: number;
        const N: number;
        const NE: number;
        const MIRROR_HORIZONTAL: number;
        const MIRROR_VERTICAL: number;
        function uX(ind: number): number;
        function uY(ind: number): number;
        function vX(ind: number): number;
        function vY(ind: number): number;
        function inv(rotation: number): number;
        function add(rotationSecond: number, rotationFirst: number): number;
        function sub(rotationSecond: number, rotationFirst: number): number;
        function rotate180(rotation: number): number;
        function isSwapWidthHeight(rotation: number): boolean;
        function byDirection(dx: number, dy: number): number;
        function matrixAppendRotationInv(matrix: Matrix, rotation: number, tx: number, ty: number): void;
    }
    class Matrix {
        constructor(a?: number, b?: number, c?: number, d?: number, tx?: number, ty?: number);

        a: number;
        b: number;
        c: number;
        d: number;
        tx: number;
        ty: number;

        fromArray(array: number[]): void;
        set(a: number, b: number, c: number, d: number, tx: number, ty: number): Matrix;
        toArray(transpose?: boolean, out?: number[]): number[];
        apply(pos: Point, newPos?: Point): Point;
        applyInverse(pos: Point, newPos?: Point): Point;
        translate(x: number, y: number): Matrix;
        scale(x: number, y: number): Matrix;
        rotate(angle: number): Matrix;
        append(matrix: Matrix): Matrix;
        setTransform(x: number, y: number, pivotX: number, pivotY: number, scaleX: number, scaleY: number, rotation: number, skewX: number, skewY: number): PIXI.Matrix;
        prepend(matrix: Matrix): Matrix;
        invert(): Matrix;
        identity(): Matrix;
        decompose(transform: TransformBase): TransformBase;
        clone(): Matrix;
        copy(matrix: Matrix): Matrix;

        static IDENTITY: Matrix;
        static TEMP_MATRIX: Matrix;
    }
    class PointLike {
        x: number;
        y: number;

        set(x?: number, y?: number): void;
        copy(point: PointLike): void;
    }
    class ObservablePoint extends PointLike {
        constructor(cb: () => any, scope?: any, x?: number, y?: number);
        cb: () => any;
        scope: any;
    }
    class Point extends PointLike {
        constructor(x?: number, y?: number);
        clone(): Point;
        equals(p: PointLike): boolean;
    }
    interface HitArea {
        contains(x: number, y: number): boolean;
    }
    class Circle {
        constructor(x?: number, y?: number, radius?: number);

        x: number;
        y: number;
        radius: number;
        type: number;

        clone(): Circle;
        contains(x: number, y: number): boolean;
        getBounds(): Rectangle;
    }
    class Ellipse {
        constructor(x?: number, y?: number, width?: number, height?: number);

        x: number;
        y: number;
        width: number;
        height: number;
        type: number;

        clone(): Ellipse;
        contains(x: number, y: number): boolean;
        getBounds(): Rectangle;
    }
    class Polygon {
        constructor(points: Point[] | number[]);
        // Note - Rest Params cannot be combined with |
        //tslint:disable-next-line:unified-signatures
        constructor(...points: Point[]);
        //tslint:disable-next-line:unified-signatures
        constructor(...points: number[]);

        closed: boolean;
        points: number[];
        type: number;

        clone(): Polygon;
        contains(x: number, y: number): boolean;
        close(): void;
    }
    class Rectangle {
        constructor(x?: number, y?: number, width?: number, height?: number);

        x: number;
        y: number;
        width: number;
        height: number;
        type: number;
        left: number;
        right: number;
        top: number;
        bottom: number;

        static EMPTY: Rectangle;

        clone(): Rectangle;
        copy(rectangle: Rectangle): Rectangle;
        contains(x: number, y: number): boolean;
        pad(paddingX: number, paddingY: number): void;
        fit(rectangle: Rectangle): void;
        enlarge(rectangle: Rectangle): void;
    }
    class RoundedRectangle {
        constructor(x?: number, y?: number, width?: number, height?: number, radius?: number);

        x: number;
        y: number;
        width: number;
        height: number;
        radius: number;
        type: number;

        clone(): RoundedRectangle;
        contains(x: number, y: number): boolean;
    }
    // renderers
    interface RendererOptions {
        /**
         * the width of the renderers view [default=800]
         */
        width?: number;

        /**
         * the height of the renderers view [default=600]
         */
        height?: number;

        /**
         * the canvas to use as a view, optional
         */
        view?: HTMLCanvasElement;

        /**
         * If the render view is transparent, [default=false]
         */
        transparent?: boolean;

        /**
         * sets antialias (only applicable in chrome at the moment) [default=false]
         */
        antialias?: boolean;

        /**
         * enables drawing buffer preservation, enable this if you need to call toDataUrl on the webgl context [default=false]
         */
        preserveDrawingBuffer?: boolean;

        /**
         * The resolution / device pixel ratio of the renderer, retina would be 2 [default=1]
         */
        resolution?: number;

        /**
         * prevents selection of WebGL renderer, even if such is present [default=false]
         */
        forceCanvas?: boolean;

        /**
         * The background color of the rendered area (shown if not transparent) [default=0x000000]
         */
        backgroundColor?: number;

        /**
         * This sets if the renderer will clear the canvas or not before the new render pass. [default=true]
         */
        clearBeforeRender?: boolean;

        /**
         * If true Pixi will Math.floor() x/ y values when rendering, stopping pixel interpolation. [default=false]
         */
        roundPixels?: boolean;

        /**
         * forces FXAA antialiasing to be used over native FXAA is faster, but may not always look as great ** webgl only** [default=false]
         */
        forceFXAA?: boolean;

        /**
         * `true` to ensure compatibility with older / less advanced devices. If you experience unexplained flickering try setting this to true. **webgl only** [default=false]
         */
        legacy?: boolean;

        /**
         * Depricated
         */
        context?: WebGLRenderingContext;

        /**
         * Depricated
         */
        autoResize?: boolean;
    }
    interface ApplicationOptions extends RendererOptions {
        /**
         * `true` to use PIXI.ticker.shared, `false` to create new ticker. [default=false]
         */
        sharedTicker?: boolean;

        /**
         * `true` to use PIXI.loaders.shared, `false` to create new Loader.
         */
        sharedLoader?: boolean;
    }
    class SystemRenderer extends utils.EventEmitter {
        constructor(system: string, options?: RendererOptions);
        constructor(system: string, screenWidth?: number, screenHeight?: number, options?: RendererOptions);

        type: number;
        options: RendererOptions;
        screen: Rectangle;
        readonly width: number;
        readonly height: number;
        view: HTMLCanvasElement;
        resolution: number;
        transparent: boolean;
        autoResize: boolean;
        blendModes: any; // todo?
        preserveDrawingBuffer: boolean;
        clearBeforeRender: boolean;
        roundPixels: boolean;
        protected _backgroundColor: number;
        protected _backgroundColorRgba: number[];
        protected _backgroundColorString: string;
        protected _tempDisplayObjectParent: Container;
        protected _lastObjectRendered: DisplayObject;

        resize(screenWidth: number, screenHeight: number): void;
        generateTexture(displayObject: DisplayObject, scaleMode?: number, resolution?: number): RenderTexture;
        render(...args: any[]): void;
        destroy(removeView?: boolean): void;
    }
    class CanvasRenderer extends SystemRenderer {
        // plugintarget mixin start
        static __plugins: any;
        //tslint:disable-next-line:ban-types forbidden-types
        static registerPlugin(pluginName: string, ctor: Function): void;
        plugins: any;
        initPlugins(): void;
        destroyPlugins(): void;
        // plugintarget mixin end

        // from InteractionManager
        interaction?: interaction.InteractionManager;

        constructor(options?: RendererOptions);
        constructor(screenWidth?: number, screenHeight?: number, options?: RendererOptions);

        rootContext: CanvasRenderingContext2D;
        rootResolution?: number;
        refresh: boolean;
        maskManager: CanvasMaskManager;
        smoothProperty: string;
        extract: extract.CanvasExtract;

        context: CanvasRenderingContext2D | null;

        render(displayObject: PIXI.DisplayObject, renderTexture?: PIXI.RenderTexture, clear?: boolean, transform?: PIXI.Transform, skipUpdateTransform?: boolean): void;
        setBlendMode(blendMode: number): void;
        destroy(removeView?: boolean): void;
        clear(clearColor?: string): void;

        on(event: "prerender" | "postrender", fn: () => void, context?: any): this;
        once(event: "prerender" | "postrender", fn: () => void, context?: any): this;
        removeListener(event: "prerender" | "postrender", fn?: () => void, context?: any): this;
        removeAllListeners(event: "prerender" | "postrender"): this;
        off(event: "prerender" | "postrender", fn?: () => void, context?: any): this;
        addListener(event: "prerender" | "postrender", fn: () => void, context?: any): this;
    }
    class CanvasMaskManager {
        constructor(renderer: CanvasRenderer);

        pushMask(maskData: any): void;
        protected renderGraphicsShape(graphics: Graphics): void;
        popMask(renderer: WebGLRenderer | CanvasRenderer): void;
        destroy(): void;
    }
    class CanvasRenderTarget {
        constructor(width: number, height: number, resolution: number);

        canvas: HTMLCanvasElement;
        context: CanvasRenderingContext2D;
        resolution: number;

        width: number;
        height: number;

        clear(): void;
        resize(width: number, height: number): void;
        destroy(): void;
    }
    interface WebGLRendererOptions extends RendererOptions {
    }
    class WebGLRenderer extends SystemRenderer {
        // plugintarget mixin start
        static __plugins: any;
        //tslint:disable-next-line:ban-types forbidden-types
        static registerPlugin(pluginName: string, ctor: Function): void;
        plugins: any;
        initPlugins(): void;
        destroyPlugins(): void;
        // plugintarget mixin end

        // from InteractionManager
        interaction: interaction.InteractionManager;

        constructor(options?: WebGLRendererOptions);
        constructor(screenWidth?: number, screenHeight?: number, options?: WebGLRendererOptions);

        protected _contextOptions: {
            alpha: boolean;
            antiAlias?: boolean;
            premultipliedAlpha: boolean;
            stencil: boolean;
            preseveDrawingBuffer?: boolean;
        };
        protected _backgroundColorRgba: number[];
        maskManager: MaskManager;
        stencilManager?: StencilManager;
        emptyRenderer: ObjectRenderer;
        currentRenderer: ObjectRenderer;
        gl: WebGLRenderingContext;
        CONTEXT_UID: number;
        state?: WebGLState;
        renderingToScreen: boolean;
        boundTextures: Texture[];
        filterManager: FilterManager;
        textureManager?: TextureManager;
        textureGC?: TextureGarbageCollector;
        extract: extract.WebGLExtract;
        protected drawModes: any;
        protected _activeShader: Shader;
        _activeRenderTarget: RenderTarget;
        protected _initContext(): void;

        render(displayObject: PIXI.DisplayObject, renderTexture?: PIXI.RenderTexture, clear?: boolean, transform?: PIXI.Transform, skipUpdateTransform?: boolean): void;
        setObjectRenderer(objectRenderer: ObjectRenderer): void;
        flush(): void;
        setBlendMode(blendMode: number): void;
        clear(clearColor?: number): void;
        setTransform(matrix: Matrix): void;
        clearRenderTexture(renderTexture: RenderTexture, clearColor?: number): WebGLRenderer;
        bindRenderTexture(renderTexture: RenderTexture, transform: Transform): WebGLRenderer;
        bindRenderTarget(renderTarget: RenderTarget): WebGLRenderer;
        bindShader(shader: Shader, autoProject?: boolean): WebGLRenderer;
        bindTexture(texture: Texture | BaseTexture, location?: number, forceLocation?: boolean): number;
        unbindTexture(texture: Texture | BaseTexture): WebGLRenderer | undefined;
        createVao(): glCore.VertexArrayObject;
        bindVao(vao: glCore.VertexArrayObject): WebGLRenderer;
        reset(): WebGLRenderer;
        handleContextLost: (event: WebGLContextEvent) => void;
        handleContextRestored: () => void;
        destroy(removeView?: boolean): void;

        on(event: "prerender" | "postrender", fn: () => void, context?: any): this;
        on(event: "context", fn: (gl: WebGLRenderingContext) => void, context?: any): this;
        once(event: "prerender" | "postrender", fn: () => void, context?: any): this;
        once(event: "context", fn: (gl: WebGLRenderingContext) => void, context?: any): this;
        removeListener(event: "prerender" | "postrender", fn?: () => void, context?: any): this;
        removeListener(event: "context", fn?: (gl: WebGLRenderingContext) => void, context?: any): this;
        removeAllListeners(event: "prerender" | "postrender" | "context"): this;
        off(event: "prerender" | "postrender", fn?: () => void, context?: any): this;
        off(event: "context", fn?: (gl: WebGLRenderingContext) => void, context?: any): this;
        addListener(event: "prerender" | "postrender", fn: () => void, context?: any): this;
        addListener(event: "context", fn: (gl: WebGLRenderingContext) => void, context?: any): this;
    }
    class WebGLState {
        constructor(gl: WebGLRenderingContext);

        activeState: number[];
        defaultState: number[];
        stackIndex: number;
        stack: number[];
        gl: WebGLRenderingContext;
        maxAttribs: number;
        attribState: glCore.AttribState;
        nativeVaoExtension: any;

        push(): void;
        pop(): void;
        setState(state: number[]): void;
        setBlend(value: number): void;
        setBlendMode(value: number): void;
        setDepthTest(value: number): void;
        setCullFace(value: number): void;
        setFrontFace(value: number): void;
        resetAttributes(): void;
        resetToDefault(): void;
    }
    class TextureManager {
        constructor(renderer: WebGLRenderer);

        renderer: WebGLRenderer;
        gl: WebGLRenderingContext;
        protected _managedTextures: Texture[];

        bindTexture(): void;
        getTexture(): WebGLTexture;
        updateTexture(texture: BaseTexture | Texture): WebGLTexture;
        destroyTexture(texture: BaseTexture, _skipRemove?: boolean): void;
        removeAll(): void;
        destroy(): void;
    }
    class TextureGarbageCollector {
        constructor(renderer: WebGLRenderer);

        renderer: WebGLRenderer;
        count: number;
        checkCount: number;
        maxIdle: number;
        checkCountMax: number;
        mode: number;

        update(): void;
        run(): void;
        unload(): void;
    }
    abstract class ObjectRenderer extends WebGLManager {
        constructor(renderer: WebGLRenderer);

        start(): void;
        stop(): void;
        flush(): void;

        render(...args: any[]): void;
    }
    class Quad {
        constructor(gl: WebGLRenderingContext);

        gl: WebGLRenderingContext;
        vertices: number[];
        uvs: number[];
        interleaved: number[];
        indices: number[];
        vertexBuffer: WebGLBuffer;
        vao: glCore.VertexArrayObject;
        initVao(shader: glCore.GLShader): void;
        map(targetTextureFrame: Rectangle, destinationFrame: Rectangle): Quad;
        upload(): Quad;
        destroy(): void;
    }
    interface FilterDataStackItem {
        renderTarget: RenderTarget;
        filter: any[];
        bounds: Rectangle;
    }
    class RenderTarget {
        constructor(gl: WebGLRenderingContext, width: number, height: number, scaleMode: number, resolution: number, root?: boolean);

        gl: WebGLRenderingContext;
        frameBuffer: glCore.GLFramebuffer;
        texture: Texture;
        clearColor: number[];
        size: Rectangle;
        resolution: number;
        projectionMatrix: Matrix;
        transform: Matrix;
        frame: Rectangle;
        defaultFrame: Rectangle;
        destinationFrame: Rectangle;
        sourceFrame?: Rectangle;
        stencilBuffer: glCore.GLFramebuffer;
        stencilMaskStack: Graphics[];
        filterData: {
            index: number,
            stack: FilterDataStackItem[];
        };
        scaleMode: number;
        root: boolean;

        clear(clearColor?: number[]): void;
        attachStencilBuffer(): void;
        setFrame(destinationFrame: Rectangle, sourceFrame: Rectangle): void;
        activate(): void;
        calculateProjection(destinationFrame: Rectangle, sourceFrame: Rectangle): void;
        resize(width: number, height: number): void;
        destroy(): void;
    }

    class BlendModeManager extends WebGLManager {
        constructor(renderer: WebGLRenderer);

        currentBlendMode: number;

        setBlendMode(blendMode: number): boolean;
    }
    interface FilterManagerStackItem {
        renderTarget: RenderTarget;
        sourceFrame: Rectangle;
        destinationFrame: Rectangle;
        filters: Filter[];
        target: any;
        resolution: number;
    }
    class FilterManager extends WebGLManager {
        constructor(renderer: WebGLRenderer);
        gl: WebGLRenderingContext;
        quad: Quad;
        stack: FilterManagerStackItem[];
        stackIndex: number;
        shaderCache: any;
        filterData: any;

        pushFilter(target: RenderTarget, filters: Filter[]): void;
        popFilter(): void;
        applyFilter(shader: glCore.GLShader | Filter, inputTarget: RenderTarget, outputTarget: RenderTarget, clear?: boolean): void;
        syncUniforms(shader: glCore.GLShader, filter: Filter): void;
        getRenderTarget(clear?: boolean, resolution?: number): RenderTarget;
        returnRenderTarget(renderTarget: RenderTarget): RenderTarget;
        calculateScreenSpaceMatrix(outputMatrix: Matrix): Matrix;
        calculateNormalizedScreenSpaceMatrix(outputMatrix: Matrix): Matrix;
        calculateSpriteMatrix(outputMatrix: Matrix, sprite: Sprite): Matrix;
        destroy(): void;
        emptyPool(): void;
        getPotRenderTarget(gl: WebGLRenderingContext, minWidth: number, minHeight: number, resolution: number): RenderTarget;
        freePotRenderTarget(renderTarget: RenderTarget): void;
    }
    class StencilMaskStack {
        stencilStack: any[];
        reverse: boolean;
        count: number;
    }
    class MaskManager extends WebGLManager {
        scissor: boolean;
        scissorData: any;
        scissorRenderTarget: RenderTarget;
        enableScissor: boolean;
        alphaMaskPool: number[];
        alphaMaskIndex: number;
        pushMask(target: RenderTarget, maskData: Sprite | Graphics): void;
        popMask(target: RenderTarget, maskData: Sprite | Graphics): void;
        pushSpriteMask(target: RenderTarget, maskData: Sprite | Graphics): void;
        popSpriteMask(): void;
        pushStencilMask(maskData: Sprite | Graphics): void;
        popStencilMask(): void;
        pushScissorMask(target: RenderTarget, maskData: Sprite | Graphics): void;
        popScissorMask(): void;
    }
    class StencilManager extends WebGLManager {
        constructor(renderer: WebGLRenderer);

        stencilMaskStack: Graphics[];

        setMaskStack(stencilMasStack: Graphics[]): void;
        pushStencil(graphics: Graphics): void;
        popStencil(): void;
        destroy(): void;
    }
    class WebGLManager {
        constructor(renderer: WebGLRenderer);

        renderer: SystemRenderer;
        onContextChange(): void;
        destroy(): void;
    }
    interface UniformData {
        type: string;
        value: any;

        // name is set by pixi if uniforms were automatically extracted from shader code, but not used anywhere
        name?: string;
    }
    class Filter {
        constructor(vertexSrc?: string, fragmentSrc?: string, uniforms?: { [name: string]: UniformData });

        vertextSrc?: string;
        fragmentSrc: string;
        blendMode: number;
        protected uniformData: { [name: string]: UniformData };
        uniforms: { [name: string]: any } | any;
        glShaders: any;
        glShaderKey?: number;
        padding: number;
        resolution: number;
        enabled: boolean;
        autoFit: boolean;
        apply(filterManager: FilterManager, input: RenderTarget, output: RenderTarget, clear?: boolean, currentState?: any): void;

        static defaultVertexSrc: string;
        static defaultFragmentSrc: string;
    }
    class SpriteMaskFilter extends Filter {
        constructor(sprite: Sprite);

        maskSprite: Sprite;
        maskMatrix: Matrix;
        apply(filterManager: FilterManager, input: RenderTarget, output: RenderTarget): void;
    }

    // sprites

    class Sprite extends Container {
        constructor(texture?: Texture);

        protected _anchor: ObservablePoint;
        anchor: ObservablePoint;
        protected _texture: Texture;
        protected _transformTrimmedID: number;
        protected _textureTrimmedID: number;
        protected _width: number;
        protected _height: number;
        tint: number;
        protected _tint: number;
        protected _tintRGB: number;
        blendMode: number;
        pluginName: string;
        protected cachedTint: number;
        texture: Texture;
        protected textureDirty: boolean;
        protected _textureID: number;
        protected _transformID: number;
        protected vertexTrimmedData: Float32Array;
        vertexData: Float32Array;
        width: number;
        height: number;

        protected _onTextureUpdate(): void;
        calculateVertices(): void;
        protected _calculateBounds(): void;
        protected calculateTrimmedVertices(): void;
        protected onAnchorUpdate(): void;
        protected _renderWebGL(renderer: WebGLRenderer): void;
        protected _renderCanvas(renderer: CanvasRenderer): void;
        getLocalBounds(): Rectangle;
        containsPoint(point: Point): boolean;
        destroy(options?: DestroyOptions | boolean): void;

        static from(source: number | string | BaseTexture | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement): Sprite;
        static fromFrame(frameId: string): Sprite;
        static fromImage(imageId: string, crossorigin?: boolean, scaleMode?: number): Sprite;
    }
    class BatchBuffer {
        vertices: ArrayBuffer;
        float32View: number[];
        uint32View: number[];

        destroy(): void;
    }
    class SpriteRenderer extends ObjectRenderer {
        constructor(renderer: PIXI.WebGLRenderer);

        vertSize: number;
        vertByteSize: number;
        size: number;
        buffers: BatchBuffer[];
        indices: number[];
        shaders: Shader[];
        currentIndex: number;
        tick: number;
        groups: any[];
        sprites: Sprite[];
        vertexBuffers: number[];
        vaos: glCore.VertexArrayObject[];
        vaoMax: number;
        vertexCount: number;

        protected onContextChanged: () => void;
        protected onPrerender: () => void;
        render(sprite: Sprite): void;
        flush(): void;
        start(): void;
        stop(): void;
        destroy(): void;
    }
    class CanvasSpriteRenderer extends ObjectRenderer {
        constructor(renderer: WebGLRenderer);

        render(sprite: Sprite): void;
        destroy(): void;
    }
    namespace CanvasTinter {
        function getTintedTexture(sprite: Sprite, color: number): HTMLCanvasElement;
        function tintWithMultiply(texture: Texture, color: number, canvas: HTMLCanvasElement): void;
        function tintWithOverlay(texture: Texture, color: number, canvas: HTMLCanvasElement): void;
        function tintWithPerPixel(texture: Texture, color: number, canvas: HTMLCanvasElement): void;
        function roundColor(color: number): number;

        let cacheStepsPerColorChannel: number;
        let convertTintToImage: boolean;
        let canUseMultiply: boolean;
        let tintMethod: number;
    }

    // text
    interface TextStyleOptions {
        align?: string;
        breakWords?: boolean;
        dropShadow?: boolean;
        dropShadowAlpha?: number;
        dropShadowAngle?: number;
        dropShadowBlur?: number;
        dropShadowColor?: string | number;
        dropShadowDistance?: number;
        fill?: string | string[] | number | number[] | CanvasGradient | CanvasPattern;
        fillGradientType?: number;
        fillGradientStops?: number[];
        fontFamily?: string | string[];
        fontSize?: number | string;
        fontStyle?: string;
        fontVariant?: string;
        fontWeight?: string;
        letterSpacing?: number;
        lineHeight?: number;
        lineJoin?: string;
        miterLimit?: number;
        padding?: number;
        stroke?: string | number;
        strokeThickness?: number;
        textBaseline?: string;
        trim?: boolean;
        wordWrap?: boolean;
        wordWrapWidth?: number;
    }

    class TextStyle implements TextStyleOptions {
        constructor(style: TextStyleOptions)

        styleID: number;

        clone(): TextStyle;
        reset(): void;

        protected _align: string;
        align: string;
        protected _breakWords: boolean;
        breakWords: boolean;
        protected _dropShadow: boolean;
        dropShadow: boolean;
        protected _dropShadowAlpha: number;
        dropShadowAlpha: number;
        protected _dropShadowAngle: number;
        dropShadowAngle: number;
        protected _dropShadowBlur: number;
        dropShadowBlur: number;
        protected _dropShadowColor: string | number;
        dropShadowColor: string | number;
        protected _dropShadowDistance: number;
        dropShadowDistance: number;
        protected _fill: string | string[] | number | number[] | CanvasGradient | CanvasPattern;
        fill: string | string[] | number | number[] | CanvasGradient | CanvasPattern;
        protected _fillGradientType: number;
        fillGradientType: number;
        protected _fillGradientStops: number[];
        fillGradientStops: number[];
        protected _fontFamily: string | string[];
        fontFamily: string | string[];
        protected _fontSize: number | string;
        fontSize: number | string;
        protected _fontStyle: string;
        fontStyle: string;
        protected _fontVariant: string;
        fontVariant: string;
        protected _fontWeight: string;
        fontWeight: string;
        protected _letterSpacing: number;
        letterSpacing: number;
        protected _lineHeight: number;
        lineHeight: number;
        protected _lineJoin: string;
        lineJoin: string;
        protected _miterLimit: number;
        miterLimit: number;
        protected _padding: number;
        padding: number;
        protected _stroke: string | number;
        stroke: string | number;
        protected _strokeThickness: number;
        strokeThickness: number;
        protected _textBaseline: string;
        textBaseline: string;
        protected _trim: boolean;
        trim: boolean;
        protected _wordWrap: boolean;
        wordWrap: boolean;
        protected _wordWrapWidth: number;
        wordWrapWidth: number;
        toFontString(): string;
    }
    class TextMetrics {
        protected _canvas: HTMLCanvasElement;
        protected _context: CanvasRenderingContext2D;
        protected _fonts: FontMetrics;

        text: string;
        style: TextStyle;
        width: number;
        height: number;
        lines: number[];
        lineWidgets: number[];
        lineHeight: number;
        maxLineWidth: number;
        fontProperties: any;

        constructor(text: string, style: TextStyle, width: number, height: number, lines: number[], lineWidths: number[], lineHeight: number, maxLineWidth: number, fontProperties: any);

        static measureText(text: string, style: TextStyle, wordWrap?: boolean, canvas?: HTMLCanvasElement): TextMetrics;
        static wordWrap(text: string, style: TextStyle, canvas?: HTMLCanvasElement): string;
        static measureFont(font: string): FontMetrics;
    }
    interface FontMetrics {
        ascent: number;
        descent: number;
        fontSize: number;
    }
    class Text extends Sprite {
        constructor(text?: string, style?: TextStyleOptions, canvas?: HTMLCanvasElement);

        canvas: HTMLCanvasElement;
        context: CanvasRenderingContext2D;
        resolution: number;
        protected _text: string;
        protected _style: TextStyle;
        //tslint:disable-next-line:ban-types forbidden-types
        protected _styleListener: Function;
        protected _font: string;
        protected localStyleID: number;

        width: number;
        height: number;
        style: TextStyle;
        text: string;

        protected updateText(respectDirty?: boolean): void;
        protected drawLetterSpacing(text: string, x: number, y: number, isStroke?: boolean): void;
        protected updateTexture(): void;
        renderWebGL(renderer: WebGLRenderer): void;
        protected _renderCanvas(renderer: CanvasRenderer): void;
        getLocalBounds(rect?: Rectangle): Rectangle;
        protected _calculateBounds(): void;
        protected _onStyleChange: () => void;
        protected _generateFillStyle(style: TextStyle, lines: string[]): string | number | CanvasGradient;
        destroy(options?: DestroyOptions | boolean): void;
        dirty: boolean;
    }
    // textures
    class BaseRenderTexture extends BaseTexture {
        constructor(width?: number, height?: number, scaleMode?: number, resolution?: number);

        height: number;
        width: number;
        realHeight: number;
        realWidth: number;
        resolution: number;
        scaleMode: number;
        hasLoaded: boolean;
        protected _glRenderTargets: { [n: number]: WebGLTexture; };
        protected _canvasRenderTarget: { [n: number]: WebGLTexture; };
        valid: boolean;

        resize(width: number, height: number): void;
        destroy(): void;

        on(event: "update", fn: (baseRenderTexture: BaseRenderTexture) => void, context?: any): this;
        once(event: "update", fn: (baseRenderTexture: BaseRenderTexture) => void, context?: any): this;
        removeListener(event: "update", fn?: (baseRenderTexture: BaseRenderTexture) => void, context?: any): this;
        removeAllListeners(event: "update"): this;
        off(event: "update", fn?: (baseRenderTexture: BaseRenderTexture) => void, context?: any): this;
        addListener(event: "update", fn: (baseRenderTexture: BaseRenderTexture) => void, context?: any): this;
    }
    class BaseTexture extends utils.EventEmitter {
        static from(source: string | HTMLImageElement | HTMLCanvasElement, scaleMode?: number, sourceScale?: number): BaseTexture;

        constructor(source?: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement, scaleMode?: number, resolution?: number);

        protected uuid?: number;
        protected touched: number;
        resolution: number;
        width: number;
        height: number;
        realWidth: number;
        realHeight: number;
        scaleMode: number;
        hasLoaded: boolean;
        isLoading: boolean;
        wrapMode: number;
        source: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | null;
        origSource: HTMLImageElement | null;
        imageType: string | null;
        sourceScale: number;
        premultipliedAlpha: boolean;
        imageUrl: string | null;
        protected isPowerOfTwo: boolean;
        mipmap: boolean;
        wrap?: boolean;
        protected _glTextures: any;
        protected _enabled: number;
        protected _id?: number;
        protected _virtualBoundId: number;
        protected readonly _destroyed: boolean;
        textureCacheIds: string[];

        update(): void;
        protected _updateDimensions(): void;
        protected _updateImageType(): void;
        protected _loadSvgSource(): void;
        protected _loadSvgSourceUsingDataUri(dataUri: string): void;
        protected _loadSvgSourceUsingXhr(): void;
        protected _loadSvgSourceUsingString(svgString: string): void;
        protected loadSource(source: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement): void;
        protected _sourceLoaded(): void;
        destroy(): void;
        dispose(): void;
        updateSourceImage(newSrc: string): void;

        static fromImage(imageUrl: string, crossorigin?: boolean, scaleMode?: number, sourceScale?: number): BaseTexture;
        static fromCanvas(canvas: HTMLCanvasElement, scaleMode?: number, origin?: string): BaseTexture;
        static addToCache(baseTexture: BaseTexture, id: string): void;
        static removeFromCache(baseTexture: string | BaseTexture): BaseTexture;

        on(event: "update" | "loaded" | "error" | "dispose", fn: (baseTexture: BaseTexture) => void, context?: any): this;
        once(event: "update" | "loaded" | "error" | "dispose", fn: (baseTexture: BaseTexture) => void, context?: any): this;
        removeListener(event: "update" | "loaded" | "error" | "dispose", fn?: (baseTexture: BaseTexture) => void, context?: any): this;
        removeAllListeners(event: "update" | "loaded" | "error" | "dispose"): this;
        off(event: "update" | "loaded" | "error" | "dispose", fn?: (baseTexture: BaseTexture) => void, context?: any): this;
        addListener(event: "update" | "loaded" | "error" | "dispose", fn: (baseTexture: BaseTexture) => void, context?: any): this;
    }
    class RenderTexture extends Texture {
        constructor(baseRenderTexture: BaseRenderTexture, frame?: Rectangle);

        protected legacyRenderer: any;
        valid: boolean;

        resize(width: number, height: number, doNotResizeBaseTexture?: boolean): void;

        static create(width?: number, height?: number, scaleMode?: number, resolution?: number): RenderTexture;
    }
    class Texture extends utils.EventEmitter {
        constructor(baseTexture: BaseTexture, frame?: Rectangle, orig?: Rectangle, trim?: Rectangle, rotate?: number);

        noFrame: boolean;
        baseTexture: BaseTexture;
        protected _frame: Rectangle;
        trim?: Rectangle;
        valid: boolean;
        requiresUpdate: boolean;
        protected _uvs: TextureUvs;
        orig: Rectangle;
        protected _updateID: number;
        transform: any;
        textureCacheIds: string[];

        update(): void;
        protected onBaseTextureLoaded(baseTexture: BaseTexture): void;
        protected onBaseTextureUpdated(baseTexture: BaseTexture): void;
        destroy(destroyBase?: boolean): void;
        clone(): Texture;
        protected _updateUvs(): void;

        static fromImage(imageUrl: string, crossOrigin?: boolean, scaleMode?: number, sourceScale?: number): Texture;
        static fromFrame(frameId: string): Texture;
        static fromCanvas(canvas: HTMLCanvasElement, scaleMode?: number, origin?: string): Texture;
        static fromVideo(video: HTMLVideoElement | string, scaleMode?: number): Texture;
        static fromVideoUrl(videoUrl: string, scaleMode?: number): Texture;
        static from(source: number | string | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | BaseTexture): Texture;
        static fromLoader(source: HTMLImageElement | HTMLCanvasElement, imageUrl: string, name?: string): Texture;
        static addToCache(texture: Texture, id: string): void;
        static removeFromCache(texture: string | Texture): Texture;

        // depreciation
        static addTextureToCache(texture: Texture, id: string): void;
        static removeTextureFromCache(id: string): Texture;

        frame: Rectangle;
        protected _rotate: boolean | 0;
        rotate: number;
        width: number;
        height: number;

        static EMPTY: Texture;
        static WHITE: Texture;

        on(event: "update", fn: (texture: Texture) => void, context?: any): this;
        once(event: "update", fn: (texture: Texture) => void, context?: any): this;
        removeListener(event: "update", fn?: (texture: Texture) => void, context?: any): this;
        removeAllListeners(event: "update"): this;
        off(event: "update", fn?: (texture: Texture) => void, context?: any): this;
        addListener(event: "update", fn: (texture: Texture) => void, context?: any): this;
    }
    class TextureUvs {
        x0: number;
        y0: number;
        x1: number;
        y1: number;
        x2: number;
        y2: number;
        x3: number;
        y3: number;

        uvsUint32: Uint32Array;

        protected set(frame: Rectangle, baseFrame: Rectangle, rotate: number): void;
    }

    class Spritesheet {
        static BATCH_SIZE: number;

        constructor(baseTexture: BaseTexture, data: any, resolutionFilename?: string);

        baseTexture: BaseTexture;
        textures: { [key: string]: Texture; };
        data: any;
        resolution: number;
        protected _frames: any;
        protected _frameKeys: string;
        protected _batchIndex: number;
        protected _callback: (spriteSheet: this, textures: { [key: string]: Texture; }) => void;
        protected _updateResolution(resolutionFilename: string): number;
        parse(callback: (spriteSheet: this, textures: { [key: string]: Texture; }) => void): void;
        protected _processFrames(initialFrameIndex: number): void;
        protected _parseComplete(): void;
        protected _nextBatch(): void;
        destroy(destroyBase?: boolean): void;
    }

    class VideoBaseTexture extends BaseTexture {
        constructor(source: HTMLVideoElement, scaleMode?: number);

        autoUpdate: boolean;
        autoPlay: boolean;
        protected _isAutoUpdating: boolean;

        update(): void;
        protected _onCanPlay(): void;
        protected _onPlayStart(): void;
        protected _onPlayStop(): void;
        destroy(): void;
        protected _isSourcePlaying(): boolean;
        protected _isSourceReady(): boolean;

        static fromVideo(video: HTMLVideoElement, scaleMode?: number): VideoBaseTexture;
        static fromUrl(videoSrc: string | any | string[] | any[]): VideoBaseTexture;
        static fromUrls(videoSrc: string | any | string[] | any[]): VideoBaseTexture;

        source: HTMLVideoElement;
        protected loadSource(source: HTMLVideoElement): void;
    }

    // ticker

    namespace ticker {
        const shared: Ticker;

        class TickerListener {
            constructor(fn: (deltaTime: number) => void, context?: any, priority?: number, once?: boolean);
            fn: (deltaTime: number) => void;
            context: any;
            priority: number;
            once: boolean;
            next: TickerListener;
            previous: TickerListener;
            protected _destroyed: boolean;
            match(fn: (deltaTime: number) => void, context?: any): boolean;
            emit(deltaTime: number): TickerListener;
            connect(previous: TickerListener): void;
            destroy(hard?: boolean): void;
        }
        class Ticker {
            protected _tick: (time: number) => void;
            protected _head: TickerListener;
            protected _requestId: number | null;
            protected _maxElapsedMS: number;

            autoStart: boolean;
            deltaTime: number;
            elapsedMS: number;
            lastTime: number;
            speed: number;
            started: boolean;

            protected _requestIfNeeded(): void;
            protected _cancelIfNeeded(): void;
            protected _startIfPossible(): void;

            add(fn: (deltaTime: number) => void, context?: any, priority?: number): Ticker;
            addOnce(fn: (deltaTime: number) => void, context?: any, priority?: number): Ticker;
            //tslint:disable-next-line:ban-types forbidden-types
            remove(fn: Function, context?: any, priority?: number): Ticker;
            protected _addListener(listener: TickerListener): Ticker;
            readonly FPS: number;
            minFPS: number;

            start(): void;
            stop(): void;
            destroy(): void;
            update(currentTime?: number): void;
        }
    }

    // shader

    class Shader extends glCore.GLShader { }

    //////////////////////////////////////////////////////////////////////////////
    ////////////////////////////EXTRACT///////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////

    namespace extract {
        class CanvasExtract {
            protected renderer: CanvasRenderer;

            constructor(renderer: CanvasRenderer);

            image(target?: DisplayObject | RenderTexture): HTMLImageElement;
            base64(target?: DisplayObject | RenderTexture): string;
            canvas(target?: DisplayObject | RenderTexture): HTMLCanvasElement;
            pixels(renderTexture?: DisplayObject | RenderTexture): number[];

            destroy(): void;
        }
        class WebGLExtract {
            protected renderer: WebGLRenderer;

            constructor(renderer: WebGLRenderer);

            image(target?: DisplayObject | RenderTexture): HTMLImageElement;
            base64(target?: DisplayObject | RenderTexture): string;
            canvas(target?: DisplayObject | RenderTexture): HTMLCanvasElement;
            pixels(renderTexture?: DisplayObject | RenderTexture): number[];

            destroy(): void;
        }
    }

    //////////////////////////////////////////////////////////////////////////////
    ////////////////////////////EXTRAS////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////

    namespace extras {
        interface BitmapTextStyle {
            font?: string | {
                name?: string;
                size?: number;
            };
            align?: string;
            tint?: number;
        }
        class BitmapText extends Container {
            static registerFont(xml: XMLDocument, texture: Texture): any;

            constructor(text: string, style?: BitmapTextStyle);

            protected _textWidth: number;
            protected _textHeight: number;
            textWidth: number;
            textHeight: number;
            protected _glyphs: Sprite[];
            protected _font: string | {
                name?: string;
                size?: number;
            };
            font: string | {
                name?: string;
                size?: number;
            };
            protected _text: string;
            protected _maxWidth: number;
            maxWidth: number;
            protected _maxLineHeight: number;
            maxLineHeight: number;
            protected _anchor: ObservablePoint;
            dirty: boolean;
            tint: number;
            align: string;
            text: string;
            anchor: PIXI.Point | number;

            protected updateText(): void;
            updateTransform(): void;
            getLocalBounds(): Rectangle;
            protected validate(): void;

            static fonts: any;
        }
        interface AnimatedSpriteTextureTimeObject {
            texture: Texture;
            time?: number;
        }
        class AnimatedSprite extends Sprite {
            constructor(textures: Texture[] | AnimatedSpriteTextureTimeObject[], autoUpdate?: boolean);

            protected _autoUpdate: boolean;
            protected _textures: Texture[];
            protected _durations: number[];
            textures: Texture[] | AnimatedSpriteTextureTimeObject[];
            animationSpeed: number;
            loop: boolean;
            onComplete: () => void;
            onFrameChange: (currentFrame: number) => void;
            onLoop: () => void;
            protected _currentTime: number;
            playing: boolean;
            totalFrames: number;
            currentFrame: number;
            stop(): void;
            play(): void;
            gotoAndStop(frameNumber: number): void;
            gotoAndPlay(frameNumber: number): void;
            protected update(deltaTime: number): void;
            destroy(options?: DestroyOptions | boolean): void;

            static fromFrames(frame: string[]): AnimatedSprite;
            static fromImages(images: string[]): AnimatedSprite;
        }
        class TextureTransform {
            constructor(texture: Texture, clampMargin?: number);

            protected _texture: Texture;
            protected mapCoord: Matrix;
            protected uClampFrame: Float32Array;
            protected uClampOffset: Float32Array;
            protected _lastTextureID: number;

            clampOffset: number;
            clampMargin: number;

            texture: Texture;

            update(forceUpdate?: boolean): boolean;
        }
        class TilingSprite extends Sprite {
            constructor(texture: Texture, width?: number, height?: number);

            tileTransform: TransformStatic;
            protected _width: number;
            protected _height: number;
            protected _canvasPattern: CanvasPattern;
            uvTransform: TextureTransform;
            uvRespectAnchor: boolean;

            clampMargin: number;
            tileScale: Point | ObservablePoint;
            tilePosition: Point | ObservablePoint;

            multiplyUvs(uvs: Float32Array, out: Float32Array): Float32Array;
            protected _onTextureUpdate(): void;
            protected _renderWebGL(renderer: WebGLRenderer): void;
            protected _renderCanvas(renderer: CanvasRenderer): void;
            protected _calculateBounds(): void;
            getLocalBounds(rect?: Rectangle): Rectangle;
            containsPoint(point: Point): boolean;
            destroy(options?: DestroyOptions | boolean): void;

            static from(source: number | string | BaseTexture | HTMLCanvasElement | HTMLVideoElement, width?: number, height?: number): TilingSprite;
            static fromFrame(frameId: string, width?: number, height?: number): TilingSprite;
            // if you remove the next line, the class will break. https://github.com/pixijs/pixi-typescript/issues/96
            static fromImage(imageId: string, crossorigin?: boolean, scaleMode?: number): Sprite;
            static fromImage(imageId: string, width?: number, height?: number, crossorigin?: boolean, scaleMode?: number): TilingSprite;

            width: number;
            height: number;
        }
        class TilingSpriteRenderer extends ObjectRenderer {
            constructor(renderer: WebGLRenderer);

            render(ts: TilingSprite): void;
        }
    }

    //////////////////////////////////////////////////////////////////////////////
    ////////////////////////////FILTERS///////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////

    namespace filters {
        class FXAAFilter extends Filter { }
        class BlurFilter extends Filter {
            constructor(strength?: number, quality?: number, resolution?: number, kernelSize?: number);

            blurXFilter: BlurXFilter;
            blurYFilter: BlurYFilter;
            resolution: number;
            padding: number;
            passes: number;
            blur: number;
            blurX: number;
            blurY: number;
            quality: number;
        }
        class BlurXFilter extends Filter {
            constructor(strength?: number, quality?: number, resolution?: number, kernelSize?: number);

            protected _quality: number;

            quality: number;
            passes: number;
            resolution: number;
            strength: number;
            firstRun: boolean;
            blur: number;
        }
        class BlurYFilter extends Filter {
            constructor(strength?: number, quality?: number, resolution?: number, kernelSize?: number);

            protected _quality: number;

            quality: number;
            passes: number;
            resolution: number;
            strength: number;
            firstRun: boolean;
            blur: number;
        }
        class ColorMatrixFilter extends Filter {
            constructor();

            protected _loadMatrix(matrix: number[], multiply?: boolean): void;
            protected _multiply(out: number[], a: number[], b: number[]): void;
            protected _colorMatrix(matrix: number[]): void;

            matrix: number[];
            alpha: number;

            brightness(b: number, multiply?: boolean): void;
            greyscale(scale: number, multiply?: boolean): void;
            blackAndWhite(multiply?: boolean): void;
            hue(rotation: number, multiply?: boolean): void;
            contrast(amount: number, multiply?: boolean): void;
            saturate(amount: number, multiply?: boolean): void;
            desaturate(multiply?: boolean): void;
            negative(multiply?: boolean): void;
            sepia(multiply?: boolean): void;
            technicolor(multiply?: boolean): void;
            polaroid(multiply?: boolean): void;
            toBGR(multiply?: boolean): void;
            kodachrome(multiply?: boolean): void;
            browni(multiply?: boolean): void;
            vintage(multiply?: boolean): void;
            colorTone(desaturation: number, toned: number, lightColor: string, darkColor: string, multiply?: boolean): void;
            night(intensity: number, multiply?: boolean): void;
            predator(amount: number, multiply?: boolean): void;
            lsd(multiply?: boolean): void;
            reset(): void;
        }
        class DisplacementFilter extends Filter {
            constructor(sprite: Sprite, scale?: number);

            scale: Point;
            map: Texture;
        }
        class VoidFilter extends Filter {
            glShaderKey: number;
        }

        // pixi-filters.d.ts todo
        // https://github.com/pixijs/pixi-filters/
        class NoiseFilter extends Filter {
            constructor(noise?: number, seed?: number);
            noise: number;
            seed: number;
        }
    }

    //////////////////////////////////////////////////////////////////////////////
    ////////////////////////////INTERACTION///////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////

    namespace interaction {
        interface InteractiveTarget {
            interactive: boolean;
            interactiveChildren: boolean;
            hitArea: PIXI.Rectangle | PIXI.Circle | PIXI.Ellipse | PIXI.Polygon | PIXI.RoundedRectangle;
            buttonMode: boolean;
            cursor: string;
            trackedPointers(): { [key: number]: InteractionTrackingData; };

            // depricated
            defaultCursor: string;
        }
        interface InteractionTrackingData {
            readonly pointerId: number;
            flags: number;
            none: number;
            over: boolean;
            rightDown: boolean;
            leftDown: boolean;
        }
        interface InteractionEvent {
            stopped: boolean;
            target: DisplayObject;
            currentTarget: DisplayObject;
            type: string;
            data: InteractionData;
            stopPropagation(): void;
        }
        class InteractionData {
            global: Point;
            target: DisplayObject;
            originalEvent: MouseEvent | TouchEvent | PointerEvent;
            identifier: number;
            isPrimary: boolean;
            button: number;
            buttons: number;
            width: number;
            height: number;
            tiltX: number;
            tiltY: number;
            pointerType: string;
            pressure: number;
            rotationAngle: number;
            twist: number;
            tangentialPressure: number;
            readonly pointerID: number;
            protected _copyEvent(event: Touch | MouseEvent | PointerEvent): void;
            protected _reset(): void;
            getLocalPosition(displayObject: DisplayObject, point?: Point, globalPos?: Point): Point;
        }
        type InteractionPointerEvents = "pointerdown" | "pointercancel" | "pointerup" |
            "pointertap" | "pointerupoutside" | "pointermove" | "pointerover" | "pointerout";
        type InteractionTouchEvents = "touchstart" | "touchcancel" | "touchend" |
            "touchendoutside" | "touchmove" | "tap";
        type InteractionMouseEvents = "rightdown" | "mousedown" | "rightup" | "mouseup" |
            "rightclick" | "click" | "rightupoutside" | "mouseupoutside" | "mousemove" |
            "mouseover" | "mouseout" | "mouseover";
        type InteractionEventTypes = InteractionPointerEvents | InteractionTouchEvents | InteractionMouseEvents;
        interface InteractionManagerOptions {
            autoPreventDefault?: boolean;
            interactionFrequency?: number;
        }
        class InteractionManager extends utils.EventEmitter {
            constructor(renderer: CanvasRenderer | WebGLRenderer | SystemRenderer, options?: InteractionManagerOptions);

            renderer: SystemRenderer;
            autoPreventDefault: boolean;
            interactionFrequency: number;
            mouse: InteractionData;
            activeInteractionData: { [key: number]: InteractionData; };
            interactionDataPool: InteractionData[];
            eventData: InteractionEvent;
            protected interactionDOMElement: HTMLElement;
            moveWhenInside: boolean;
            eventsAdded: boolean;
            protected mouseOverRenderer: boolean;
            readonly supportsTouchEvents: boolean;
            readonly supportsPointerEvents: boolean;
            protected onPointerUp: (event: PointerEvent) => void;
            protected processPointerUp: (interactionEvent: InteractionEvent, displayObject: Container | PIXI.Sprite | PIXI.extras.TilingSprite, hit: boolean) => void;
            protected onPointerCancel: (event: PointerEvent) => void;
            protected processPointerCancel: (interactionEvent: InteractionEvent, displayObject: PIXI.Container | PIXI.Sprite | PIXI.extras.TilingSprite) => void;
            protected onPointerDown: (event: PointerEvent) => void;
            protected processPointerDown: (interactionEvent: InteractionEvent, displayObject: PIXI.Container | PIXI.Sprite | PIXI.extras.TilingSprite, hit: boolean) => void;
            protected onPointerMove: (event: PointerEvent) => void;
            protected processPointerMove: (interactionEvent: InteractionEvent, displayObject: PIXI.Container | PIXI.Sprite | PIXI.extras.TilingSprite, hit: boolean) => void;
            protected onPointerOut: (event: PointerEvent) => void;
            protected processPointerOverOut: (interactionEvent: InteractionEvent, displayObject: PIXI.Container | PIXI.Sprite | PIXI.extras.TilingSprite, hit: boolean) => void;
            protected onPointerOver: (event: PointerEvent) => void;
            cursorStyles: {
                default: string;
                pointer: string;
            };
            currentCursorMode: string;
            cursor: string;
            protected _tempPoint: Point;
            resolution: number;
            hitTest(globalPoint: Point, root?: Container): DisplayObject;
            protected setTargetElement(element: HTMLCanvasElement, resolution?: number): void;
            protected addEvents(): void;
            protected removeEvents(): void;
            update(deltaTime?: number): void;
            setCursorMode(mode: string): void;
            protected dispatchEvent(displayObject: Container | Sprite | extras.TilingSprite, eventString: string, eventData: any): void;
            mapPositionToPoint(point: Point, x: number, y: number): void;
            //tslint:disable-next-line:ban-types forbidden-types
            protected processInteractive(
                interactionEvent: InteractionEvent,
                displayObject: PIXI.Container | PIXI.Sprite | PIXI.extras.TilingSprite,
                func?: Function,
                hitTest?: boolean,
                interactive?: boolean
            ): boolean;
            //tslint:disable-next-line:ban-types forbidden-types
            protected onPointerComplete(
                originalEvent: PointerEvent,
                cancelled: boolean,
                func: Function
            ): void;
            protected getInteractionDataForPointerId(pointerId: number): InteractionData;
            protected releaseInteractionDataForPointerId(event: PointerEvent): void;
            protected configureInteractionEventForDOMEvent(interactionEvent: InteractionEvent, pointerEvent: PointerEvent, interactionData: InteractionData): InteractionEvent;
            protected normalizeToPointerData(event: TouchEvent | MouseEvent | PointerEvent): PointerEvent[];
            destroy(): void;

            // depricated
            defaultCursorStyle: string;
            currentCursorStyle: string;
        }
    }

    //////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////LOADER/////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////

    // pixi loader extends
    // https://github.com/englercj/resource-loader/
    // 2.0.6

    class MiniSignalBinding {
        //tslint:disable-next-line:ban-types forbidden-types
        constructor(fn: Function, once?: boolean, thisArg?: any);

        //tslint:disable-next-line:ban-types forbidden-types
        protected _fn: Function;
        protected _once: boolean;
        protected _thisArg: any;
        protected _next: MiniSignalBinding;
        protected _prev: MiniSignalBinding;
        protected _owner: MiniSignal;

        detach(): boolean;
    }
    class MiniSignal {
        constructor();

        protected _head: MiniSignalBinding;
        protected _tail: MiniSignalBinding;

        handlers(exists?: boolean): MiniSignalBinding[] | boolean;
        handlers(exists?: true): boolean;
        handlers(exists?: false): MiniSignalBinding[];

        has(node: MiniSignalBinding): boolean;
        dispatch(): boolean;
        //tslint:disable-next-line:ban-types forbidden-types
        add(fn: Function, thisArg?: any): any;
        //tslint:disable-next-line:ban-types forbidden-types
        once(fn: Function, thisArg?: any): any;
        detach(node: MiniSignalBinding): MiniSignal;
        detachAll(): MiniSignal;
    }

    namespace loaders {
        interface LoaderOptions {
            crossOrigin?: boolean | string;
            loadType?: number;
            xhrType?: string;
            metaData?: any;
            loadElement?: HTMLImageElement | HTMLAudioElement | HTMLVideoElement;
            skipSource?: boolean;
        }
        interface ResourceDictionary {
            [index: string]: PIXI.loaders.Resource;
        }

        // As of ResourceLoader v2 we no longer require EventEmitter
        // However, for depreciation reasons, it remains.
        class Loader extends utils.EventEmitter {
            // pixi overrides here
            //tslint:disable-next-line:ban-types forbidden-types
            static addPixiMiddleware(fn: Function): void;

            // below this line is the original non-pixi loader

            static Resource: any;
            static async: any;
            static base64: any;

            constructor(baseUrl?: string, concurrency?: number);

            baseUrl: string;
            progress: number;
            loading: boolean;
            defaultQueryString: string;

            //tslint:disable-next-line:ban-types forbidden-types
            protected _beforeMiddleware: Function[];
            //tslint:disable-next-line:ban-types forbidden-types
            protected _afterMiddleware: Function[];
            protected _resourcesParsing: Resource[];
            //tslint:disable-next-line:ban-types forbidden-types
            protected _boundLoadResource: (r: Resource, d: Function) => void;
            protected _queue: any;

            resources: ResourceDictionary;

            onProgress: MiniSignal;
            onError: MiniSignal;
            onLoad: MiniSignal;
            onStart: MiniSignal;
            onComplete: MiniSignal;

            add(...params: any[]): this;
            //tslint:disable-next-line:ban-types forbidden-types
            add(name: string, url: string, options?: LoaderOptions, cb?: Function): this;
            //tslint:disable-next-line:ban-types forbidden-types
            add(obj: string | any | any[], options?: LoaderOptions, cb?: Function): this;

            //tslint:disable-next-line:ban-types forbidden-types
            pre(fn: Function): this;
            //tslint:disable-next-line:ban-types forbidden-types
            use(fn: Function): this;
            reset(): this;
            //tslint:disable-next-line:ban-types forbidden-types
            load(cb?: Function): this;

            protected _prepareUrl(url: string): string;
            //tslint:disable-next-line:ban-types forbidden-types
            protected _loadResource(resource: Resource, dequeue: Function): void;
            protected _onComplete(): void;
            protected _onLoad(resource: Resource): void;

            destroy(): void;

            // depreciation

            on(event: "complete", fn: (loader: loaders.Loader, object: any) => void, context?: any): this;
            on(event: "error", fn: (error: Error, loader: loaders.Loader, resource: Resource) => void, context?: any): this;
            on(event: "load" | "progress", fn: (loader: loaders.Loader, resource: Resource) => void, context?: any): this;
            on(event: "start", fn: (loader: loaders.Loader) => void, context?: any): this;

            once(event: "complete", fn: (loader: loaders.Loader, object: any) => void, context?: any): this;
            once(event: "error", fn: (error: Error, loader: loaders.Loader, resource: Resource) => void, context?: any): this;
            once(event: "load" | "progress", fn: (loader: loaders.Loader, resource: Resource) => void, context?: any): this;
            once(event: "start", fn: (loader: loaders.Loader) => void, context?: any): this;
            //tslint:disable-next-line:ban-types forbidden-types
            off(event: "complete" | "error" | "load" | "progress" | "start" | string, fn?: Function, context?: any): this;
        }
        interface TextureDictionary {
            [index: string]: PIXI.Texture;
        }
        class Resource {
            static setExtensionLoadType(extname: string, loadType: number): void;
            static setExtensionXhrType(extname: string, xhrType: string): void;

            constructor(name: string, url: string | string[], options?: LoaderOptions);

            protected _flags: number;

            name: string;
            url: string;
            extension: string;
            data: any;
            crossOrigin: boolean | string;
            loadType: number;
            xhrType: string;
            metadata: any;
            error: Error;
            xhr: XMLHttpRequest | null;
            children: Resource[];
            type: number;
            progressChunk: number;

            //tslint:disable-next-line:ban-types forbidden-types
            protected _dequeue: Function;
            //tslint:disable-next-line:ban-types forbidden-types
            protected _onLoadBinding: Function;
            //tslint:disable-next-line:ban-types forbidden-types
            protected _boundComplete: Function;
            //tslint:disable-next-line:ban-types forbidden-types
            protected _boundOnError: Function;
            //tslint:disable-next-line:ban-types forbidden-types
            protected _boundOnProgress: Function;
            //tslint:disable-next-line:ban-types forbidden-types
            protected _boundXhrOnError: Function;
            //tslint:disable-next-line:ban-types forbidden-types
            protected _boundXhrOnAbort: Function;
            //tslint:disable-next-line:ban-types forbidden-types
            protected _boundXhrOnLoad: Function;
            //tslint:disable-next-line:ban-types forbidden-types
            protected _boundXdrOnTimeout: Function;

            onStart: MiniSignal;
            onProgress: MiniSignal;
            onComplete: MiniSignal;
            onAfterMiddleware: MiniSignal;

            isDataUrl: boolean;
            isComplete: boolean;
            isLoading: boolean;
            complete(): void;
            abort(message?: string): void;
            //tslint:disable-next-line:ban-types forbidden-types
            load(cb?: Function): void;

            protected _hasFlag(flag: number): boolean;
            protected _setFlag(flag: number, value: boolean): void;
            protected _loadElement(type: string): void;
            protected _loadSourceElement(type: string): void;
            protected _loadXhr(): void;
            protected _loadXdr(): void;
            protected _createSource(type: string, url: string, mime?: string): HTMLSourceElement;
            protected _onError(event?: any): void;
            protected _onProgress(event?: any): void;
            protected _xhrOnError(): void;
            protected _xhrOnAbort(): void;
            protected _xdrOnTimeout(): void;
            protected _xhrOnLoad(): void;
            protected _determineCrossOrigin(url: string, loc: any): string;
            protected _determineXhrType(): number;
            protected _determineLoadType(): number;
            protected _getExtension(): string;
            protected _getMimeXhrType(type: number): string;

            static STATUS_FLAGS: {
                NONE: number;
                DATA_URL: number;
                COMPLETE: number;
                LOADING: number;
            };

            static TYPE: {
                UNKNOWN: number;
                JSON: number;
                XML: number;
                IMAGE: number;
                AUDIO: number;
                VIDEO: number;
                TEXT: number;
            };

            static LOAD_TYPE: {
                XHR: number;
                IMAGE: number;
                AUDIO: number;
                VIDEO: number;
            };

            static XHR_RESPONSE_TYPE: {
                DEFAULT: string;
                BUFFER: string;
                BLOB: string;
                DOCUMENT: string;
                JSON: string;
                TEXT: string;
            };

            static EMPTY_GIF: string;

            texture: Texture;
            spineAtlas: any;
            spineData: any;
            textures?: TextureDictionary;
        }
    }

    //////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////MESH///////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////

    namespace mesh {
        class Mesh extends Container {
            constructor(texture: Texture, vertices?: Float32Array, uvs?: Float32Array, indices?: Uint16Array, drawMode?: number);

            protected _texture: Texture;
            uvs: Float32Array;
            vertices: Float32Array;
            indices: Uint16Array;
            dirty: number;
            indexDirty: number;
            dirtyVertex: boolean;
            protected _geometryVersion: number;
            blendMode: number;
            pluginName: string;
            canvasPadding: number;
            drawMode: number;
            texture: Texture;
            tintRgb: Float32Array;
            protected _glDatas: { [n: number]: any; };
            protected _uvTransform: extras.TextureTransform;
            uploadUvTransform: boolean;
            multiplyUvs(): void;
            refresh(forceUpdate?: boolean): void;
            protected _refresh(): void;
            protected _renderWebGL(renderer: WebGLRenderer): void;
            protected _renderCanvas(renderer: CanvasRenderer): void;
            protected _onTextureUpdate(): void;
            protected _calculateBounds(): void;
            containsPoint(point: Point): boolean;
            tint: number;

            static DRAW_MODES: {
                TRIANGLE_MESH: number;
                TRIANGLES: number;
            };
        }

        class CanvasMeshRenderer {
            constructor(renderer: CanvasRenderer);

            renderer: CanvasRenderer;

            render(mesh: Mesh): void;
            protected _renderTriangleMesh(mesh: Mesh): void;
            protected _renderTriangles(mesh: Mesh): void;
            protected _renderDrawTriangle(mesh: Mesh, index0: number, index1: number, index2: number): void;
            protected renderMeshFlat(mesh: Mesh): void;

            destroy(): void;
        }

        class MeshRenderer extends ObjectRenderer {
            constructor(renderer: WebGLRenderer);

            shader: Shader;
            render(mesh: Mesh): void;
        }

        class Plane extends Mesh {
            constructor(texture: Texture, verticesX?: number, verticesY?: number);
            protected _ready: boolean;
            verticesX: number;
            verticesY: number;
            drawMode: number;

            refresh(): void;

            protected _onTexureUpdate(): void;
        }

        class NineSlicePlane extends Plane {
            constructor(texture: Texture, leftWidth?: number, topHeight?: number, rightWidth?: number, bottomHeight?: number);

            width: number;
            height: number;
            leftWidth: number;
            rightWidth: number;
            topHeight: number;
            bottomHeight: number;

            protected _leftWidth: number;
            protected _rightWidth: number;
            protected _topHeight: number;
            protected _bottomHeight: number;
            protected _height: number;
            protected _width: number;
            protected _origHeight: number;
            protected _origWidth: number;
            protected _uvh: number;
            protected _uvw: number;

            updateHorizontalVertices(): void;
            updateVerticalVertices(): void;
            protected drawSegment(context: CanvasRenderingContext2D | WebGLRenderingContext, textureSource: any, w: number, h: number, x1: number, y1: number, x2: number, y2: number): void;
            protected _refresh(): void;
        }

        class Rope extends Mesh {
            constructor(texture: Texture, points: Point[]);

            points: Point[];
            colors: number[];
            autoUpdate: boolean;
            protected _refresh(): void;

            refreshVertices(): void;
        }
    }
    //////////////////////////////////////////////////////////////////////////////
    /////////////////////////////PARTICLES////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    namespace particles {
        interface ParticleContainerProperties {
            scale?: boolean;
            position?: boolean;
            rotation?: boolean;
            uvs?: boolean;
            alpha?: boolean;
        }
        class ParticleContainer extends Container {
            constructor(size?: number, properties?: ParticleContainerProperties, batchSize?: number);
            protected _tint: number;
            protected tintRgb: number | any[];
            tint: number;
            protected _properties: boolean[];
            protected _maxSize: number;
            protected _batchSize: number;
            protected _glBuffers: { [n: number]: WebGLBuffer; };
            protected _bufferToUpdate: number;
            interactiveChildren: boolean;
            blendMode: number;
            roundPixels: boolean;
            baseTexture: BaseTexture;

            setProperties(properties: ParticleContainerProperties): void;
            protected onChildrenChange: (smallestChildIndex?: number) => void;

            destroy(options?: DestroyOptions | boolean): void;
        }
        class ParticleBuffer {
            constructor(gl: WebGLRenderingContext, properties: any, dynamicPropertyFlags: any[], size: number);

            gl: WebGLRenderingContext;
            vertSize: number;
            vertByteSize: number;
            size: number;
            dynamicProperties: any[];
            staticProperties: any[];
            staticStride: number;
            staticBuffer: any;
            staticData: any;
            dynamicStride: number;
            dynamicBuffer: any;
            dynamicData: any;

            destroy(): void;
        }
        interface ParticleRendererProperty {
            attribute: number;
            size: number;
            uploadFunction(children: PIXI.DisplayObject[], startIndex: number, amount: number, array: number[], stride: number, offset: number): void;
            offset: number;
        }
        class ParticleRenderer extends ObjectRenderer {
            constructor(renderer: WebGLRenderer);

            shader: glCore.GLShader;
            indexBuffer: WebGLBuffer;
            properties: ParticleRendererProperty[];
            protected tempMatrix: Matrix;

            start(): void;
            generateBuffers(container: ParticleContainer): ParticleBuffer[];
            uploadVertices(children: DisplayObject[], startIndex: number, amount: number, array: number[], stride: number, offset: number): void;
            uploadPosition(children: DisplayObject[], startIndex: number, amount: number, array: number[], stride: number, offset: number): void;
            uploadRotation(children: DisplayObject[], startIndex: number, amount: number, array: number[], stride: number, offset: number): void;
            uploadUvs(children: DisplayObject[], startIndex: number, amount: number, array: number[], stride: number, offset: number): void;
            uploadAlpha(children: DisplayObject[], startIndex: number, amount: number, array: number[], stride: number, offset: number): void;
            destroy(): void;

            indices: Uint16Array;
        }
    }
    //////////////////////////////////////////////////////////////////////////////
    ////////////////////////////PREPARE///////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    namespace prepare {
        type AddHook = (item: any, queue: any[]) => boolean;
        type UploadHook<UploadHookSource> = (prepare: UploadHookSource, item: any) => boolean;
        abstract class BasePrepare<UploadHookSource>{
            constructor(renderer: SystemRenderer);

            limiter: CountLimiter | TimeLimiter;
            protected renderer: SystemRenderer;
            protected uploadHookHelper: UploadHookSource;
            protected queue: any[];
            protected addHooks: AddHook[];
            protected uploadHooks: Array<UploadHook<UploadHookSource>>;
            //tslint:disable-next-line:ban-types forbidden-types
            protected completes: Function[];
            protected ticking: boolean;
            protected delayedTick: () => void;

            //tslint:disable-next-line:ban-types forbidden-types
            upload(item: Function | DisplayObject | Container | BaseTexture | Texture | Graphics | Text | any, done?: () => void): void;
            protected tick(): void;
            protected prepareItems(): void;
            registerFindHook(addHook: AddHook): this;
            registerUploadHook(uploadHook: UploadHook<UploadHookSource>): this;
            protected findMultipleBaseTextures(item: PIXI.DisplayObject, queue: any[]): boolean;
            protected findBaseTexture(item: PIXI.DisplayObject, queue: any[]): boolean;
            protected findTexture(item: PIXI.DisplayObject, queue: any[]): boolean;
            add(item: PIXI.DisplayObject | PIXI.Container | PIXI.BaseTexture | PIXI.Texture | PIXI.Graphics | PIXI.Text | any): this;
            destroy(): void;
        }
        class CanvasPrepare extends BasePrepare<CanvasPrepare> {
            constructor(renderer: CanvasRenderer);

            protected canvas: HTMLCanvasElement;
            protected ctx: CanvasRenderingContext2D;
        }
        class WebGLPrepare extends BasePrepare<WebGLRenderer> {
            constructor(renderer: WebGLRenderer);
        }
        class CountLimiter {
            constructor(maxItemsPerFrame: number);

            protected maxItemsPerFrame: number;
            protected itemsLeft: number;

            beginFrame(): void;
            allowedToUpload(): boolean;
        }
        class TimeLimiter {
            constructor(maxMilliseconds: number);

            protected maxMilliseconds: number;
            protected frameStart: number;

            beginFrame(): void;
            allowedToUpload(): boolean;
        }
    }

    //////////////////////////////////////////////////////////////////////////////
    /////////////////////////////pixi-gl-core/////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    // pixi-gl-core https://github.com/pixijs/pixi-gl-core
    // sharedArrayBuffer as a type is not available yet.
    // need to fully define what an `Attrib` is.
    namespace glCore {
        interface ContextOptions {
            /**
             * Boolean that indicates if the canvas contains an alpha buffer.
             */
            alpha?: boolean;
            /**
             * Boolean that indicates that the drawing buffer has a depth buffer of at least 16 bits.
             */
            depth?: boolean;
            /**
             * Boolean that indicates that the drawing buffer has a stencil buffer of at least 8 bits.
             */
            stencil?: boolean;
            /**
             * Boolean that indicates whether or not to perform anti-aliasing.
             */
            antialias?: boolean;
            /**
             * Boolean that indicates that the page compositor will assume the drawing buffer contains colors with pre-multiplied alpha.
             */
            premultipliedAlpha?: boolean;
            /**
             * If the value is true the buffers will not be cleared and will preserve their values until cleared or overwritten by the author.
             */
            preserveDrawingBuffer?: boolean;
            /**
             *  Boolean that indicates if a context will be created if the system performance is low.
             */
            failIfMajorPerformanceCaveat?: boolean;
        }
        function createContext(view: HTMLCanvasElement, options?: ContextOptions): WebGLRenderingContext;
        function setVertexAttribArrays(gl: WebGLRenderingContext, attribs: Attrib[], state?: WebGLState): WebGLRenderingContext | undefined;
        class GLBuffer {
            constructor(gl: WebGLRenderingContext, type: number, data: ArrayBuffer | ArrayBufferView | any, drawType: number);

            protected _updateID?: number;
            gl: WebGLRenderingContext;
            buffer: WebGLBuffer;
            type: number;
            drawType: number;
            data: ArrayBuffer | ArrayBufferView | any;

            upload(data: ArrayBuffer | ArrayBufferView | any, offset?: number, dontBind?: boolean): void;
            bind(): void;

            static createVertexBuffer(gl: WebGLRenderingContext, data: ArrayBuffer | ArrayBufferView | any, drawType: number): GLBuffer;
            static createIndexBuffer(gl: WebGLRenderingContext, data: ArrayBuffer | ArrayBufferView | any, drawType: number): GLBuffer;
            static create(gl: WebGLRenderingContext, type: number, data: ArrayBuffer | ArrayBufferView | any, drawType: number): GLBuffer;

            destroy(): void;
        }
        class GLFramebuffer {
            constructor(gl: WebGLRenderingContext, width: number, height: number);

            gl: WebGLRenderingContext;
            frameBuffer: WebGLFramebuffer;
            stencil: WebGLRenderbuffer;
            texture: GLTexture;
            width: number;
            height: number;

            enableTexture(texture: GLTexture): void;
            enableStencil(): void;
            clear(r: number, g: number, b: number, a: number): void;
            bind(): void;
            unbind(): void;
            resize(width: number, height: number): void;
            destroy(): void;

            static createRGBA(gl: WebGLRenderingContext, width: number, height: number, data: ArrayBuffer | ArrayBufferView | any): GLFramebuffer;
            static createFloat32(gl: WebGLRenderingContext, width: number, height: number, data: ArrayBuffer | ArrayBufferView | any): GLFramebuffer;
        }
        class GLShader {
            constructor(gl: WebGLRenderingContext, vertexSrc: string | string[], fragmentSrc: string | string[], precision?: string, attributeLocations?: { [key: string]: number });

            gl: WebGLRenderingContext;
            program?: WebGLProgram | null;
            uniformData: any;
            uniforms: any;
            attributes: any;

            bind(): void;
            destroy(): void;
        }
        class GLTexture {
            constructor(gl: WebGLRenderingContext, width?: number, height?: number, format?: number, type?: number);

            gl: WebGLRenderingContext;
            texture: WebGLTexture;
            mipmap: boolean;
            premultiplyAlpha: boolean;
            width: number;
            height: number;
            format: number;
            type: number;

            upload(source: HTMLImageElement | ImageData | HTMLVideoElement | HTMLCanvasElement): void;
            uploadData(data: ArrayBuffer | ArrayBufferView, width: number, height: number): void;
            bind(location?: number): void;
            unbind(): void;
            minFilter(linear: boolean): void;
            magFilter(linear: boolean): void;
            enableMipmap(): void;
            enableLinearScaling(): void;
            enableNearestScaling(): void;
            enableWrapClamp(): void;
            enableWrapRepeat(): void;
            enableWrapMirrorRepeat(): void;
            destroy(): void;

            static fromSource(gl: WebGLRenderingContext, source: HTMLImageElement | ImageData | HTMLVideoElement | HTMLCanvasElement, premultipleAlpha?: boolean): GLTexture;
            static fromData(gl: WebGLRenderingContext, data: number[], width: number, height: number): GLTexture;
        }
        interface Attrib {
            attribute: {
                location: number;
                size: number;
            };
            normalized: boolean;
            stride: number;
            start: number;
            buffer: ArrayBuffer;
        }
        interface WebGLRenderingContextAttribute {
            buffer: WebGLBuffer;
            attribute: any;
            type: number;
            normalized: boolean;
            stride: number;
            start: number;
        }
        interface AttribState {
            tempAttribState: Attrib[];
            attribState: Attrib[];
        }
        class VertexArrayObject {
            static FORCE_NATIVE: boolean;

            constructor(gl: WebGLRenderingContext, state: WebGLState);

            protected nativeVaoExtension: any;
            protected nativeState: AttribState;
            protected nativeVao: VertexArrayObject;
            gl: WebGLRenderingContext;
            attributes: Attrib[];
            indexBuffer: GLBuffer;
            dirty: boolean;

            bind(): VertexArrayObject;
            unbind(): VertexArrayObject;
            activate(): VertexArrayObject;
            addAttribute(buffer: GLBuffer, attribute: Attrib, type: number, normalized: boolean, stride: number, start: number): VertexArrayObject;
            addIndex(buffer: GLBuffer, options?: any): VertexArrayObject;
            clear(): VertexArrayObject;
            draw(type: number, size: number, start: number): VertexArrayObject;
            destroy(): void;
        }
    }

    //////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////UTILS//////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////

    interface DecomposedDataUri {
        mediaType: string;
        subType: string;
        encoding: string;
        data: any;
    }

    namespace utils {
        function uid(): number;
        function hex2rgb(hex: number, out?: number[]): number[];
        function hex2string(hex: number): string;
        function rgb2hex(rgb: number[]): number;
        function canUseNewCanvasBlendModes(): boolean;
        function getResolutionOfUrl(url: string, defaultValue?: number): number;
        function getSvgSize(svgString: string): any;
        function decomposeDataUri(dataUri: string): DecomposedDataUri | void;
        function getUrlFileExtension(url: string): string | void;
        function sayHello(type: string): void;
        function skipHello(): void;
        function isWebGLSupported(): boolean;
        function sign(n: number): number;
        function removeItems<T>(arr: T[], startIdx: number, removeCount: number): void;
        function correctBlendMode(blendMode: number, premultiplied: boolean): number;
        function premultiplyTint(tint: number, alpha: number): number;
        function premultiplyRgba(rgb: Float32Array | number[], alpha: number, out?: Float32Array, premultiply?: boolean): Float32Array;
        function premultiplyTintToRgba(tint: number, alpha: number, out?: Float32Array, premultiply?: boolean): Float32Array;
        const premultiplyBlendMode: number[][];
        const TextureCache: any;
        const BaseTextureCache: any;

        // https://github.com/kaimallea/isMobile
        namespace isMobile {
            const apple: {
                phone: boolean;
                ipod: boolean;
                tablet: boolean;
                device: boolean;
            };
            const android: {
                phone: boolean;
                tablet: boolean;
                device: boolean;
            };
            const amazon: {
                phone: boolean;
                tablet: boolean;
                device: boolean;
            };
            const windows: {
                phone: boolean;
                tablet: boolean;
                device: boolean;
            };
            const seven_inch: boolean;
            const other: {
                blackberry10: boolean;
                blackberry: boolean;
                opera: boolean;
                firefox: boolean;
                chrome: boolean;
                device: boolean;
            };
            const any: boolean;
            const phone: boolean;
            const tablet: boolean;
        }
        // https://github.com/primus/eventemitter3
        class EventEmitter {
            static prefixed: string | boolean;
            static EventEmitter: {
                new (): EventEmitter;
                prefixed: string | boolean;
            };
            /**
             * Minimal EventEmitter interface that is molded against the Node.js
             * EventEmitter interface.
             *
             * @constructor
             * @api public
             */
            constructor();
            /**
             * Return an array listing the events for which the emitter has registered listeners.
             *
             * @returns {(string | symbol)[]}
             */
            eventNames(): Array<(string | symbol)>;
            /**
             * Return the listeners registered for a given event.
             *
             * @param {(string | symbol)} event The event name.
             * @returns {Function[]}
             */
            //tslint:disable-next-line:ban-types forbidden-types
            listeners(event: string | symbol): Function[];
            /**
             * Check if there listeners for a given event.
             * If `exists` argument is not `true` lists listeners.
             *
             * @param {(string | symbol)} event The event name.
             * @param {boolean} exists Only check if there are listeners.
             * @returns {boolean}
             */
            listeners(event: string | symbol, exists: boolean): boolean;
            /**
             * Calls each of the listeners registered for a given event.
             *
             * @param {(string | symbol)} event The event name.
             * @param {...*} args Arguments that are passed to registered listeners
             * @returns {boolean} `true` if the event had listeners, else `false`.
             */
            emit(event: string | symbol, ...args: any[]): boolean;
            /**
             * Add a listener for a given event.
             *
             * @param {(string | symbol)} event The event name.
             * @param {Function} fn The listener function.
             * @param {*} [context=this] The context to invoke the listener with.
             * @returns {EventEmitter} `this`.
             */
            //tslint:disable-next-line:ban-types forbidden-types
            on(event: string | symbol, fn: Function, context?: any): this;
            /**
             * Add a one-time listener for a given event.
             *
             * @param {(string | symbol)} event The event name.
             * @param {Function} fn The listener function.
             * @param {*} [context=this] The context to invoke the listener with.
             * @returns {EventEmitter} `this`.
             */
            //tslint:disable-next-line:ban-types forbidden-types
            once(event: string | symbol, fn: Function, context?: any): this;
            /**
             * Remove the listeners of a given event.
             *
             * @param {(string | symbol)} event The event name.
             * @param {Function} fn Only remove the listeners that match this function.
             * @param {*} context Only remove the listeners that have this context.
             * @param {boolean} once Only remove one-time listeners.
             * @returns {EventEmitter} `this`.
             */
            //tslint:disable-next-line:ban-types forbidden-types
            removeListener(event: string | symbol, fn?: Function, context?: any, once?: boolean): this;
            /**
             * Remove all listeners, or those of the specified event.
             *
             * @param {(string | symbol)} event The event name.
             * @returns {EventEmitter} `this`.
             */
            removeAllListeners(event?: string | symbol): this;
            /**
             * Alias method for `removeListener`
             */
            //tslint:disable-next-line:ban-types forbidden-types
            off(event: string | symbol, fn?: Function, context?: any, once?: boolean): this;
            /**
             * Alias method for `on`
             */
            //tslint:disable-next-line:ban-types forbidden-types
            addListener(event: string | symbol, fn: Function, context?: any): this;
            /**
             * This function doesn't apply anymore.
             * @deprecated
             */
            setMaxListeners(): this;
        }
    }
    //////////////////////////////////////////////////////////////////////////////
    /////////////////////////////depreciation/////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    // not sure how to handle blendmodes scalemodes basetexturecache
    namespace core {
        /**
         * @class
         * @private
         * @name SpriteBatch
         * @memberof PIXI
         * @see PIXI.ParticleContainer
         * @throws {ReferenceError} SpriteBatch does not exist any more, please use the new ParticleContainer instead.
         * @deprecated since version 3.0.0
         */
        type SpriteBatch = ParticleContainer;

        /**
         * @class
         * @private
         * @name AssetLoader
         * @memberof PIXI
         * @see PIXI.loaders.Loader
         * @throws {ReferenceError} The loader system was overhauled in pixi v3, please see the new PIXI.loaders.Loader class.
         * @deprecated since version 3.0.0
         */
        type AssetLoader = loaders.Loader;

        /**
         * @class
         * @private
         * @name Stage
         * @memberof PIXI
         * @see PIXI.Container
         * @deprecated since version 3.0.0
         */
        type Stage = Container;

        /**
         * @class
         * @private
         * @name DisplayObjectContainer
         * @memberof PIXI
         * @see PIXI.Container
         * @deprecated since version 3.0.0
         */
        type DisplayObjectContainer = Container;

        /**
         * @class
         * @private
         * @name Strip
         * @memberof PIXI
         * @see PIXI.mesh.Mesh
         * @deprecated since version 3.0.0
         */
        type Strip = mesh.Mesh;

        /**
         * @class
         * @private
         * @name Rope
         * @memberof PIXI
         * @see PIXI.mesh.Rope
         * @deprecated since version 3.0.0
         */
        type Rope = mesh.Rope;

        /**
         * @class
         * @private
         * @name ParticleContainer
         * @memberof PIXI
         * @see PIXI.particles.ParticleContainer
         * @deprecated since version 4.0.0
         */
        type ParticleContainer = particles.ParticleContainer;

        /**
         * @class
         * @private
         * @name MovieClip
         * @memberof PIXI
         * @see PIXI.extras.MovieClip
         * @deprecated since version 3.0.0
         */
        type MovieClip = extras.AnimatedSprite;

        /**
         * @class
         * @private
         * @name TilingSprite
         * @memberof PIXI
         * @see PIXI.extras.TilingSprite
         * @deprecated since version 3.0.0
         */
        type TilingSprite = extras.TilingSprite;

        /**
         * @class
         * @private
         * @name BaseTextureCache
         * @memberof PIXI
         * @see PIXI.utils.BaseTextureCache
         * @deprecated since version 3.0.0
         */
        type BaseTextureCache = any;

        /**
         * @class
         * @private
         * @name BitmapText
         * @memberof PIXI
         * @see PIXI.extras.BitmapText
         * @deprecated since version 3.0.0
         */
        type BitmapText = extras.BitmapText;

        /**
         * @namespace
         * @private
         * @name math
         * @memberof PIXI
         * @see PIXI
         * @deprecated since version 3.0.6
         */
        type math = any;

        /**
         * @class
         * @private
         * @name PIXI.AbstractFilter
         * @see PIXI.Filter
         * @deprecated since version 3.0.6
         */
        type AbstractFilter = Filter;

        /**
         * @class
         * @private
         * @name PIXI.TransformManual
         * @see PIXI.TransformBase
         * @deprecated since version 4.0.0
         */
        type TransformManual = TransformBase;

        /**
         * @static
         * @constant
         * @name PIXI.TARGET_FPMS
         * @see PIXI.settings.TARGET_FPMS
         * @deprecated since version 4.2.0
         */
        type TARGET_FPMS = number;

        /**
         * @static
         * @constant
         * @name PIXI.FILTER_RESOLUTION
         * @see PIXI.settings.FILTER_RESOLUTION
         * @deprecated since version 4.2.0
         */
        type FILTER_RESOLUTION = number;

        /**
         * @static
         * @constant
         * @name PIXI.RESOLUTION
         * @see PIXI.settings.RESOLUTION
         * @deprecated since version 4.2.0
         */
        type RESOLUTION = number;

        /**
         * @static
         * @constant
         * @name PIXI.MIPMAP_TEXTURES
         * @see PIXI.settings.MIPMAP_TEXTURES
         * @deprecated since version 4.2.0
         */
        type MIPMAP_TEXTURES = any;

        /**
         * @static
         * @constant
         * @name PIXI.SPRITE_BATCH_SIZE
         * @see PIXI.settings.SPRITE_BATCH_SIZE
         * @deprecated since version 4.2.0
         */
        type SPRITE_BATCH_SIZE = number;

        /**
         * @static
         * @constant
         * @name PIXI.SPRITE_MAX_TEXTURES
         * @see PIXI.settings.SPRITE_MAX_TEXTURES
         * @deprecated since version 4.2.0
         */
        type SPRITE_MAX_TEXTURES = number;

        /**
         * @static
         * @constant
         * @name PIXI.RETINA_PREFIX
         * @see PIXI.settings.RETINA_PREFIX
         * @deprecated since version 4.2.0
         */
        type RETINA_PREFIX = RegExp | string;

        /**
         * @static
         * @constant
         * @name PIXI.DEFAULT_RENDER_OPTIONS
         * @see PIXI.settings.RENDER_OPTIONS
         * @deprecated since version 4.2.0
         */
        type DEFAULT_RENDER_OPTIONS = number;

        /**
         * @static
         * @name PRECISION
         * @memberof PIXI.settings
         * @see PIXI.PRECISION
         * @deprecated since version 4.4.0
         */
        type PRECISION = string;
    }

    namespace extras {
        /**
         * @class
         * @name MovieClip
         * @memberof PIXI.extras
         * @see PIXI.extras.AnimatedSprite
         * @deprecated since version 4.2.0
         */
        type MovieClip = extras.AnimatedSprite;
    }
    namespace settings {
        /**
         * @static
         * @name PRECISION
         * @memberof PIXI.settings
         * @see PIXI.PRECISION
         * @deprecated since version 4.4.0
         */
        type PRECISION = number;
    }
}

declare namespace pixi {
    const gl: typeof PIXI.glCore;
}

//tslint:disable-next-line:no-single-declare-module
declare module "pixi.js" {
    export = PIXI;
}
/* tslint:disable */// Generated by Haxe TypeScript Declaration Generator :)

/**
 * Allows you to map pixels to the screen or draw rectangles.
 */
declare class Bitmap {
	/**
	 * The basic object that represents an image.
	 *
	 * @class Bitmap
	 * @constructor
	 * @param {Int} width The width of the bitmap
	 * @param {Int} height The height of the bitmap
	 */
	constructor(width?: number, height?: number);
	/**
	 * The face name of the font.
	 *
	 * @property fontFace
	 * @type String
	 */
	fontFace: string;
	/**
	 * The size of the font in pixels.
	 *
	 * @property fontSize
	 * @type Number
	 */
	fontSize: number;
	/**
	 * Whether the font is italic.
	 *
	 * @property fontItalic
	 * @type Boolean
	 */
	fontItalic: number;
	/**
	 * The color of the text in CSS format.
	 *
	 * @property textColor
	 * @type String
	 */
	textColor: string;
	/**
	 * The color of the outline of the text in CSS format.
	 *
	 * @property outlineColor
	 * @type String
	 */
	outlineColor: string;
	/**
	 * The width of the outline of the text.
	 *
	 * @property outlineWidth
	 * @type Number
	 */
	outlineWidth: number;
	/**
	 * [read-only] The url of the image file.
	 *
	 * @property url
	 * @type String
	 */
	url: string;
	/**
	 * [read-only] The base texture that holds the image.
	 *
	 * @property baseTexture
	 * @type PIXI.BaseTexture
	 */
	baseTexture: PIXI.BaseTexture;
	/**
	 * [read-only] The bitmap canvas.
	 *
	 * @property canvas
	 * @type HTMLCanvasElement
	 */
	canvas: HTMLCanvasElement;
	/**
	 * [read-only] The 2d context of the bitmap canvas.
	 *
	 * @property context
	 * @type CanvasRenderingContext2D
	 */
	context: CanvasRenderingContext2D;
	/**
	 * [read-only] The width of the bitmap.
	 *
	 * @property width
	 * @type Number
	 */
	width: number;
	/**
	 * [read-only] The height of the bitmap.
	 *
	 * @property height
	 * @type Number
	 */
	height: number;
	/**
	 * [read-only] The rectangle of the bitmap.
	 *
	 * @property rect
	 * @type Rectangle
	 */
	rect: Rectangle;
	/**
	 * Whether the smooth scaling is applied.
	 *
	 * @property smooth
	 * @type Boolean
	 */
	smooth: boolean;
	/**
	 * The opacity of the drawing object in the range (0, 255).
	 *
	 * @property paintOpacity
	 * @type Number
	 */
	paintOpacity: number;
	/**
	 * Cache entry, for images. In all cases _url is the same as cacheEntry.key
	 * @type CacheEntry
	 */
	cacheEntry: CacheEntry;
	/**
	 * Checks whether the bitmap is ready to render.
	 *
	 * @method isReady
	 * @return {Boolean} True if the bitmap is ready to render
	 */
	isReady(): boolean;
	/**
	 * Checks whether a loading error has occurred.
	 *
	 * @method isError
	 * @return {Boolean} True if a loading error has occurred
	 */
	isError(): boolean;
	/**
	 * Resizes the bitmap.
	 *
	 * @method resize
	 * @param {Number} width The new width of the bitmap
	 * @param {Number} height The new height of the bitmap
	 */
	resize(width: number, height: number): void;
	/**
	 * Performs a block transfer.
	 *
	 * @method blt
	 * @param {Bitmap} source The bitmap to draw
	 * @param {Number} sx The x coordinate in the source
	 * @param {Number} sy The y coordinate in the source
	 * @param {Number} sw The width of the source image
	 * @param {Number} sh The height of the source image
	 * @param {Number} dx The x coordinate in the destination
	 * @param {Number} dy The y coordinate in the destination
	 * @param {Number} [dw=sw] The width to draw the image in the destination
	 * @param {Number} [dh=sh] The height to draw the image in the destination
	 */
	blt(source: Bitmap, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw?: number, dh?: number): void;
	/**
	 * Returns pixel color at the specified point.
	 *
	 * @method getPixel
	 * @param {Number} x The x coordinate of the pixel in the bitmap
	 * @param {Number} y The y coordinate of the pixel in the bitmap
	 * @return {String} The pixel color (hex format)
	 */
	getPixel(x: number, y: number): string;
	/**
	 * Returns alpha pixel value at the specified point.
	 *
	 * @method getAlphaPixel
	 * @param {Number} x The x coordinate of the pixel in the bitmap
	 * @param {Number} y The y coordinate of the pixel in the bitmap
	 * @return {String} The alpha value
	 */
	getAlphaPixel(x: number, y: number): string;
	/**
	 * Clears the specified rectangle.
	 *
	 * @method clearRect
	 * @param {Number} x The x coordinate for the upper-left corner
	 * @param {Number} y The y coordinate for the upper-left corner
	 * @param {Number} width The width of the rectangle to clear
	 * @param {Number} height The height of the rectangle to clear
	 */
	clearRect(x: number, y: number, width: number, height: number): void;
	/**
	 * Clears the entire bitmap.
	 *
	 * @method clear
	 */
	clear(): void;
	/**
	 * Fills the specified rectangle.
	 *
	 * @method fillRect
	 * @param {Number} x The x coordinate for the upper-left corner
	 * @param {Number} y The y coordinate for the upper-left corner
	 * @param {Number} width The width of the rectangle to clear
	 * @param {Number} height The height of the rectangle to clear
	 * @param {String} color The color of the rectangle in CSS format
	 */
	fillRect(x: number, y: number, width: number, height: number, color: string): void;
	/**
	 * Fills the entire bitmap.
	 *
	 * @method fillAll
	 * @param {String} color The color of the rectangle in CSS format
	 */
	fillAll(color: string): void;
	/**
	 * Draws the rectangle with a gradation.
	 *
	 * @method gradientFillRect
	 * @param {Number} x The x coordinate for the upper-left corner
	 * @param {Number} y The y coordinate for the upper-left corner
	 * @param {Number} width The width of the rectangle to clear
	 * @param {Number} height The height of the rectangle to clear
	 * @param {String} color1 The start color of the gradation
	 * @param {String} color2 The end color of the gradation
	 * @param {Boolean} vertical Whether it draws a vertical gradient
	 */
	gradientFillRect(x: number, y: number, width: number, height: number, color1: string, color2: string, vertical?: boolean): void;
	/**
	 * Draw the filled circle.
	 *
	 * @method drawCircle
	 * @param {Number} x The x coordinate of the center of the circle
	 * @param {Number} y The y coordinate of the center of the circle
	 * @param {Number} radius The radius of the circle
	 * @param {String} color The color of the circle in CSS format
	 */
	drawCircle(x: number, y: number, radius: number, color: string): void;
	/**
	 * Draws the outline text to the bitmap.
	 *
	 * @method drawText
	 * @param {String} text The text that will be drawn
	 * @param {Number} x The x coordinate for the left of the text
	 * @param {Number} y The y coordinate for the top of the text
	 * @param {Number} maxWidth The maximum allowed width of the text
	 * @param {Number} lineHeight The height of the text line
	 * @param {String} align The alignment of the text
	 */
	drawText(text: string, x: number, y: number, maxWidth: number, lineHeight: number, align?: string): void;
	/**
	 * Returns the width of the specified text.
	 *
	 * @method measureTextWidth
	 * @param {String} text The text to be measured
	 * @return {Number} The width of the text in pixels
	 */
	measureTextWidth(text: string): number;
	/**
	 * Changes the color tone of the entire bitmap.
	 *
	 * @method adjustTone
	 * @param {Number} r The red strength in the range (-255, 255)
	 * @param {Number} g The green strength in the range (-255, 255)
	 * @param {Number} b The blue strength in the range (-255, 255)
	 */
	adjustTone(r: number, g: number, b: number): void;
	/**
	 * Rotates the hue of the entire bitmap.
	 *
	 * @method rotateHue
	 * @param {Number} offset The hue offset in 360 degrees
	 */
	rotateHue(offset: number): void;
	/**
	 * Applies a blur effect to the bitmap.
	 *
	 * @method blur
	 */
	blur(): void;
	/**
	 * Add a callback function that will be called when the bitmap is loaded.
	 *
	 * @method addLoadListener
	 * @param {Function} listner The callback function
	 */
	addLoadListener(listner: (bitmap: Bitmap) => void): void;
	/**
	 * touch the resource
	 * @method touch
	 */
	touch(): void;
	/**
	 * Performs a block transfer, using assumption that original image was not modified (no hue)
	 *
	 * @method blt
	 * @param {Bitmap} source The bitmap to draw
	 * @param {Int} sx The x coordinate in the source
	 * @param {Int} sy The y coordinate in the source
	 * @param {Int} sw The width of the source image
	 * @param {Int} sh The height of the source image
	 * @param {Int} dx The x coordinate in the destination
	 * @param {Int} dy The y coordinate in the destination
	 * @param {Int} [dw=sw] The width to draw the image in the destination
	 * @param {Int} [dh=sh] The height to draw the image in the destination
	 */
	bltImage(source: Bitmap, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw?: number, dh?: number): void;
	/**
	 * Loads a image file and returns a new bitmap object.
	 *
	 * @static
	 * @method load
	 * @param {String} url The image url of the texture
	 * @return Bitmap
	 */
	static load(url: string): Bitmap;
	/**
	 * Takes a snapshot of the game screen and returns a new bitmap object.
	 *
	 * @static
	 * @method snap
	 * @param {Stage} stage The stage object
	 * @return Bitmap
	 */
	static snap(stage: Stage): Bitmap;
}

declare class CacheEntry {
	/**
	 * The resource class. Allows to be collected as a garbage if not use for some time or ticks
	 *
	 * @class CacheEntry
	 * @constructor
	 * @param {ResourceManager} resource manager
	 * @param {string} key, url of the resource
	 * @param {string} item - Bitmap, HTML5Audio, WebAudio - whatever you want to store in the cache
	 */
	constructor(cache: CacheMap, key: string, item: string);
	/**
	 * frees the resource
	 */
	free(byTTL?: boolean): void;
	/**
	 * Allocates the resource
	 * @returns {CacheEntry}
	 */
	allocate(): CacheEntry;
	/**
	 * Sets the time to live
	 * @param {number} ticks TTL in ticks, 0 if not set
	 * @param {number} time TTL in seconds, 0 if not set
	 * @returns {CacheEntry}
	 */
	setTimeToLive(ticks?: number, seconds?: number): CacheEntry;
	isStillAlive(): boolean;
	/**
	 * makes sure that resource wont freed by Time To Live
	 * if resource was already freed by TTL, put it in cache again
	 */
	touch(): void;
}

declare class CacheMap {
	/**
	 * Cache for images, audio, or any other kind of resource
	 * @param manager
	 * @constructor
	 */
	constructor(manager: ImageManager);
	/**
	 * checks ttl of all elements and removes dead ones
	 */
	checkTTL(): void;
	/**
	 * cache item
	 * @param key url of cache element
	 * @returns {*|null}
	 */
	getItem(key: string): any;
	clear(): void;
	setItem(key: string, item: any): CacheEntry;
	update(ticks: number, delta: number): void;
}

/**
 * The static class that carries out graphics processing.
 *
 * @class Graphics
 */
declare class Graphics {
	protected constructor();
	/**
	 * The total frame count of the game screen.
	 *
	 * @static
	 * @property frameCount
	 * @type Number
	 */
	static frameCount: number;
	/**
	 * The alias of PIXI.blendModes.NORMAL.
	 *
	 * @static
	 * @property BLEND_NORMAL
	 * @type Number
	 * @final
	 */
	static BLEND_NORMAL: number;
	/**
	 * The alias of PIXI.blendModes.ADD.
	 *
	 * @static
	 * @property BLEND_ADD
	 * @type Number
	 * @final
	 */
	static BLEND_ADD: number;
	/**
	 * The alias of PIXI.blendModes.MULTIPLY.
	 *
	 * @static
	 * @property BLEND_MULTIPLY
	 * @type Number
	 * @final
	 */
	static BLEND_MULTIPLY: number;
	/**
	 * The alias of PIXI.blendModes.SCREEN.
	 *
	 * @static
	 * @property BLEND_SCREEN
	 * @type Number
	 * @final
	 */
	static BLEND_SCREEN: number;
	/**
	 * The width of the game screen.
	 *
	 * @static
	 * @property width
	 * @type Number
	 */
	static width: number;
	/**
	 * The height of the game screen.
	 *
	 * @static
	 * @property height
	 * @type Number
	 */
	static height: number;
	/**
	 * The width of the window display area.
	 *
	 * @static
	 * @property boxWidth
	 * @type Number
	 */
	static boxWidth: number;
	/**
	 * The height of the window display area.
	 *
	 * @static
	 * @property boxHeight
	 * @type Number
	 */
	static boxHeight: number;
	/**
	 * The zoom scale of the game screen.
	 *
	 * @static
	 * @property scale
	 * @type Number
	 */
	static scale: number;
	/**
	 * Initializes the graphics system.
	 *
	 * @static
	 * @method initialize
	 * @param {Number} width The width of the game screen
	 * @param {Number} height The height of the game screen
	 * @param {String} type The type of the renderer.
	 *                 'canvas', 'webgl', or 'auto'.
	 */
	static initialize(width?: number, height?: number, type?: string): void;
	/**
	 * Marks the beginning of each frame for FPSMeter.
	 *
	 * @static
	 * @method tickStart
	 */
	static tickStart(): void;
	/**
	 * Marks the end of each frame for FPSMeter.
	 *
	 * @static
	 * @method tickEnd
	 */
	static tickEnd(): void;
	/**
	 * Renders the stage to the game screen.
	 *
	 * @static
	 * @method render
	 * @param {Stage} stage The stage object to be rendered
	 */
	static render(stage?: Stage): void;
	/**
	 * Checks whether the renderer type is WebGL.
	 *
	 * @static
	 * @method isWebGL
	 * @return {Boolean} True if the renderer type is WebGL
	 */
	static isWebGL(): boolean;
	/**
	 * Checks whether the current browser supports WebGL.
	 *
	 * @static
	 * @method hasWebGL
	 * @return {Boolean} True if the current browser supports WebGL.
	 */
	static hasWebGL(): boolean;
	/**
	 * Checks whether the canvas blend mode 'difference' is supported.
	 *
	 * @static
	 * @method canUseDifferenceBlend
	 * @return {Boolean} True if the canvas blend mode 'difference' is supported
	 */
	static canUseDifferenceBlend(): boolean;
	/**
	 * Checks whether the canvas blend mode 'saturation' is supported.
	 *
	 * @static
	 * @method canUseSaturationBlend
	 * @return {Boolean} True if the canvas blend mode 'saturation' is supported
	 */
	static canUseSaturationBlend(): boolean;
	/**
	 * Sets the source of the "Now Loading" image.
	 *
	 * @static
	 * @method setLoadingImage
	 * @param {String} Path of image
	 */
	static setLoadingImage(src: string): void;
	/**
	 * Initializes the counter for displaying the "Now Loading" image.
	 *
	 * @static
	 * @method startLoading
	 */
	static startLoading(): void;
	/**
	 * Increments the loading counter and displays the "Now Loading" image if necessary.
	 *
	 * @static
	 * @method updateLoading
	 */
	static updateLoading(): void;
	/**
	 * Erases the "Now Loading" image.
	 *
	 * @static
	 * @method endLoading
	 */
	static endLoading(): void;
	/**
	 * Displays the error text to the screen.
	 *
	 * @static
	 * @method printError
	 * @param {String} name The name of the error
	 * @param {String} message The message of the error
	 */
	static printError(name: string, message: string): void;
	/**
	 * Shows the FPSMeter element.
	 *
	 * @static
	 * @method showFps
	 */
	static showFps(): void;
	/**
	 * Hides the FPSMeter element.
	 *
	 * @static
	 * @method hideFps
	 */
	static hideFps(): void;
	/**
	 * Loads a font file.
	 *
	 * @static
	 * @method loadFont
	 * @param {String} name The face name of the font
	 * @param {String} url The url of the font file
	 */
	static loadFont(name: string, url: string): void;
	/**
	 * Checks whether the font file is loaded.
	 *
	 * @static
	 * @method isFontLoaded
	 * @param {String} name The face name of the font
	 * @return {Boolean} True if the font file is loaded
	 */
	static isFontLoaded(name: string): boolean;
	/**
	 * Starts playback of a video.
	 *
	 * @static
	 * @method playVideo
	 * @param {String} src
	 */
	static playVideo(src: string): void;
	/**
	 * Checks whether the video is playing.
	 *
	 * @static
	 * @method isVideoPlaying
	 * @return {Boolean} True if the video is playing
	 */
	static isVideoPlaying(): boolean;
	/**
	 * Checks whether the browser can play the specified video type.
	 *
	 * @static
	 * @method canPlayVideoType
	 * @param {String} type The video type to test support for
	 * @return {Boolean} True if the browser can play the specified video type
	 */
	static canPlayVideoType(type: string): boolean;
	/**
	 * Converts an x coordinate on the page to the corresponding
	 * x coordinate on the canvas area.
	 *
	 * @static
	 * @method pageToCanvasX
	 * @param {Number} x The x coordinate on the page to be converted
	 * @return {Number} The x coordinate on the canvas area
	 */
	static pageToCanvasX(x: number): number;
	/**
	 * Converts a y coordinate on the page to the corresponding
	 * y coordinate on the canvas area.
	 *
	 * @static
	 * @method pageToCanvasY
	 * @param {Number} y The y coordinate on the page to be converted
	 * @return {Number} The y coordinate on the canvas area
	 */
	static pageToCanvasY(y: number): number;
	/**
	 * Checks whether the specified point is inside the game canvas area.
	 *
	 * @static
	 * @method isInsideCanvas
	 * @param {Number} x The x coordinate on the canvas area
	 * @param {Number} y The y coordinate on the canvas area
	 * @return {Boolean} True if the specified point is inside the game canvas area
	 */
	static isInsideCanvas(x: number, y: number): boolean;
	/**
	 * Calls pixi.js garbage collector
	 */
	static callGC(): void;
	static _renderer: PIXI.AbstractRenderer;
}

declare class HTML5Audio {
	protected constructor();
	_initialized: boolean;
	_unlocked: boolean;
	_audioElement: HTMLAudioElement;
	_gainTweenInterval: number;
	_tweenGain: number;
	_tweenTargetGain: number;
	_tweenGainStep: number;
	_staticSePath: boolean;
	_volume: number;
	_loadListeners: (() => void)[];
	_hasError: boolean;
	__autoPlay: boolean;
	_isLoading: boolean;
	_buffered: boolean;
	/**
	 * [read-only] The url of the audio file.
	 *
	 * @property url
	 * @type String
	 */
	url: string;
	/**
	 * The volume of the audio.
	 *
	 * @property volume
	 * @type Number
	 */
	volume: number;
	/**
	 * Sets up the Html5 Audio.
	 *
	 * @static
	 * @method setup
	 * @param {String} url The url of the audio file
	 */
	setup(url: string): void;
	/**
	 * Initializes the audio system.
	 *
	 * @static
	 * @method initialize
	 * @return {Boolean} True if the audio system is available
	 */
	initialize(): void;
	/**
	 * Clears the audio data.
	 *
	 * @static
	 * @method clear
	 */
	clear(): void;
	/**
	 * Set the URL of static se.
	 *
	 * @static
	 * @param {String} url
	 */
	setStaticSe(url: string): void;
	/**
	 * Checks whether the audio data is ready to play.
	 *
	 * @static
	 * @method isReady
	 * @return {Boolean} True if the audio data is ready to play
	 */
	isReady(): boolean;
	/**
	 * Checks whether a loading error has occurred.
	 *
	 * @static
	 * @method isError
	 * @return {Boolean} True if a loading error has occurred
	 */
	isError(): boolean;
	/**
	 * Checks whether the audio is playing.
	 *
	 * @static
	 * @method isPlaying
	 * @return {Boolean} True if the audio is playing
	 */
	isPlaying(): boolean;
	/**
	 * Plays the audio.
	 *
	 * @static
	 * @method play
	 * @param {Boolean} loop Whether the audio data play in a loop
	 * @param {Number} offset The start position to play in seconds
	 */
	play(loop: boolean, offset: number): void;
	/**
	 * Stops the audio.
	 *
	 * @static
	 * @method stop
	 */
	stop(): void;
	/**
	 * Performs the audio fade-in.
	 *
	 * @static
	 * @method fadeIn
	 * @param {Number} duration Fade-in time in seconds
	 */
	fadeIn(duration: number): void;
	/**
	 * Performs the audio fade-out.
	 *
	 * @static
	 * @method fadeOut
	 * @param {Number} duration Fade-out time in seconds
	 */
	fadeOut(duration: number): void;
	/**
	 * Gets the seek position of the audio.
	 *
	 * @static
	 * @method seek
	 */
	seek(): void;
}

declare class Input {
	protected constructor();
	/**
	 * The wait time of the key repeat in frames.
	 *
	 * @static
	 * @property keyRepeatWait
	 * @type Number
	 */
	static keyRepeatWait: number;
	/**
	 * The interval of the key repeat in frames.
	 *
	 * @static
	 * @property keyRepeatInterval
	 * @type Number
	 */
	static keyRepeatInterval: number;
	/**
	 * A hash table to convert from a virtual key code to a mapped key name.
	 *
	 * @static
	 * @property keyMapper
	 * @type Object
	 * ```
	 * {
	 * [key:number]:string
	 * }
	 * ```
	 */
	static keyMapper: Object;
	/**
	 * A hash table to convert from a gamepad button to a mapped key name.
	 *
	 * @static
	 * @property gamepadMapper
	 * @type Object
	 * ```
	 * {
	 * [key:number]:String
	 * }
	 * ```
	 */
	static gamepadMapper: Object;
	/**
	 * [read-only] The four direction value as a number of the numpad, or 0 for neutral.
	 *
	 * @static
	 * @property dir4
	 * @type Number
	 */
	static dir4: number;
	/**
	 * [read-only] The eight direction value as a number of the numpad, or 0 for neutral.
	 *
	 * @static
	 * @property dir8
	 * @type Number
	 */
	static dir8: number;
	/**
	 * [read-only] The time of the last input in milliseconds.
	 *
	 * @static
	 * @property date
	 * @type Number
	 */
	static date: number;
	/**
	 * Initializes the input system.
	 *
	 * @static
	 * @method initialize
	 */
	static initialize(): void;
	/**
	 * Clears all the input data.
	 *
	 * @static
	 * @method clear
	 */
	static clear(): void;
	/**
	 * Updates the input data.
	 *
	 * @static
	 * @method update
	 */
	static update(): void;
	/**
	 * Checks whether a key is currently pressed down.
	 *
	 * @static
	 * @method isPressed
	 * @param {String} keyName The mapped name of the key
	 * @return {Boolean} True if the key is pressed
	 */
	static isPressed(keyName: string): boolean;
	/**
	 * Checks whether a key is just pressed.
	 *
	 * @static
	 * @method isTriggered
	 * @param {String} keyName The mapped name of the key
	 * @return {Boolean} True if the key is triggered
	 */
	static isTriggered(keyName: string): boolean;
	/**
	 * Checks whether a key is just pressed or a key repeat occurred.
	 *
	 * @static
	 * @method isRepeated
	 * @param {String} keyName The mapped name of the key
	 * @return {Boolean} True if the key is repeated
	 */
	static nisRepeated(keyName: string): boolean;
	/**
	 * Checks whether a key is kept depressed.
	 *
	 * @static
	 * @method isLongPressed
	 * @param {String} keyName The mapped name of the key
	 * @return {Boolean} True if the key is long-pressed
	 */
	static isLongPressed(keyName: string): boolean;
}

/**
 * The static class that handles JSON with object information.
 *
 * @class JsonEx
 */
declare class JsonEx {
	protected constructor();
	/**
	 * The maximum depth of objects.
	 *
	 * @static
	 * @property maxDepth
	 * @type Number
	 * @default 100
	 */
	maxDepth: number;
	/**
	 * Makes a deep copy of the specified object.
	 *
	 * @static
	 * @method makeDeepCopy
	 * @param {Object} object The object to be copied
	 * @return {Object} The copied object
	 */
	static makeDeepCopy(object: any): any;
	/**
	 * Converts an object to a JSON string with object information.
	 *
	 * @static
	 * @method stringify
	 * @param {Object} object The object to be converted
	 * @return {String} The JSON string
	 */
	static stringify(object: any): string;
	/**
	 * Parses a JSON string and reconstructs the corresponding object.
	 *
	 * @static
	 * @method parse
	 * @param {String} json The JSON string
	 * @return {Object} The reconstructed object
	 */
	static parse(json: string): any;
}

declare namespace PIXI {
	declare class Point {
		/**
		 * The Point object represents a location in a two-dimensional coordinate system, where x represents
		 * the horizontal axis and y represents the vertical axis.
		 *
		 * @class
		 * @namespace PIXI
		 * @param [x=0] {number} position of the point on the x axis
		 * @param [y=0] {number} position of the point on the y axis
		 */
		constructor(x?: number, y?: number);
		/**
		 * Copies x and y from the given point
		 *
		 * @param {Point} The point to copy from
		 * @return {Point} Returns itself.
		 */
		copyFrom(p: PIXI.Point): PIXI.Point;
		/**
		 * Copies x and y into the given point
		 *
		 * @param {Point} p - The point to copy.
		 * @return {Point} Given point with values updated
		 */
		copyTo(p: PIXI.Point): PIXI.Point;
		/**
		 * Returns true if the given point is equal to this point
		 *
		 * @method copy
		 * @param {Point} the point to compare
		 * @return {Bool} the result of the comparison
		 */
		equals(p: PIXI.Point): boolean;
		/**
		 * Sets the point to a new x and y position.
		 * If y is ommited, both x and y will be set to x.
		 *
		 * @method set
		 * @param [x=0] {Float} position of the point on the x axis
		 * @param [y=0] {Float} position of the point on the y axis
		 */
		set(x?: number, y?: number): void;
		/**
		 * @property x
		 * @type Float
		 * @default 0
		 */
		x: number;
		/**
		 * @property y
		 * @type Float
		 * @default 0
		 */
		y: number;
	}
}

declare class Point extends PIXI.Point {
	/**
	 * The point class.
	 *
	 * @class Point
	 * @constructor
	 * @param {Number} x The x coordinate
	 * @param {Number} y The y coordinate
	 */
	constructor(x?: number, y?: number);
	/**
	 * The x coordinate.
	 *
	 * @property x
	 * @type Number
	 */
	x: number;
	/**
	 * The y coordinate.
	 *
	 * @property y
	 * @type Number
	 */
	y: number;
}

declare namespace pixi.core.math.shapes {
	declare class Shape {
		protected constructor();
		/**
		 * Defines the type of the shape to avoid instanceof (Std.is) checks
		 */
		type: any;
		/**
		 * Checks whether the x and y coordinates passed to this function are contained within this Shape
		 *
		 * @method contains
		 * @param x {Float} The X coordinate of the point to test
		 * @param y {Float} The Y coordinate of the point to test
		 * @return {Bool} Whether the x/y coords are within this Rectangle
		 */
		contains(x: number, y: number): boolean;
	}
}

declare namespace PIXI {
	declare class Rectangle extends pixi.core.math.shapes.Shape {
		/**
		 * the Rectangle object is an area defined by its position, as indicated by its top-left corner point (x, y) and by its width and its height.
		 *
		 * @class Rectangle
		 * @constructor
		 * @param x {Float} The X coord of the upper-left corner of the rectangle
		 * @param y {Float} The Y coord of the upper-left corner of the rectangle
		 * @param width {Float} The overall width of this rectangle
		 * @param height {Float} The overall height of this rectangle
		 */
		constructor(x?: number, y?: number, width?: number, height?: number);
		/**
		 * Creates a clone of this Rectangle instance
		 *
		 * @method clone
		 * @return {Rectangle} a copy of the rectangle
		 */
		clone(): PIXI.Rectangle;
		/**
		 * Copies another Rectangle to this one.
		 *
		 * @param  rectangle {Rectangle} The rectangle to copy
		 * @return {Rectangle} Returns itself.
		 */
		copy(rectangle: PIXI.Rectangle): PIXI.Rectangle;
		/**
		 * Checks whether the x and y coordinates given are contained within the rectangle.
		 *
		 * @param  x {Float} x coordinate of the point to test.
		 * @param  y {Float} y coordinate of the point to test.
		 * @return {Bool} whether the x and y coordinates are within this Rectangle.
		 */
		contains(x: number, y: number): boolean;
		/**
		 * Pads this rectangle, making it grow in all directions.
		 *
		 * @param  padX {Float} The horizontal padding amount.
		 * @param  padY {Float} The vertical padding amount.
		 */
		pad(padX: number, padY: number): void;
		/**
		 * Fits this rectangle around the passed one.
		 *
		 * @param  rectangle {Rectangle} The rectangle to fit.
		 */
		fit(rectangle: PIXI.Rectangle): void;
		/**
		 * Enlarges this rectangle to fit around the passed one.
		 *
		 * @param  rectangle {Rectangle} The rectangle to include.
		 */
		enlarge(rectangle: PIXI.Rectangle): void;
		/**
		 * @property x
		 * @type Float
		 * @default 0
		 */
		x: number;
		/**
		 * @property y
		 * @type Float
		 * @default 0
		 */
		y: number;
		/**
		 * @property width
		 * @type Float
		 * @default 0
		 */
		width: number;
		/**
		 * @property height
		 * @type Float
		 * @default 0
		 */
		height: number;
		/**
		 * @property left
		 * @type Float
		 * @default 0
		 */
		left: number;
		/**
		 * @property right
		 * @type Float
		 * @default 0
		 */
		right: number;
		/**
		 * @property top
		 * @type Float
		 * @default 0
		 */
		top: number;
		/**
		 * @property bottom
		 * @type Float
		 * @default 0
		 */
		bottom: number;
	}
}

declare class Rectangle extends PIXI.Rectangle {
	/**
	 * The rectangle class.
	 *
	 * @class Rectangle
	 * @constructor
	 * @param {Number} x The x coordinate for the upper-left corner
	 * @param {Number} y The y coordinate for the upper-left corner
	 * @param {Number} width The width of the rectangle
	 * @param {Number} height The height of the rectangle
	 */
	constructor(x?: number, y?: number, width?: number, height?: number);
	/**
	 * @static
	 * @property emptyRectangle
	 * @type Rectangle
	 */
	static emptyRectangle: Rectangle;
}

declare namespace PIXI.utils {
	declare class EventEmitter {
		/**
		 * Minimal EventEmitter interface that is molded against the Node.js
		 * EventEmitter interface.
		 *
		 * @constructor
		 */
		constructor();
		/**
		 * Return a list of assigned event listeners.
		 *
		 * @param {String} eventName
		 * @return {Array}
		 */
		listeners(event: string): any[];
		/**
		 * Emit an event to all registered event listeners.
		 *
		 * @alias dispatchEvent
		 * @param eventName {String} The name of the event.
		 * @return {Bool} Indication if we've emitted an event.
		 */
		emit(event: string, a1?: any, a2?: any, a3?: any, a4?: any, a5?: any): boolean;
		/**
		 * Register a new EventListener for the given event.
		 *
		 * @param {String} event Name of the event.
		 * @param {function} fn Callback function.
		 * @param {Mixed} context The context of the function.
		 */
		on(event: string, fn: (arg0: PIXI.interaction.InteractionEvent) => void, context?: any): void;
		/**
		 * Add an EventListener that's only called once.
		 *
		 * @param {String} event Name of the event.
		 * @param {function} fn Callback function.
		 * @param {Mixed} context The context of the function.
		 */
		once(event: string, fn: (arg0: PIXI.interaction.InteractionEvent) => void, context?: any): void;
		/**
		 * Register a new EventListener for the given event.
		 *
		 * @param {String} event Name of the event.
		 * @param {function} fn Callback function.
		 * @param {Mixed} context The context of the function.
		 */
		addListener(event: string, fn: (arg0: PIXI.interaction.InteractionEvent) => void, context?: any): void;
		/**
		 * Remove event listeners.
		 *
		 * @param {String} event The event we want to remove.
		 * @param {function} fn The listener that we need to find.
		 * @param {Bool} once Only remove once listeners.
		 */
		off(event: string, fn: (arg0: PIXI.interaction.InteractionEvent) => void, once?: boolean): void;
		/**
		 * Remove event listeners.
		 *
		 * @param {String} event The event we want to remove.
		 * @param {function} fn The listener that we need to find.
		 * @param {Bool} once Only remove once listeners.
		 */
		removeListener(event: string, fn: (arg0: PIXI.interaction.InteractionEvent) => void, once?: boolean): void;
		/**
		 * Remove all listeners or only the listeners for the specified event.
		 *
		 * @param {String} event The event want to remove all listeners for.
		 */
		removeAllListeners(event?: string): void;
	}
}

declare namespace PIXI.interaction {
	declare class interactiveTarget extends PIXI.utils.EventEmitter {
		protected constructor();
		/**
		 * Fired when a pointer device button (usually a mouse button) is pressed on the display
		 * object.
		 *
		 * @event mousedown
		 * @memberof InteractiveTarget#
		 */
		mousedown(event: PIXI.interaction.InteractionEvent): void;
		/**
		 * Fired when a pointer device secondary button (usually a mouse right-button) is pressed
		 * on the display object.
		 *
		 * @event rightdown
		 * @memberof InteractiveTarget#
		 */
		rightdown(event: PIXI.interaction.InteractionEvent): void;
		/**
		 * Fired when a pointer device button (usually a mouse button) is released over the display
		 * object.
		 *
		 * @event mouseup
		 * @memberof InteractiveTarget#
		 */
		mouseup(event: PIXI.interaction.InteractionEvent): void;
		/**
		 * Fired when a pointer device secondary button (usually a mouse right-button) is released
		 * over the display object.
		 *
		 * @event rightup
		 * @memberof InteractiveTarget#
		 */
		rightup(event: PIXI.interaction.InteractionEvent): void;
		/**
		 * Fired when a pointer device button (usually a mouse button) is pressed and released on
		 * the display object.
		 *
		 * @event click
		 * @memberof InteractiveTarget#
		 */
		click(event: PIXI.interaction.InteractionEvent): void;
		/**
		 * Fired when a pointer device secondary button (usually a mouse right-button) is pressed
		 * and released on the display object.
		 *
		 * @event rightclick
		 * @memberof InteractiveTarget#
		 */
		rightclick(event: PIXI.interaction.InteractionEvent): void;
		/**
		 * Fired when a pointer device button (usually a mouse button) is released outside the
		 * display object that initially registered a
		 * [mousedown]{@link PIXI.interaction.InteractionManager#event:mousedown}.
		 *
		 * @event mouseupoutside
		 * @memberof InteractiveTarget#
		 */
		mouseupoutside(event: PIXI.interaction.InteractionEvent): void;
		/**
		 * Fired when a pointer device secondary button (usually a mouse right-button) is released
		 * outside the display object that initially registered a
		 * [rightdown]{@link PIXI.interaction.InteractionManager#event:rightdown}.
		 *
		 * @event rightupoutside
		 * @memberof InteractiveTarget#
		 */
		rightupoutside(event: PIXI.interaction.InteractionEvent): void;
		/**
		 * Fired when a pointer device (usually a mouse) is moved while over the display object
		 *
		 * @event mousemove
		 * @memberof InteractiveTarget#
		 */
		mousemove(event: PIXI.interaction.InteractionEvent): void;
		/**
		 * Fired when a pointer device (usually a mouse) is moved onto the display object
		 *
		 * @event mouseover
		 * @memberof InteractiveTarget#
		 */
		mouseover(event: PIXI.interaction.InteractionEvent): void;
		/**
		 * Fired when a pointer device (usually a mouse) is moved off the display object
		 *
		 * @event mouseout
		 * @memberof InteractiveTarget#
		 */
		mouseout(event: PIXI.interaction.InteractionEvent): void;
		/**
		 * Fired when a pointer device button is pressed on the display object.
		 *
		 * @event pointerdown
		 * @memberof InteractiveTarget#
		 */
		pointerdown(event: PIXI.interaction.InteractionEvent): void;
		/**
		 * Fired when a pointer device button is released over the display object.
		 *
		 * @event pointerup
		 * @memberof InteractiveTarget#
		 */
		pointerup(event: PIXI.interaction.InteractionEvent): void;
		/**
		 * Fired when a pointer device button is pressed and released on the display object.
		 *
		 * @event pointertap
		 * @memberof InteractiveTarget#
		 */
		pointertap(event: PIXI.interaction.InteractionEvent): void;
		/**
		 * Fired when a pointer device button is released outside the display object that initially
		 * registered a [pointerdown]{@link PIXI.interaction.InteractionManager#event:pointerdown}.
		 *
		 * @event pointerupoutside
		 * @memberof InteractiveTarget#
		 */
		pointerupoutside(event: PIXI.interaction.InteractionEvent): void;
		/**
		 * Fired when a pointer device is moved while over the display object
		 *
		 * @event pointermove
		 * @memberof InteractiveTarget#
		 */
		pointermove(event: PIXI.interaction.InteractionEvent): void;
		/**
		 * Fired when a pointer device is moved onto the display object
		 *
		 * @event pointerover
		 * @memberof InteractiveTarget#
		 */
		pointerover(event: PIXI.interaction.InteractionEvent): void;
		/**
		 * Fired when a pointer device is moved off the display object
		 *
		 * @event pointerout
		 * @memberof InteractiveTarget#
		 */
		pointerout(event: PIXI.interaction.InteractionEvent): void;
		/**
		 * Fired when a touch point is placed on the display object.
		 *
		 * @event touchstart
		 * @memberof InteractiveTarget#
		 */
		touchstart(event: PIXI.interaction.InteractionEvent): void;
		/**
		 * Fired when a touch point is removed from the display object.
		 *
		 * @event touchend
		 * @memberof InteractiveTarget#
		 */
		touchend(event: PIXI.interaction.InteractionEvent): void;
		/**
		 * Fired when a touch point is placed and removed from the display object.
		 *
		 * @event tap
		 * @memberof InteractiveTarget#
		 */
		tap(event: PIXI.interaction.InteractionEvent): void;
		/**
		 * Fired when a touch point is removed outside of the display object that initially
		 * registered a [touchstart]{@link PIXI.interaction.InteractionManager#event:touchstart}.
		 *
		 * @event touchendoutside
		 * @memberof InteractiveTarget#
		 */
		touchendoutside(event: PIXI.interaction.InteractionEvent): void;
		/**
		 * Fired when a touch point is moved along the display object.
		 *
		 * @event touchmove
		 * @memberof InteractiveTarget#
		 */
		touchmove(event: PIXI.interaction.InteractionEvent): void;
		/**
		 * Indicates if the displayObject is interactive or not.
		 *
		 * @member {Bool}
		 * @default false
		 * @memberof InteractiveTarget#
		 */
		interactive: boolean;
		/**
		 * Indicates if the children of displayObject are interactive or not.
		 *
		 * @member {Bool}
		 * @default true
		 * @memberof InteractiveTarget#
		 */
		interactiveChildren: boolean;
		/**
		 * Interaction shape. Children will be hit first, then this shape will be checked.
		 *
		 * @member {Shape}
		 * @memberof InteractiveTarget#
		 * @default null
		 */
		hitArea: pixi.core.math.shapes.Shape;
		/**
		 * Indicates if the displayObject uses button mode or normal mode.
		 *
		 * @member {Bool}
		 * @default false
		 * @memberof InteractiveTarget#
		 */
		buttonMode: boolean;
		/**
		 * Default cursor.
		 *
		 * @member {String}
		 * @default pointer
		 * @memberof InteractiveTarget#
		 */
		defaultCursor: string;
		/**
		 * Internal check to detect if the mouse cursor is hovered over the displayObject
		 *
		 * @member {Bool}
		 * @private
		 */
		_over: boolean;
		/**
		 * Internal check to detect if the left mouse button is pressed on the displayObject
		 *
		 * @member {Bool}
		 * @private
		 */
		_isLeftDown: boolean;
		/**
		 * Internal check to detect if the right mouse button is pressed on the displayObject
		 *
		 * @member {Bool}
		 * @private
		 */
		_isRightDown: boolean;
		/**
		 * Internal check to detect if the pointer cursor is hovered over the displayObject
		 *
		 * @member {Bool}
		 * @private
		 */
		_pointerOver: boolean;
		/**
		 * Internal check to detect if the pointer is down on the displayObject
		 *
		 * @member {Bool}
		 * @private
		 */
		_pointerDown: boolean;
		/**
		 * Internal check to detect if a user has touched the displayObject
		 *
		 * @member {Bool}
		 * @private
		 */
		_touchDown: boolean;
	}
}

declare namespace pixi.core.display {
	export type DestroyOptions = {
		/**
		 * {boolean} [options.baseTexture=false] - Only used for child Sprites if options.children is set to true
		 * Should it destroy the base texture of the child sprite
		 */
		baseTexture: boolean;
		/**
		 * {boolean} [options.children=false] - if set to true, all the children will have their destroy
		 *  method called as well. 'options' will be passed on to those calls.
		 */
		children: boolean;
		/**
		 * {boolean} [options.texture=false] - Only used for child Sprites if options.children is set to true
		 * Should it destroy the texture of the child sprite
		 */
		texture: boolean;
	}
}

declare namespace PIXI {
	declare class DisplayObject extends PIXI.interaction.interactiveTarget {
		/**
		 * The base class for all objects that are rendered on the screen.
		 * This is an abstract class and should not be used on its own rather it should be extended.
		 *
		 * @class
		 * @namespace PIXI
		 */
		constructor();
		/**
		 * Retrieves the bounds of the displayObject as a rectangle object
		 *
		 * @param skipUpdate {Matrix} setting to true will stop the transforms of the scene graph from being updated.
		 * This means the calculation returned MAY be out of date BUT will give you a nice performance boost
		 * @param rect {Rectangle} Optional rectangle to store the result of the bounds calculation
		 * @return {Rectangle} the rectangular bounding area
		 */
		getBounds(skipUpdate?: boolean, rect?: PIXI.Rectangle): PIXI.Rectangle;
		/**
		 * Retrieves the local bounds of the displayObject as a rectangle object
		 *
		 * @param rect {Rectangle} Optional rectangle to store the result of the bounds calculation
		 * @return {Rectangle} the rectangular bounding area
		 */
		getLocalBounds(rect?: PIXI.Rectangle): PIXI.Rectangle;
		/**
		 * Calculates the global position of the display object
		 *
		 * @param position {Point} The world origin to calculate from
		 * @param point {Point} A Point in which to store the value, optional (otherwise a new Point is created)
		 * @param skipUpdate {Bool} Should we skip the update transform
		 * @return {Point} A point object representing the position of this object
		 */
		toGlobal(position: PIXI.Point, point?: PIXI.Point, skipUpdate?: boolean): PIXI.Point;
		/**
		 * Calculates the local position of the display object relative to another point
		 *
		 * @param position {Point} The world origin to calculate from
		 * @param [from] {DisplayObject} The DisplayObject to calculate the global position from
		 * @param [point] {Point} A Point object in which to store the value, optional (otherwise will create a new Point)
		 * @return {Point} A point object representing the position of this object
		 */
		toLocal(position: PIXI.Point, frm?: PIXI.DisplayObject, point?: PIXI.Point): PIXI.Point;
		updateTransform(): void;
		displayObjectUpdateTransform(): void;
		/**
		 * Set the parent Container of this DisplayObject
		 *
		 * @param container {Container} The Container to add this DisplayObject to
		 * @return {Container} The Container that this DisplayObject was added to
		 */
		setParent(container: PIXI.Container): PIXI.Container;
		/**
		 * Convenience function to set the postion, scale, skew and pivot at once.
		 *
		 * @param [x=0] {Float} The X position
		 * @param [y=0] {Float} The Y position
		 * @param [scaleX=1] {Float} The X scale value
		 * @param [scaleY=1] {Float} The Y scale value
		 * @param [skewX=0] {Float} The X skew value
		 * @param [skewY=0] {Float} The Y skew value
		 * @param [pivotX=0] {Float} The X pivot value
		 * @param [pivotY=0] {Float} The Y pivot value
		 * @return {DisplayObject}
		 */
		setTransform(x?: number, y?: number, scaleX?: number, scaleY?: number, rotation?: number, skewX?: number, skewY?: number, pivotX?: number, pivotY?: number): PIXI.DisplayObject;
		/**
		 * Base destroy method for generic display objects
		 * Removes all internal references and listeners as well as removes children from the display list.
		 *
		 * @param {object|boolean} [options] - Options parameter. A boolean will act as if all options
		 *  have been set to that value
		 * @param {boolean} [options.children=false] - if set to true, all the children will have their destroy
		 *  method called as well. 'options' will be passed on to those calls.
		 * @param {boolean} [options.texture=false] - Only used for child Sprites if options.children is set to true
		 *  Should it destroy the texture of the child sprite
		 * @param {boolean} [options.baseTexture=false] - Only used for child Sprites if options.children is set to true
		 *  Should it destroy the base texture of the child sprite
		 */
		destroy(options?: boolean | pixi.core.display.DestroyOptions): void;
		/**
		 * The instance name of the object.
		 *
		 * @member {String}
		 */
		name: string;
		/**
		 * Set this to true if you want this display object to be cached as a bitmap.
		 * This basically takes a snap shot of the display object as it is at that moment. It can provide a performance benefit for complex static displayObjects.
		 * To remove simply set this property to 'null'
		 *
		 * @member {Bool}
		 * @memberof DisplayObject#
		 */
		cacheAsBitmap: boolean;
		/**
		 * The opacity of the object.
		 *
		 * @member {Float}
		 */
		alpha: number;
		/**
		 * World transform and local transform of this object. This will become read-only later,
		 * please do not assign anything there unless you know what are you doing.
		 *
		 * @member {Transform}
		 */
		transform: PIXI.Transform;
		/**
		 * The visibility of the object. If false the object will not be drawn, and
		 * the updateTransform function will not be called.
		 *
		 * @member {Bool}
		 */
		visible: boolean;
		/**
		 * Can this object be rendered, if false the object will not be drawn but the updateTransform
		 * methods will still be called.
		 *
		 * @member {Bool}
		 */
		renderable: boolean;
		/**
		 * The display object container that contains this display object.
		 *
		 * @member {Container}
		 * @readOnly
		 */
		parent: PIXI.Container;
		/**
		 * The multiplied alpha of the displayObject
		 *
		 * @member {Float}
		 * @readOnly
		 */
		worldAlpha: number;
		/**
		 * The area the filter is applied to. This is used as more of an optimisation
		 * rather than figuring out the dimensions of the displayObject each frame you can set this rectangle
		 *
		 * Also works as an interaction mask
		 *
		 * @member {Rectangle}
		 */
		filterArea: PIXI.Rectangle;
		/**
		 * The position of the displayObject on the x axis relative to the local coordinates of the parent.
		 *
		 * @member {Float}
		 * @memberof DisplayObject#
		 */
		x: number;
		/**
		 * The position of the displayObject on the y axis relative to the local coordinates of the parent.
		 *
		 * @member {Float}
		 * @memberof DisplayObject#
		 */
		y: number;
		/**
		 * Current transform of the object based on world (parent) factors
		 *
		 * @member {Matrix}
		 * @readOnly
		 */
		worldTransform: PIXI.Matrix;
		/**
		 * Current transform of the object based on local factors: position, scale, other stuff
		 *
		 * @member {PIXI.Matrix}
		 * @readOnly
		 */
		localTransform: PIXI.Matrix;
		/**
		 * The coordinate of the object relative to the local coordinates of the parent.
		 *
		 * @member {Point}
		 */
		position: PIXI.Point;
		/**
		 * The scale factor of the object.
		 *
		 * @member {Point}
		 */
		scale: PIXI.Point;
		/**
		 * The pivot point of the displayObject that it rotates around
		 *
		 * @member {Point}
		 */
		pivot: PIXI.Point;
		/**
		 * The skew factor for the object in radians.
		 *
		 * @member {Point}
		 */
		skew: PIXI.Point;
		/**
		 * The rotation of the object in radians.
		 *
		 * @member {Float}
		 */
		rotation: number;
		/**
		 * Indicates if the displayObject is globally visible.
		 *
		 * @member {Bool}
		 * @memberof DisplayObject#
		 * @readonly
		 */
		worldVisible: boolean;
		/**
		 * Sets a mask for the displayObject. A mask is an object that limits the visibility of an object to the shape of the mask applied to it.
		 * In PIXI a regular mask must be a PIXI.Graphics or a PIXI.Sprite object. This allows for much faster masking in canvas as it utilises shape clipping.
		 * To remove a mask, set this property to null.
		 *
		 * For the moment, PIXI.CanvasRenderer doesn't support PIXI.Sprite as mask.
		 *
		 * @member {Graphics|Sprite}
		 * @memberof DisplayObject#
		 */
		mask: PIXI.Sprite | PIXI.Graphics;
		/**
		 * Sets the filters for the displayObject.
		 * * IMPORTANT: This is a webGL only feature and will be ignored by the canvas renderer.
		 * To remove filters simply set this property to 'null'
		 *
		 * @member {Array<AbstractFilter>}
		 * @memberof DisplayObject#
		 */
		filters: PIXI.Filter[];
		/**
		 *  Flag for if the object is accessible. If true AccessibilityManager will overlay a
		 *   shadow div with attributes set
		 *
		 * @member {Bool}
		 */
		accessible: boolean;
		/**
		 * Sets the title attribute of the shadow div
		 * If accessibleTitle AND accessibleHint has not been this will default to 'displayObject [tabIndex]'
		 *
		 * @member {String}
		 */
		accessibleTitle: string;
		/**
		 * Sets the aria-label attribute of the shadow div
		 *
		 * @member {String}
		 */
		accessibleHint: string;
		tabIndex: number;
	}
}

declare namespace PIXI {
	declare class Container extends PIXI.DisplayObject {
		/**
		 * A Container represents a collection of display objects.
		 * It is the base class of all display objects that act as a container for other objects.
		 *
		 * @class
		 * @extends DisplayObject
		 * @namespace PIXI
		 */
		constructor();
		/**
		 * The array of children of this container.
		 *
		 * @member {DisplayObject[]}
		 * @readonly
		 */
		children: PIXI.DisplayObject[];
		/**
		 * The width of the Container, setting this will actually modify the scale to achieve the value set
		 *
		 * @member {Float}
		 * @memberof Container#
		 */
		width: number;
		/**
		 * The height of the Container, setting this will actually modify the scale to achieve the value set
		 *
		 * @member {Float}
		 * @memberof Container#
		 */
		height: number;
		/**
		 * Adds a child to the container.
		 *
		 * You can also add multple items like so: myContainer.addChild(thinkOne, thingTwo, thingThree)
		 *
		 * @param child {DisplayObject} The DisplayObject to add to the container
		 * @return {DisplayObject} The child that was added.
		 */
		addChild<T>(child: T): T;
		/**
		 * Adds a child to the container at a specified index.
		 * If the index is out of bounds an error will be thrown.
		 *
		 * @param child {DisplayObject} The child to add
		 * @param index {Int} The index to place the child in
		 * @return {DisplayObject} The child that was added.
		 */
		addChildAt<T>(child: T, index: number): T;
		/**
		 * Swaps the position of 2 Display Objects within this container.
		 *
		 * @param child1 {DisplayObject}
		 * @param child2 {DisplayObject}
		 */
		swapChildren(child1: PIXI.DisplayObject, child2: PIXI.DisplayObject): void;
		/**
		 * Returns the index position of a child DisplayObject instance
		 *
		 * @param child {DisplayObject} The DisplayObject instance to identify
		 * @return {Int} The index position of the child display object to identify
		 */
		getChildIndex(child: PIXI.DisplayObject): number;
		/**
		 * Changes the position of an existing child in the display object container
		 *
		 * @param child {DisplayObject} The child DisplayObject instance for which you want to change the index number
		 * @param index {Int} The resulting index number for the child display object
		 */
		setChildIndex(child: PIXI.DisplayObject, index: number): void;
		/**
		 * Returns the child at the specified index
		 *
		 * @param index {Int} The index to get the child from
		 * @return {DisplayObject} The child at the given index, if any.
		 */
		getChildAt(index: number): PIXI.DisplayObject;
		/**
		 * Removes a child from the container.
		 *
		 * @param child {DisplayObject} The DisplayObject to remove
		 * @return {DisplayObject} The child that was removed.
		 */
		removeChild(child: PIXI.DisplayObject): PIXI.DisplayObject;
		/**
		 * Removes a child from the specified index position.
		 *
		 * @param index {Int} The index to get the child from
		 * @return {DisplayObject} The child that was removed.
		 */
		removeChildAt(index: number): PIXI.DisplayObject;
		/**
		 * Removes all children from this container that are within the begin and end indexes.
		 *
		 * @param beginIndex {Int} The beginning position. Default value is 0.
		 * @param endIndex {Int} The ending position. Default value is size of the container.
		 * @return {Array<DisplayObject>} The children that are removed.
		 */
		removeChildren(beginIndex?: number, endIndex?: number): PIXI.DisplayObject[];
		/**
		 * Returns the display object in the container
		 *
		 * @param name {string} instance name
		 * @return {DisplayObject}
		 */
		getChildByName(name: string): PIXI.DisplayObject;
	}
}

declare namespace PIXI {
	declare class Sprite extends PIXI.Container {
		/**
		 * The Sprite object is the base for all textured objects that are rendered to the screen
		 *
		 * A sprite can be created directly from an image like this:
		 *
		 * ```haxe
		 * 	var sprite = new Sprite.fromImage('assets/image.png');
		 * ```
		 *
		 * @class Sprite
		 * @extends Container
		 * @namespace PIXI
		 * @param texture {Texture} The texture for this sprite
		 */
		constructor(texture?: PIXI.Texture);
		/**
		 * The anchor sets the origin point of the texture.
		 * The default is 0,0 this means the texture's origin is the top left
		 * Setting than anchor to 0.5,0.5 means the textures origin is centered
		 * Setting the anchor to 1,1 would mean the textures origin points will be the bottom right corner
		 *
		 * @member {ObservablePoint}
		 */
		anchor: PIXI.ObservablePoint;
		/**
		 * The texture that the sprite is using
		 *
		 * @member {Texture}
		 */
		texture: PIXI.Texture;
		/**
		 * The tint applied to the sprite. This is a hex value. A value of 0xFFFFFF will remove any tint effect.
		 *
		 * @member {Int}
		 * @default 0xFFFFFF
		 */
		tint: number;
		/**
		 * The blend mode to be applied to the sprite. Set to CONST.blendModes.NORMAL to remove any blend mode.
		 *
		 * @member {Int}
		 * @default CONST.blendModes.NORMAL;
		 */
		blendMode: any;
		/**
		 * The shader that will be used to render the sprite. Set to null to remove a current shader.
		 *
		 * @member {Shader|Filter}
		 */
		shader: PIXI.Shader | PIXI.Filter;
		/**
		 * Plugin that is responsible for rendering this element.
		 * Allows to customize the rendering process without overriding '_render' & '_renderCanvas' methods.
		 *
		 * @member {String}
		 * @default 'sprite'
		 */
		pluginName: string;
		/**
		 * Tests if a point is inside this sprite
		 *
		 * @param {Point} point - the point to test
		 * @return {Bool} the result of the test
		 */
		containsPoint(point: PIXI.Point): boolean;
		/**
		 * Helper function that creates a new sprite based on the source you provide.
		 * The source can be - frame id, image url, video url, canvas element, video element, base texture
		 *
		 * @static
		 * @param {Int|String|BaseTexture|HTMLCanvasElement|HTMLVideoElement} source Source to create texture from
		 * @return {Sprite} The newly created sprite
		 */
		static from(source: any): PIXI.Sprite;
		/**
		 * Helper function that creates a sprite that will contain a texture from the TextureCache based on the frameId
		 * The frame ids are created when a Texture packer file has been loaded
		 *
		 * @static
		 * @param frameId {String} The frame Id of the texture in the cache
		 * @return {Sprite} A new Sprite using a texture from the texture cache matching the frameId
		 */
		static fromFrame(frameId: string): PIXI.Sprite;
		/**
		 * Helper function that creates a sprite that will contain a texture based on an image url
		 * If the image is not in the texture cache it will be loaded
		 *
		 * @static
		 * @param imageId {String} The image url of the texture
		 * @param [crossorigin=(auto)] {Bool} Should use anonymouse CORS? Defaults to true if the URL is not a data-URI.
		 * @param [scaleMode=scaleModes.DEFAULT] {ScaleModes} See {@link scaleModes} for possible values
		 * @return {Sprite} A new Sprite using a texture from the texture cache matching the image id
		 */
		static fromImage(imageId: string, crossorigin?: boolean, scaleMode?: any): PIXI.Sprite;
	}
}

declare class ScreenSprite extends PIXI.Sprite {
	/**
	 * The sprite which covers the entire game screen.
	 *
	 * @class ScreenSprite
	 * @constructor
	 */
	constructor();
	/**
	 * The opacity of the sprite (0 to 255).
	 *
	 * @property opacity
	 * @type Number
	 */
	opacity: number;
	/**
	 * Sets black to the color of the screen sprite.
	 *
	 * @method setBlack
	 */
	setBlack(): void;
	/**
	 * Sets white to the color of the screen sprite.
	 *
	 * @method setWhite
	 */
	setWhite(): void;
	/**
	 * Sets the color of the screen sprite by values.
	 *
	 * @method setColor
	 * @param {Number} r The red value in the range (0, 255)
	 * @param {Number} g The green value in the range (0, 255)
	 * @param {Number} b The blue value in the range (0, 255)
	 */
	setColor(r?: number, g?: number, b?: number): void;
}

declare class Tilemap extends PIXI.Container {
	/**
	 * [read-only] The array of children of the sprite.
	 *
	 * @property children
	 * @type Array<PIXI.DisplayObject>
	 */
	constructor();
	/**
	 * The bitmaps used as a tileset.
	 *
	 * @property bitmaps
	 * @type Array
	 */
	bitmaps: Bitmap[];
	/**
	 * The origin point of the tilemap for scrolling.
	 *
	 * @property origin
	 * @type Point
	 */
	origin: Point;
	/**
	 * The tileset flags.
	 *
	 * @property flags
	 * @type Array
	 */
	flags: number[];
	/**
	 * The animation count for autotiles.
	 *
	 * @property animationCount
	 * @type Number
	 */
	animationCount: number;
	/**
	 * Whether the tilemap loops horizontal.
	 *
	 * @property horizontalWrap
	 * @type Boolean
	 */
	horizontalWrap: boolean;
	/**
	 * Whether the tilemap loops vertical.
	 *
	 * @property verticalWrap
	 * @type Boolean
	 */
	verticalWrap: boolean;
	/**
	 * The width of the screen in pixels.
	 *
	 * @property width
	 * @type Number
	 */
	tileWidth: number;
	/**
	 * The height of a tile in pixels.
	 *
	 * @property tileHeight
	 * @type Number
	 */
	tileHeight: number;
	/**
	 * Sets the tilemap data.
	 *
	 * @method setData
	 * @param {Number} width The width of the map in number of tiles
	 * @param {Number} height The height of the map in number of tiles
	 * @param {Array} data The one dimensional array for the map data
	 */
	setData(width: number, height: number, data: number[]): void;
	/**
	 * Checks whether the tileset is ready to render.
	 *
	 * @method isReady
	 * @type Boolean
	 * @return {Boolean} True if the tilemap is ready
	 */
	isReady(): boolean;
	/**
	 * Updates the tilemap for each frame.
	 *
	 * @method update
	 */
	update(): void;
	/**
	 * @method updateTransform
	 * @private
	 */
	updateTransform(): void;
	/**
	 * Forces to repaint the entire static
	 *
	 * @method refresh
	 */
	refresh(): void;
	/**
	 * Adds a child to the container.
	 *
	 * @method addChild
	 * @param {PIXI.DisplayObject} child The child to add
	 * @return {PIXI.DisplayObject} The child that was added
	 */
	addChild(child: PIXI.DisplayObject): PIXI.DisplayObject;
	/**
	 * Adds a child to the container at a specified index.
	 *
	 * @method addChildAt
	 * @param {PIXI.DisplayObject} child The child to add
	 * @param {Number} index The index to place the child in
	 * @return {PIXI.DisplayObject} The child that was added
	 */
	addChildAt(child: PIXI.DisplayObject, index: number): PIXI.DisplayObject;
	/**
	 * Removes a child from the container.
	 *
	 * @method removeChild
	 * @param {PIXI.DisplayObject} child The child to remove
	 * @return {PIXI.DisplayObject} The child that was removed
	 */
	removeChild(child: PIXI.DisplayObject): PIXI.DisplayObject;
	/**
	 * Removes a child from the specified index position.
	 *
	 * @method removeChildAt
	 * @param {Number} index The index to get the child from
	 * @return {PIXI.DisplayObject} The child that was removed
	 */
	removeChildAt(index: number): PIXI.DisplayObject;
	/**
	 * Forces to refresh the tileset
	 *
	 * @method refresh
	 */
	refreshTileset(): void;
	static TILE_ID_A1: number;
	static TILE_ID_A2: number;
	static TILE_ID_A3: number;
	static TILE_ID_A4: number;
	static TILE_ID_A5: number;
	static TILE_ID_B: number;
	static TILE_ID_C: number;
	static TILE_ID_D: number;
	static TILE_ID_E: number;
	static TILE_ID_MAX: number;
	static FLOOR_AUTOTILE_TABLE: number[][][];
	static WALL_AUTOTILE_TABLE: number[][][];
	static WATERFALL_AUTOTILE_TABLE: number[][][];
	static isVisibleTile(tileId: number): boolean;
	static isAutotile(tileId: number): boolean;
	static getAutotileKind(tileId: number): number;
	static getAutotileShape(tileId: number): number;
	static makeAutotileId(kind: number, shape: number): number;
	static isSameKindTile(tileID1: number, tileID2: number): boolean;
	static isTileA1(tileId: number): boolean;
	static isTileA2(tileId: number): boolean;
	static isTileA3(tileId: number): boolean;
	static isTileA4(tileId: number): boolean;
	static isTileA5(tileId: number): boolean;
	static isWaterTile(tileId: number): boolean;
	static isWaterfallTile(tileId: number): boolean;
	static isGroundTile(tileId: number): boolean;
	static isShadowingTile(tileId: number): boolean;
	static isRoofTile(tileId: number): boolean;
	static isWallTopTile(tileId: number): boolean;
	static isWallSideTile(tileId: number): boolean;
	static isWallTile(tileId: number): boolean;
	static isFloorTypeAutotile(tileId: number): boolean;
	static isWallTypeAutotile(tileId: number): boolean;
	static isWaterfallTypeAutotile(tileId: number): boolean;
}

declare class ShaderTilemap extends Tilemap {
	protected constructor();
	/**
	 * PIXI render method
	 *
	 * @method renderWebGL
	 * @param {PIXI.WebGLRenderer} pixi renderer
	 */
	renderWebGL(renderer: PIXI.Renderer): void;
	/**
	 * PIXI render method
	 *
	 * @method renderCanvas
	 * @param {PIXI.CanvasRenderer} pixi renderer
	 */
	renderCanvas(renderer: PIXI.CanvasRenderer): void;
	/**
	 * Forces to repaint the entire tilemap AND update bitmaps list if needed
	 *
	 * @method refresh
	 */
	refresh(): void;
	/**
	 * Call after you update tileset
	 *
	 * @method refreshTileset
	 */
	refreshTileset(): void;
}

declare class Sprite extends PIXI.Sprite {
	/**
	 * The basic object that is rendered to the game screen.
	 *
	 * @class Sprite
	 * @constructor
	 * @param {Bitmap} bitmap The image for the sprite
	 */
	constructor(bitmap?: Bitmap);
	/**
	 * The image for the sprite.
	 *
	 * @property bitmap
	 * @type Bitmap
	 */
	bitmap: Bitmap;
	/**
	 * The width of the sprite without the scale.
	 *
	 * @property width
	 * @type Number
	 */
	opacity: number;
	/**
	 * The visibility of the sprite.
	 *
	 * @property visible
	 * @type Boolean
	 */
	visible: boolean;
	/**
	 * The x coordinate of the sprite.
	 *
	 * @property x
	 * @type Number
	 */
	x: number;
	/**
	 * The y coordinate of the sprite.
	 *
	 * @property y
	 * @type Number
	 */
	y: number;
	/**
	 * The origin point of the sprite. (0,0) to (1,1).
	 *
	 * @property anchor
	 * @type Point
	 */
	point: PIXI.Point;
	/**
	 * The scale factor of the sprite.
	 *
	 * @property scale
	 * @type Point
	 */
	scale: PIXI.Point;
	/**
	 * The rotation of the sprite in radians.
	 *
	 * @property rotation
	 * @type Number
	 */
	rotation: number;
	/**
	 * The blend mode to be applied to the sprite.
	 *
	 * @property blendMode
	 * @type Number
	 */
	blendMode: number;
	/**
	 * Sets the filters for the sprite.
	 *
	 * @property filters
	 * @type Array<PIXI.Filter>
	 */
	filters: PIXI.Filter[];
	/**
	 * [read-only] The array of children of the sprite.
	 *
	 * @property children
	 * @type Array<PIXI.DisplayObject>
	 */
	spriteId: number;
	opaque: boolean;
	voidFilter: PIXI.Filter;
	initialize(bitmap?: Bitmap): void;
	/**
	 * Updates the sprite for each frame.
	 *
	 * @method update
	 */
	update(): void;
	/**
	 * @method updateTransform
	 * @private
	 */
	updateTransform(): void;
	/**
	 * Sets the x and y at once.
	 *
	 * @method move
	 * @param {Number} x The x coordinate of the sprite
	 * @param {Number} y The y coordinate of the sprite
	 */
	move(x: number, y: number): void;
	/**
	 * Sets the rectagle of the bitmap that the sprite displays.
	 *
	 * @method setFrame
	 * @param {Number} x The x coordinate of the frame
	 * @param {Number} y The y coordinate of the frame
	 * @param {Number} width The width of the frame
	 * @param {Number} height The height of the frame
	 */
	setFrame(x: number, y: number, width: number, height: number): void;
	/**
	 * Gets the blend color for the sprite.
	 *
	 * @method getBlendColor
	 * @return {Array} The blend color [r, g, b, a]
	 */
	getBlendColor(): number[];
	/**
	 * Sets the blend color for the sprite.
	 *
	 * @method setBlendColor
	 * @param {Array} color The blend color [r, g, b, a]
	 */
	setBlendColor(color: number[]): void;
	/**
	 * Gets the color tone for the sprite.
	 *
	 * @method getColorTone
	 * @return {Array} The color tone [r, g, b, gray]
	 */
	getColorTone(): number[];
	/**
	 * Sets the color tone for the sprite.
	 *
	 * @method setColorTone
	 * @param {Array} tone The color tone [r, g, b, gray]
	 */
	setColorTone(tone: number[]): void;
	/**
	 * Adds a child to the container.
	 *
	 * @method addChild
	 * @param {PIXI.DisplayObject} child The child to add
	 * @return {PIXI.DisplayObject} The child that was added
	 */
	addChild(child: PIXI.DisplayObject): PIXI.DisplayObject;
	/**
	 * Adds a child to the container at a specified index.
	 *
	 * @method addChildAt
	 * @param {PIXI.DisplayObject} child The child to add
	 * @param {Number} index The index to place the child in
	 * @return {PIXI.DisplayObject} The child that was added
	 */
	addChildAt(child: PIXI.DisplayObject, index: number): PIXI.DisplayObject;
	/**
	 * Removes a child from the container.
	 *
	 * @method removeChild
	 * @param {PIXI.DisplayObject} child The child to remove
	 * @return {PIXI.DisplayObject} The child that was removed
	 */
	removeChild(child: PIXI.DisplayObject): PIXI.DisplayObject;
	/**
	 * Removes a child from the specified index position.
	 *
	 * @method removeChildAt
	 * @param {Number} index The index to get the child from
	 * @return {PIXI.DisplayObject} The child that was removed
	 */
	removeChildAt(index: number): PIXI.DisplayObject;
	/**
	 * Number of the created objects.
	 *
	 * @static
	 * @property _counter
	 * @type Number
	 */
	static _counter: number;
}

declare class Stage extends PIXI.Container {
	/**
	 * The root object of the display tree.
	 *
	 * @class Stage
	 * @constructor
	 */
	constructor();
	/**
	 * Adds a child to the container.
	 *
	 * @method addChild
	 * @param {PIXI.DisplayObject} child The child to add
	 * @return {PIXI.DisplayObject} The child that was added
	 */
	addChild(child: PIXI.DisplayObject): PIXI.DisplayObject;
	/**
	 * Adds a child to the container at a specified index.
	 *
	 * @method addChildAt
	 * @param {PIXI.DisplayObject} child The child to add
	 * @param {Number} index The index to place the child in
	 * @return {PIXI.DisplayObject} The child that was added
	 */
	addChildAt(child: PIXI.DisplayObject, index: number): PIXI.DisplayObject;
	/**
	 * Removes a child from the container.
	 *
	 * @method removeChild
	 * @param {PIXI.DisplayObject} child The child to remove
	 * @return {PIXI.DisplayObject} The child that was removed
	 */
	removeChild(child: PIXI.DisplayObject): PIXI.DisplayObject;
	/**
	 * Removes a child from the specified index position.
	 *
	 * @method removeChildAt
	 * @param {Number} index The index to get the child from
	 * @return {PIXI.DisplayObject} The child that was removed
	 */
	removeChildAt(index: number): PIXI.DisplayObject;
}

declare namespace PIXI {
	declare class TilingSprite extends PIXI.Sprite {
		/**
		 * A tiling sprite is a fast way of rendering a tiling image
		 *
		 * @class
		 * @extends Sprite
		 * @memberof PIXI.extras
		 * @param texture {Texture} the texture of the tiling sprite
		 * @param width {Float} [width=100] the width of the tiling sprite
		 * @param height {Float} [height=100] the height of the tiling sprite
		 */
		constructor(texture: PIXI.Texture, width?: number, height?: number);
		/**
		 * Tile transform
		 *
		 * @member {Transform}
		 */
		tileTransform: PIXI.Transform;
		/**
		 * Whether or not anchor affects uvs
		 *
		 * @member {Bool}
		 * @default false
		 */
		uvRespectAnchor: boolean;
		/**
		 * The scaling of the image that is being tiled
		 *
		 * @member {ObservablePoint}
		 */
		tileScale: PIXI.ObservablePoint;
		/**
		 * The offset position of the image that is being tiled
		 *
		 * @member {ObservablePoint}
		 */
		tilePosition: PIXI.ObservablePoint;
		/**
		 * Changes frame clamping in corresponding textureTransform, shortcut
		 * Change to -0.5 to add a pixel to the edge, recommended for transparent trimmed textures in atlas
		 * @default 0.5
		 */
		clampMargin: number;
		/**
		 * Helper function that creates a new sprite based on the source you provide.
		 * The source can be - frame id, image url, video url, canvas element, video element, base texture
		 *
		 * @static
		 * @param {Int|String|BaseTexture|HTMLCanvasElement|HTMLVideoElement} source Source to create texture from
		 * @param {Float} width - the width of the tiling sprite
		 * @param {Float} height - the height of the tiling sprite
		 * @return {TilingSprite} The newly created sprite
		 */
		static from(source: any, width: number, height: number): PIXI.TilingSprite;
		/**
		 * Helper function that creates a tiling sprite that will use a texture from the TextureCache based on the frameId
		 * The frame ids are created when a Texture packer file has been loaded
		 *
		 * @static
		 * @param {String} frameId - The frame Id of the texture in the cache
		 * @param {Float} width - the width of the tiling sprite
		 * @param {Float} height - the height of the tiling sprite
		 * @return {TilingSprite} A new TilingSprite using a texture from the texture cache matching the frameId
		 */
		static fromFrame(frameId: string, width: number, height: number): PIXI.TilingSprite;
		/**
		 * Helper function that creates a sprite that will contain a texture based on an image url
		 * If the image is not in the texture cache it will be loaded
		 *
		 * @static
		 * @param {String} imageId - The image url of the texture
		 * @param {Float} width - the width of the tiling sprite
		 * @param {Float} height - the height of the tiling sprite
		 * @param {Bool} [crossorigin] - if you want to specify the cross-origin parameter
		 * @param {ScaleModes} [scaleMode=PIXI.settings.SCALE_MODE] - if you want to specify the scale mode,
		 *  see {@link PIXI.SCALE_MODES} for possible values
		 * @return {TilingSprite} A new TilingSprite using a texture from the texture cache matching the image id
		 */
		static fromImage(imageId: string, width: number, height: number, crossorigin?: boolean, scaleMode?: any): PIXI.TilingSprite;
	}
}

declare class TilingSprite extends PIXI.TilingSprite {
	/**
	 * The sprite object for a tiling image.
	 *
	 * @class TilingSprite
	 * @constructor
	 * @param {Bitmap} bitmap The image for the tiling sprite
	 */
	constructor(bitmap: Bitmap);
	/**
	 * The origin point of the tiling sprite for scrolling.
	 *
	 * @property origin
	 * @type Point
	 */
	origin: Point;
	/**
	 * The image for the tiling sprite.
	 *
	 * @property bitmap
	 * @type Bitmap
	 */
	bitmap: Bitmap;
	/**
	 * The opacity of the tiling sprite (0 to 255).
	 *
	 * @property opacity
	 * @type Number
	 */
	opacity: number;
	/**
	 * The visibility of the tiling sprite.
	 *
	 * @property visible
	 * @type Boolean
	 */
	visibility: boolean;
	/**
	 * The x coordinate of the tiling sprite.
	 *
	 * @property x
	 * @type Number
	 */
	x: number;
	/**
	 * The y coordinate of the tiling sprite.
	 *
	 * @property y
	 * @type Number
	 */
	y: number;
	spriteId: number;
	/**
	 * Updates the tiling sprite for each frame.
	 *
	 * @method update
	 */
	update(): void;
	/**
	 * @method updateTransform
	 * @private
	 */
	updateTransform(): void;
	/**
	 * Sets the x, y, width, and height all at once.
	 *
	 * @method move
	 * @param {Number} x The x coordinate of the tiling sprite
	 * @param {Number} y The y coordinate of the tiling sprite
	 * @param {Number} width The width of the tiling sprite
	 * @param {Number} height The height of the tiling sprite
	 */
	move(x?: number, y?: number, width?: number, height?: number): void;
	/**
	 * Specifies the region of the image that the tiling sprite will use.
	 *
	 * @method setFrame
	 * @param {Number} x The x coordinate of the frame
	 * @param {Number} y The y coordinate of the frame
	 * @param {Number} width The width of the frame
	 * @param {Number} height The height of the frame
	 */
	setFrame(x: number, y: number, width: number, height: number): void;
	updateTransformTS(): void;
	/**
	 * @method generateTilingTexture
	 * @param {Boolean} arg
	 */
	generateTilingTexture(arg: boolean): void;
}

declare namespace PIXI {
	declare class Filter {
		/**
		 * @class
		 * @memberof PIXI
		 * @param [vertexSrc] {String} The source of the vertex shader.
		 * @param [fragmentSrc] {String} The source of the fragment shader.
		 * @param [uniforms] {Dynamic} Custom uniforms to use to augment the built-in ones.
		 */
		constructor(vertexSrc?: string, fragmentSrc?: string, uniforms?: any);
		/**
		 * Legacy filters use position and uvs from attributes
		 */
		readonly legacy: boolean;
		/**
		 * Sets the blendmode of the filter. Default: PIXI.BLEND_MODES.NORMAL
		 */
		blendMode: any;
		/**
		 * Program that the shader uses
		 */
		program: PIXI.Program;
		/**
		 * The WebGL state the filter requires to render
		 */
		state: PIXI.State;
		/**
		 * The vertex shader.
		 *
		 * @member {String}
		 */
		vertexSrc: string;
		/**
		 * The fragment shader.
		 *
		 * @member {String}
		 */
		fragmentSrc: string;
		/**
		 * An object containing the current values of custom uniforms.
		 * @example <caption>Updating the value of a custom uniform</caption>
		 * filter.uniforms.time = performance.now();
		 *
		 * @member {Dynamic}
		 */
		uniforms: any;
		/**
		 * The padding of the filter. Some filters require extra space to breath such as a blur.
		 * Increasing this will add extra width and height to the bounds of the object that the
		 * filter is applied to.
		 *
		 * @member {Float}
		 */
		padding: number;
		/**
		 * The resolution of the filter. Setting this to be lower will lower the quality but
		 * increase the performance of the filter.
		 *
		 * @member {Float}
		 */
		resolution: number;
		/**
		 * If enabled is true the filter is applied, if false it will not.
		 *
		 * @member {Bool}
		 */
		enabled: boolean;
		/**
		 * If enabled, PixiJS will fit the filter area into boundaries for better performance. Switch it off if it does not work for specific shader.
		 * Workaround for http://jsfiddle.net/xbmhh207/1/
		 * @default true
		 * @member {Bool}
		 */
		autoFit: boolean;
		apply(filterManager: PIXI.systems.FilterSystem, input: PIXI.RenderTexture, output: PIXI.RenderTexture, clear?: boolean, currentState?: pixi.core.renderers.webgl.filters.CurrentState): void;
		/**
		 * The default vertex shader source
		 *
		 * @static
		 * @constant
		 */
		static defaultVertexSrc: any;
		/**
		 * The default fragment shader source
		 *
		 * @static
		 * @constant
		 */
		static defaultFragmentSrc: any;
	}
}

declare namespace PIXI.filters {
	declare class ColorMatrixFilter extends PIXI.Filter {
		/**
		 * The ColorMatrixFilter class lets you apply a 5x5 matrix transformation on the RGBA
		 * color and alpha values of every pixel on your displayObject to produce a result
		 * with a new set of RGBA color and alpha values. It's pretty powerful!
		 *
		 * ```js
		 *  var colorMatrix = new ColorMatrixFilter();
		 *  container.filters = [colorMatrix];
		 *  colorMatrix.contrast(2);
		 * ```
		 * @author Clément Chenebault <clement@goodboydigital.com>
		 * @class
		 * @extends AbstractFilter
		 * @memberof PIXI.filters
		 */
		constructor();
		/**
		 * Sets the matrix of the color matrix filter
		 *
		 * @member {number[]}
		 * @memberof ColorMatrixFilter#
		 * @default [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
		 */
		matrix: number[];
		/**
		 * Adjusts brightness
		 *
		 * Multiply the current matrix
		 * @param b {Float} value of the brigthness (0 is black)
		 * @param multiply {Bool} refer to ._loadMatrix() method
		 */
		brightness(b: number, multiply: boolean): void;
		/**
		 * Set the matrices in grey scales
		 *
		 * Multiply the current matrix
		 * @param scale {Float} value of the grey (0 is black)
		 * @param multiply {Bool} refer to ._loadMatrix() method
		 */
		greyscale(scale: number, multiply: boolean): void;
		/**
		 * Set the black and white matrice
		 * Multiply the current matrix
		 *
		 * @param multiply {Bool} refer to ._loadMatrix() method
		 */
		blackAndWhite(multiply: boolean): void;
		/**
		 * Set the hue propertie of the color
		 *
		 * Multiply the current matrix
		 * @param rotation {Float} in degrees
		 * @param multiply {Bool} refer to ._loadMatrix() method
		 */
		hue(rotation: number, multiply: boolean): void;
		/**
		 * Set the contrast matrix, increase the separation between dark and bright
		 * Increase contrast : shadows darker and highlights brighter
		 * Decrease contrast : bring the shadows up and the highlights down
		 *
		 * @param amount {Float} value of the contrast
		 * @param multiply {Bool} refer to ._loadMatrix() method
		 */
		contrast(amount: number, multiply: boolean): void;
		/**
		 * Set the saturation matrix, increase the separation between colors
		 * Increase saturation : increase contrast, brightness, and sharpness
		 * @param amount {Float}
		 * @param multiply {Bool} refer to ._loadMatrix() method
		 */
		saturation(amount: number, multiply: boolean): void;
		/**
		 * Desaturate image (remove color)
		 *
		 * Call the saturate function
		 *
		 * @param multiply {Bool} refer to ._loadMatrix() method
		 */
		desaturate(multiply: boolean): void;
		/**
		 * Negative image (inverse of classic rgb matrix)
		 *
		 * @param multiply {Bool} refer to ._loadMatrix() method
		 */
		negative(multiply: boolean): void;
		/**
		 * Sepia image
		 *
		 * @param multiply {Bool} refer to ._loadMatrix() method
		 */
		sepia(multiply: boolean): void;
		/**
		 * Color motion picture process invented in 1916 (thanks Dominic Szablewski)
		 *
		 * @param multiply {Bool} refer to ._loadMatrix() method
		 */
		technicolor(multiply: boolean): void;
		/**
		 * Polaroid filter
		 *
		 * @param multiply {boolean} refer to ._loadMatrix() method
		 */
		polaroid(multiply: boolean): void;
		/**
		 * Filter who transforms : Red -> Blue and Blue -> Red
		 *
		 * @param multiply {Bool} refer to ._loadMatrix() method
		 */
		toBGR(multiply: boolean): void;
		/**
		 * Color reversal film introduced by Eastman Kodak in 1935. (thanks Dominic Szablewski)
		 *
		 * @param multiply {Bool} refer to ._loadMatrix() method
		 */
		kodachrome(multiply: boolean): void;
		/**
		 * Brown delicious browni filter (thanks Dominic Szablewski)
		 *
		 * @param multiply {Bool} refer to ._loadMatrix() method
		 */
		browni(multiply: boolean): void;
		vintage(multiply: boolean): void;
		colorTone(desaturation: number, toned: number, lightColor: number, darkColor: number, multiply: boolean): void;
		night(intensity: number, multiply: boolean): void;
		predator(amount: number, multiply: boolean): void;
		lsd(multiply: boolean): void;
		reset(): void;
	}
}

declare class ToneFilter extends PIXI.filters.ColorMatrixFilter {
	/**
	 * The color matrix filter for WebGL.
	 *
	 * @class ToneFilter
	 * @extends PIXI.Filter
	 * @constructor
	 */
	constructor();
	/**
	 * Changes the hue.
	 *
	 * @method adjustHue
	 * @param {Number} value The hue value in the range (-360, 360)
	 */
	adjustHue(value?: number): void;
	/**
	 * Changes the saturation.
	 *
	 * @method adjustSaturation
	 * @param {Number} value The saturation value in the range (-255, 255)
	 */
	adjustSaturation(value?: number): void;
	/**
	 * Changes the tone.
	 *
	 * @method adjustTone
	 * @param {Number} r The red strength in the range (-255, 255)
	 * @param {Number} g The green strength in the range (-255, 255)
	 * @param {Number} b The blue strength in the range (-255, 255)
	 */
	adjustTone(r?: number, g?: number, b?: number): void;
}

declare class ToneSprite extends PIXI.Container {
	/**
	 * The sprite which changes the screen color in 2D canvas mode.
	 *
	 * @class ToneSprite
	 * @constructor
	 */
	constructor();
	/**
	 * Clears the tone.
	 *
	 * @method reset
	 */
	clear(): void;
	/**
	 * Sets the tone.
	 *
	 * @method setTone
	 * @param {Number} r The red strength in the range (-255, 255)
	 * @param {Number} g The green strength in the range (-255, 255)
	 * @param {Number} b The blue strength in the range (-255, 255)
	 * @param {Number} gray The grayscale level in the range (0, 255)
	 */
	setTone(r: number, g: number, b: number, gray: number): void;
}

declare namespace rm.types {
	export const enum Frames {
		base = -1,
	}
}

declare class TouchInput {
	protected constructor();
	static _mousePressed: boolean;
	static _screenPressed: boolean;
	static _pressedTime: number;
	static _date: number;
	static _x: number;
	static _y: number;
	/**
	 * The wait time of the pseudo key repeat in frames.
	 *
	 * @static
	 * @property keyRepeatWait
	 * @type Number
	 */
	static keyRepeatWait: rm.types.Frames;
	/**
	 * The interval of the pseudo key repeat in frames.
	 *
	 * @static
	 * @property keyRepeatInterval
	 * @type Number
	 */
	static keyRepeatInterval: rm.types.Frames;
	/**
	 * [read-only] The horizontal scroll amount.
	 *
	 * @static
	 * @property wheelX
	 * @type Number
	 */
	static wheelX: number;
	/**
	 * [read-only] The vertical scroll amount.
	 *
	 * @static
	 * @property wheelY
	 * @type Number
	 */
	static wheelY: number;
	/**
	 * [read-only] The x coordinate on the canvas area of the latest touch event.
	 *
	 * @static
	 * @property x
	 * @type Number
	 */
	static x: number;
	/**
	 * [read-only] The y coordinate on the canvas area of the latest touch event.
	 *
	 * @static
	 * @property y
	 * @type Number
	 */
	static y: number;
	/**
	 * [read-only] The time of the last input in milliseconds.
	 *
	 * @static
	 * @property date
	 * @type Number
	 */
	static date: number;
	/**
	 * Initializes the touch system.
	 *
	 * @static
	 * @method initialize
	 */
	static initialize(): void;
	/**
	 * Clears all the touch data.
	 *
	 * @static
	 * @method clear
	 */
	static clear(): void;
	/**
	 * Updates the touch data.
	 *
	 * @static
	 * @method update
	 */
	static update(): void;
	/**
	 * Checks whether the mouse button or touchscreen is currently pressed down.
	 *
	 * @static
	 * @method isPressed
	 * @return {Boolean} True if the mouse button or touchscreen is pressed
	 */
	static isPressed(): boolean;
	/**
	 * Checks whether the left mouse button or touchscreen is just pressed.
	 *
	 * @static
	 * @method isTriggered
	 * @return {Boolean} True if the mouse button or touchscreen is triggered
	 */
	static isTriggered(): boolean;
	/**
	 * Checks whether the left mouse button or touchscreen is just pressed
	 * or a pseudo key repeat occurred.
	 *
	 * @static
	 * @method isRepeated
	 * @return {Boolean} True if the mouse button or touchscreen is repeated
	 */
	static isRepeated(): boolean;
	/**
	 * Checks whether the left mouse button or touchscreen is kept depressed.
	 *
	 * @static
	 * @method isLongPressed
	 * @return {Boolean} True if the left mouse button or touchscreen is long-pressed
	 */
	static isLongPressed(): boolean;
	/**
	 * Checks whether the right mouse button is just pressed.
	 *
	 * @static
	 * @method isCancelled
	 * @return {Boolean} True if the right mouse button is just pressed
	 */
	static isCancelled(): boolean;
	/**
	 * Checks whether the mouse or a finger on the touchscreen is moved.
	 *
	 * @static
	 * @method isMoved
	 * @return {Boolean} True if the mouse or a finger on the touchscreen is moved
	 */
	static isMoved(): boolean;
	/**
	 * Checks whether the left mouse button or touchscreen is released.
	 *
	 * @static
	 * @method isReleased
	 * @return {Boolean} True if the mouse button or touchscreen is released
	 */
	static isReleased(): boolean;
}

declare class Utils {
	protected constructor();
	/**
	 * The name of the RPG Maker. 'MV' in the current version.
	 */
	static RPGMAKER_NAME: string;
	/**
	 * The version of the RPG Maker.
	 *
	 * @static
	 * @property RPGMAKER_VERSION
	 * @type String
	 * @final
	 */
	static RPGMAKER_VERSION: string;
	/**
	 * Checks whether the option is in the query string.
	 *
	 * @param {String} name The option name
	 * @return {Boolean} True if the option is in the query string
	 */
	static isOptionValid(name: string): boolean;
	/**
	 * Checks whether the platform is NW.js.
	 *
	 * @return {Boolean} True if the platform is NW.js
	 */
	static isNwjs(): boolean;
	/**
	 * Checks whether the platform is a mobile device.
	 *
	 * @static
	 * @method isMobileDevice
	 * @return {Boolean} True if the platform is a mobile device
	 */
	static isMobileDevice(): boolean;
	/**
	 * Checks whether the browser is Mobile Safari.
	 *
	 * @static
	 * @method isMobileSafari
	 * @return {Boolean} True if the browser is Mobile Safari
	 */
	static isMobileSafari(): boolean;
	/**
	 * Checks whether the browser is Android Chrome.
	 *
	 * @return {Boolean} True if the browser is Android Chrome
	 */
	static isAndroidChrome(): boolean;
	/**
	 * Checks whether the browser can read files in the game folder.
	 *
	 * @return {Boolean} True if the browser can read files in the game folder
	 */
	static canReadGameFiles(): boolean;
	/**
	 * Makes a CSS color string from RGB values.
	 *
	 * @static
	 * @method rgbToCssColor
	 * @param {Int} r The red value in the range (0, 255)
	 * @param {Int} g The green value in the range (0, 255)
	 * @param {Int} b The blue value in the range (0, 255)
	 * @return {String} CSS color string
	 */
	static rgbToCssColor(r: number, g: number, b: number): string;
	static isSupportPassiveEvent(): boolean;
	static generateRuntimeId(): number;
}

declare class Weather extends PIXI.Container {
	/**
	 * The weather effect which displays rain, storm, or snow.
	 *
	 * @class Weather
	 * @constructor
	 */
	constructor();
	/**
	 * The type of the weather in ['none', 'rain', 'storm', 'snow'].
	 *
	 * @property type
	 * @type String
	 */
	type: string;
	/**
	 * The power of the weather in the range (0, 9).
	 *
	 * @property power
	 * @type Number
	 */
	power: number;
	/**
	 * The origin point of the weather for scrolling.
	 *
	 * @property origin
	 * @type Point
	 */
	origin: Point;
	/**
	 * Updates the weather for each frame.
	 *
	 * @method update
	 */
	update(): void;
}

declare class WindowLayer extends PIXI.Container {
	/**
	 * The layer which contains game windows.
	 *
	 * @class WindowLayer
	 * @constructor
	 */
	constructor();
	/**
	 * The width of the window layer in pixels.
	 *
	 * @property width
	 * @type Number
	 */
	voidFilter: PIXI.Filter;
	/**
	 * Sets the x, y, width, and height all at once.
	 *
	 * @method move
	 * @param {Number} x The x coordinate of the window layer
	 * @param {Number} y The y coordinate of the window layer
	 * @param {Number} width The width of the window layer
	 * @param {Number} height The height of the window layer
	 */
	move(x: number, y: number, width: number, height: number): void;
	/**
	 * Updates the window layer for each frame.
	 *
	 * @method update
	 */
	update(): void;
	/**
	 * Adds a child to the container.
	 *
	 * @method addChild
	 * @param {PIXI.DisplayObject} child The child to add
	 * @return {PIXI.DisplayObject} The child that was added
	 */
	addChild(child: PIXI.DisplayObject): PIXI.DisplayObject;
	/**
	 * Adds a child to the container at a specified index.
	 *
	 * @method addChildAt
	 * @param {PIXI.DisplayObject} child The child to add
	 * @param {Number} index The index to place the child in
	 * @return {PIXI.DisplayObject} The child that was added
	 */
	addChildAt(child: PIXI.DisplayObject, index: number): PIXI.DisplayObject;
	/**
	 * Removes a child from the container.
	 *
	 * @method removeChild
	 * @param {PIXI.DisplayObject} child The child to remove
	 * @return {PIXI.DisplayObject} The child that was removed
	 */
	removeChild(child: PIXI.DisplayObject): PIXI.DisplayObject;
	/**
	 * Removes a child from the specified index position.
	 *
	 * @method removeChildAt
	 * @param {Number} index The index to get the child from
	 * @return {PIXI.DisplayObject} The child that was removed
	 */
	removeChildAt(index: number): PIXI.DisplayObject;
	/**
	 * @method _renderCanvas
	 * @param {PIXI.CanvasRenderer} renderer
	 * @private
	 */
	_renderCanvas(renderer: PIXI.CanvasRenderer): void;
	/**
	 * @method _renderWebGL
	 * @param {PIXI.WebGLRenderer} renderer
	 * @private
	 */
	_renderWebGL(renderer: PIXI.Renderer): void;
}

declare class Window extends PIXI.Container {
	/**
	 * The visibility of the sprite.
	 *
	 * @property visible
	 * @type Boolean
	 */
	constructor();
	/**
	 * The origin point of the window for scrolling.
	 *
	 * @property origin
	 * @type Point
	 */
	origin: PIXI.Point;
	/**
	 * The active state for the window.
	 *
	 * @property active
	 * @type Boolean
	 */
	active: boolean;
	/**
	 * The visibility of the down scroll arrow.
	 *
	 * @property downArrowVisible
	 * @type Boolean
	 */
	downArrowVisible: boolean;
	/**
	 * The visibility of the up scroll arrow.
	 *
	 * @property upArrowVisible
	 * @type Boolean
	 */
	upArrowVisible: boolean;
	/**
	 * The visibility of the pause sign.
	 *
	 * @property pause
	 * @type Boolean
	 */
	pause: boolean;
	/**
	 * The image used as a window skin.
	 *
	 * @property windowskin
	 * @type Bitmap
	 */
	windowskin: Bitmap;
	/**
	 * The bitmap used for the window contents.
	 *
	 * @property contents
	 * @type Bitmap
	 */
	contents: Bitmap;
	/**
	 * The width of the window in pixels.
	 *
	 * @property width
	 * @type Number
	 */
	padding: number;
	/**
	 * The size of the margin for the window background.
	 *
	 * @property margin
	 * @type Number
	 */
	margin: number;
	/**
	 * The opacity of the window without contents (0 to 255).
	 *
	 * @property opacity
	 * @type Number
	 */
	opacity: number;
	/**
	 * The opacity of the window background (0 to 255).
	 *
	 * @property backOpacity
	 * @type Number
	 */
	backOpacity: number;
	/**
	 * The opacity of the window contents (0 to 255).
	 *
	 * @property contentsOpacity
	 * @type Number
	 */
	contentsOpacity: number;
	/**
	 * The openness of the window (0 to 255).
	 *
	 * @property openness
	 * @type Number
	 */
	openness: number;
	/**
	 * The width of the content area in pixels.
	 */
	innerWidth: number;
	/**
	 * The height of the content area in pixels.
	 */
	innerHeight: number;
	/**
	 * The rectangle of the content area
	 */
	innerRect: Rectangle;
	/**
	 * Updates the window for each frame.
	 *
	 * @method update
	 */
	update(): void;
	/**
	 * Sets the x, y, width, and height all at once.
	 *
	 * @method move
	 * @param {Number} x The x coordinate of the window
	 * @param {Number} y The y coordinate of the window
	 * @param {Number} width The width of the window
	 * @param {Number} height The height of the window
	 */
	move(x?: number, y?: number, width?: number, height?: number): void;
	/**
	 * Returns true if the window is completely open (openness == 255).
	 *
	 * @method isOpen
	 * @return {Boolean}
	 */
	isOpen(): boolean;
	/**
	 * Returns true if the window is completely closed (openness == 0).
	 *
	 * @method isClosed
	 * @return {Boolean}
	 */
	isClosed(): boolean;
	/**
	 * Sets the position of the command cursor.
	 *
	 * @method setCursorRect
	 * @param {Number} x The x coordinate of the cursor
	 * @param {Number} y The y coordinate of the cursor
	 * @param {Number} width The width of the cursor
	 * @param {Number} height The height of the cursor
	 */
	setCursorRect(x?: number, y?: number, width?: number, height?: number): void;
	/**
	 * Changes the color of the background.
	 *
	 * @method setTone
	 * @param {Number} r The red value in the range (-255, 255)
	 * @param {Number} g The green value in the range (-255, 255)
	 * @param {Number} b The blue value in the range (-255, 255)
	 */
	setTone(r: number, g: number, b: number): void;
	/**
	 * Adds a child between the background and contents.
	 *
	 * @method addChildToBack
	 * @param {PIXI.DisplayObject} child The child to add
	 * @return {PIXI.DisplayObject} The child that was added
	 */
	addChildToBack(child: PIXI.DisplayObject): PIXI.DisplayObject;
	/**
	 * Adds a child to the container.
	 *
	 * @method addChild
	 * @param {PIXI.DisplayObject} child The child to add
	 * @return {PIXI.DisplayObject} The child that was added
	 */
	addChild(child: PIXI.DisplayObject): PIXI.DisplayObject;
	/**
	 * Adds a child to the container at a specified index.
	 *
	 * @method addChildAt
	 * @param {PIXI.DisplayObject} child The child to add
	 * @param {Number} index The index to place the child in
	 * @return {PIXI.DisplayObject} The child that was added
	 */
	addChildAt(child: PIXI.DisplayObject, index: number): PIXI.DisplayObject;
	/**
	 * Removes a child from the container.
	 *
	 * @method removeChild
	 * @param {PIXI.DisplayObject} child The child to remove
	 * @return {PIXI.DisplayObject} The child that was removed
	 */
	removeChild(child: PIXI.DisplayObject): PIXI.DisplayObject;
	/**
	 * Removes a child from the specified index position.
	 *
	 * @method removeChildAt
	 * @param {Number} index The index to get the child from
	 * @return {PIXI.DisplayObject} The child that was removed
	 */
	removeChildAt(index: number): PIXI.DisplayObject;
	/**
	 * Move the cursor position by the given amount
	 * @param x
	 * @param y
	 */
	moveCursorBy(x: number, y: number): void;
	/**
	 * Moves the inner children by the given amount.
	 * @param x
	 * @param y
	 */
	moveInnerChildrenBy(x: number, y: number): void;
	/**
	 * Adds a child to the client area.
	 * @param child
	 * @return DisplayObject
	 */
	addInnerChild(child: PIXI.DisplayObject): PIXI.DisplayObject;
	/**
	 * Draws the window shape into PIXI.Graphics object. Used by WindowLayer.
	 * @param graphics
	 */
	drawShape(graphics: PIXI.Graphics): void;
	/**
	 * Destroys the window
	 */
	destroy(): void;
	/**
	 * @method updateTransform
	 * @private
	 */
	updateTransform(): void;
}

declare namespace rm.types {
	export type AudioParameters = {
		name: string;
		pan: number;
		pitch: number;
		pos: number;
		volume: number;
	}
}

/**
 * Static class that handles BGM, BGS, ME, and SE.
 */
declare class AudioManager {
	protected constructor();
	static _bgmVolume: number;
	static _bgsVolume: number;
	static _meVolume: number;
	static _seVolume: number;
	static _currentBgm: rm.types.AudioParameters;
	static _currentBgs: rm.types.AudioParameters;
	static _bgmBuffer: HTML5Audio;
	static _bgsBuffer: HTML5Audio;
	static _meBuffer: HTML5Audio;
	static _seBuffers: HTML5Audio[];
	static _staticBuffers: HTML5Audio[];
	static _replayFadeTime: number;
	static _path: string;
	static _blobUrl: string;
	static bgmVolume: number;
	static bgsVolume: number;
	static meVolume: number;
	static seVolume: number;
	static playBgm(bgm: rm.types.AudioParameters, pos?: number): void;
	static replayBgm(bgm: rm.types.AudioParameters): void;
	static isCurrentBgm(bgm: rm.types.AudioParameters): boolean;
	static updateBgmParameters(bgm: rm.types.AudioParameters): void;
	static pdateCurrentBgm(bgm: rm.types.AudioParameters, pos: number): void;
	static stopBgm(): void;
	static fadeOutBgm(duration: number): void;
	static fadeInBgm(duration: number): void;
	static playBgs(bgs: rm.types.AudioParameters, pos?: number): void;
	static replayBgs(bgs: rm.types.AudioParameters): void;
	static isCurrentBgs(bgs: rm.types.AudioParameters): boolean;
	static updateBgsParameters(bgs: rm.types.AudioParameters): void;
	static updateCurrentBgs(bgs: rm.types.AudioParameters, pos: number): void;
	static stopBgs(): void;
	static fadeOutBgs(duration: number): void;
	static fadeInBgs(duration: number): void;
	static playMe(me: rm.types.AudioParameters): void;
	static updateMeParameters(me: rm.types.AudioParameters): void;
	static fadeOutMe(duration: number): void;
	static stopMe(): void;
	static playSe(se: rm.types.AudioParameters): void;
	static updateSeParameters(buffer: rm.types.AudioParameters, se: rm.types.AudioParameters): void;
	static stopSe(): void;
	static playStaticSe(se: rm.types.AudioParameters): void;
	static loadStaticSe(se: rm.types.AudioParameters): void;
	static isStaticSe(se: rm.types.AudioParameters): boolean;
	static stopAll(): void;
	static saveBgm(): rm.types.AudioParameters;
	static saveBgs(): rm.types.AudioParameters;
	static makeEmptyAudioObject(): rm.types.AudioParameters;
	static createBuffer(): HTML5Audio;
	static updateBufferParameters(buffer: rm.types.AudioParameters, configVolume: number, audio: rm.types.AudioParameters): void;
	static audioFileExt(): string;
	static shouldUseHtml5Audio(): string;
	static checkErrors(): void;
	static checkWebAudioError(webAudio?: HTML5Audio): void;
	static playEncryptedBgm(bgm: rm.types.AudioParameters, pos?: number): void;
	static createDecryptBuffer(url: string, bgm: rm.types.AudioParameters, pos?: number): void;
}

declare namespace rm.types {
	/**
	 * A superclass of actor, class, skill, item, weapon, armor, enemy, and state.
	 *
	 * Some items are unnecessary depending on the type of data, but they are included for convenience sake.
	 */
	export type BaseItem = {
		/**
		 * The description text.
		 */
		description: string;
		/**
		 * The icon number.
		 */
		iconIndex: number;
		/**
		 * The item ID.
		 */
		id: number;
		meta: Object;
		/**
		 * The item name.
		 */
		name: string;
		note: string;
	}
}

declare namespace rm.types {
	export type BattleRewards = {
		exp: number;
		gold: number;
		items: rm.types.BaseItem[];
	}
}

declare namespace rm.types {
	export const enum BattleResult {
		base = -1,
	}
}

/**
 * Manages the game battles to process all of the
 * events that happen within.
 */
declare class BattleManager {
	protected constructor();
	_phase: string;
	_canEscape: boolean;
	_canLose: boolean;
	_battleTest: boolean;
	_eventCallback: () => void;
	_preemptive: boolean;
	_surprise: boolean;
	_actorIndex: number;
	_actionForceBattler: Game_Battler;
	_mapBgm: rm.types.AudioParameters;
	_mapBgs: rm.types.AudioParameters;
	_actionBattlers: Game_Battler[];
	_subject: Game_Battler;
	_action: Game_Action;
	_targets: Game_Battler[];
	_logWindow: Window_BattleLog;
	_statusWindow: Window_BattleStatus;
	_spriteset: Spriteset_Battle;
	_escapeRatio: number;
	_escaped: boolean;
	_rewards: rm.types.BattleRewards;
	static setup(troopId: number, canEscape: boolean, canLose: boolean): void;
	static initMembers(): void;
	static isBattleTest(): boolean;
	static setBattleTest(battleTest: boolean): void;
	static setEventCallback(callback: () => void): void;
	static setLogWindow(logWindow: Window_BattleLog): void;
	static setStatusWindow(statusWindow: Window_BattleStatus): void;
	static setSpriteset(spriteset: Spriteset_Battle): void;
	static onEncounter(): void;
	static ratePreemptive(): number;
	static rateSurprise(): number;
	static saveBgmAndBgs(): void;
	static playBattleBgm(): void;
	static playVictoryMe(): void;
	static playDefeatMe(): void;
	static replayBgmAndBgs(): void;
	static makeEscapeRatio(): void;
	static update(): void;
	static updateEvent(): boolean;
	static updateEventMain(): boolean;
	static isBusy(): boolean;
	static isInputting(): boolean;
	static isInTurn(): boolean;
	static isTurnEnd(): boolean;
	static isAborting(): boolean;
	static isBattleEnd(): boolean;
	static canEscape(): boolean;
	static canLose(): boolean;
	static isEscaped(): boolean;
	static actor(): Game_Actor;
	static clearActor(): void;
	static changeActor(newActorIndex: number, lastActorActionState: string): void;
	static startBattle(): void;
	static displayStartMessages(): void;
	static startInput(): void;
	static inputtingAction(): Game_Action;
	static selectNextCommand(): void;
	static selectPreviousCommand(): void;
	static refreshStatus(): void;
	static startTurn(): void;
	static updateTurn(): void;
	static processTurn(): void;
	static endTurn(): void;
	static updateTurnEnd(): void;
	static getNextSubject(): Game_Battler;
	static allBattleMembers(): Game_Battler[];
	static makeActionOrders(): void;
	static startAction(): void;
	static updateAction(): void;
	static endAction(): void;
	static invokeAction(): void;
	static invokeNormalAction(): void;
	static invokeCounterAttack(): void;
	static invokeMagicReflection(): void;
	static applySubstitute(target: Game_Battler): Game_Battler;
	static checkSubstitute(target: Game_Battler): boolean;
	static isActionForced(): boolean;
	static forceAction(battler: Game_Battler): void;
	static processForcedAction(): void;
	static abort(): void;
	static checkBattleEnd(): boolean;
	static checkAbort(): boolean;
	static processVictory(): void;
	static processEscape(): boolean;
	static processAbort(): void;
	static processDefeat(): void;
	static endBattle(result: rm.types.BattleResult): void;
	static updateBattleEnd(): void;
	static makeRewards(): void;
	static displayVictoryMessage(): void;
	static displayDefeatMessage(): void;
	static displayEscapeSuccessMessage(): void;
	static displayEscapeFailureMessage(): void;
	static displayRewards(): void;
	static displayExp(): void;
	static displayGold(): void;
	static displayDropItems(): void;
	static gainRewards(): void;
	static gainExp(): void;
	static gainGold(): void;
	static gainDropItems(): void;
}

declare namespace rm.types {
	export type TextState = {
		index: number;
		left: number;
		startX: number;
		text: string;
		x: number;
		y: number;
	}
}

declare namespace rm.types {

}

declare class Window_Base extends Window {
	/**
	 * Creates an instance of Window_Base.
	 * @param {number} x
	 * @param {number} y
	 * @param {number} width
	 * @param {number} height
	 * @memberof Window_Base
	 */
	constructor(x: number, y: number, width: number, height: number);
	/**
	 * Initializes the window.
	 *
	 * @memberof Window_Base
	 */
	initialize(x?: number, y?: number, width?: number, height?: number): void;
	/**
	 * Returns the standard line height of the current window;
	 * default is 36.
	 * @returns {number}
	 * @memberof Window_Base
	 */
	lineHeight(): number;
	/**
	 * Returns the standard font face of the
	 * game based on what language the game is in.
	 * @returns {String}
	 * @memberof Window_Base
	 */
	standardFontFace(): string;
	/**
	 * Returns the standard font size of the text
	 * in window; default is 28.
	 * @returns {number}
	 * @memberof Window_Base
	 */
	standardFontSize(): number;
	/**
	 * Returns the standard padding of the window;
	 * default is 18.
	 * @returns {number}
	 * @memberof Window_Base
	 */
	standardPadding(): number;
	/**
	 * Returns the text padding of the window;
	 * default is 6.
	 * @returns {number}
	 * @memberof Window_Base
	 */
	textPadding(): number;
	/**
	 * Returns the standard back opacity of the window; this is the
	 * opacity of the area behind the window's text content.
	 * Default is 192.
	 * @returns {number}
	 * @memberof Window_Base
	 */
	standardBackOpacity(): number;
	/**
	 * Loads the window skin from the img/system directory.
	 *
	 * @memberof Window_Base
	 */
	loadWindowSkin(): void;
	/**
	 * Updates the window padding based on the
	 * standardPadding method.
	 * @memberof Window_Base
	 */
	updatePadding(): void;
	/**
	 * Updates the back opacity of the window
	 * based on the standardBackOpacity method.
	 * @memberof Window_Base
	 */
	updateBackOpacity(): void;
	/**
	 * Returns the inner content width of the window.
	 *
	 * @returns {number}
	 * @memberof Window_Base
	 */
	contentsWidth(): number;
	/**
	 * Returns the inner content height of the window.
	 *
	 * @returns {number}
	 * @memberof Window_Base
	 */
	contentsHeight(): number;
	/**
	 * Returns the fitting height given a number of lines based on
	 * the line height plus standard padding of the window.
	 * Default formula: numLines * lineHeight + standardPadding * 2
	 *
	 * @param {number} numLines
	 * @returns {number}
	 * @memberof Window_Base
	 */
	fittingHeight(numLines: number): number;
	/**
	 * Updates the tone of the window based on the
	 * game system window tone defined in the database.
	 * @memberof Window_Base
	 */
	updateTone(): void;
	/**
	 * Creates the contents of the window; this is the area
	 * of the window which text is drawn to.
	 * @memberof Window_Base
	 */
	createContents(): void;
	/**
	 * Resets the font settings of the window back to the
	 * default.
	 * @memberof Window_Base
	 */
	resetFontSettings(): void;
	/**
	 * Resets the text color of the window back to the
	 * default.
	 * @memberof Window_Base
	 */
	resetTextColor(): void;
	/**
	 * The update method of the window; this is
	 * run every frame to do logic processing for the window.
	 * @memberof Window_Base
	 */
	update(): void;
	/**
	 * Updates the openness of the window when the
	 * _opening property is set to true.
	 * Openness is increased.
	 * @memberof Window_Base
	 */
	updateOpen(): void;
	/**
	 * Updates the openness of the window when the
	 * _closing property is set to true.
	 * Openness is decreased.
	 * @memberof Window_Base
	 */
	updateClose(): void;
	/**
	 * Opens the window.
	 *
	 * @memberof Window_Base
	 */
	open(): void;
	/**
	 * Closes the window.
	 *
	 * @memberof Window_Base
	 */
	close(): void;
	/**
	 * Returns true if the window is currently opening.
	 *
	 * @returns {boolean}
	 * @memberof Window_Base
	 */
	isOpening(): boolean;
	/**
	 * Returns true if the window is currently closing.
	 *
	 * @returns {boolean}
	 * @memberof Window_Base
	 */
	isClosing(): boolean;
	/**
	 * Shows the window, making it visible.
	 *
	 * @memberof Window_Base
	 */
	show(): void;
	/**
	 * Hides the window, making it invisible;
	 * the window is not closed when hidden.
	 *
	 * @memberof Window_Base
	 */
	hide(): void;
	/**
	 * Activates the window, allowing it to be processed
	 * and to update.
	 * @memberof Window_Base
	 */
	activate(): void;
	/**
	 * Deactives the window, preventing further processing.
	 *
	 * @memberof Window_Base
	 */
	deactivate(): void;
	/**
	 * Returns a text color given a numbered index
	 * as a css color String; this index maps
	 * directly to the img/system/window.png colors
	 * by default.
	 * @param {number} n
	 * @returns {*}
	 * @memberof Window_Base
	 */
	textColor(n: number): string;
	/**
	 * Returns the normal color as a css
	 * color String.
	 * @returns {String}
	 * @memberof Window_Base
	 */
	normalColor(): string;
	/**
	 * Returns the system color as a
	 * css color String.
	 * @returns {String}
	 * @memberof Window_Base
	 */
	systemColor(): string;
	/**
	 * Returns the crisis color as a
	 * css color String.
	 * @returns {String}
	 * @memberof Window_Base
	 */
	crisisColor(): string;
	/**
	 * Returns the death color as a
	 * css color String.
	 * @returns {String}
	 * @memberof Window_Base
	 */
	deathColor(): string;
	/**
	 * Returns the gauage back color as
	 * a css color String.
	 * @returns {String}
	 * @memberof Window_Base
	 */
	gaugeBackColor(): string;
	/**
	 * Returns the hp gauge color 1
	 * as a css color String.
	 * @returns {String}
	 * @memberof Window_Base
	 */
	hpGaugeColor1(): string;
	/**
	 * Returns the hp gauge color 2
	 * as a css color String.
	 * @returns {String}
	 * @memberof Window_Base
	 */
	hpGaugeColor2(): string;
	/**
	 * Returns the mp gauge color 1
	 * as a css color String.
	 * @returns {String}
	 * @memberof Window_Base
	 */
	mpGaugeColor1(): string;
	/**
	 * Returns the mp gauge color 2
	 * as a css color String.
	 * @returns {String}
	 * @memberof Window_Base
	 */
	mpGaugeColor2(): string;
	/**
	 * Returns the mp cost color as a
	 * css color String.
	 * @returns {String}
	 * @memberof Window_Base
	 */
	mpCostColor(): string;
	/**
	 * Returns the power up color as a
	 * css color String.
	 * @returns {String}
	 * @memberof Window_Base
	 */
	powerUpColor(): string;
	/**
	 * Returns the power down color as a
	 * css color String.
	 * @returns {String}
	 * @memberof Window_Base
	 */
	powerDownColor(): string;
	/**
	 * Returns the tp gauge color 1 as a
	 * css color String.
	 * @returns {String}
	 * @memberof Window_Base
	 */
	tpGaugeColor1(): string;
	/**
	 * Returns tp gauge color 2 as a
	 * css color String.
	 * @returns {String}
	 * @memberof Window_Base
	 */
	tpGaugeColor2(): string;
	/**
	 * Returns the tp cost color as a
	 * css color String.
	 * @returns {String}
	 * @memberof Window_Base
	 */
	tpCostColor(): string;
	/**
	 * Returns the pending color as a
	 * css color String.
	 * @returns {String}
	 * @memberof Window_Base
	 */
	pendingColor(): string;
	/**
	 * Returns the translucentOpacity for the window;
	 * The default is 160.
	 *
	 * @returns {number}
	 * @memberof Window_Base
	 */
	translucentOpacity(): number;
	/**
	 * Changes the text color property given a css color String.
	 *
	 * @param {String} color
	 * @memberof Window_Base
	 */
	changeTextColor(color: string): void;
	/**
	 * Changes the paintOpacity (the opacity of the text drawn to the window);
	 * if true the opacity is set to 255, otherwise the opacity is set to 160.
	 * @param {boolean} enabled
	 * @memberof Window_Base
	 */
	changePaintOpacity(enabled: boolean): void;
	/**
	 * Given text or a number, draws the content to the window's contents
	 * layer at the specified x and y coordinate within the max width.
	 * The text content can also be aligned with the align property.
	 * The possible alignments are: "left", "center", "right".
	 * @param {(String | number)} text
	 * @param {number} x
	 * @param {number} y
	 * @param {number} maxWidth
	 * @param {String} align
	 * @memberof Window_Base
	 */
	drawText(text: string | number, x: number, y: number, maxWidth: number, align: string): void;
	/**
	 * Calculates the width of a text String and
	 * returns a number.
	 * @param {String} text
	 * @returns {number}
	 * @memberof Window_Base
	 */
	textWidth(text: string): number;
	/**
	 * Draws text with text codes included; this will draw
	 * icons, increase text height, and more.
	 * @param text
	 * @param x
	 * @param y
	 * @param width
	 * @returns Int
	 * @memberof Window_Base
	 */
	drawTextEx(text: string, x: number, y: number): number;
	/**
	 * Converts the escape characters and returns the text content
	 * after processing the characters.
	 * @param {String} text
	 * @returns {String}
	 * @memberof Window_Base
	 */
	convertEscapeCharacters(text: string): string;
	/**
	 * Returns the actor name given an index;
	 * the index starts from 1.
	 * @param {number} actorIndex
	 * @returns {String}
	 * @memberof Window_Base
	 */
	actorName(actorIndex: number): string;
	/**
	 * Returns a party member name given an index;
	 * the index starts from 1.
	 * @param {number} partyMemberIndex
	 * @returns {String}
	 * @memberof Window_Base
	 */
	partyMemberName(partyMemberIndex: number): string;
	/**
	 * Process each character in the text when drawTextEx
	 * is used to draw text.
	 * @param {MV.TextState} textState
	 * @memberof Window_Base
	 */
	processCharacter(textState: rm.types.TextState): void;
	/**
	 * Processes the normal characters in the text
	 * when drawTextEx is used to draw text.
	 * Normal characters are letters and numbers.
	 * @param {MV.TextState} textState
	 * @memberof Window_Base
	 */
	processNormalCharacter(textState: rm.types.TextState): void;
	/**
	 * Processes new line when drawTextEx is used to draw text.
	 *
	 * @param {MV.TextState} textState
	 * @memberof Window_Base
	 */
	processNewLine(textState: rm.types.TextState): void;
	/**
	 * Processes new page when drawTexttEx is used to draw text.
	 *
	 * @param {MV.TextState} textState
	 * @memberof Window_Base
	 */
	processNewPage(textState: rm.types.TextState): void;
	obtainEscapeCode(textState: rm.types.TextState): string;
	/**
	 * Obtains the escape parameters from text codes in the text state
	 * when drawTextEx is used to draw text.
	 * @param {MV.TextState} textState
	 * @returns {(number | String)}
	 * @memberof Window_Base
	 */
	obtainEscapeParam(textState: string | rm.types.TextState): number | string;
	/**
	 * Processes escape characters when drawTextEx is used
	 * for drawing text.
	 * @param {String} code
	 * @param {MV.TextState} textState
	 * @memberof Window_Base
	 */
	processEscapeCharacter(code: string, textState: rm.types.TextState): void;
	/**
	 * Processes drawing an icon when drawTextEx is used for
	 * drawing text.
	 * @param {number} iconIndex
	 * @param {MV.TextState} textState
	 * @memberof Window_Base
	 */
	processDrawIcon(iconIndex: number, textState: rm.types.TextState): void;
	/**
	 * Makes the font bigger by a value of 12.
	 *
	 * @memberof Window_Base
	 */
	makeFontBigger(): void;
	/**
	 * Makes the font smaller by a value of 12.
	 *
	 * @memberof Window_Base
	 */
	makeFontSmaller(): void;
	/**
	 * Calculates the text height of the textState (when using drawTextEx);
	 * if all is set to true, all lines of text are calculated, otherwise
	 * only a single line is processed.
	 * @param {rm.TextState} textState
	 * @param {Bool} all
	 * @returns Int
	 * @memberof Window_Base
	 */
	calcTextHeight(textState: rm.types.TextState, all: boolean): number;
	/**
	 * Draws an icon given the specified iconIndex at the specified
	 * x and y coordinates. The Width and Height of the icon is based on the
	 * _iconWidth and _iconHeight properties.
	 * @param {number} iconIndex
	 * @param {number} x
	 * @param {number} y
	 * @memberof Window_Base
	 */
	drawIcon(iconIndex: number, x: number, y: number): void;
	drawFace(faceName: string, faceIndex: number, x: number, y: number, width: number, height: number): void;
	/**
	 * Draws a character (map sprites) at the specified x and y coordinate.
	 * CharacterName refers to character spritesheet, and characterIndex refers
	 * to the characterIndex on the spritesheet.
	 * @param {String} characterName
	 * @param {number} characterIndex
	 * @param {number} x
	 * @param {number} y
	 * @memberof Window_Base
	 */
	drawCharacter(characterName: string, characterIndex: number, x: number, y: number): void;
	/**
	 * Draws a gauge at the specified x and y coordinates within the given width.
	 * Color1 and Color2 represent the gradient as css color Strings of the gauge.
	 *
	 * @param {number} x
	 * @param {number} y
	 * @param {number} width
	 * @param {number} rate
	 * @param {String} color1
	 * @param {String} color2
	 * @memberof Window_Base
	 */
	drawGauge(x: number, y: number, width: number, rate: number, color1: string, color2: string): void;
	/**
	 * Returns the hp color as a css String.
	 *
	 * @param {Game_Actor} actor
	 * @returns {String}
	 * @memberof Window_Base
	 */
	hpColor(actor: Game_Actor): string;
	/**
	 * Returns the mp color as a css color String.
	 *
	 * @param {Game_Actor} actor
	 * @returns {String}
	 * @memberof Window_Base
	 */
	mpColor(actor: Game_Actor): string;
	/**
	 * Returns the tp color as a css color String.
	 *
	 * @param {Game_Actor} actor
	 * @returns {String}
	 * @memberof Window_Base
	 */
	tpColor(actor: Game_Actor): string;
	drawActorCharacter(actor: Game_Actor, x: number, y: number): void;
	/**
	 * Draws the actor face at the specified x and y coordinates within
	 * the given width.
	 * @param {Game_Actor} actor
	 * @param {number} x
	 * @param {number} y
	 * @param {number} width
	 * @param {number} height
	 * @memberof Window_Base
	 */
	drawActorFace(actor: Game_Actor, x: number, y: number, width: number, height: number): void;
	/**
	 * Draws the actor name at the specified x and y coordinates within
	 * the given width.
	 * @param {Game_Actor} actor
	 * @param {number} x
	 * @param {number} y
	 * @param {number} width
	 * @memberof Window_Base
	 */
	drawActorName(actor: Game_Actor, x: number, y: number, width: number): void;
	/**
	 * Draws the actor class at the specified x and y coordinates
	 * within the given width.
	 * @param {Game_Actor} actor
	 * @param {number} x
	 * @param {number} y
	 * @param {number} width
	 * @memberof Window_Base
	 */
	drawActorClass(actor: Game_Actor, x: number, y: number, width: number): void;
	/**
	 * Draws the actor nickname at the specified x and y coordinates
	 * within the given width.
	 * @param {Game_Actor} actor
	 * @param {Int} x
	 * @param {Int} y
	 * @param {Int} width
	 * @memberof Window_Base
	 */
	drawActorNickname(actor: Game_Actor, x: number, y: number, width: number): void;
	/**
	 * Draws the actor level at the specified x and y coordinates.
	 *
	 * @param {Game_Actor} actor
	 * @param {Int} x
	 * @param {Int} y
	 * @memberof Window_Base
	 */
	drawActorLevel(actor: Game_Actor, x: number, y: number): void;
	/**
	 * Draws the actor icons at the specified x and y coordinates
	 * within the given width.
	 * @param {Game_Actor} actor
	 * @param {number} x
	 * @param {number} y
	 * @param {number} width
	 * @memberof Window_Base
	 */
	drawActorIcons(actor: Game_Actor, x: number, y: number, width: number): void;
	/**
	 * Draws the current and max number at the specified x and y coordinate
	 * within the given width. Color1 represents the current number and color2
	 * represents the max number when the text is drawn.
	 * @param {number} current
	 * @param {number} max
	 * @param {number} x
	 * @param {number} y
	 * @param {number} width
	 * @param {String} color1
	 * @param {String} color2
	 * @memberof Window_Base
	 */
	drawCurrentAndMax(current: number, max: number, x: number, y: number, width: number, color1: string, color2: string): void;
	/**
	 * Draws the actor hp at the specified x and y coordinates within
	 * the given width.
	 * @param {Game_Actor} actor
	 * @param {number} x
	 * @param {number} y
	 * @param {number} width
	 * @memberof Window_Base
	 */
	drawActorHp(actor: Game_Actor, x: number, y: number, width: number): void;
	/**
	 * Draws the actor mp at the specified x and y coordinates within
	 * the given width.
	 * @param {Game_Actor} actor
	 * @param {number} x
	 * @param {number} y
	 * @param {number} width
	 * @memberof Window_Base
	 */
	drawActorMp(actor: Game_Actor, x: number, y: number, width: number): void;
	/**
	 * Draws the actor tp at the specified x and y coordinates within the
	 * given width.
	 * @param {Game_Actor} actor
	 * @param {number} x
	 * @param {number} y
	 * @param {number} width
	 * @memberof Window_Base
	 */
	drawActorTp(actor: Game_Actor, x: number, y: number, width: number): void;
	/**
	 * Draws a simple status for the game actor passed into the method at the
	 * specified x and y coordinates within the given width.
	 *
	 * @param {Game_Actor} actor
	 * @param {number} x
	 * @param {number} y
	 * @param {number} width
	 * @memberof Window_Base
	 */
	drawActorSimpleStatus(actor: Game_Actor, x: number, y: number, width: number): void;
	/**
	 * Draws the item name at the specified x and y coordinates within
	 * the given width.
	 * @param {RPG.BaseItem} item
	 * @param {number} x
	 * @param {number} y
	 * @param {number} width
	 * @memberof Window_Base
	 */
	drawItemName(item: rm.types.BaseItem, x: number, y: number, width: number): void;
	/**
	 * Draws the currency value given at the specified x and y coordinates within
	 * the width given. Useful if you want to write your own custom currency value.
	 * @param {number} value
	 * @param {String} unit
	 * @param {number} x
	 * @param {number} y
	 * @param {number} width
	 * @memberof Window_Base
	 */
	drawCurrencyValue(value: number, unit: string, x: number, y: number, width: number): void;
	/**
	 * Changes the text color based on the powerUpColor, powerDownColor
	 * and normal color. powerUpColor is any number greater than 0, powerDownColor
	 * is any color less than 0, otherwise normal color is returned.
	 * @param {number} change
	 * @memberof Window_Base
	 */
	paramchangeTextColor(change: number): rm.types.Color;
	/**
	 * Sets the background type of the window.
	 * 0 is 255 window opacity (standard).
	 * 1 is the window with background dimmer.
	 * Any other number changes the opacity
	 * to 0.
	 * @param {number} type
	 * @memberof Window_Base
	 */
	setBackgroundType(type: number): void;
	/**
	 * Shows the background dimmer sprite.
	 *
	 * @memberof Window_Base
	 */
	showBackgroundDimmer(): void;
	/**
	 * Hides the background dimmer sprite.
	 *
	 * @memberof Window_Base
	 */
	hideBackgroundDimmer(): void;
	/**
	 * Updates the background dimmer sprite opacity based on the openness
	 * of the window.
	 * @memberof Window_Base
	 */
	updateBackgroundDimmer(): void;
	/**
	 * Refreshes the bitmap attached to the dimmer sprite
	 * based on the window dimensions.
	 * @memberof Window_Base
	 */
	refreshDimmerBitmap(): void;
	/**
	 * Color 1 of the dimmer sprite bitmap.
	 * for the gradient.
	 * @returns {String}
	 * @memberof Window_Base
	 */
	dimColor1(): string;
	/**
	 * Color 2 of the dimmer sprite bitmap
	 * for the gradient.
	 * @returns {String}
	 * @memberof Window_Base
	 */
	dimColor2(): string;
	/**
	 * Returns the x coordinate of the mouse to
	 * a local window x coordinate.
	 * @param {number} x
	 * @returns {number}
	 * @memberof Window_Base
	 */
	canvasToLocalX(x: number): number;
	/**
	 * Returns the y coordinate of the mouse
	 * to a local window y coordinate.
	 * @param {number} y
	 * @returns {number}
	 * @memberof Window_Base
	 */
	canvasToLocalY(y: number): number;
	/**
	 * Reverses the face images of the
	 * game party members.
	 * @memberof Window_Base
	 */
	reserveFaceImages(): void;
	static _iconWidth: number;
	static _iconHeight: number;
	static _faceWidth: number;
	static _faceHeight: number;
}

declare namespace rm.types {
	export type ConfigData = {
		alwaysDash: boolean;
		bgmVolume: number;
		bgsVolume: number;
		commandRemember: boolean;
		meVolume: number;
		seVolume: number;
	}
}

/**
 * Manages the configuration of RPGMakerMZ Config Data.
 */
declare class ConfigManager {
	protected constructor();
	static load(): void;
	static save(): void;
	static makeData(): rm.types.ConfigData;
	static applyData(config: rm.types.ConfigData): void;
	static readFlag(config: rm.types.ConfigData, name: string): boolean;
	static readVolume(config: rm.types.ConfigData, name: string): number;
}

/**
 * Manages the game data: saving, loading, meta data,
 * and map information.
 */
declare class DataManager {
	protected constructor();
	static _globalId: string;
	static _lastAccessId: number;
	static _errorUrl: any;
	static _databaseFiles: JSON[];
	static loadDatabase(): void;
	static loadDataFile(name: string, src: string): void;
	static isDatabaseLoaded(): boolean;
	static loadMapData(mapId: number): void;
	static makeEmptyMap(): void;
	static isMapLoaded(): boolean;
	static onLoad(object: any): void;
	/**
	 * Extracts Meta Data. A Json Like Object
	 * @param data
	 */
	static extractMetaData(data: any): void;
	static checkError(): void;
	static isBattleTest(): boolean;
	static isEventTest(): boolean;
	/**
	 * Returns a Bool value given an item.
	 * Item being a database object representing a skill.
	 * @static
	 * @param {object} item
	 * @returns {Bool}
	 * @memberof DataManager
	 */
	static isSkill(item: rm.types.BaseItem): boolean;
	/**
	 * Returns a Bool value given an item.
	 * Item must be a database item to be true.
	 * @static
	 * @param {object} item
	 * @returns {Bool}
	 * @memberof DataManager
	 */
	static isItem(item: rm.types.BaseItem): boolean;
	/**
	 * Returns a Bool value given an item.
	 * Item must be a database weapon to be true.
	 * @static
	 * @param {object} item
	 * @returns {Bool}
	 * @memberof DataManager
	 */
	static isWeapon(item: rm.types.BaseItem): boolean;
	/**
	 * Returns a Bool value given an item.
	 * Item must be a database armor to be true.
	 * @static
	 * @param {object} item
	 * @returns {Bool}
	 * @memberof DataManager
	 */
	static isArmor(item: rm.types.BaseItem): boolean;
	static createGameObjects(): void;
	static setupNewGame(): void;
	static setupBattleTest(): void;
	static setupEventTest(): void;
	static loadGlobalInfo(): void;
	/**
	 * JSON like object
	 * @param info
	 */
	static saveGlobalInfo(info: any): void;
	/**
	 * Returns a Bool value given a savefileId.
	 * If the savefileId exists; the value will be true.
	 * @static
	 * @param {number} savefileId
	 * @returns {Bool}
	 * @memberof DataManager
	 */
	static isThisGameFile(savefileId: number): boolean;
	static isAnySavefileExists(): boolean;
	static latestSavefileId(): number;
	static loadAllSavefileImages(): void;
	/**
	 * JSON Like Object for save file images
	 */
	static loadSavefileImages(info: any): void;
	/**
	 * Returns the maximum number of save files
	 * allocated in the game.
	 * @static
	 * @returns {number}
	 * @memberof DataManager
	 */
	static maxSavefiles(): number;
	/**
	 * Saves the RPGMakerMV game given a savefileId.
	 * Returns true if successful.
	 * @static
	 * @param {number} savefileId
	 * @returns {Bool}
	 * @memberof DataManager
	 */
	static saveGame(savefileId: number): boolean;
	static loadGame(savefileId: number): boolean;
	/**
	 * Returns the last accessed save fileId upon
	 * saving or loading the game.
	 * @static
	 * @returns {number}
	 * @memberof DataManager
	 */
	static lastAccessedSavefileId(): number;
	static saveGameWithoutRescue(savefileId: number): boolean;
	static loadGameWithoutRescue(savefileId: number): boolean;
	static selectSavefileForNewGame(): void;
	/**
	 * Creates a new save file on the global
	 * save file information containing important
	 * data such as play time, characters, timestamp.
	 * @static
	 * @memberof DataManager
	 */
	static makeSavefileInfo(): void;
	/**
	 * Creates the save file contents when saving your game.
	 * Good for aliasing when you want to add more data
	 * to the game's save contents.
	 * @static
	 * @returns {object}
	 * @memberof DataManager
	 */
	static makeSaveContents(): any;
	/**
	 * Extracts the save file contents into the game's
	 * variables. An excellent method to alias when you
	 * wish to extend the game's save contents for a plugin.
	 * @static
	 * @param {object} contents
	 * @memberof DataManager
	 */
	static extractSaveContents(contents: any): void;
}

/**
 * Static class that manages images. Loading the images
 * and create bitmap objects.
 */
declare class ImageManager {
	protected constructor();
	static cache: CacheMap;
	static loadFace(filename: string, hue?: number): Bitmap;
	/**
	 * Loads a Bitmap object from the 'img/parallaxes/' folder
	 * and returns it.
	 * @param {string} filename
	 * @param {number} [hue]
	 * @returns {Bitmap}
	 * @memberof ImageManagerStatic
	 */
	static loadParallax(filename: string, hue?: number): Bitmap;
	/**
	 * Loads a Bitmap object from the 'img/pictures/' folder
	 * and returns it.
	 * @param {string} filename
	 * @param {number} [hue]
	 * @returns {Bitmap}
	 * @memberof ImageManagerStatic
	 */
	static loadPicture(filename: string, hue?: number): Bitmap;
	/**
	 * Loads a Bitmap object from the 'img/animations/' folder
	 * and returns it.
	 * @param {string} filename
	 * @param {number} [hue]
	 * @returns {Bitmap}
	 * @memberof ImageManagerStatic
	 */
	static loadAnimation(filename: string, hue?: number): Bitmap;
	/**
	 * Loads a Bitmap object from the 'img/battlebacks1/' folder
	 *  and returns it.
	 * @param {string} filename
	 * @param {number} [hue]
	 * @returns {Bitmap}
	 * @memberof ImageManagerStatic
	 */
	static loadBattleback1(filename: string, hue?: number): Bitmap;
	/**
	 * Loads a Bitmap object from the 'img/battlebacks2/' folder
	 * and returns it.
	 * @param {string} filename
	 * @param {number} [hue]
	 * @returns {Bitmap}
	 * @memberof ImageManagerStatic
	 */
	static loadBattleback2(filename: string, hue?: number): Bitmap;
	/**
	 * Loads a Bitmap object from the 'img/enemies/' folder
	 * and returns it.
	 * @param {string} filename
	 * @param {number} [hue]
	 * @returns {Bitmap}
	 * @memberof ImageManagerStatic
	 */
	static loadEnemy(filename: string, hue?: number): Bitmap;
	/**
	 * Loads a Bitmap object from the 'img/characters/' folder
	 * and returns it.
	 * @param {string} filename
	 * @param {number} [hue]
	 * @returns {Bitmap}
	 * @memberof ImageManagerStatic
	 */
	static loadCharacter(filename: string, hue?: number): Bitmap;
	static loadSvActor(filename: string, hue?: number): Bitmap;
	/**
	 * Loads a Bitmap object from the 'img/sv_enemies/' folder
	 * and returns it.
	 * @param {string} filename
	 * @param {number} [hue]
	 * @returns {Bitmap}
	 * @memberof ImageManagerStatic
	 */
	static loadSvEnemy(filename: string, hue?: number): Bitmap;
	/**
	 * Loads a Bitmap object from 'img/system/' folder
	 * and returns it.
	 * @param {string} filename
	 * @param {number} [hue]
	 * @returns {Bitmap}
	 * @memberof ImageManagerStatic
	 */
	static loadSystem(filename: string, hue?: number): Bitmap;
	/**
	 * Loads a Bitmap object from the 'img/tilesets/' folder
	 * and returns it.
	 * @param {string} filename
	 * @param {number} [hue]
	 * @returns {Bitmap}
	 * @memberof ImageManagerStatic
	 */
	static loadTileset(filename: string, hue?: number): Bitmap;
	/**
	 * Loads a Bitmap object from the 'img/titles1/' folder
	 * and returns it.
	 * @param {string} filename
	 * @param {number} [hue]
	 * @returns {Bitmap}
	 * @memberof ImageManagerStatic
	 */
	static loadTitle1(filename: string, hue?: number): Bitmap;
	/**
	 * Loads a Bitmap object from the 'img/titles2/' folder
	 * and returns it.
	 * @param {string} filename
	 * @param {number} [hue]
	 * @returns {Bitmap}
	 * @memberof ImageManagerStatic
	 */
	static loadTitle2(filename: string, hue?: number): Bitmap;
	/**
	 * Loads a Bitmap object from any folder and returns it.
	 *
	 * @param {string} folder
	 * @param {string} filename
	 * @param {number} hue
	 * @param {boolean} smooth
	 * @returns {Bitmap}
	 * @memberof ImageManagerStatic
	 */
	static loadBitmap(folder: string, filename: string, hue: number, smooth: boolean): Bitmap;
	/**
	 * Loads an empty Bitmap object and returns it.
	 *
	 * @param {string} path
	 * @param {number} hue
	 * @returns {Bitmap}
	 * @memberof ImageManagerStatic
	 */
	static loadEmptyBitmap(path: string, hue: number): Bitmap;
	/**
	 * Loads a Bitmap object given a path
	 * and returns it.
	 * @param {string} path
	 * @param {number} hue
	 * @returns {Bitmap}
	 * @memberof ImageManagerStatic
	 */
	static loadNormalBitmap(path: string, hue: number): Bitmap;
	/**
	 * Clears the image cache in RPGMakerMV.
	 *
	 * @memberof ImageManagerStatic
	 */
	static clear(): void;
	/**
	 * Returns true if the image cache
	 * is ready.
	 * @returns {boolean}
	 * @memberof ImageManagerStatic
	 */
	static isReady(): boolean;
	/**
	 * Returns true if the given filename
	 * is an object character. Must contain
	 * a  '!' in the file name to be an
	 * object character.
	 * @param {string} filename
	 * @returns {boolean}
	 * @memberof ImageManagerStatic
	 */
	static isObjectCharacter(filename: string): boolean;
	/**
	 * Returns true if the given filename is
	 * a large character. Must contain a '$'
	 * in the file name to be a large character.
	 * @param {string} filename
	 * @returns {boolean}
	 * @memberof ImageManagerStatic
	 */
	static isBigCharacter(filename: string): boolean;
	static isZeroParallax(filename: string): boolean;
}

declare namespace rm.types {
	/**
	 * Plugin Settings for RPGMakerMV/MZ
	 */
	export type PluginSettings = {
		/**
		 * Plugin Description
		 */
		description: string;
		/**
		 * Plugin Name
		 */
		name: string;
		/**
		 * Plugin Parameters in a map/dictionary like syntax.
		 * Example:
		 * ```js
		 * parameters["TextSpeed"]
		 * ```
		 */
		parameters: { [key: string]: any };
		/**
		 * Plugin Status On/Off
		 */
		status: string;
	}
}

/**
 * Static class that manages plugins
 */
declare class PluginManager {
	protected constructor();
	static _path: string;
	static _scripts: string[];
	static _errorUrls: string[];
	static setup(plugins: rm.types.PluginSettings[]): void;
	static checkErrors(): void;
	/**
	 * Returns all of the plugin parameters for an RPGMakerMZ
	 * plugin in a JSON Like String Format.
	 * Should typedef this for ease of parsing.
	 * @param name
	 * @return Any
	 */
	static parameters(name: string): any;
	/**
	 * Uses internally by the Plugin Manager to load
	 * the plugin scripts.
	 * @param name
	 */
	static loadScript(name: string): void;
	static onError(e: Event): void;
	/**
	 * Regsters a new plugin command in MZ using a lambda expression
	 * The Variable of the lambda should be transformed into the appropriate
	 * typed def struct for your use case for your command.
	 * Example Syntax For Commented Parameters
	 *
	 *```js
	 * //Should be in comment
	 * @command PluginCommandFunctionName
	 * @text My Plugin Command
	 * @desc Plugin Command Description Text
	 * @arg Actors
	 * @text Which Actors?
	 * @type actor[]
	 * @desc Select which Actor ID(s) to affect.
	 * @default ["1"]
	 * @arg State
	 * @text State
	 * @type state
	 * @desc Which State to apply?
	 * @default 1
	 * PluginManager.registerCommand("TestPlugin", "PluginCommandFunctionName", args => {
	 * // Get Arguments
	 * const actorIds = JSON.parse(args.Actors);
	 * const stateId = args.State;
	 * // Use the arguments
	 * for (const actorId of actorIds) {
	 * const actor = $gameParty.members().find(member => member.actorId() === Number(actorId));
	 * if (actor) {
	 * actor.addState(stateId);
	 * }
	 * }
	 * });
	 * ```
	 * @param pluginName
	 * @param commandName
	 * @param lambda
	 */
	static registerCommand(pluginName: string, commandName: string, lambda: (arg0: any) => void): void;
}

/**
 * Manages the scenes of the game.
 */
declare class SceneManager {
	protected constructor();
	static _scene: Scene_Base;
	static _nextScene: Scene_Base;
	static _stack: any[];
	static _screenWidth: number;
	static _screenHeight: number;
	static _backgroundBitmap: Bitmap;
	static _boxWidth: number;
	static _boxHeight: number;
	static _deltaTime: number;
	static _currentTime: number;
	static _accumulator: number;
	/**
	 * Convenience variable for getting the current scene.
	 */
	static _scene: any;
	static preferableRendererType(): string;
	static shouldUseCanvasRenderer(): boolean;
	static initialize(): void;
	static initGraphics(): void;
	static initAudio(): void;
	static initInput(): void;
	static initNwjs(): void;
	static update(): void;
	static terminate(): void;
	static tickStart(): void;
	static tickEnd(): void;
	static changeScene(): void;
	static updateScene(): void;
	static renderScene(): void;
	static onSceneCreate(): void;
	static onSceneStart(): void;
	static onSceneLoading(): void;
	static onError(e: Event): void;
	static onKeyDown(event: KeyboardEvent): void;
	static catchException(e: Event): void;
	static isSceneChanging(): boolean;
	static isCurrentSceneBusy(): boolean;
	static isCurrentSceneStarted(): boolean;
	static isNextScene(sceneClass: any): boolean;
	static isPreviousScene(sceneClass: any): boolean;
	/**
	 * Goes to the scene passed in.
	 * @param sceneClass
	 */
	static goto(sceneClass: any): void;
	/**
	 * Pushes the scene passed in to the scene stack.
	 * Immediately goes to the scene passed in.
	 * @param sceneClass
	 */
	static push(sceneClass: any): void;
	/**
	 * Pops the current scene from the stack.
	 */
	static pop(): void;
	/**
	 * Exits the current scene.
	 */
	static exit(): void;
	static clearStack(): void;
	/**
	 * Stops the current scene.
	 */
	static stop(): void;
	static prepareNextScene(): void;
	static snap(): Bitmap;
	static snapForBackground(): void;
	static backgroundBitmap(): Bitmap;
	static updateManagers(ticks: number, delta: number): void;
}

/**
 * Static class that plays sound effects defined in the database.
 */
declare class SoundManager {
	protected constructor();
	static preloadImportantSounds(): void;
	static loadSystemSound(databaseNumber: number): void;
	static playSystemSound(databaseNumber: number): void;
	static playCursor(): void;
	static playOk(): void;
	static playCancel(): void;
	static playBuzzer(): void;
	static playEquip(): void;
	static playSave(): void;
	static playLoad(): void;
	static playBattleStart(): void;
	static playEscape(): void;
	static playEnemyAttack(): void;
	static playEnemyDamage(): void;
	static playEnemyCollapse(): void;
	static playBossCollapse1(): void;
	static playBossCollapse2(): void;
	static playActorDamage(): void;
	static playActorCollapse(): void;
	static playRecovery(): void;
	static playMiss(): void;
	static playEvasion(): void;
	static playMagicEvasion(): void;
	static playReflection(): void;
	static playShop(): void;
	static playUseItem(): void;
	static playUseSkill(): void;
}

/**
 * The static class that manages storage of save game data.
 */
declare class StorageManager {
	protected constructor();
	static save(savefileId: number, json: string): void;
	static load(savefileId: number): string;
	static exists(savefileId: number): boolean;
	static remove(savefileId: number): void;
	static backup(savefileId: number): void;
	static backupExists(savefileId: number): boolean;
	static cleanBackup(savefileId: number): boolean;
	static restoreBackup(savefileId: number): void;
	static isLocalMode(): boolean;
	static saveToLocalFile(savefileId: number, json: string): void;
	static loadFromLocalFile(savefileId: number): string;
	static loadFromLocalBackupFile(savefileId: number): string;
	static localFileBackupExists(savefileId: number): boolean;
	static localFileExists(savefileId: number): boolean;
	static removeLocalFile(savefileId: number): void;
	static saveToWebStorage(savefileId: number, json: string): void;
	static loadFromWebStorage(savefileId: number): string;
	static loadFromWebStorageBackup(savefileId: number): string;
	static webStorageBackupExists(savefileId: number): boolean;
	static webStorageExists(savefileId: number): boolean;
	static removeWebStorage(savefileId: number): void;
	static localFileDirectoryPath(): string;
	static localFilePath(savefileId: number): string;
	static webStorageKey(savefileId: number): string;
}

/**
 * The static class that handles terms and messages.
 * This is linked to the terms and information
 * contained within the editor.
 */
declare class TextManager {
	protected constructor();
	static currencyUnit: string;
	static level: string;
	static levelA: string;
	static hp: string;
	static hpA: string;
	static mp: string;
	static mpA: string;
	static tp: string;
	static tpA: string;
	static exp: string;
	static expA: string;
	static fight: string;
	static escape: string;
	static attack: string;
	static guard: string;
	static item: string;
	static skill: string;
	static equip: string;
	static status: string;
	static formation: string;
	static save: string;
	static gameEnd: string;
	static options: string;
	static weapon: string;
	static armor: string;
	static keyItem: string;
	static equip2: string;
	static optimize: string;
	static clear: string;
	static newGame: string;
	static continue_: string;
	static toTitle: string;
	static cancel: string;
	static buy: string;
	static sell: string;
	static alwaysDash: string;
	static commandRemember: string;
	static bgmVolume: string;
	static bgsVolume: string;
	static meVolume: string;
	static seVolume: string;
	static possession: string;
	static expTotal: string;
	static expNext: string;
	static saveMessage: string;
	static loadMessage: string;
	static file: string;
	static partyName: string;
	static emerge: string;
	static preemptive: string;
	static surprise: string;
	static escapeStart: string;
	static escapeFailure: string;
	static victory: string;
	static defeat: string;
	static obtainExp: string;
	static obtainGold: string;
	static obtainItem: string;
	static levelUp: string;
	static obtainSkill: string;
	static useItem: string;
	static criticalToEnemy: string;
	static criticalToActor: string;
	static actorDamage: string;
	static actorRecovery: string;
	static actorGain: string;
	static actorLoss: string;
	static actorDrain: string;
	static actorNoDamage: string;
	static actorNoHit: string;
	static enemyDamage: string;
	static enemyRecovery: string;
	static enemyGain: string;
	static enemyLoss: string;
	static enemyDrain: string;
	static enemyNoDamage: string;
	static enemyNoHit: string;
	static evasion: string;
	static magicEvasion: string;
	static magicReflection: string;
	static counterAttack: string;
	static substitute: string;
	static buffAdd: string;
	static debuffAdd: string;
	static buffRemove: string;
	static actionFailure: string;
	static basic(basicId: number): string;
	static param(paramId: number): string;
	static command(commandId: number): string;
	static message(messageId: string): string;
	static getter(method: string, param: number): string;
}

declare namespace rm.types {
	/**
	 * The data class for enemy [Actions].
	 */
	export type EnemyAction = {
		/**
		 * The first parameter of the condition.
		 */
		conditionParam1: number;
		/**
		 * The second parameter of the condition.
		 */
		conditionParam2: number;
		/**
		 * The type of condition.
		 *
		 * 0: Always
		 * 1: Turn No.
		 * 2: HP
		 * 3: MP
		 * 4: State
		 * 5: Party Level
		 * 6: Switch
		 */
		conditionType: number;
		/**
		 * The action's priority rating (1..10).
		 */
		rating: number;
		/**
		 * The ID of skills to be employed as actions.
		 */
		skillId: number;
	}
}

declare namespace rm.types {
	/**
	 * The data class for damage.
	 */
	export type Damage = {
		/**
		 * Critical hit (true/false).
		 */
		critical: boolean;
		/**
		 * The element ID.
		 */
		elementId: number;
		/**
		 * The formula.
		 */
		formula: string;
		/**
		 * The type of damage.
		 *
		 * 0: None
		 * 1: HP damage
		 * 2: MP damage
		 * 3: HP recovery
		 * 4: MP recovery
		 * 5: HP drain
		 * 6: MP drain
		 */
		type: number;
		/**
		 * The degree of variability.
		 */
		variance: number;
	}
}

declare namespace rm.types {
	/**
	 * The data class for use effects.
	 */
	export type Effect = {
		/**
		 * The use effect code.
		 */
		code: number;
		/**
		 * The ID of data (state, parameter, and so on) according to the type of use effect.
		 */
		dataId: number;
		/**
		 * Value 1 set according to the type of use effect.
		 */
		value1: number;
		/**
		 * Value 2 set according to the type of use effect.
		 */
		value2: number;
	}
}

declare namespace rm.types {
	export type UsableItem = {
		/**
		 * The animation ID.
		 */
		animationId: number;
		/**
		 * Damage (RPG.Damage).
		 */
		damage: rm.types.Damage;
		/**
		 * The description text.
		 */
		description: string;
		/**
		 * A list of use effects. An RPG.Effect array.
		 */
		effects: rm.types.Effect[];
		/**
		 * The type of hit.
		 *
		 * 0: Certain hit
		 * 1: Physical attack
		 * 2: Magical attack
		 */
		hitType: number;
		/**
		 * The icon number.
		 */
		iconIndex: number;
		/**
		 * The item ID.
		 */
		id: number;
		meta: Object;
		/**
		 * The item name.
		 */
		name: string;
		note: string;
		/**
		 * When the item/skill may be used.
		 *
		 * 0: Always
		 * 1: Only in battle
		 * 2: Only from the menu
		 * 3: Never
		 */
		occasion: number;
		/**
		 * The number of repeats.
		 */
		repeats: number;
		/**
		 * The scope of effects.
		 *
		 * 0: None
		 * 1: One Enemy
		 * 2: All Enemies
		 * 3: One Random Enemy
		 * 4: Two Random Enemies
		 * 5: Three Random Enemies
		 * 6: Four Random Enemies
		 * 7: One Ally
		 * 8: All Allies
		 * 9: One Ally (Dead)
		 * 10: All Allies (Dead)
		 * 11: The User
		 */
		scope: number;
		/**
		 * The speed correction.
		 */
		speed: number;
		/**
		 * The success rate.
		 */
		successRate: number;
		/**
		 * The number of TP gained.
		 */
		tpGain: number;
	}
}

/**
 * Game_Action
 * The game object class representing a battle action.
 * @class Game_Action
 */
declare class Game_Action {
	constructor(subject: Game_Battler, forcing: boolean);
	_subjectActorId: number;
	_subjectEnemyIndex: number;
	_targetIndex: number;
	_forcing: boolean;
	_item: Game_Item;
	clear(): void;
	setSubject(subject: Game_Battler): void;
	subject(): Game_Battler;
	friendsUnit(): Game_Unit;
	opponentsUnit(): Game_Unit;
	setEnemyAction(action: rm.types.EnemyAction): void;
	setAttack(): void;
	setGuard(): void;
	setSkill(skillId: number): void;
	setItem(itemId: number): void;
	setItemObject(object: rm.types.UsableItem): void;
	setTarget(targetIndex: number): void;
	item(): rm.types.UsableItem;
	isSkill(): boolean;
	isItem(): boolean;
	numRepeats(): number;
	checkItemScope(list: number[]): boolean;
	isForOpponent(): boolean;
	isForFriend(): boolean;
	isForDeadFriend(): boolean;
	isForUser(): boolean;
	isForOne(): boolean;
	isForRandom(): boolean;
	isForAll(): boolean;
	needsSelection(): number;
	numTargets(): number;
	checkDamageType(list: number[]): boolean;
	isHpEffect(): boolean;
	isMpEffect(): boolean;
	isDamage(): boolean;
	isRecover(): boolean;
	isDrain(): boolean;
	isHpRecover(): boolean;
	isMpRecover(): boolean;
	isCertainHit(): boolean;
	isPhysical(): boolean;
	isMagical(): boolean;
	isAttack(): boolean;
	isGuard(): boolean;
	isMagicSkill(): boolean;
	decideRandomTarget(): void;
	setConfusion(): void;
	prepare(): void;
	isValid(): boolean;
	speed(): number;
	makeTargets(): Game_Battler[];
	repeatTargets(targets: Game_Battler[]): Game_Battler[];
	confusionTarget(): Game_Battler;
	targetsForOpponents(): Game_Battler[];
	targetsForFriends(): Game_Battler[];
	evaluate(): number;
	itemTargetCandidates(): Game_Battler[];
	evaluateWithTarget(target: Game_Battler): number;
	testApply(target: Game_Battler): boolean;
	hasItemAnyValidEffects(target: Game_Battler): boolean;
	testItemEffect(target: Game_Battler, effect: rm.types.Effect): boolean;
	itemCnt(target: Game_Battler): number;
	itemMrf(target: Game_Battler): number;
	itemHit(target: Game_Battler): number;
	itemEva(target: Game_Battler): number;
	itemCri(target: Game_Battler): number;
	apply(target: Game_Battler): void;
	makeDamageValue(target: Game_Battler, critical: boolean): number;
	evalDamageFormula(target: Game_Battler): number;
	calcElementRate(target: Game_Battler): number;
	elementsMaxRate(target: Game_Battler, elements: number[]): number;
	applyCritical(damage: number): number;
	applyVariance(damage: number, variance: number): number;
	applyGuard(damage: number, target: Game_Battler): number;
	executeDamage(target: Game_Battler, value: number): void;
	executeHpDamage(target: Game_Battler, value: number): void;
	executeMpDamage(target: Game_Battler, value: number): void;
	gainDrainedHp(value: number): void;
	gainDrainedMp(value: number): void;
	applyItemEffect(target: Game_Battler, effect: rm.types.Effect): void;
	itemEffectRecoverHp(target: Game_Battler, effect: rm.types.Effect): void;
	itemEffectRecoverMp(target: Game_Battler, effect: rm.types.Effect): void;
	itemEffectGainTp(target: Game_Battler, effect: rm.types.Effect): void;
	itemEffectAddState(target: Game_Battler, effect: rm.types.Effect): void;
	itemEffectAddAttackState(target: Game_Battler, effect: rm.types.Effect): void;
	itemEffectAddNormalState(target: Game_Battler, effect: rm.types.Effect): void;
	itemEffectRemoveState(target: Game_Battler, effect: rm.types.Effect): void;
	itemEffectAddBuff(target: Game_Battler, effect: rm.types.Effect): void;
	itemEffectAddDebuff(target: Game_Battler, effect: rm.types.Effect): void;
	itemEffectRemoveBuff(target: Game_Battler, effect: rm.types.Effect): void;
	itemEffectRemoveDebuff(target: Game_Battler, effect: rm.types.Effect): void;
	itemEffectSpecial(target: Game_Battler, effect: rm.types.Effect): void;
	itemEffectGrow(target: Game_Battler, effect: rm.types.Effect): void;
	itemEffectLearnSkill(target: Game_Battler, effect: rm.types.Effect): void;
	itemEffectCommonEvent(target: Game_Battler, effect: rm.types.Effect): void;
	makeSuccess(target: Game_Battler): void;
	applyItemUserEffect(target: Game_Battler): void;
	lukEffectRate(target: Game_Battler): number;
	applyGlobal(): void;
	static EFFECT_RECOVER_HP: number;
	static EFFECT_RECOVER_MP: number;
	static EFFECT_GAIN_TP: number;
	static EFFECT_ADD_STATE: number;
	static EFFECT_REMOVE_STATE: number;
	static EFFECT_ADD_BUFF: number;
	static EFFECT_ADD_DEBUFF: number;
	static EFFECT_REMOVE_BUFF: number;
	static EFFECT_REMOVE_DEBUFF: number;
	static EFFECT_SPECIAL: number;
	static EFFECT_GROW: number;
	static EFFECT_LEARN_SKILL: number;
	static EFFECT_COMMON_EVENT: number;
	static SPECIAL_EFFECT_ESCAPE: number;
	static HITTYPE_CERTAIN: number;
	static HITTYPE_PHYSICAL: number;
	static HITTYPE_MAGICAL: number;
}

declare namespace haxe.display {

}

declare namespace haxe.display {

}

declare namespace rm.types {
	export type Trait = {
		/**
		 * The trait code.
		 */
		code: number;
		/**
		 * The ID of the data (such as elements or states) according to the type of the trait.
		 */
		dataId: number;
		/**
		 * The map tree expansion flag, which is used internally.
		 */
		expanded: boolean;
		/**
		 * The x-axis scroll position, which is used internally.
		 */
		scrollX: number;
		/**
		 * The y-axis scroll position, which is used internally.
		 */
		scrollY: number;
		/**
		 * The value set according to the type of the trait.
		 */
		value: number;
	}
}

declare namespace rm.types {
	/**
	 * The data class for state.
	 */
	export type State = {
		/**
		 * The timing of automatic state removal.
		 *
		 * 0: None
		 * 1: At end of action
		 * 2: At end of turn
		 */
		autoRemovalTiming: number;
		/**
		 * Chance of state being removed by damage (%).
		 */
		chanceByDamage: number;
		description: string;
		doc: string;
		/**
		 * The icon number.
		 */
		iconIndex: number;
		/**
		 * The ID.
		 */
		id: number;
		internal: boolean;
		links: string[];
		/**
		 * The maximum turns of the duration.
		 */
		maxTurns: number;
		/**
		 * The message when an actor fell in the state.
		 */
		message1: string;
		/**
		 * The message when an enemy fell in the state.
		 */
		message2: string;
		/**
		 * The message when the state remains.
		 */
		message3: string;
		/**
		 * The message when the state is removed.
		 */
		message4: number;
		/**
		 * The minimum turns of the duration.
		 */
		minTurns: number;
		/**
		 * The side-view motion.
		 */
		motion: number;
		/**
		 * The name.
		 */
		name: string;
		/**
		 * The side-view overlay.
		 */
		overlay: number;
		parameters: string[];
		platforms: haxe.display.Platform[];
		/**
		 * The state priority (0..100).
		 */
		priority: number;
		releaseByDamage: boolean;
		/**
		 * Removes state at end of battle (true/false).
		 */
		removeAtBattleEnd: boolean;
		/**
		 * Removes state by damage (true/false).
		 */
		removeByDamage: boolean;
		/**
		 * Removes state by action restriction (true/false).
		 */
		removeByRestriction: boolean;
		/**
		 * Removes state by walking (true/false).
		 */
		removeByWalking: boolean;
		/**
		 * Action restrictions.
		 *
		 * 0: None
		 * 1: Attack enemy
		 * 2: Attack enemy or ally
		 * 3: Attack ally
		 * 4: Cannot act
		 */
		restriction: number;
		/**
		 * Number of steps until state is removed.
		 */
		stepToRemove: number;
		targets: haxe.display.MetadataTarget[];
		/**
		 * The array of Trait data.
		 */
		traits: rm.types.Trait[];
	}
}

/**
 * -----------------------------------------------------------------------------
 * Game_ActionResult
 *
 * The game object declare class for a result of a battle action. For convinience, all
 * member variables in this declare class are public.
 * @class Game_ActionResult
 */
declare class Game_ActionResult {
	constructor();
	used: boolean;
	missed: boolean;
	evaded: boolean;
	physical: boolean;
	drain: boolean;
	critical: boolean;
	success: boolean;
	hpAffected: boolean;
	hpDamage: number;
	mpDamage: number;
	tpDamage: number;
	addedStates: number[];
	removedStates: number[];
	addedBuffs: number[];
	addedDebuffs: number[];
	removedBuffs: number[];
	initialize(): void;
	/**
	 * Clears the game action result.
	 *
	 * @memberof Game_ActionResult
	 */
	clear(): void;
	/**
	 * Returns the added states from the action result.
	 *
	 * @returns {Array<RPG.State>}
	 * @memberof Game_ActionResult
	 */
	addedStateObjects(): rm.types.State[];
	/**
	 * Returns the removes states from the result.
	 *
	 * @returns {Array<RPG.State>}
	 * @memberof Game_ActionResult
	 */
	removedStateObjects(): rm.types.State[];
	isStatusAffected(): boolean;
	/**
	 * Returns true if the action result is a hit.
	 *
	 * @returns {Bool}
	 * @memberof Game_ActionResult
	 */
	isHit(): boolean;
	isStateAdded(stateId: number): boolean;
	pushAddedState(stateId: number): void;
	isStateRemoved(stateId: number): boolean;
	pushRemovedState(stateId: number): void;
	/**
	 * Returns true if the a buff is added to the specified param
	 * from the action result.
	 * @param {number} paramId
	 * @returns {Bool}
	 * @memberof Game_ActionResult
	 */
	isBuffAdded(paramId: number): boolean;
	pushAddedBuff(paramId: number): void;
	isDebuffAdded(paramId: number): boolean;
	pushAddedDebuff(paramId: number): void;
	isBuffRemoved(paramId: number): boolean;
	pushRemovedBuff(paramId: number): void;
}

declare namespace rm.types {
	/**
	 * The data class for skills.
	 */
	export type Skill = {
		/**
		 * The animation ID.
		 */
		animationId: number;
		/**
		 * Damage (RPG.Damage).
		 */
		damage: rm.types.Damage;
		/**
		 * The description text.
		 */
		description: string;
		/**
		 * A list of use effects. An RPG.Effect array.
		 */
		effects: rm.types.Effect[];
		/**
		 * The type of hit.
		 *
		 * 0: Certain hit
		 * 1: Physical attack
		 * 2: Magical attack
		 */
		hitType: number;
		/**
		 * The icon number.
		 */
		iconIndex: number;
		/**
		 * The item ID.
		 */
		id: number;
		/**
		 * The use message.
		 */
		message1: string;
		/**
		 * The use message.
		 */
		message2: string;
		meta: Object;
		/**
		 * Number of MP consumed.
		 */
		mpCost: number;
		/**
		 * The item name.
		 */
		name: string;
		note: string;
		/**
		 * When the item/skill may be used.
		 *
		 * 0: Always
		 * 1: Only in battle
		 * 2: Only from the menu
		 * 3: Never
		 */
		occasion: number;
		/**
		 * The number of repeats.
		 */
		repeats: number;
		/**
		 * Weapon type required.
		 */
		requiredWtypeId1: number;
		/**
		 * Weapon type required.
		 */
		requiredWtypeId2: number;
		/**
		 * The scope of effects.
		 *
		 * 0: None
		 * 1: One Enemy
		 * 2: All Enemies
		 * 3: One Random Enemy
		 * 4: Two Random Enemies
		 * 5: Three Random Enemies
		 * 6: Four Random Enemies
		 * 7: One Ally
		 * 8: All Allies
		 * 9: One Ally (Dead)
		 * 10: All Allies (Dead)
		 * 11: The User
		 */
		scope: number;
		/**
		 * The speed correction.
		 */
		speed: number;
		/**
		 * Skill type ID.
		 */
		stypeId: number;
		/**
		 * The success rate.
		 */
		successRate: number;
		/**
		 * Number of TP consumed
		 */
		tpCost: number;
		/**
		 * The number of TP gained.
		 */
		tpGain: number;
	}
}

declare namespace rm.types {
	/**
	 * The data class for items.
	 */
	export type Item = {
		/**
		 * The animation ID.
		 */
		animationId: number;
		/**
		 * The truth value indicating whether the item disappears when used.
		 */
		consumable: boolean;
		/**
		 * Damage (RPG.Damage).
		 */
		damage: rm.types.Damage;
		/**
		 * The description text.
		 */
		description: string;
		/**
		 * A list of use effects. An RPG.Effect array.
		 */
		effects: rm.types.Effect[];
		/**
		 * The type of hit.
		 *
		 * 0: Certain hit
		 * 1: Physical attack
		 * 2: Magical attack
		 */
		hitType: number;
		/**
		 * The icon number.
		 */
		iconIndex: number;
		/**
		 * The item ID.
		 */
		id: number;
		/**
		 * The item type ID.
		 *
		 * 1: Regular item
		 * 2: Key item
		 */
		itypeId: number;
		meta: Object;
		/**
		 * The item name.
		 */
		name: string;
		note: string;
		/**
		 * When the item/skill may be used.
		 *
		 * 0: Always
		 * 1: Only in battle
		 * 2: Only from the menu
		 * 3: Never
		 */
		occasion: number;
		/**
		 * The item's price.
		 */
		price: number;
		/**
		 * The number of repeats.
		 */
		repeats: number;
		/**
		 * The scope of effects.
		 *
		 * 0: None
		 * 1: One Enemy
		 * 2: All Enemies
		 * 3: One Random Enemy
		 * 4: Two Random Enemies
		 * 5: Three Random Enemies
		 * 6: Four Random Enemies
		 * 7: One Ally
		 * 8: All Allies
		 * 9: One Ally (Dead)
		 * 10: All Allies (Dead)
		 * 11: The User
		 */
		scope: number;
		/**
		 * The speed correction.
		 */
		speed: number;
		/**
		 * The success rate.
		 */
		successRate: number;
		/**
		 * The number of TP gained.
		 */
		tpGain: number;
	}
}

declare namespace rm.types {
	/**
	 * A superclass of weapons and armor.
	 */
	export type EquipItem = {
		/**
		 * The description text.
		 */
		description: string;
		/**
		 * The type of weapon or armor.
		 *
		 * 0: Weapon
		 * 1: Shield
		 * 2: Head
		 * 3: Body
		 * 4: Accessory
		 */
		etypeId: number;
		/**
		 * The icon number.
		 */
		iconIndex: number;
		/**
		 * The item ID.
		 */
		id: number;
		meta: Object;
		/**
		 * The item name.
		 */
		name: string;
		note: string;
		/**
		 * The amount of parameter change. An array of integers using the following IDs as subscripts:
		 *
		 * 0: Maximum hit points
		 * 1: Maximum magic points
		 * 2: Attack power
		 * 3: Defense power
		 * 4: Magic attack power
		 * 5: Magic defense power
		 * 6: Agility
		 * 7: Luck
		 */
		params: number[];
		/**
		 * The price of the weapon or armor.
		 */
		price: number;
		/**
		 * The array of Trait data.
		 */
		traits: rm.types.Trait[];
	}
}

/**
 * -----------------------------------------------------------------------------
 * Game_BattlerBase
 *
 * The superdeclare class of Game_Battler. It mainly contains parameters calculation.
 * @class Game_BattlerBase
 */
declare class Game_BattlerBase {
	constructor();
	initialize(): void;
	_hp: number;
	_mp: number;
	_tp: number;
	_hidden: boolean;
	_paramPlus: number[];
	_states: number[];
	/**
	 * [stateId: Int]:Int
	 * }
	 * Access using number/integer
	 */
	_stateTurns: { [key: string]: any };
	_buffs: number[];
	_buffTurns: number[];
	/**
	 * [read-only] Hit Points
	 */
	readonly hp: number;
	/**
	 * [read-only] Magic Points
	 */
	readonly mp: number;
	/**
	 * [read-only] Tactical Points
	 */
	readonly tp: number;
	/**
	 * [read-only] Maximum Hit Points - param 0
	 */
	readonly mhp: number;
	/**
	 * [read-only] Maximum Magic Points - param 1
	 */
	readonly mmp: number;
	/**
	 * [read-only] ATtacK power - param 2
	 */
	readonly atk: number;
	/**
	 * [read-only] DEFense power - param 3
	 */
	readonly def: number;
	/**
	 * [read-only] Magic Attack power - param 4
	 */
	readonly mat: number;
	/**
	 * [read-only] Magic Defense power - param 5
	 */
	readonly mdf: number;
	/**
	 * [read-only] Agility - param 6
	 */
	readonly agi: number;
	/**
	 * [read-only] LucK - param 7
	 */
	readonly luk: number;
	/**
	 * [read-only] HIT rate -xparam 0
	 */
	readonly hit: number;
	/**
	 * [read-only] EVAsion rate
	 */
	readonly eva: number;
	/**
	 * [read-only] CRItical rate
	 */
	readonly cri: number;
	/**
	 * [read-only] Critical EVasion rate
	 */
	readonly cev: number;
	/**
	 * [read-only] Magic EVasion rate
	 */
	readonly mev: number;
	/**
	 * [read-only] Magic ReFlection rate
	 */
	readonly mrf: number;
	/**
	 * [read-only] CouNTer attack rate
	 */
	readonly cnt: number;
	/**
	 * [read-only] Hp ReGeneration rate
	 */
	readonly hrg: number;
	/**
	 * [read-only] Mp ReGeneration rate
	 */
	readonly mrg: number;
	/**
	 * [read-only] Tp ReGeneration rate
	 */
	readonly trg: number;
	/**
	 * [read-only] TarGet Rate
	 */
	readonly tgr: number;
	/**
	 * [read-only] Ggweqrtg*xzuaRD effect rate
	 */
	readonly grd: number;
	/**
	 * [read-only] RECovery effect rate
	 */
	readonly rec: number;
	/**
	 * [read-only] PHArmacology
	 */
	readonly pha: number;
	/**
	 * [read-only] Mp Cost Rate
	 */
	readonly mcr: number;
	/**
	 * [read-only] Tp Charge Rate
	 */
	readonly tcr: number;
	/**
	 * [read-only] Physical Damage Rate
	 */
	readonly pdr: number;
	/**
	 * [read-only] Magical Damage Rate
	 */
	readonly mdr: number;
	/**
	 * [read-only] Floor Damage Rate
	 */
	readonly fdr: number;
	/**
	 * [read-only] EXperience Rate
	 */
	readonly exr: number;
	initMembers(): void;
	/**
	 * Clears any modifications to
	 * the base parameters.
	 */
	clearParamPlus(): void;
	/**
	 * Clears states applied to the actors.
	 */
	clearStates(): void;
	/**
	 * Erases the current state from the game battler given the
	 * stateId in the editor database.
	 * @param {number} stateId
	 * @memberof Game_BattlerBase
	 */
	eraseState(stateId: number): void;
	/**
	 * Returns true if the battler is affected by the specified state given
	 * the state id.
	 * @param {number} stateId
	 * @returns {Bool}
	 * @memberof Game_BattlerBase
	 */
	isStateAffected(stateId: number): boolean;
	isDeathStateAffected(): boolean;
	/**
	 * Returns the death state id.
	 *
	 * @returns {number}
	 * @memberof Game_BattlerBase
	 */
	deathStateId(): number;
	/**
	 * Resets the state count of the specified state, given the state id.
	 *
	 * @param {number} stateId
	 * @memberof Game_BattlerBase
	 */
	resetStateCounts(stateId: number): void;
	/**
	 * Returns true if the state, given the state id is expired.
	 *
	 * @param {number} stateId
	 * @returns {Bool}
	 * @memberof Game_BattlerBase
	 */
	isStateExpired(stateId: number): boolean;
	updateStateTurns(): void;
	/**
	 * Clears buffs from the battler.
	 *
	 * @memberof Game_BattlerBase
	 */
	clearBuffs(): void;
	eraseBuff(paramId: number): void;
	/**
	 * Returns the length of the buff.
	 *
	 * @returns {number}
	 * @memberof Game_BattlerBase
	 */
	buffLength(): number;
	/**
	 * Buffs the current parameter id.
	 *
	 * @param {number} paramId
	 * @returns {number}
	 * @memberof Game_BattlerBase
	 */
	buff(paramId: number): number;
	isBuffAffected(paramId: number): boolean;
	isDebuffAffected(paramId: number): boolean;
	isBuffOrDebuffAffected(paramId: number): boolean;
	isMaxBuffAffected(paramId: number): boolean;
	isMaxDebuffAffected(paramId: number): boolean;
	increaseBuff(paramId: number): void;
	decreaseBuff(paramId: number): void;
	overwriteBuffTurns(paramId: number, turns: number): void;
	isBuffExpired(paramId: number): boolean;
	/**
	 * Updates the buff turns on battler.
	 *
	 * @memberof Game_BattlerBase
	 */
	updateBuffTurns(): void;
	/**
	 * Kills the battler.
	 *
	 * @memberof Game_BattlerBase
	 */
	die(): void;
	/**
	 * Revives the battler.
	 *
	 * @memberof Game_BattlerBase
	 */
	revive(): void;
	/**
	 * Returns the states applied to the battler.
	 *
	 * @returns {Array<RPG.State>}
	 * @memberof Game_BattlerBase
	 */
	states(): rm.types.State[];
	/**
	 * Returns the array of state icons attached to the battler;
	 * this is determined by the active states on the battler.
	 * @returns {Array<number>}
	 * @memberof Game_BattlerBase
	 */
	stateIcons(): number[];
	/**
	 * Returns the array of buff icons attached to the battler;
	 * this is determined by the active buffs on the battler.
	 * @returns {Array<number>}
	 * @memberof Game_BattlerBase
	 */
	buffIcons(): number[];
	buffIconIndex(buffLevel: number, paramId: number): number;
	/**
	 * Returns all of the icons attached to the battler.
	 *
	 * @returns {Array<number>}
	 * @memberof Game_BattlerBase
	 */
	allIcons(): number[];
	/**
	 * Returns the trait object to the user
	 * @return Array<any>
	 */
	traitObjects(): any[];
	/**
	 * Returns all the traits of the battler.
	 *
	 * @returns {Array<RPG.Trait>}
	 * @memberof Game_BattlerBase
	 */
	allTraits(): rm.types.Trait[];
	traits(code: number): rm.types.Trait[];
	traitsWithId(code: number, traitId: number): rm.types.Trait[];
	traitsPi(code: number, traitId: number): number;
	traitsSum(code: number, traitId: number): number;
	traitsSumAll(code: number): number;
	traitsSet(code: number): number[];
	/**
	 * Returns the base parameters of the battler; this is determined by their
	 * current level and the paramId given.
	 * @param {number} paramId
	 * @returns {number}
	 * @memberof Game_BattlerBase
	 */
	paramBase(paramId: number): number;
	paramPlus(paramId: number): number;
	paramMin(paramId: number): number;
	paramMax(paramId: number): number;
	paramRate(paramId: number): number;
	paramBuffRate(paramId: number): number;
	/**
	 * Returns a standard parameter, given a paramId;
	 * standard parameters include: HP, MP, Atk, M.Atk, Def, M.Def, Luck, Agility.
	 * @param {number} paramId
	 * @returns {number}
	 * @memberof Game_BattlerBase
	 */
	param(paramId: number): number;
	/**
	 * Returns the Extra parameter, given a  x parameter id.
	 * These include
	 * Hit rate
	 * Evasion rate
	 * Critical rate
	 * Magic evasion rate
	 * Magic reflection rate
	 * Counter attack rate
	 * Hp regeneration rate
	 * Mp regeneration rate
	 * Tp regeneration rate
	 * @param xparamId
	 * @return Int
	 */
	xparam(xparamId: number): number;
	sparam(sparamId: number): number;
	elementRate(elementId: number): number;
	debuffRate(paramId: number): number;
	stateRate(stateId: number): number;
	stateResistSet(): number[];
	isStateResist(stateId: number): boolean;
	/**
	 * Returns the attack elements of the battler
	 * as a list of numbers.
	 * @returns {Array<number>}
	 * @memberof Game_BattlerBase
	 */
	attackElements(): number[];
	/**
	 * Returns the attack states of the battler as a
	 * list of numbers.
	 * @returns {Array<number>}
	 * @memberof Game_BattlerBase
	 */
	attackStates(): number[];
	attackStatesRate(stateId: number): void;
	/**
	 * Returns the attack speed of the battler.
	 *
	 * @returns {number}
	 * @memberof Game_BattlerBase
	 */
	attackSpeed(): number;
	/**
	 * Returns the number of attacks available to the battler.
	 *
	 * @returns {number}
	 * @memberof Game_BattlerBase
	 */
	attackTimesAdd(): number;
	/**
	 * Returns an array of integers
	 * representing skill type ids.
	 * @return Array<Int>
	 */
	addedSkillTypes(): number[];
	isSkillTypeSealed(skilltypeId: number): boolean;
	addedSkills(): number[];
	isSkillSealed(skillId: number): boolean;
	isEquipWtypeOk(weaponTypeId: number): boolean;
	isEquipAtypeOk(armorTypeId: number): boolean;
	isEquipTypeLocked(equipmentTypeId: number): boolean;
	isEquipTypeSealed(equipmentTypeId: number): boolean;
	/**
	 * Returns the battler slot type of a trait.
	 *
	 * @returns {number}
	 * @memberof Game_BattlerBase
	 */
	slotType(): number;
	/**
	 * Returns true if the battler dual wields.
	 *
	 * @returns {Bool}
	 * @memberof Game_BattlerBase
	 */
	isDualWield(): boolean;
	actionPlusSet(): number[];
	/**
	 * Takes a special flag
	 * @param flagId
	 * @return Bool
	 */
	specialFlag(flagId: number): boolean;
	/**
	 * Returns the collapse type of the battler.
	 * This is represented as an Int.
	 * @returns {Int}
	 * @memberof Game_BattlerBase
	 */
	collapseType(): number;
	partyAbility(abilityId: number): boolean;
	/**
	 * Returns true if the battler is set to battle automatically.
	 *
	 * @returns {Bool}
	 * @memberof Game_BattlerBase
	 */
	isAutoBattle(): boolean;
	/**
	 * Returns true if the battler is guarding.
	 *
	 * @returns {Bool}
	 * @memberof Game_BattlerBase
	 */
	isGuard(): boolean;
	isSubstitute(): boolean;
	/**
	 * Returns true if tp is preserved between battles.
	 *
	 * @returns {Bool}
	 * @memberof Game_BattlerBase
	 */
	isPreserveTp(): boolean;
	addParam(paramId: number, value: number): void;
	/**
	 * Sets the battler hp.
	 *
	 * @param {number} hp
	 * @memberof Game_BattlerBase
	 */
	setHp(hp: number): void;
	/**
	 * Sets the battler mp.
	 *
	 * @param {number} mp
	 * @memberof Game_BattlerBase
	 */
	setMp(mp: number): void;
	/**
	 * Sets the battler tp.
	 *
	 * @param {number} tp
	 * @memberof Game_BattlerBase
	 */
	setTp(tp: number): void;
	/**
	 * Returns the maximum tp of the battler.
	 *
	 * @returns {number}
	 * @memberof Game_BattlerBase
	 */
	maxTp(): number;
	/**
	 * Refreshes the battler.
	 *
	 * @memberof Game_BattlerBase
	 */
	refresh(): void;
	/**
	 * Recovers the battler from all states and restores the
	 * battler to maximum hp and mp.
	 * @memberof Game_BattlerBase
	 */
	recoverAll(): void;
	/**
	 * Returns the percentage of the battler's hp left as a float.
	 *
	 * @returns {number}
	 * @memberof Game_BattlerBase
	 */
	hpRate(): number;
	/**
	 * Returns the percentage of the battler's mp left as a float.
	 *
	 * @returns {number}
	 * @memberof Game_BattlerBase
	 */
	mpRate(): number;
	/**
	 * Returns the percentage of the battler's tp left as a float.
	 *
	 * @returns {number}
	 * @memberof Game_BattlerBase
	 */
	tpRate(): number;
	/**
	 * Hides the game battler.
	 *
	 * @memberof Game_BattlerBase
	 */
	hide(): void;
	/**
	 * Shows the game battler.
	 *
	 * @memberof Game_BattlerBase
	 */
	appear(): void;
	/**
	 * Returns true if the game battler is hidden.
	 *
	 * @returns {Bool}
	 * @memberof Game_BattlerBase
	 */
	isHidden(): boolean;
	/**
	 * Returns true if the game battler is not hidden.
	 *
	 * @returns {Bool}
	 * @memberof Game_BattlerBase
	 */
	isAppeared(): boolean;
	/**
	 * Returns true if the battler is dead.
	 *
	 * @returns {Bool}
	 * @memberof Game_BattlerBase
	 */
	isDead(): boolean;
	/**
	 * Returns true if the battler is alive.
	 *
	 * @returns {Bool}
	 * @memberof Game_BattlerBase
	 */
	isAlive(): boolean;
	/**
	 * Returns true if the battler is dying.
	 *
	 * @returns {Bool}
	 * @memberof Game_BattlerBase
	 */
	isDying(): boolean;
	/**
	 * Returns true if the game battler is restricted.
	 *
	 * @returns {Bool}
	 * @memberof Game_BattlerBase
	 */
	isRestricted(): boolean;
	/**
	 * Returns true if the battler can input actions.
	 *
	 * @returns {Bool}
	 * @memberof Game_BattlerBase
	 */
	canInput(): boolean;
	canMove(): boolean;
	/**
	 * Returns true if the battler is confused.
	 *
	 * @returns {Bool}
	 * @memberof Game_BattlerBase
	 */
	isConfused(): boolean;
	/**
	 * Returns the confusion level of the battler.
	 *
	 * @returns {number}
	 * @memberof Game_BattlerBase
	 */
	confusionLevel(): number;
	/**
	 * Returns true if the battler is an actor.
	 *
	 * @returns {Bool}
	 * @memberof Game_BattlerBase
	 */
	isActor(): boolean;
	/**
	 * Returns true if the battler is an enemy.
	 *
	 * @returns {Bool}
	 * @memberof Game_BattlerBase
	 */
	isEnemy(): boolean;
	/**
	 * Sorts the states attached to the battler.
	 *
	 * @memberof Game_BattlerBase
	 */
	sortStates(): void;
	/**
	 * Returns the number of the restriction.
	 *
	 * @returns {number}
	 * @memberof Game_BattlerBase
	 */
	restriction(): number;
	/**
	 * Adds a new state given a state id to the battler.
	 *
	 * @param {number} stateId
	 * @memberof Game_BattlerBase
	 */
	addNewState(stateId: number): void;
	/**
	 * Handler for when the battler is restricted.
	 *
	 * @memberof Game_BattlerBase
	 */
	onRestrict(): void;
	mostImportantStateText(): string;
	stateMotionIndex(): number;
	stateOverlayIndex(): number;
	/**
	 * Returns true if the skill is a weapon type
	 * oriented skill.
	 * @param {RPG.Skill} skill
	 * @returns {Bool}
	 * @memberof Game_BattlerBase
	 */
	isSkillWtypeOk(skill: rm.types.Skill): boolean;
	/**
	 * Returns the mp cost of the skill.
	 *
	 * @param {RPG.Skill} skill
	 * @returns {number}
	 * @memberof Game_BattlerBase
	 */
	skillMpCost(skill: rm.types.Skill): number;
	/**
	 * Returns the tp cost of the skill.
	 *
	 * @param {RPG.Skill} skill
	 * @returns {number}
	 * @memberof Game_BattlerBase
	 */
	skillTpCost(skill: rm.types.Skill): number;
	/**
	 * Returns true if the battler can pay the cost
	 * of the specified skill.
	 * @param {RPG.Skill} skill
	 * @returns {Bool}
	 * @memberof Game_BattlerBase
	 */
	canPaySkillCost(skill: rm.types.Skill): boolean;
	/**
	 * Pays the cost of the skill when activating the skill.
	 *
	 * @param {RPG.Skill} skill
	 * @memberof Game_BattlerBase
	 */
	paySkillCost(skill: rm.types.Skill): void;
	/**
	 * Returns true if the item occasion is okay.
	 *
	 * @param {RPG.UsableItem} item
	 * @returns {Bool}
	 * @memberof Game_BattlerBase
	 */
	isOccasionOk(item: rm.types.UsableItem): boolean;
	meetsUsableItemConditions(item: rm.types.UsableItem): boolean;
	/**
	 * Returns true if the battler meets the skill conditions.
	 *
	 * @param {RPG.Skill} skill
	 * @returns {Bool}
	 * @memberof Game_BattlerBase
	 */
	meetsSkillConditions(skill: rm.types.Skill): boolean;
	/**
	 * Returns true if the battler meets the item conditions.
	 *
	 * @param {RPG.Item} item
	 * @returns {Bool}
	 * @memberof Game_BattlerBase
	 */
	meetsItemConditions(item: rm.types.Item): boolean;
	/**
	 * Returns true if the battler can use the item.
	 *
	 * @param {RPG.UsableItem} item
	 * @returns {Bool}
	 * @memberof Game_BattlerBase
	 */
	canUse(item: rm.types.UsableItem): boolean;
	/**
	 * Returns true if the battler can equip the item.
	 *
	 * @param {RPG.EquipItem} item
	 * @returns {Bool}
	 * @memberof Game_BattlerBase
	 */
	canEquip(item: rm.types.EquipItem): boolean;
	/**
	 * Returns true if the battler can equip a weapon.
	 *
	 * @param {RPG.EquipItem} item
	 * @returns {Bool}
	 * @memberof Game_BattlerBase
	 */
	canEquipWeapon(item: rm.types.EquipItem): boolean;
	/**
	 * Returns true if the battler can equip armor.
	 *
	 * @param {RPG.EquipItem} item
	 * @returns {Bool}
	 * @memberof Game_BattlerBase
	 */
	canEquipArmor(item: rm.types.EquipItem): boolean;
	/**
	 * Returns the attack skill id in the database.
	 *
	 * @returns {number}
	 * @memberof Game_BattlerBase
	 */
	attackSkillid(): number;
	/**
	 * Returns the guard skill id in the database.
	 *
	 * @returns {number}
	 * @memberof Game_BattlerBase
	 */
	guardSkillId(): number;
	/**
	 * Returns true if the battler can attack.
	 *
	 * @returns {Bool}
	 * @memberof Game_BattlerBase
	 */
	canAttack(): boolean;
	/**
	 * Returns true if the battler can guard.
	 *
	 * @returns {Bool}
	 * @memberof Game_BattlerBase
	 */
	canGuard(): boolean;
	/**
	 * Trait element rate; default to 11.
	 */
	static TRAIT_ELEMENT_RATE: number;
	/**
	 * Debuff Rate; default to 12.
	 */
	static TRAIT_DEBUFF_RATE: number;
	/**
	 * Trait state rate; default to 13.
	 */
	static TRAIT_STATE_RATE: number;
	/**
	 * Trait state resist; default to 14.
	 */
	static TRAIT_STATE_RESIST: number;
	/**
	 * Trait param; default to 21.
	 */
	static TRAIT_PARAM: number;
	/**
	 * Trait x param; default to 22.
	 */
	static TRAIT_XPARAM: number;
	/**
	 * Trait s param; default to 23.
	 */
	static TRAIT_SPARAM: number;
	/**
	 * Trait attack element; default to 31.
	 */
	static TRAIT_ATTACK_ELEMENT: number;
	/**
	 * Trait attack state; default to 32.
	 */
	static TRAIT_ATTACK_STATE: number;
	/**
	 * Trait attack speed; default to 33.
	 */
	static TRAIT_ATTACK_SPEED: number;
	/**
	 * Trait attack times; default to 34.
	 */
	static TRAIT_ATTACK_TIMES: number;
	/**
	 * Trait Stype(Skill type ) add; default to 41.
	 */
	static TRAIT_STYPE_ADD: number;
	/**
	 * Trait Stype(Skill type) seal; default to 42.
	 */
	static TRAIT_STYPE_SEAL: number;
	/**
	 * Trait Skill add; default to 43.
	 */
	static TRAIT_SKILL_ADD: number;
	/**
	 * Trait skill  seal; default to 44.
	 */
	static TRAIT_SKILL_SEAL: number;
	/**
	 * Trait WType(equip weapon type); default to 51.
	 */
	static TRAIT_EQUIP_WTYPE: number;
	/**
	 * Trait AType(Equip armor type); default to 52.
	 */
	static TRAIT_EQUIP_ATYPE: number;
	/**
	 * Trait equipment lock; default to 53.
	 */
	static TRAIT_EQUIP_LOCK: number;
	/**
	 * Trait equipment seal; default to 54.
	 */
	static TRAIT_EQUIP_SEAL: number;
	/**
	 * Trait slot type;default to 55.
	 */
	static TRAIT_SLOT_TYPE: number;
	/**
	 * Trait action plus; default to 61.
	 */
	static TRAIT_ACTION_PLUS: number;
	/**
	 * Trait special flag; default to 62.
	 */
	static TRAIT_SPECIAL_FLAG: number;
	/**
	 * Trait collapse type; default to 63.
	 */
	static TRAIT_COLLAPSE_TYPE: number;
	/**
	 * Trait party ability; default to 64.
	 */
	static TRAIT_PARTY_ABILITY: number;
	/**
	 * Flag ID auto battle; default to 0;
	 */
	static FLAG_ID_AUTO_BATTLE: number;
	/**
	 * Flag ID guard; default to 1.
	 */
	static FLAG_ID_GUARD: number;
	/**
	 * Flag Id substitude; default to 2.
	 */
	static FLAG_ID_SUBSTITUTE: number;
	/**
	 * Flag id preserve type; default to 3.
	 */
	static FLAG_ID_PRESERVE_TP: number;
	/**
	 * Icon buff start, default to 32.
	 */
	static ICON_BUFF_START: number;
	/**
	 * Icon debuff start; default to 48.
	 */
	static ICON_DEBUFF_START: number;
}

declare namespace rm.types {
	export type BattlerAnimation = {
		animationId: number;
		delay: number;
		mirror: boolean;
	}
}

declare namespace rm.types {
	export const enum MotionType {
		WALK = "walk",
		WAIT = "wait",
		CHANT = "chant",
		GUARD = "guard",
		DAMAGE = "damage",
		EVADE = "evade",
		THRUST = "thrust",
		MISSLE = "missle",
		SKILL = "SKILL",
		SPELL = "spell",
		ITEM = "item",
		ESCAPE = "escape",
		VICTORY = "victory",
		DYING = "dying",
		ABNORMAL = "abnormal",
		SLEEP = "sleep",
		DEAD = "dead",
	}
}

declare namespace rm.types {
	export const enum WeaponImageId {
		base = -1,
	}
}

declare namespace rm.types {
	export const enum AnimationId {
		base = -1,
	}
}

declare namespace rm.types {
	export const enum ActionState {
		base = "",
	}
}

declare class Game_Battler extends Game_BattlerBase {
	protected constructor();
	_actions: Game_Action[];
	_speed: number;
	_result: Game_ActionResult;
	_actionState: string;
	_lastTargetIndex: number;
	_animations: rm.types.BattlerAnimation[];
	_damagePopup: boolean;
	_effectType: string;
	_motionType: rm.types.MotionType;
	_weaponImageId: number;
	_motionRefresh: boolean;
	_selected: boolean;
	/**
	 * Returns the name of the battler.
	 *
	 * @returns {String}
	 * @memberof Game_Battler
	 */
	name(): string;
	/**
	 * Returns the battler name of the battler;
	 * the battler name is associated with the file used as the battler graphic.
	 * @returns {String}
	 * @memberof Game_Battler
	 */
	battlerName(): string;
	/**
	 * Returns the index of the battler.
	 *
	 * @returns {number}
	 * @memberof Game_Battler
	 */
	index(): number;
	/**
	 * Returns the unit of the battler; this is either the
	 * game party or game troop.
	 * @returns {Game_Unit}
	 * @memberof Game_Battler
	 */
	friendsUnit(): Game_Unit;
	/**
	 * Returns the opponents unit; this is either
	 * game party or game troop.
	 * @returns {Game_Unit}
	 * @memberof Game_Battler
	 */
	opponentsUnit(): Game_Unit;
	/**
	 * Clears animations from the battler.
	 *
	 * @memberof Game_Battler
	 */
	clearAnimations(): void;
	/**
	 * Clear damage pop up from the battler.
	 *
	 * @memberof Game_Battler
	 */
	clearDamagePopup(): void;
	/**
	 * Clear weapon animation from the battler.
	 *
	 * @memberof Game_Battler
	 */
	clearWeaponAnimation(): void;
	/**
	 * Clears effect from the battler.
	 *
	 * @memberof Game_Battler
	 */
	clearEffect(): void;
	/**
	 * Clears motion from the battler.
	 *
	 * @memberof Game_Battler
	 */
	clearMotion(): void;
	requestEffect(effectType: string): void;
	/**
	 * Request the specified motion on the game battler.
	 *
	 * @param {String} motionType
	 * @memberof Game_Battler
	 */
	requestMotion(motionType: string): void;
	requestMotionRefresh(): void;
	select(): void;
	deselect(): void;
	isAnimationRequested(): boolean;
	isDamagePopupRequested(): boolean;
	isEffectRequested(): boolean;
	/**
	 * Returns true if a motion is requested.
	 *
	 * @returns {Bool}
	 * @memberof Game_Battler
	 */
	isMotionRequested(): boolean;
	/**
	 * Returns true if a weapon animation is requested.
	 *
	 * @returns {Bool}
	 * @memberof Game_Battler
	 */
	isWeaponAnimationRequested(): boolean;
	isMotionRefreshRequested(): boolean;
	isSelected(): boolean;
	/**
	 * Returns the effect type of the battler.
	 *
	 * @returns {String}
	 * @memberof Game_Battler
	 */
	effectType(): string;
	/**
	 * Returns the motion type of the battler.
	 *
	 * @returns {String}
	 * @memberof Game_Battler
	 */
	motionType(): string;
	/**
	 * Returns the weapon image id.
	 *
	 * @returns {number}
	 * @memberof Game_Battler
	 */
	weaponImageId(): rm.types.WeaponImageId;
	/**
	 * Shifts the battler animation.
	 *
	 * @returns {BattlerAnimation}
	 * @memberof Game_Battler
	 */
	shiftAnimation(): rm.types.BattlerAnimation;
	/**
	 * Starts the specified animation, given the animation id on the
	 * battler.
	 * @param {number} animationId
	 * @param {Bool} mirror
	 * @param {number} delay
	 * @memberof Game_Battler
	 */
	startAnimation(animationId: rm.types.AnimationId, mirror: boolean, delay: number): void;
	/**
	 * Starts a damage pop up on the battler.
	 *
	 * @memberof Game_Battler
	 */
	startDamagePopup(): void;
	/**
	 * Starts the weapon animation on te battler given a weapon id.
	 *
	 * @param {number} weaponImageId
	 * @memberof Game_Battler
	 */
	startWeaponAnimation(weaponImageId: rm.types.WeaponImageId): void;
	action(index: number): Game_Action;
	/**
	 * Sets the action at the specified index for the battler.
	 *
	 * @param {number} index
	 * @param {Game_Action} action
	 * @memberof Game_Battler
	 */
	setAction(index: number, action: Game_Action): void;
	/**
	 * Returns the number of battler actions.
	 *
	 * @returns {number}
	 * @memberof Game_Battler
	 */
	numActions(): number;
	/**
	 * Clears the battler actions.
	 *
	 * @memberof Game_Battler
	 */
	clearActions(): void;
	/**
	 * Returns the battler action result.
	 *
	 * @returns {Game_ActionResult}
	 * @memberof Game_Battler
	 */
	result(): Game_ActionResult;
	/**
	 * Clears the battler action result.
	 *
	 * @memberof Game_Battler
	 */
	clearResult(): void;
	/**
	 * Refreshes the battler.
	 *
	 * @memberof Game_Battler
	 */
	refresh(): void;
	/**
	 * Adds a state to the battler given the specified
	 * state id.
	 * @param {number} stateId
	 * @memberof Game_Battler
	 */
	addState(stateId: number): void;
	/**
	 * Returns true if the specified state given the state id
	 * is addable.
	 * @param {number} stateId
	 * @returns {Bool}
	 * @memberof Game_Battler
	 */
	isStateAddable(stateId: number): boolean;
	/**
	 * Returns true if the specified state given the state id
	 * restricts.
	 *
	 * @param {number} stateId
	 * @returns {Bool}
	 * @memberof Game_Battler
	 */
	isStateRestrict(stateId: number): boolean;
	/**
	 * Handler for when theb attler is restricted.
	 *
	 * @memberof Game_Battler
	 */
	onRestrict(): void;
	/**
	 * Removes the specified state given the state id.
	 *
	 * @param {number} stateId
	 * @memberof Game_Battler
	 */
	removeState(stateId: number): void;
	/**
	 * Has the battler escape from battle; plays a sound on escaping.
	 *
	 * @memberof Game_Battler
	 */
	escape(): void;
	/**
	 * Adds a buff to the battler for the specified number of turns
	 * on the selected parameter.
	 * @param {number} paramId
	 * @param {number} turns
	 * @memberof Game_Battler
	 */
	addBuff(paramId: number, turns: number): void;
	/**
	 * Adds a debuff to the battler for the specified number of turns
	 * on the selected parameter.
	 * @param {number} paramId
	 * @param {number} turns
	 * @memberof Game_Battler
	 */
	addDebuff(paramId: number, turns: number): void;
	removeBuff(paramId: number): void;
	removeBattleStates(): void;
	/**
	 * Removes all buffs from the battler.
	 *
	 * @memberof Game_Battler
	 */
	removeAllBuffs(): void;
	removeStatesAuto(timing: number): void;
	removeBuffsAuto(): void;
	removeStatesByDamage(): void;
	/**
	 * Creates the number of times for
	 * an action.
	 * @returns {number}
	 * @memberof Game_Battler
	 */
	makeActionTimes(): number;
	/**
	 * Creates the actions for the battler.
	 *
	 * @memberof Game_Battler
	 */
	makeActions(): void;
	/**
	 * Returns the speed of the battler.
	 *
	 * @returns {number}
	 * @memberof Game_Battler
	 */
	speed(): number;
	/**
	 * Calculates the speed of the battler.
	 *
	 * @memberof Game_Battler
	 */
	makeSpeed(): void;
	/**
	 * Returns the current action of the battler.
	 *
	 * @returns {Game_Action}
	 * @memberof Game_Battler
	 */
	currentAction(): Game_Action;
	/**
	 * Removes the current battler action.
	 *
	 * @memberof Game_Battler
	 */
	removeCurrentAction(): void;
	/**
	 * Sets the last target based on the target passed in.
	 * @param target
	 */
	setLastTarget(target: Game_Battler): void;
	forceAction(skillId: number, targetIndex: number): void;
	/**
	 * Has theb attler use the given item.
	 *
	 * @param {RPG.UsableItem} item
	 * @memberof Game_Battler
	 */
	useItem(item: rm.types.UsableItem): void;
	/**
	 * Has the battler consume the given item.
	 *
	 * @param {RPG.UsableItem} item
	 * @memberof Game_Battler
	 */
	consumeItem(item: rm.types.UsableItem): void;
	/**
	 * Adds the specified amount of hp to the battler.
	 *
	 * @param {number} value
	 * @memberof Game_Battler
	 */
	gainHp(value: number): void;
	/**
	 * Adds the specified amount of mp to the battler.
	 *
	 * @param {number} value
	 * @memberof Game_Battler
	 */
	gainMp(value: number): void;
	/**
	 * Adds the specified amount of tp to the battler.
	 *
	 * @param {number} value
	 * @memberof Game_Battler
	 */
	gainTp(value: number): void;
	/**
	 * Adds a specified amount of tp to the battler silently.
	 *
	 * @param {number} value
	 * @memberof Game_Battler
	 */
	gainSilentTp(value: number): void;
	/**
	 * Initializes the battler's tp; tp is random.
	 *
	 * @memberof Game_Battler
	 */
	initTp(): void;
	/**
	 * Clears the battler's tp.
	 *
	 * @memberof Game_Battler
	 */
	clearTp(): void;
	chargeTpByDamage(damageRate: number): void;
	/**
	 * Has the battler regenerate hp based on their hp regen.
	 *
	 * @memberof Game_Battler
	 */
	regenerateHp(): void;
	maxSlipDamage(): number;
	/**
	 * Has the battler regenerate mp based on their mp regen.
	 *
	 * @memberof Game_Battler
	 */
	regenerateMp(): void;
	/**
	 * Has the battler regenerate tp based on their tp regen.
	 *
	 * @memberof Game_Battler
	 */
	regenerateTp(): void;
	/**
	 * Has the battler regenerate all resources based on
	 * their respective regeneration stats.
	 * @memberof Game_Battler
	 */
	regenerateAll(): void;
	/**
	 * Handler for when battle has started.
	 *
	 * @memberof Game_Battler
	 */
	onBattleStart(): void;
	/**
	 * Handler for when all actions end
	 */
	onAllActionsEnd(): void;
	/**
	 * Handler for when turn ends
	 */
	onTurnEnd(): void;
	/**
	 * Handler for when battle ends
	 */
	onBattleEnd(): void;
	/**
	 * Handler for when damage is done
	 * @param value
	 */
	onDamage(value: number): void;
	/**
	 * Sets the action state
	 * @param actionState
	 */
	setActionState(actionState: rm.types.ActionState): void;
	isUndecided(): boolean;
	/**
	 * Returns true if the battler is inputting commands in battle.
	 *
	 * @returns {Bool}
	 * @memberof Game_Battler
	 */
	isInputting(): boolean;
	/**
	 * Returns true if the battler is waiting in battle.
	 *
	 * @returns {Bool}
	 * @memberof Game_Battler
	 */
	isWaiting(): boolean;
	/**
	 * Returns true if the battler is performing an action in battle.
	 *
	 * @returns {Bool}
	 * @memberof Game_Battler
	 */
	isActing(): boolean;
	/**
	 * Returns true if the battler is chanting in combat.
	 *
	 * @returns {Bool}
	 * @memberof Game_Battler
	 */
	isChanting(): boolean;
	/**
	 * Returns true if the battler is waiting to guard.
	 *
	 * @returns {Bool}
	 * @memberof Game_Battler
	 */
	isGuardWaiting(): boolean;
	/**
	 * Perform action start motion, given the specified game action.
	 *
	 * @param {Game_Action} action
	 * @memberof Game_Battler
	 */
	performActionStart(action: Game_Action): void;
	/**
	 * Perform given action motion.
	 *
	 * @param {Game_Action} action
	 * @memberof Game_Battler
	 */
	performAction(action: Game_Action): void;
	/**
	 * Perform action end motion.
	 *
	 * @memberof Game_Battler
	 */
	performActionEnd(): void;
	/**
	 * Perform damage motion.
	 *
	 * @memberof Game_Battler
	 */
	performDamage(): void;
	/**
	 * Perform miss motion.
	 *
	 * @memberof Game_Battler
	 */
	performMiss(): void;
	/**
	 * Perform recovery motion.
	 *
	 * @memberof Game_Battler
	 */
	performRecovery(): void;
	/**
	 * Perform evasion motion.
	 *
	 * @memberof Game_Battler
	 */
	performEvasion(): void;
	/**
	 * Perform magic evasion motion.
	 *
	 * @memberof Game_Battler
	 */
	performMagicEvasion(): void;
	/**
	 * Perform counter motion.
	 *
	 * @memberof Game_Battler
	 */
	performCounter(): void;
	/**
	 * Performs the reflect motion.
	 *
	 * @memberof Game_Battler
	 */
	performReflection(): void;
	/**
	 * Perform substitute motion with the specified game battler.
	 *
	 * @param {Game_Battler} target
	 * @memberof Game_Battler
	 */
	performSubstitute(target: Game_Battler): void;
	/**
	 * Performs the collapse motion.
	 *
	 * @memberof Game_Battler
	 */
	performCollapse(): void;
}

declare namespace rm.types {
	/**
	 * The data class for actors.
	 */
	export type Actor = {
		/**
		 * The file name of the actor's battler graphic.
		 */
		battlerName: string;
		/**
		 * The index (0..7) of the actor's walking graphic.
		 */
		characterIndex: number;
		/**
		 * The file name of the actor's walking graphic.
		 */
		characterName: string;
		/**
		 * The actor's class ID.
		 */
		classId: number;
		doc: string;
		/**
		 * The actor's initial equipment. An array of weapon IDs or armor IDs with the following subscripts:
		 */
		equips: number[];
		/**
		 * The index (0..7) of the actor's face graphic.
		 */
		faceIndex: number;
		/**
		 * The file name of the actor's face graphic.
		 */
		faceName: string;
		/**
		 * The ID.
		 */
		id: string;
		/**
		 * The actor's initial level.
		 */
		initialLevel: number;
		internal: boolean;
		links: string[];
		/**
		 * The actor's max level
		 */
		maxLevel: number;
		/**
		 * The name.
		 */
		name: string;
		/**
		 * The actor's nickname.
		 */
		nickname: string;
		parameters: string[];
		platforms: haxe.display.Platform[];
		/**
		 * The profile.
		 */
		profile: string;
		targets: haxe.display.MetadataTarget[];
		/**
		 * The array of Trait data.
		 */
		traits: rm.types.Trait[];
	}
}

declare namespace rm.types {
	/**
	 * The data class for weapons.
	 */
	export type Weapon = {
		/**
		 * The animation ID when using the weapon.
		 */
		animationId: number;
		/**
		 * The description text.
		 */
		description: string;
		/**
		 * The type of weapon or armor.
		 *
		 * 0: Weapon
		 * 1: Shield
		 * 2: Head
		 * 3: Body
		 * 4: Accessory
		 */
		etypeId: number;
		/**
		 * The icon number.
		 */
		iconIndex: number;
		/**
		 * The item ID.
		 */
		id: number;
		meta: Object;
		/**
		 * The item name.
		 */
		name: string;
		note: string;
		/**
		 * The amount of parameter change. An array of integers using the following IDs as subscripts:
		 *
		 * 0: Maximum hit points
		 * 1: Maximum magic points
		 * 2: Attack power
		 * 3: Defense power
		 * 4: Magic attack power
		 * 5: Magic defense power
		 * 6: Agility
		 * 7: Luck
		 */
		params: number[];
		/**
		 * The price of the weapon or armor.
		 */
		price: number;
		/**
		 * The array of Trait data.
		 */
		traits: rm.types.Trait[];
		/**
		 * The weapon type ID.
		 */
		wtypeId: number;
	}
}

declare namespace rm.types {
	/**
	 * The data class for armor.
	 */
	export type Armor = {
		/**
		 * The armor type ID.
		 */
		atypeId: number;
		/**
		 * The description text.
		 */
		description: string;
		/**
		 * The type of weapon or armor.
		 *
		 * 0: Weapon
		 * 1: Shield
		 * 2: Head
		 * 3: Body
		 * 4: Accessory
		 */
		etypeId: number;
		/**
		 * The icon number.
		 */
		iconIndex: number;
		/**
		 * The item ID.
		 */
		id: number;
		meta: Object;
		/**
		 * The item name.
		 */
		name: string;
		note: string;
		/**
		 * The amount of parameter change. An array of integers using the following IDs as subscripts:
		 *
		 * 0: Maximum hit points
		 * 1: Maximum magic points
		 * 2: Attack power
		 * 3: Defense power
		 * 4: Magic attack power
		 * 5: Magic defense power
		 * 6: Agility
		 * 7: Luck
		 */
		params: number[];
		/**
		 * The price of the weapon or armor.
		 */
		price: number;
		/**
		 * The array of Trait data.
		 */
		traits: rm.types.Trait[];
	}
}

declare namespace rm.types {
	/**
	 * The data class for a class's [Skills to Learn].
	 */
	export type ClassLearning = {
		doc: string;
		internal: boolean;
		/**
		 * The data class for a class's [Skills to Learn].
		 */
		level: number;
		links: string[];
		name: string;
		parameters: string[];
		platforms: haxe.display.Platform[];
		/**
		 * The ID of the skill to learn.
		 */
		skillId: number;
		targets: haxe.display.MetadataTarget[];
	}
}

declare namespace rm.types {
	/**
	 * The data class for class.
	 */
	export type RPGClass = {
		doc: string;
		/**
		 * An array of values that decides the experience curve. The subscripts are as follows:
		 *
		 * 0: Base value
		 * 1: Extra value
		 * 2: Acceleration A
		 * 3: Acceleration B
		 */
		expParams: number[];
		/**
		 * The ID.
		 */
		id: number;
		internal: boolean;
		/**
		 * The skills to learn. An array of RPG.Class.Learning.
		 */
		learnings: rm.types.ClassLearning[];
		links: string[];
		/**
		 * The name.
		 */
		name: string;
		parameters: string[];
		/**
		 * The parameter development curve. A 2-dimensional array containing ordinary parameters according to level (Table).
		 *
		 * The format is params[param_id, level], and param_id is assigned as follows:
		 *
		 * 0: Maximum hit points
		 * 1: Maximum magic points
		 * 2: Attack power
		 * 3: Defense power
		 * 4: Magic attack power
		 * 5: Magic defense power
		 * 6: Agility
		 * 7: Luck
		 */
		params: number[][];
		platforms: haxe.display.Platform[];
		targets: haxe.display.MetadataTarget[];
		/**
		 * The array of Trait data.
		 */
		traits: rm.types.Trait[];
	}
}

declare class Game_Actor extends Game_Battler {
	constructor(actorId: number);
	_actorId: number;
	_name: string;
	_nickname: string;
	_profile: string;
	_classId: number;
	_level: number;
	_characterName: string;
	_characterIndex: number;
	_faceName: string;
	_faceIndex: number;
	_battlerName: string;
	_exp: Object;
	/**
	 * Skill Ids
	 */
	_skills: number[];
	_equips: Game_Item[];
	_actionInputIndex: number;
	_lastMenuSkill: Game_Item;
	_lastBattleSkill: Game_Item;
	_lastCommandSymbol: string;
	_stateSteps: Object;
	/**
	 * [read-only]
	 */
	level: number;
	setup(actorId: number): void;
	/**
	 * Returns the id of the actor.
	 *
	 * @returns {Int}
	 * @memberof Game_Actor
	 */
	actorId(): number;
	/**
	 * Returns the database information of the actor.
	 *
	 * @returns {Actor}
	 * @memberof Game_Actor
	 */
	actor(): rm.types.Actor;
	/**
	 * Returns the actor's name.
	 * @return String
	 */
	name(): string;
	/**
	 * Sets the actor name.
	 *
	 * @param {String} name
	 * @memberof Game_Actor
	 */
	setName(name: string): void;
	/**
	 * Returns the nickname of the actor.
	 *
	 * @returns {String}
	 * @memberof Game_Actor
	 */
	nickname(): string;
	/**
	 * Sets the nickname of the actor.
	 *
	 * @param {String} nickname
	 * @memberof Game_Actor
	 */
	setNickname(nickname: string): void;
	/**
	 * Returns the actor profile.
	 *
	 * @returns {String}
	 * @memberof Game_Actor
	 */
	profile(): string;
	/**
	 * Sets the actor profile.
	 *
	 * @param {String} profile
	 * @memberof Game_Actor
	 */
	setProfile(profile: string): void;
	/**
	 * Returns the face name of the actor; this is
	 * the image of faces for the actor.
	 * @returns {String}
	 * @memberof Game_Actor
	 */
	faceName(): string;
	/**
	 * Returns the face index of the actor.
	 *
	 * @returns {Int}
	 * @memberof Game_Actor
	 */
	faceIndex(): number;
	/**
	 * Clears all states from the actor.
	 *
	 * @memberof Game_Actor
	 */
	clearStates(): void;
	/**
	 * Erase the specified state from the actor.
	 *
	 * @param {Int} stateId
	 * @memberof Game_Actor
	 */
	eraseState(stateId: number): void;
	/**
	 * Reset state count of the specified state.
	 *
	 * @param {Int} stateId
	 * @memberof Game_Actor
	 */
	resetStateCounts(stateId: number): void;
	/**
	 * Initialize images of the actor.
	 *
	 * @memberof Game_Actor
	 */
	initImages(): void;
	/**
	 * Returns the exp required to level.
	 *
	 * @param {Int} level
	 * @returns {Int}
	 * @memberof Game_Actor
	 */
	expForLevel(level: number): number;
	/**
	 * Initialize exp of the actor.
	 *
	 * @memberof Game_Actor
	 */
	initExp(): void;
	/**
	 * Returns the current experience points of the actor.
	 *
	 * @returns {Int}
	 * @memberof Game_Actor
	 */
	currentExp(): number;
	/**
	 * Returns the current level's experience for the actor.
	 *
	 * @returns {Int}
	 * @memberof Game_Actor
	 */
	currentLevelExp(): number;
	/**
	 * Returns the experience points for the next level of the actor.
	 *
	 * @returns {Int}
	 * @memberof Game_Actor
	 */
	nextLevelExp(): number;
	/**
	 * Returns the next required experience points for the actor to level up.
	 *
	 * @returns {Int}
	 * @memberof Game_Actor
	 */
	nextRequiredExp(): number;
	/**
	 * Returns the maximum level of the actor.
	 *
	 * @memberof Game_Actor
	 */
	maxLevel(): void;
	/**
	 * Returns true if the actor is max level.
	 *
	 * @returns {Bool}
	 * @memberof Game_Actor
	 */
	isMaxLevel(): boolean;
	/**
	 * Initialize actor skills.
	 *
	 * @memberof Game_Actor
	 */
	initSkills(): void;
	/**
	 * Initialize actor equipment in the given slots.
	 *
	 * @param {Array<Int>} equips
	 * @memberof Game_Actor
	 */
	initEquips(equips: number[]): void;
	/**
	 * Returns the equip slots of the actor.
	 *
	 * @returns {Array<Int>}
	 * @memberof Game_Actor
	 */
	equipSlots(): number[];
	/**
	 * Returns the equipment of the actor.
	 *
	 * @returns {Array<EquipItem>}
	 * @memberof Game_Actor
	 */
	equips(): rm.types.EquipItem[];
	/**
	 * Returns the weapon of the actor.
	 *
	 * @returns {Array<Weapon>}
	 * @memberof Game_Actor
	 */
	weapons(): rm.types.Weapon[];
	/**
	 * Returns the armor of the actor.
	 *
	 * @returns {Array<Armor>}
	 * @memberof Game_Actor
	 */
	armors(): rm.types.Armor[];
	/**
	 * Returns true if the actor has a weapon.
	 *
	 * @param {Weapon} weapon
	 * @returns {Bool}
	 * @memberof Game_Actor
	 */
	hasWeapon(weapon: rm.types.Weapon): boolean;
	/**
	 * Returns true if the actor has armor.
	 *
	 * @param {Armor} armor
	 * @returns {Bool}
	 * @memberof Game_Actor
	 */
	hasArmor(armor: rm.types.Armor): boolean;
	/**
	 * Returns true if the equip change is okay in the given slot.
	 *
	 * @param {Int} slotId
	 * @returns {Bool}
	 * @memberof Game_Actor
	 */
	isEquipChangeOk(slotId: number): boolean;
	/**
	 * Changes the actor equipment in the given slot with the
	 * given equip item. Places the original item into the party
	 * inventory.
	 * @param {Int} slotId
	 * @param {EquipItem} item
	 * @memberof Game_Actor
	 */
	changeEquip(slotId: number, item: rm.types.EquipItem): void;
	/**
	 * Forces the actor to change equipment in the given slot
	 * with the given equip item without placing the item back into
	 * the party inventory.
	 * @param {Int} slotId
	 * @param {EquipItem} item
	 * @memberof Game_Actor
	 */
	forceChangeEquip(slotId: number, item: rm.types.EquipItem): void;
	/**
	 * Trades the new item with the old item in the party inventory.
	 *
	 * @param {EquipItem} newItem
	 * @param {EquipItem} oldItem
	 * @returns {Bool}
	 * @memberof Game_Actor
	 */
	tradeItemWithParty(newItem: rm.types.EquipItem, oldItem: rm.types.EquipItem): boolean;
	/**
	 * Changes the actor equip with an item based on the equip id.
	 *
	 * @param {Int} etypeId
	 * @param {Int} itemId
	 * @memberof Game_Actor
	 */
	changeEquipById(etypeId: number, itemId: number): void;
	/**
	 * Returns true if the actor is equipped with the specific item.
	 *
	 * @param {EquipItem} item
	 * @returns {Bool}
	 * @memberof Game_Actor
	 */
	isEquipped(item: rm.types.EquipItem): boolean;
	/**
	 * Discards the given equip item from the actor; item
	 * is not return to the party inventory.
	 * @param {EquipItem} item
	 * @memberof Game_Actor
	 */
	discardEquip(item: rm.types.EquipItem): void;
	/**
	 * Returns items the actor can't normally equip to the party inventory.
	 *
	 * @param {Bool} forcing
	 * @memberof Game_Actor
	 */
	releaseUnequippableItems(forcing: boolean): void;
	/**
	 * Clears the actor's equipment; items are returned to the inventory.
	 *
	 * @memberof Game_Actor
	 */
	clearEquipments(): void;
	/**
	 * Optimize the actor's equipment.
	 *
	 * @memberof Game_Actor
	 */
	optimizeEquipments(): void;
	/**
	 * Equips the best item in the given slot.
	 *
	 * @param {Int} slotId
	 * @memberof Game_Actor
	 */
	bestEquipItem(slotId: number): void;
	/**
	 * Calculates the equip item performance and returns the sum/difference.
	 *
	 * @param {EquipItem} item
	 * @returns {Int}
	 * @memberof Game_Actor
	 */
	calcEquipItemPerformance(item: rm.types.EquipItem): number;
	isSkillWtypeOk(skill: rm.types.Skill): boolean;
	isWtypeEquipped(wtypeId: number): boolean;
	/**
	 * Refreshes the actor.
	 *
	 * @memberof Game_Actor
	 */
	refresh(): void;
	friendsUnit(): Game_Party;
	opponentsUnit(): Game_Temp;
	/**
	 * Returns true if the actor is a member in battle.
	 *
	 * @returns {Bool}
	 * @memberof Game_Actor
	 */
	isBattleMember(): boolean;
	isFormationChangeOk(): boolean;
	/**
	 * Returns the current class of the actor from the database.
	 *
	 * @returns {Class}
	 * @memberof Game_Actor
	 */
	currentClass(): rm.types.RPGClass;
	/**
	 * Returns true if the actor is the specified class from the database.
	 *
	 * @param {Class} gameClass
	 * @returns {Bool}
	 * @memberof Game_Actor
	 */
	isClass(gameClass: rm.types.RPGClass): boolean;
	/**
	 * Returns the actor's skills; even if the skills are not usable.
	 *
	 * @returns {Array<Skill>}
	 * @memberof Game_Actor
	 */
	skills(): rm.types.Skill[];
	/**
	 * Returns the usable skills of the actor.
	 *
	 * @returns {Array<Skill>}
	 * @memberof Game_Actor
	 */
	usableSkills(): rm.types.Skill[];
	/**
	 * Returns the attack element ids.
	 *
	 * @returns {Array<Int>}
	 * @memberof Game_Actor
	 */
	attackElements(): number[];
	/**
	 * Returns true if the actor has no weapon.
	 *
	 * @returns {Bool}
	 * @memberof Game_Actor
	 */
	hasNoWeapons(): boolean;
	/**
	 * Returns the element id of barehanded attacks.
	 * By default this is 1.
	 *
	 * @returns {Int}
	 * @memberof Game_Actor
	 */
	bareHandsElementId(): number;
	/**
	 * Returns the base value of the parameter.
	 * @param paramId
	 * @return Int
	 */
	paramBase(paramId: number): number;
	/**
	 * Returns the first attack animation id.
	 *
	 * @returns {Int}
	 * @memberof Game_Actor
	 */
	attackAnimationId1(): number;
	/**
	 * Returns the second attack animation id.
	 *
	 * @returns {Int}
	 * @memberof Game_Actor
	 */
	attackAnimationId2(): number;
	/**
	 * Returns the animation id for a barehanded attack.
	 *
	 * @returns {Int}
	 * @memberof Game_Actor
	 */
	bareHandsAnimationId(): number;
	/**
	 * Change the actor experience points; leveling up the actor
	 * if it's above the required exp for the current level.
	 * If show is set to true, actor level up with be displayed.
	 * @param {Int} exp
	 * @param {Bool} show
	 * @memberof Game_Actor
	 */
	changeExp(exp: number, show: boolean): void;
	/**
	 * Level up the actor.
	 *
	 * @memberof Game_Actor
	 */
	levelUp(): void;
	/**
	 * Level down the actor.
	 *
	 * @memberof Game_Actor
	 */
	levelDown(): void;
	findNewSkills(lastSkills: rm.types.Skill[]): rm.types.Skill[];
	/**
	 * Displays the actor level up in a message window, with the learned skills.
	 *
	 * @param {Array<Skill>} newSkills
	 * @memberof Game_Actor
	 */
	displayLevelUp(newSkills: rm.types.Skill[]): void;
	/**
	 * Gives the specified exp to the actor.
	 *
	 * @param {Int} exp
	 * @memberof Game_Actor
	 */
	gainExp(exp: number): void;
	/**
	 * Returns the final exp rate of the actor based on if the actor
	 * is a reserved party member or an active battle member.
	 * @returns {Int}
	 * @memberof Game_Actor
	 */
	finalExpRate(): number;
	/**
	 * Returns the exp rate of actors not in battle; this is set in the database.
	 *
	 * @returns {Int}
	 * @memberof Game_Actor
	 */
	benchMembersExpRate(): number;
	/**
	 * Returns true if the actor should display level up in a message window.
	 *
	 * @returns {Bool}
	 * @memberof Game_Actor
	 */
	shouldDisplayLevelUp(): boolean;
	/**
	 * Changes the actor level; if show is set to true,
	 * the actor level will be displayed.
	 * @param {Int} level
	 * @param {Bool} show
	 * @memberof Game_Actor
	 */
	changeLevel(level: number, show: boolean): void;
	/**
	 * Actor learns the specified skill given the skill id.
	 *
	 * @param {Int} skillId
	 * @memberof Game_Actor
	 */
	learnSkill(skillId: number): void;
	/**
	 * Actor forgets the specified skill given the skill id from
	 * the actor's usable skills.
	 * @param {Int} skillId
	 * @memberof Game_Actor
	 */
	forgetSkill(skillId: number): void;
	/**
	 * Returns true if the actor has learned the specified
	 * skill given the specified skill id.
	 * @param {Int} skillId
	 * @returns {Bool}
	 * @memberof Game_Actor
	 */
	isLearnedSkill(skillId: number): boolean;
	/**
	 * Changes the actor class; if keep is true, the actor
	 * will retain their experience points.
	 * @param {Int} classId
	 * @param {Bool} keepExp
	 * @memberof Game_Actor
	 */
	changeClass(classId: number, keepExp: boolean): void;
	setCharacterImage(characterName: string, characterIndex: number): void;
	/**
	 * Sets the face image of the actor given the face image (from database)
	 * and face index within the iamge.
	 *
	 * @param {String} faceName
	 * @param {Int} faceIndex
	 * @memberof Game_Actor
	 */
	setFaceImage(faceName: string, faceIndex: number): void;
	/**
	 * Sets the battler image of the actor; this is the sprite displayed
	 * in the side view mode.
	 * @param {String} battlerName
	 * @memberof Game_Actor
	 */
	setBattlerImage(battlerName: string): void;
	/**
	 * Returns true if the actor sprite is visible.
	 *
	 * @returns {Bool}
	 * @memberof Game_Actor
	 */
	isSpriteVisible(): boolean;
	/**
	 * Starts the animation on the actor given the specified animation id;
	 * if  mirror is set to true, the animation will be mirrored. If a delay is enter,
	 * the animation will be delayed.
	 * @param {Int} animationId
	 * @param {Bool} mirror
	 * @param {Int} delay
	 * @memberof Game_Actor
	 */
	startAnimation(animationId: number, mirror: boolean, delay: number): void;
	/**
	 * Performs the attack motion for the actor.
	 *
	 * @memberof Game_Actor
	 */
	performAttack(): void;
	/**
	 * Perform the victory motion for the actor.
	 *
	 * @memberof Game_Actor
	 */
	performVictory(): void;
	/**
	 * Performs the escape motion for the actor.
	 *
	 * @memberof Game_Actor
	 */
	performEscape(): void;
	/**
	 * Creates the action list for the actor.
	 *
	 * @returns {Array<Game_Action>}
	 * @memberof Game_Actor
	 */
	makeActionList(): Game_Action[];
	/**
	 * Creates the auto battle actions for the game actor.
	 *
	 * @memberof Game_Actor
	 */
	makeAutoBattleActions(): void;
	makeConfusionActions(): void;
	/**
	 * Handler for when the player walks on the map scene.
	 *
	 * @memberof Game_Actor
	 */
	onPlayerWalk(): void;
	updateStateSteps(state: rm.types.State): void;
	/**
	 * Shows the added states to the actor.
	 *
	 * @memberof Game_Actor
	 */
	showAddedStates(): void;
	/**
	 * Shows the removed states from the actor.
	 *
	 * @memberof Game_Actor
	 */
	showRemovedStates(): void;
	stepsForTurn(): number;
	turnEndOnMap(): void;
	/**
	 * Checks the effect of the floor on the actor.
	 *
	 * @memberof Game_Actor
	 */
	checkFloorEffect(): void;
	/**
	 * Executes the floor dmaage on the actor.
	 *
	 * @memberof Game_Actor
	 */
	executeFloorDamage(): void;
	/**
	 * Returns the basic floor damage.
	 *
	 * @returns {Int}
	 * @memberof Game_Actor
	 */
	basicFloorDamage(): number;
	/**
	 * Returns the max floor damage.
	 *
	 * @returns {Int}
	 * @memberof Game_Actor
	 */
	maxFloorDamage(): number;
	/**
	 * Perform damage to the actor on the map scene.
	 *
	 * @memberof Game_Actor
	 */
	performMapDamage(): void;
	/**
	 * Clears all of the actor's animations.
	 *
	 * @memberof Game_Actor
	 */
	clearActions(): void;
	/**
	 * Returns action the actor is inputting.
	 *
	 * @returns {Game_Action}
	 * @memberof Game_Actor
	 */
	inputtingAction(): Game_Action;
	selectNextCommand(): boolean;
	selectPreviousCommand(): boolean;
	/**
	 * Returns the last menu skill of the actor.
	 *
	 * @returns {Skill}
	 * @memberof Game_Actor
	 */
	lastMenuSkill(): rm.types.Skill;
	setLastMenuSkill(skill: rm.types.Skill): void;
	/**
	 * Returns the last battle skill of the actor.
	 *
	 * @returns {Skill}
	 * @memberof Game_Actor
	 */
	lastBattleSkill(): rm.types.Skill;
	setLastBattleSkill(skill: rm.types.Skill): void;
	/**
	 * Returns the last command symbol that the actor used.
	 *
	 * @returns {String}
	 * @memberof Game_Actor
	 */
	lastCommandSymbol(): string;
	/**
	 * Sets the last command symbol to the given symbol; this is the
	 * selected command in the battle menu.
	 * @param {String} symbol
	 * @memberof Game_Actor
	 */
	setLastCommandSymbol(symbol: string): void;
	/**
	 * Returns true if the item effect  has a special effect from game action.
	 * @param item
	 * @return Bool
	 */
	testEscape(item: rm.types.BaseItem): boolean;
}

declare class Game_Actors {
	constructor();
	/**
	 * List of all Game_Actor in the database.
	 */
	_data: Game_Actor[];
	initialize(): void;
	/**
	 * Returns the actor with the specified id.
	 *
	 * @param {number} actorId
	 * @returns {Game_Actor}
	 * @memberof Game_Actors
	 */
	actor(actorId: number): Game_Actor;
}

declare namespace rm.types {
	export const enum MoveSpeed {
		X8SLOWER = 1,
		X4SLOWER = 2,
		X2SLOWER = 3,
		NORMAL = 4,
		X2FASTER = 5,
		X4FASTER = 6,
	}
}

declare namespace rm.types {
	export const enum MoveFrequency {
		LOWEST = 1,
		LOWER = 2,
		NORMAL = 3,
		HIGHER = 4,
		HIGHEST = 5,
	}
}

declare namespace rm.types {
	export const enum Direction {
		base = -1,
	}
}

declare namespace rm.types {

}

declare namespace rm.types {
	export const enum CharacterPriority {
		BELOW_CHARACTERS = 0,
		SAME_AS_CHARACTERS = 1,
		ABOVE_CHARACTERS = 2,
	}
}

declare namespace rm.types {
	export const enum BalloonId {
		EXCLAMATION = 0,
		QUESTION = 1,
		MUSIC_NOTE = 2,
		HEART = 3,
		ANGER = 4,
		SWEAT = 5,
		COBWEB = 6,
		SILENCE = 7,
		LIGHT_BULB = 8,
		ZZZ = 9,
	}
}

/**
 * The super class of Game Character. It handles basic
 * information such as coordinates, images, and more
 * shared by all characters.
 */
declare class Game_CharacterBase {
	constructor();
	_x: number;
	_y: number;
	_realX: number;
	_realY: number;
	_moveSpeed: rm.types.MoveSpeed;
	_moveFrequency: rm.types.MoveFrequency;
	_opacity: number;
	_blendMode: number;
	_direction: rm.types.Direction;
	_pattern: rm.types.CharacterPattern;
	_priorityType: rm.types.CharacterPriority;
	_tileId: number;
	_characterName: string;
	_characterIndex: number;
	_isObjectCharacter: boolean;
	_walkAnime: boolean;
	_stepAnime: boolean;
	_directionFix: boolean;
	_through: boolean;
	_transparent: boolean;
	_bushDepth: number;
	_animationId: rm.types.AnimationId;
	_ballonId: rm.types.BalloonId;
	_animationPlaying: boolean;
	_balloonPlaying: boolean;
	_animationCount: number;
	_stopCount: number;
	_jumpCount: number;
	_jumpPeak: number;
	_movementSuccess: boolean;
	initialize(): void;
	/**
	 * [read-only]
	 */
	x: number;
	/**
	 * [read-only]
	 */
	y: number;
	initMembers(): void;
	pos(x: number, y: number): boolean;
	posNt(x: number, y: number): boolean;
	/**
	 * Returns the move speed of the game character.
	 *
	 * @returns {Int}
	 * @memberof Game_CharacterBase
	 */
	moveSpeed(): number;
	setMoveSpeed(moveSpeed: number): void;
	/**
	 * Returns the move frequency of the character.
	 *
	 * @returns {Int}
	 * @memberof Game_CharacterBase
	 */
	moveFrequency(): number;
	setMoveFrequency(moveFrequency: number): void;
	opacity(): number;
	setOpacity(opacity: number): void;
	/**
	 * Returns the blend mode of the character;
	 * these are represented by Ints.
	 * @returns {Int}
	 * @memberof Game_CharacterBase
	 */
	blendMode(): number;
	/**
	 * Sets the blend mode of the character;
	 * these are represented by Ints.
	 * @param {Int} blendMode
	 * @memberof Game_CharacterBase
	 */
	setBlendMode(blendMode: number): void;
	/**
	 * Returns true if the character is
	 * normal priority; this means you can collide with them.
	 * @returns {Bool}
	 * @memberof Game_CharacterBase
	 */
	isNormalPriority(): boolean;
	setPriorityType(priorityType: number): void;
	/**
	 * Returns true if the character is moving.
	 *
	 * @returns {Bool}
	 * @memberof Game_CharacterBase
	 */
	isMoving(): boolean;
	/**
	 * Returns true if the character is jumping.
	 *
	 * @returns {Bool}
	 * @memberof Game_CharacterBase
	 */
	isJumping(): boolean;
	/**
	 * Returns the jump height of base character.
	 *
	 * @returns {Int}
	 * @memberof Game_CharacterBase
	 */
	jumpHeight(): number;
	/**
	 * Returns true if the character is stopping.
	 *
	 * @returns {Bool}
	 * @memberof Game_CharacterBase
	 */
	isStopping(): boolean;
	checkStop(threshold: number): boolean;
	/**
	 * Resets the step count of the character.
	 *
	 * @memberof Game_CharacterBase
	 */
	resetStopCount(): void;
	realMoveSpeed(): number;
	distancePerFrame(): number;
	/**
	 * Returns true if the character is dashing.
	 *
	 * @returns {Bool}
	 * @memberof Game_CharacterBase
	 */
	isDashing(): boolean;
	isDebugThrough(): boolean;
	/**
	 * Straightens the character.
	 *
	 * @memberof Game_CharacterBase
	 */
	straighten(): void;
	reverseDir(d: number): number;
	canPass(x: number, y: number, d: number): boolean;
	canPassDiagonally(x: number, y: number, horz: number, vert: number): boolean;
	isMapPassable(x: number, y: number, d: number): boolean;
	isCollidedWithCharacters(x: number, y: number): boolean;
	isCollidedWithEvents(x: number, y: number): boolean;
	isCollidedWithVehicles(x: number, y: number): boolean;
	setPosition(x: number, y: number): void;
	copyPosition(character: Game_Player): void;
	locate(x: number, y: number): void;
	direction(): number;
	/**
	 * Sets the direction of the character based on numpad
	 * directions.
	 * @param {Int} d
	 * @memberof Game_CharacterBase
	 */
	setDirection(d: number): void;
	/**
	 * Returns true if the character is a tile; these
	 * are events without character sprites.
	 * @returns {Bool}
	 * @memberof Game_CharacterBase
	 */
	isTile(): boolean;
	/**
	 * Returns true if the character is an object character;
	 * these are events with character sprites.
	 * @returns {Bool}
	 * @memberof Game_CharacterBase
	 */
	isObjectCharacter(): boolean;
	shiftY(): number;
	scrolledX(): number;
	scrolledY(): number;
	/**
	 * Returns the character's scrreen x position.
	 *
	 * @returns {Int}
	 * @memberof Game_CharacterBase
	 */
	screenX(): number;
	/**
	 * Returns the character's screen y position.
	 *
	 * @returns {Int}
	 * @memberof Game_CharacterBase
	 */
	screenY(): number;
	/**
	 * Returns the character's screen z position.
	 *
	 * @returns {Int}
	 * @memberof Game_CharacterBase
	 */
	screenZ(): number;
	isNearTheScreen(): boolean;
	update(): void;
	updateStop(): void;
	updateJump(): void;
	updateMove(): void;
	updateAnimation(): void;
	animationWait(): number;
	/**
	 * Updates the character's animation count.
	 *
	 * @memberof Game_CharacterBase
	 */
	updateAnimationCount(): void;
	updatePattern(): void;
	maxPattern(): number;
	/**
	 * Returns the pattern of the character; these are the walking
	 * patterns.
	 * @returns {Int}
	 * @memberof Game_CharacterBase
	 */
	pattern(): number;
	/**
	 * Sets the pattern of the character, given
	 * a pattern Int.
	 * @param {Int} pattern
	 * @memberof Game_CharacterBase
	 */
	setPattern(pattern: number): void;
	isOriginalPattern(): boolean;
	/**
	 * Resets the pattern of the character.
	 *
	 * @memberof Game_CharacterBase
	 */
	resetPattern(): void;
	refreshBushDepth(): void;
	isOnLadder(): boolean;
	isOnBush(): boolean;
	/**
	 * Returns the terrain tag of the character.
	 *
	 * @returns {Int}
	 * @memberof Game_CharacterBase
	 */
	terrainTag(): number;
	/**
	 * Returns the region id of the character.
	 *
	 * @returns {Int}
	 * @memberof Game_CharacterBase
	 */
	regionId(): number;
	/**
	 * Increases the character steps.
	 *
	 * @memberof Game_CharacterBase
	 */
	increaseSteps(): void;
	/**
	 * Returns the tile id of character.
	 *
	 * @returns {Int}
	 * @memberof Game_CharacterBase
	 */
	tileId(): number;
	characterName(): string;
	characterIndex(): number;
	setImage(characterName: string, characterIndex: number): void;
	setTileImage(tileId: number): void;
	checkEventTriggerTouchFront(d: number): void;
	checkEventTriggerTouch(x: number, y: number): boolean;
	isMovementSucceeded(x: number, y: number): boolean;
	setMovementSuccess(success: boolean): void;
	moveStraight(d: number): void;
	moveDiagonally(horz: number, vert: number): void;
	jump(xPlus: number, yPlus: number): void;
	hasWalkAnime(): boolean;
	setWalkAnime(walkAnime: boolean): void;
	/**
	 * Returns true if the character has step animation.
	 *
	 * @returns {Bool}
	 * @memberof Game_CharacterBase
	 */
	hasStepAnime(): boolean;
	setStepAnime(stepAnime: boolean): void;
	/**
	 * Returns true if the character is set to a fixed direction.
	 *
	 * @returns {Bool}
	 * @memberof Game_CharacterBase
	 */
	isDirectionFixed(): boolean;
	/**
	 * Sets the character to be fixed in a specified direction
	 * given a Bool value.
	 * @param {Bool} directionFix
	 * @memberof Game_CharacterBase
	 */
	setDirectionFix(directionFix: boolean): void;
	/**
	 * Returns true if the character is set to pass through.
	 *
	 * @returns {Bool}
	 * @memberof Game_CharacterBase
	 */
	isThrough(): boolean;
	setThrough(through: boolean): void;
	isTransparent(): boolean;
	/**
	 * Returns the bush depth around the character.
	 *
	 * @returns {Int}
	 * @memberof Game_CharacterBase
	 */
	bushDepth(): number;
	setTransparent(transparent: boolean): void;
	/**
	 * Requests an animation given the animation id.
	 *
	 * @param {Int} animationId
	 * @memberof Game_CharacterBase
	 */
	requestAnimation(animationId: number): void;
	/**
	 * Requests the balloon animation given the balloon id.
	 *
	 * @param {Int} balloonId
	 * @memberof Game_CharacterBase
	 */
	requestBalloon(balloonId: number): void;
	/**
	 * Returns the animation id.
	 *
	 * @returns {Int}
	 * @memberof Game_CharacterBase
	 */
	animationId(): number;
	/**
	 * Returns the id of the balloon animation.
	 *
	 * @returns {Int}
	 * @memberof Game_CharacterBase
	 */
	balloonId(): number;
	/**
	 * Starts the requested animation.
	 *
	 * @memberof Game_CharacterBase
	 */
	startAnimation(): void;
	/**
	 * Stars a balloon animation.
	 *
	 * @memberof Game_CharacterBase
	 */
	startBalloon(): void;
	isAnimationPlaying(): boolean;
	/**
	 * Returns true if a balloon animation is playing.
	 *
	 * @returns {Bool}
	 * @memberof Game_CharacterBase
	 */
	isBalloonPlaying(): boolean;
	endAnimation(): void;
	/**
	 * Ends the balloon animation on the character.
	 *
	 * @memberof Game_CharacterBase
	 */
	endBalloon(): void;
}

declare namespace rm.types {
	/**
	 * The data class for the Move command.
	 */
	export type MoveCommand = {
		/**
		 * Move command code.
		 */
		code: number;
		/**
		 * An array containing the Move command's arguments. The contents vary for each command.
		 */
		parameters: any[];
	}
}

declare namespace rm.types {
	/**
	 * The data class for the Move route.
	 */
	export type MoveRoute = {
		/**
		 * Program contents. An RPG.MoveCommand array.
		 */
		list: rm.types.MoveCommand[];
		/**
		 * The truth value of the [Repeat Action] option.
		 */
		repeat: boolean;
		/**
		 * The truth value of the [Skip If Cannot Move] option.
		 */
		skippable: boolean;
		/**
		 * The truth value of the [Wait for Completion] option.
		 */
		wait: boolean;
	}
}

/**
 * Super class of Game_Player, Game_Follower, Game_Vehicle,
 * and Game_Event.
 */
declare class Game_Character extends Game_CharacterBase {
	protected constructor();
	_moveRouteForcing: boolean;
	_moveRoute: rm.types.MoveRoute;
	_moveRouteIndex: number;
	_originalMoveRoute: rm.types.MoveRoute;
	_originalMoveRouteIndex: number;
	_waitCount: number;
	initMembers(): void;
	/**
	 * Memorizes the movement route.
	 *
	 * @memberof Game_Character
	 */
	memorizeMoveRoute(): void;
	/**
	 * Restores the original movement route.
	 *
	 * @memberof Game_Character
	 */
	restoreMoveRoute(): void;
	/**
	 * Returns true if the move route is being forced.
	 *
	 * @returns {Bool}
	 * @memberof Game_Character
	 */
	isMoveRouteForcing(): boolean;
	/**
	 * Sets the move route of the game character.
	 *
	 * @param {RPG.MoveRoute} moveRoute
	 * @memberof Game_Character
	 */
	setMoveRoute(moveRoute: rm.types.MoveRoute): void;
	/**
	 * Forces the move route of the game character.
	 *
	 * @param {RPG.MoveRoute} moveRoute
	 * @memberof Game_Character
	 */
	forceMoveRoute(moveRoute: rm.types.MoveRoute): void;
	updateStop(): void;
	/**
	 * Updates the game character's move routine.
	 *
	 * @memberof Game_Character
	 */
	updateRoutineMove(): void;
	/**
	 * Processes the given move commands.
	 *
	 * @param {RPG.MoveCommand} command
	 * @memberof Game_Character
	 */
	processMoveCommand(command: rm.types.MoveCommand): void;
	deltaXFrom(x: number): number;
	deltaYFrom(y: number): number;
	/**
	 * Move's the game character at random.
	 *
	 * @memberof Game_Character
	 */
	moveRandom(): void;
	/**
	 * Moves the game character toward the other game character.
	 *
	 * @param {Game_Character} character
	 * @memberof Game_Character
	 */
	moveTowardCharacter(character: Game_Character): void;
	/**
	 * Moves the game character away from the other game character.
	 *
	 * @param {Game_Character} character
	 * @memberof Game_Character
	 */
	moveAwayFromCharacter(character: Game_Character): void;
	/**
	 * Turns the game character toward the other game character.
	 *
	 * @param {Game_Character} character
	 * @memberof Game_Character
	 */
	turnTowardCharacter(character: Game_Character): void;
	/**
	 * Turns the game character away from the other game character.
	 *
	 * @param {Game_Character} character
	 * @memberof Game_Character
	 */
	turnAwayFromCharacter(character: Game_Character): void;
	/**
	 * Turns the game character toward the player.
	 *
	 * @memberof Game_Character
	 */
	turnTowardPlayer(): void;
	/**
	 * Turns the game character away from the player.
	 *
	 * @memberof Game_Character
	 */
	turnAwayFromPlayer(): void;
	/**
	 * Moves the game character toward the player.
	 *
	 * @memberof Game_Character
	 */
	moveTowardPlayer(): void;
	/**
	 * Moves the game character away from the player.
	 *
	 * @memberof Game_Character
	 */
	moveAwayFromPlayer(): void;
	/**
	 * Moves the game character forward.
	 *
	 * @memberof Game_Character
	 */
	moveForward(): void;
	/**
	 * Moves the game character backward.
	 *
	 * @memberof Game_Character
	 */
	moveBackward(): void;
	/**
	 * Handles the end of the move route.
	 *
	 * @memberof Game_Character
	 */
	processRouteEnd(): void;
	advanceMoveRouteIndex(): void;
	/**
	 * Turns the game character right by 90 degrees.
	 *
	 * @memberof Game_Character
	 */
	turnRight90(): void;
	/**
	 * Turns the game character left by 90 degrees.
	 *
	 * @memberof Game_Character
	 */
	turnLeft90(): void;
	turn180(): void;
	/**
	 * Turns the game character or left by 90 degrees.
	 *
	 * @memberof Game_Character
	 */
	turnRightOrLeft90(): void;
	/**
	 * Turns the game character at random.
	 *
	 * @memberof Game_Character
	 */
	turnRandom(): void;
	swap(character: Game_Character): void;
	findDirectionTo(goalX: number, goalY: number): number;
	/**
	 * Returns the search limit for path finding.
	 *
	 * @returns {Int}
	 * @memberof Game_Character
	 */
	searchLimit(): number;
	static ROUTE_END: number;
	static ROUTE_MOVE_DOWN: number;
	static ROUTE_MOVE_LEFT: number;
	static ROUTE_MOVE_RIGHT: number;
	static ROUTE_MOVE_UP: number;
	static ROUTE_MOVE_LOWER_L: number;
	static ROUTE_MOVE_LOWER_R: number;
	static ROUTE_MOVE_UPPER_L: number;
	static ROUTE_MOVE_UPPER_R: number;
	static ROUTE_MOVE_RANDOM: number;
	static ROUTE_MOVE_TOWARD: number;
	static ROUTE_MOVE_AWAY: number;
	static ROUTE_MOVE_FORWARD: number;
	static ROUTE_MOVE_BACKWARD: number;
	static ROUTE_JUMP: number;
	static ROUTE_WAIT: number;
	static ROUTE_TURN_DOWN: number;
	static ROUTE_TURN_LEFT: number;
	static ROUTE_TURN_RIGHT: number;
	static ROUTE_TURN_UP: number;
	static ROUTE_TURN_90D_R: number;
	static ROUTE_TURN_90D_L: number;
	static ROUTE_TURN_180D: number;
	static ROUTE_TURN_90D_R_L: number;
	static ROUTE_TURN_RANDOM: number;
	static ROUTE_TURN_TOWARD: number;
	static ROUTE_TURN_AWAY: number;
	static ROUTE_SWITCH_ON: number;
	static ROUTE_SWITCH_OFF: number;
	static ROUTE_CHANGE_SPEED: number;
	static ROUTE_CHANGE_FREQ: number;
	static ROUTE_WALK_ANIME_ON: number;
	static ROUTE_WALK_ANIME_OFF: number;
	static ROUTE_STEP_ANIME_ON: number;
	static ROUTE_STEP_ANIME_OFF: number;
	static ROUTE_DIR_FIX_ON: number;
	static ROUTE_DIR_FIX_OFF: number;
	static ROUTE_THROUGH_ON: number;
	static ROUTE_THROUGH_OFF: number;
	static ROUTE_TRANSPARENT_ON: number;
	static ROUTE_TRANSPARENT_OFF: number;
	static ROUTE_CHANGE_IMAGE: number;
	static ROUTE_CHANGE_OPACITY: number;
	static ROUTE_CHANGE_BLEND_MODE: number;
	static ROUTE_PLAY_SE: number;
	static ROUTE_SCRIPT: number;
}

declare namespace rm.types {
	/**
	 * The data class for the Event command.
	 */
	export type EventCommand = {
		/**
		 * The event code.
		 */
		code: number;
		/**
		 * The indent depth. Usually 0. The [Conditional Branch] command, among others, adds 1 with every step deeper.
		 */
		indent: number;
		/**
		 * An array containing the Event command's arguments. The contents vary for each command.
		 */
		parameters: any[];
	}
}

declare namespace rm.types {
	/**
	 * The data class for common events.
	 */
	export type CommonEvent = {
		/**
		 * The event ID.
		 */
		id: number;
		/**
		 * A list of event commands. An RPG.EventCommand array.
		 */
		list: rm.types.EventCommand[];
		/**
		 * The event name.
		 */
		name: string;
		/**
		 * The condition switch ID.
		 */
		switchId: number;
		/**
		 * The event trigger (0: none, 1: autorun; 2: parallel).
		 */
		trigger: number;
	}
}

declare class Game_CommonEvent {
	constructor(commonEventId: number);
	_commonEventId: number;
	_interpreter: Game_Interpreter;
	initialize(commonEventId: number): void;
	/**
	 * Returns the common event information from the database.
	 *
	 * @returns {CommonEvent}
	 * @memberof Game_CommonEvent
	 */
	event(): rm.types.CommonEvent;
	/**
	 * Returns the common event's list of event commands.
	 *
	 * @returns {Array<EventCommand>}
	 * @memberof Game_CommonEvent
	 */
	list(): rm.types.EventCommand[];
	/**
	 * Refreshes the common event.
	 *
	 * @memberof Game_CommonEvent
	 */
	refresh(): void;
	/**
	 * Returns true if the common event is active.
	 *
	 * @returns {boolean}
	 * @memberof Game_CommonEvent
	 */
	isActive(): boolean;
	/**
	 * Updates the common event.
	 *
	 * @memberof Game_CommonEvent
	 */
	update(): void;
}

declare namespace rm.types {
	export type EnemyDropItem = {
		/**
		 * The ID of the data depending on the type of dropped item (item, weapon, or armor).
		 */
		dataId: number;
		/**
		 * N of the probability that the item will be dropped, 1/N.
		 */
		denominator: number;
		/**
		 * The type of dropped item.
		 *
		 * 0: None
		 * 1: Item
		 * 2: Weapon
		 * 3: Armor
		 */
		kind: number;
	}
}

declare namespace rm.types {
	export type Enemy = {
		/**
		 * The enemy's action pattern. An array of RPG.Enemy.Action.
		 */
		actions: rm.types.EnemyAction[];
		/**
		 * The adjustment value for the battler graphic's hue (0..360).
		 */
		battlerHue: number;
		/**
		 * The file name of the enemy's battler graphic.
		 */
		battlerName: string;
		doc: string;
		/**
		 * The items the enemy drops. An RPG.Enemy.DropItem array.
		 */
		dropItems: rm.types.EnemyDropItem[];
		/**
		 * The enemy's experience.
		 */
		exp: number;
		/**
		 * The enemy's gold.
		 */
		gold: number;
		/**
		 * The ID of the enemy in the database.
		 *
		 * @type {number}
		 * @memberof Enemy
		 */
		id: number;
		internal: boolean;
		links: string[];
		/**
		 * The name of the enemy in the database.
		 *
		 * @type {string}
		 * @memberof Enemy
		 */
		name: string;
		parameters: string[];
		/**
		 * Parameters. An array of integers using the following IDs as subscripts:
		 *
		 * 0: Maximum hit points
		 * 1: Maximum magic points
		 * 2: Attack power
		 * 3: Defense power
		 * 4: Magic attack power
		 * 5: Magic defense power
		 * 6: Agility
		 * 7: Luck
		 */
		params: number[];
		platforms: haxe.display.Platform[];
		targets: haxe.display.MetadataTarget[];
	}
}

/**
 * -----------------------------------------------------------------------------
 * Game_Enemy
 *
 * The game object declare class for an enemy.
 * @class Game_Enemy
 */
declare class Game_Enemy extends Game_Battler {
	constructor(enemyId: number, x: number, y: number);
	_enemyId: number;
	_letter: string;
	_plural: boolean;
	_screenX: number;
	_screenY: number;
	initialize(enemyId: number, x: number, y: number): void;
	initMembers(): void;
	setup(enemyId: number, x: number, y: number): void;
	/**
	 * Returns the other troops in the enemy team.
	 *
	 * @returns {Game_Troop}
	 * @memberof Game_Enemy
	 */
	friendsUnit(): Game_Temp;
	/**
	 * Returns the game party.
	 *
	 * @returns {Game_Party}
	 * @memberof Game_Enemy
	 */
	opponentsUnit(): Game_Party;
	isBattleMember(): boolean;
	/**
	 * Returns the enemy id.
	 *
	 * @returns {number}
	 * @memberof Game_Enemy
	 */
	enemyId(): number;
	/**
	 * Returns the enemy information from the database.
	 *
	 * @returns {RPG.Enemy}
	 * @memberof Game_Enemy
	 */
	enemy(): rm.types.Enemy;
	/**
	 * Returns the enemy's exp amount.
	 *
	 * @memberof Game_Enemy
	 */
	exp(): void;
	/**
	 * Returns enemy's given gold.
	 *
	 * @memberof Game_Enemy
	 */
	gold(): void;
	/**
	 * Creates the drop items for the enemy specified by the database.
	 *
	 * @returns {Array<RPG.BaseItem>}
	 * @memberof Game_Enemy
	 */
	makeDropItems(): rm.types.BaseItem[];
	/**
	 * Returns the item drop rate of the enemy.
	 *
	 * @returns {number}
	 * @memberof Game_Enemy
	 */
	dropItemRate(): number;
	itemObject(kind: number, dataId: number): void;
	/**
	 * Returns true if the enemy sprite is visible.
	 *
	 * @returns {boolean}
	 * @memberof Game_Enemy
	 */
	isSpriteVisible(): boolean;
	/**
	 * Returns enemy screen X coordinate.
	 *
	 * @returns {number}
	 * @memberof Game_Enemy
	 */
	screenX(): number;
	/**
	 * Returns enemy screen Y position.
	 *
	 * @returns {number}
	 * @memberof Game_Enemy
	 */
	screenY(): number;
	/**
	 * Returns the hue of the enemy.
	 *
	 * @returns {number}
	 * @memberof Game_Enemy
	 */
	battlerHue(): number;
	/**
	 * Returns the enemy original name.
	 *
	 * @returns {string}
	 * @memberof Game_Enemy
	 */
	originalName(): string;
	isLetterEmpty(): boolean;
	setLetter(letter: string): void;
	setPlural(plural: boolean): void;
	/**
	 * Transform the enemy into another enemy based on id.
	 *
	 * @param {number} enemyId
	 * @memberof Game_Enemy
	 */
	transform(enemyId: number): void;
	meetsCondition(action: rm.types.EnemyAction): boolean;
	meetsTurnCondition(param1: number, param2: number): boolean;
	meetsHpCondition(param1: number, param2: number): boolean;
	meetsMpCondition(param1: number, param2: number): boolean;
	meetsStateCondition(param: number): boolean;
	meetsPartyLevelCondition(param: number): boolean;
	meetsSwitchCondition(param: number): boolean;
	/**
	 * Returns true if the enemy action is valid.
	 *
	 * @param {RPG.Enemy.Action} action
	 * @returns {boolean}
	 * @memberof Game_Enemy
	 */
	isActionValid(action: rm.types.EnemyAction): boolean;
	selectAction(actionList: rm.types.EnemyAction[], ratingZero: number): rm.types.EnemyAction;
	selectAllActions(actionList: rm.types.EnemyAction[]): void;
}

declare namespace rm.types {
	export const enum MoveType {
		FIXED = 0,
		RANDOM = 1,
		APPROACH = 2,
		CUSTOM = 3,
	}
}

declare namespace rm.types {
	export const enum EventTrigger {
		base = -1,
	}
}

declare namespace rm.types {
	/**
	 * The data class for the event page conditions.
	 */
	export type EventPageConditions = {
		/**
		 * The ID of that actor if the [Actor] condition is valid.
		 */
		actorId: string;
		/**
		 * The truth value indicating whether the [Actor] condition is valid.
		 */
		actorValid: boolean;
		/**
		 * The ID of that item if the [Item] condition is valid.
		 */
		itemId: string;
		/**
		 * The truth value indicating whether the [Item] condition is valid.
		 */
		itemValid: boolean;
		/**
		 * The letter of that self switch ("A".."D") if the [Self Switch] condition is valid.
		 */
		selfSwitchCh: string;
		/**
		 * The truth value indicating whether the [Self Switch] condition is valid.
		 */
		selfSwitchValid: boolean;
		/**
		 * The ID of that switch if the first [Switch] condition is valid.
		 */
		switch1Id: number;
		/**
		 * The truth value indicating whether the first [Switch] condition is valid.
		 */
		switch1Valid: boolean;
		/**
		 * The ID of that switch if the second [Switch] condition is valid.
		 */
		switch2Id: number;
		/**
		 * The truth value indicating whether the second [Switch] condition is valid.
		 */
		switch2Valid: boolean;
		/**
		 * The ID of that variable if the [Variable] condition is valid.
		 */
		variableId: number;
		/**
		 * The truth value indicating whether the [Variable] condition is valid.
		 */
		variableValid: boolean;
		/**
		 * The standard value of that variable (x and greater) if the [Variable] condition is valid.
		 */
		variableValue: number;
	}
}

declare namespace rm.types {
	/**
	 * The data class for the Event page [Graphics].
	 */
	export type EventPageImage = {
		/**
		 * The index of the character's graphic file (0..7).
		 */
		characterIndex: number;
		/**
		 * The file name of the character's graphic.
		 */
		characterName: string;
		/**
		 * The direction in which the character is facing (2: down, 4: left, 6: right, 8: up).
		 */
		direction: number;
		/**
		 * The character's pattern (0..2).
		 */
		pattern: number;
		/**
		 * The tile ID. If the specified graphic is not a tile, this value is 0.
		 */
		tileId: number;
	}
}

declare namespace rm.types {
	/**
	 * The data class for the event page.
	 */
	export type EventPage = {
		/**
		 * The event condition (RPG.EventPage.Condition).
		 */
		conditions: rm.types.EventPageConditions;
		/**
		 * The truth value of the [Direction Fix] option.
		 */
		directionFix: boolean;
		/**
		 * The event graphic (RPG.EventPage.Image) .
		 */
		image: rm.types.EventPageImage;
		/**
		 * A list of event commands. An RPG.EventCommand array.
		 */
		list: rm.types.EventCommand[];
		/**
		 * The movement frequency (1: lowest, 2: lower, 3: normal, 4: higher, 5: highest).
		 */
		moveFrequency: number;
		/**
		 * The movement route (RPG.MoveRoute). Referenced only when the movement type is set to custom.
		 */
		moveRoute: rm.types.MoveRoute[];
		/**
		 * The movement speed (1: x8 slower, 2: x4 slower, 3: x2 slower, 4: normal, 5: x2 faster, 6: x4 faster).
		 */
		moveSpeed: number;
		/**
		 * The type of movement (0: fixed, 1: random, 2: approach, 3: custom).
		 */
		moveType: number;
		/**
		 * The priority type (0: below characters, 1: same as characters, 2: above characters).
		 */
		priorityType: number;
		/**
		 * The truth value of the [Stepping Animation] option.
		 */
		stepAnime: boolean;
		/**
		 * The truth value of the [Through] option.
		 */
		through: boolean;
		/**
		 * The event trigger (0: action button, 1: player touch, 2: event touch, 3: autorun, 4: parallel).
		 */
		trigger: number;
		/**
		 * The truth value of the [Walking Animation] option.
		 */
		walkAnime: boolean;
	}
}

declare namespace rm.types {
	/**
	 * The data class for map events.
	 */
	export type Event = {
		/**
		 * The event ID.
		 */
		id: number;
		meta: Object;
		/**
		 * The event name.
		 */
		name: string;
		note: string;
		/**
		 * The event pages. RPG.EventPage array.
		 */
		pages: rm.types.EventPage[];
		/**
		 * The event's x-coordinate on the map.
		 */
		x: number;
		/**
		 * The event's y-coordinate on the map.
		 */
		y: number;
	}
}

/**
 * THe game object class for an event. It contains functionality
 * for event page switching and running parallel process events.
 */
declare class Game_Event extends Game_Character {
	constructor(mapId: number, eventId: number);
	_mapId: number;
	_eventId: number;
	_moveType: rm.types.MoveType;
	/**
	 * @description when does this event trigger:  
	 * 0: player interaction IE: player hits "okay" on this event  
	 * 1: touch  
	 * 2: event touch  
	 * 3: autorun  
	 * 4: parellel  
	 */
	_trigger: rm.types.EventTrigger;
	_starting: boolean;
	_erased: boolean;
	_pageIndex: number;
	_originalPattern: rm.types.CharacterPattern;
	_originalDirection: rm.types.Direction;
	_prelockDirection: rm.types.Direction;
	_locked: boolean;
	initialize(mapId: number, eventId: number): void;
	initMembers(): void;
	/**
	 * Returns the event id of the game event.
	 *
	 * @returns {Int}
	 * @memberof Game_Event
	 */
	eventId(): number;
	/**
	 * Returns the event database information.
	 *
	 * @returns {RPG.Event}
	 * @memberof Game_Event
	 */
	event(): rm.types.Event;
	/**
	 * Returns the event page created in the database.
	 *
	 * @returns {RPG.EventPage}
	 * @memberof Game_Event
	 */
	page(): rm.types.EventPage;
	/**
	 * Returns the list of event commands on the current page of the game event.
	 *
	 * @returns {Array<RPG.EventCommand>}
	 * @memberof Game_Event
	 */
	list(): rm.types.EventCommand[];
	isCollidedWithCharacters(x: number, y: number): boolean;
	isCollidedWithEvents(x: number, y: number): boolean;
	/**
	 * Returns true if the event has collided with the player character
	 * at the specified x and y coordinates.
	 * @param {Int} x
	 * @param {Int} y
	 * @returns {Bool}
	 * @memberof Game_Event
	 */
	isCollidedWithPlayerCharacters(x: number, y: number): boolean;
	/**
	 * Locks the game event.
	 *
	 * @memberof Game_Event
	 */
	lock(): void;
	/**
	 * Unlocks the game eveent.
	 *
	 * @memberof Game_Event
	 */
	unlock(): void;
	updateStop(): void;
	/**
	 * Updates the self movement of the game event.
	 *
	 * @memberof Game_Event
	 */
	updateSelfMovement(): void;
	stopCountThreshold(): number;
	moveTypeRandom(): void;
	moveTypeTowardPlayer(): void;
	/**
	 * Returns true if the game event is near the player.
	 *
	 * @returns {Bool}
	 * @memberof Game_Event
	 */
	isNearThePlayer(): boolean;
	moveTypeCustom(): void;
	/**
	 * Returns true if the event is staring.
	 *
	 * @returns {Bool}
	 * @memberof Game_Event
	 */
	isStarting(): boolean;
	/**
	 * Clears the starting flag.
	 *
	 * @memberof Game_Event
	 */
	clearStartingFlag(): void;
	isTriggerIn(triggers: number[]): boolean;
	/**
	 * Starts the game event.
	 *
	 * @memberof Game_Event
	 */
	start(): void;
	/**
	 * Erases the event.
	 *
	 * @memberof Game_Event
	 */
	erase(): void;
	/**
	 * Refreshes the game event.
	 *
	 * @memberof Game_Event
	 */
	refresh(): void;
	/**
	 * Finds the proper page index of the game event for
	 * event command processing.
	 * @returns {Int}
	 * @memberof Game_Event
	 */
	findProperPageIndex(): number;
	meetsConditions(page: rm.types.EventPage): boolean;
	/**
	 * Sets up the event page.
	 *
	 * @memberof Game_Event
	 */
	setupPage(): void;
	/**
	 * Clears the page settings of the game event.
	 *
	 * @memberof Game_Event
	 */
	clearPageSettings(): void;
	/**
	 * Sets up the event page settings.
	 *
	 * @memberof Game_Event
	 */
	setupPageSettings(): void;
	isOriginalPattern(): boolean;
	/**
	 * Resets the pattern of the game event.
	 *
	 * @memberof Game_Event
	 */
	resetPattern(): void;
	checkEventTriggerAuto(): void;
	update(): void;
	updateParallel(): void;
	locate(x: number, y: number): void;
	/**
	 * Forces the game event to move along the specified route.
	 *
	 * @param {RPG.MoveRoute} moveRoute
	 * @memberof Game_Event
	 */
	forceMoveRoute(moveRoute: rm.types.MoveRoute): void;
}

/**
 * -----------------------------------------------------------------------------
 * Game_Follower
 *
 * The game object declare class for a follower. A follower is an allied character,
 * other than the front character, displayed in the party.
 * @class Game_Follower
 */
declare class Game_Follower extends Game_Character {
	constructor(memberIndex: number);
	_memberIndex: number;
	refresh(): void;
	/**
	 * Returns the current actor.
	 *
	 * @returns {Game_Actor}
	 * @memberof Game_Follower
	 */
	actor(): Game_Actor;
	/**
	 * Returns true if the follower is visible.
	 *
	 * @returns {Bool}
	 * @memberof Game_Follower
	 */
	isVisible(): boolean;
	/**
	 * Updates the game follower.
	 *
	 * @memberof Game_Follower
	 */
	update(): void;
	/**
	 * Has the follower chase a game actor.
	 *
	 * @param {Game_Character} character
	 * @memberof Game_Follower
	 */
	chaseCharacter(character: Game_Character): void;
}

/**
 * -----------------------------------------------------------------------------
 * Game_Followers
 *
 * The wrapper declare class for a follower array.
 * @class Game_Followers
 */
declare class Game_Followers {
	constructor();
	_visible: boolean;
	_gathering: boolean;
	_data: Game_Follower[];
	initialize(): void;
	/**
	 * Returns true if the followers are visible.
	 *
	 * @returns {Bool}
	 * @memberof Game_Followers
	 */
	isVisible(): boolean;
	/**
	 * Shows  the followers.
	 *
	 * @memberof Game_Followers
	 */
	show(): void;
	/**
	 * Hides the followers.
	 *
	 * @memberof Game_Followers
	 */
	hide(): void;
	/**
	 * Returns the followers at the specified index.
	 *
	 * @param {number} index
	 * @returns {Game_Follower}
	 * @memberof Game_Followers
	 */
	follower(index: number): Game_Follower;
	forEach(callback: () => void, thisObject: any): void;
	reverseEach(callback: () => void, thisObject: any): void;
	/**
	 * Refreshes the game followers.
	 *
	 * @memberof Game_Followers
	 */
	refresh(): void;
	/**
	 * Updates the game followers.
	 *
	 * @memberof Game_Followers
	 */
	update(): void;
	/**
	 * Updates the movement of game followers.
	 *
	 * @memberof Game_Followers
	 */
	updateMove(): void;
	jumpAll(): void;
	synchronize(x: number, y: number, d: number): void;
	/**
	 * Gathers the followers.
	 *
	 * @memberof Game_Followers
	 */
	gather(): void;
	/**
	 * Returns true if the followers are gathering.
	 *
	 * @returns {Bool}
	 * @memberof Game_Followers
	 */
	areGathering(): boolean;
	/**
	 * Returns the visible followers.
	 *
	 * @returns {Array<Game_Follower>}
	 * @memberof Game_Followers
	 */
	visibleFollowers(): Game_Follower[];
	/**
	 * Returns true if the followers are moving.
	 *
	 * @returns {Bool}
	 * @memberof Game_Followers
	 */
	areMoving(): boolean;
	/**
	 * Returns true if the followers are gathered.
	 *
	 * @returns {Bool}
	 * @memberof Game_Followers
	 */
	areGathered(): boolean;
	/**
	 * Returns true if the specified follower is collided at the specified x and y
	 *coordinate.
	 *
	 * @param {number} x
	 * @param {number} y
	 * @returns {Bool}
	 * @memberof Game_Followers
	 */
	isSomeoneCollided(x: number, y: number): boolean;
}

/**
 * -----------------------------------------------------------------------------
 * Game_Interpreter
 *
 * The interpreter for running event commands.
 * @class Game_Interpreter
 */
declare class Game_Interpreter {
	constructor(depth: number);
	_depth: number;
	_branch: Object;
	_params: any[];
	_indent: number;
	_frameCount: number;
	_freezeChecker: number;
	_mapId: number;
	_eventId: number;
	_list: rm.types.EventCommand[];
	_index: number;
	_waitCount: number;
	_waitMode: string;
	_comments: string;
	_character: Game_Event;
	_childInterpreter: Game_Interpreter;
	checkOverflow(): void;
	/**
	 * Clears the interpreter.
	 *
	 * @memberof Game_Interpreter
	 */
	clear(): void;
	/**
	 * Sets up the interpreter with the list of event commands, and the given
	 * event Id.
	 *
	 * @param {Array<RPG.EventCommand>} list
	 * @param {Int} eventId
	 * @memberof Game_Interpreter
	 */
	setup(list: rm.types.EventCommand[], eventId: number): void;
	/**
	 * Returns the currrent eventId.
	 *
	 * @returns {Int}
	 * @memberof Game_Interpreter
	 */
	eventId(): number;
	/**
	 * Returns true if the event is on the current map.
	 *
	 * @returns {Bool}
	 * @memberof Game_Interpreter
	 */
	isOnCurrentMap(): boolean;
	/**
	 * Returns true after setting up the reserved common event.
	 *
	 * @returns {Bool}
	 * @memberof Game_Interpreter
	 */
	setupReservedCommonEvent(): boolean;
	/**
	 * Returns true if the interpreter is running.
	 *
	 * @returns {Bool}
	 * @memberof Game_Interpreter
	 */
	isRunning(): boolean;
	update(): void;
	/**
	 * Updates the child game interpreter.
	 *
	 * @returns {Bool}
	 * @memberof Game_Interpreter
	 */
	updateChild(): boolean;
	/**
	 * Updates the wait of the game interpreter.
	 *
	 * @returns {Bool}
	 * @memberof Game_Interpreter
	 */
	updateWait(): boolean;
	updateWaitCount(): boolean;
	updateWaitMode(): boolean;
	/**
	 * Sets the wait mode of the interpreter.
	 *
	 * @param {String} waitMode
	 * @memberof Game_Interpreter
	 */
	setWaitMode(waitMode: string): void;
	/**
	 * sets a specified wait duration for the interpreter.
	 *
	 * @param {Int} duration
	 * @memberof Game_Interpreter
	 */
	wait(duration: number): void;
	fadeSpeed(): number;
	/**
	 * Executes the event command;
	 * returns true or false based on execution.
	 * @returns {Bool}
	 * @memberof Game_Interpreter
	 */
	executeCommand(): boolean;
	/**
	 * Checks if the interpreter has frozen.
	 *
	 * @returns {Bool}
	 * @memberof Game_Interpreter
	 */
	checkFreeze(): boolean;
	/**
	 * Terminates the game interpreter.
	 *
	 * @memberof Game_Interpreter
	 */
	terminate(): void;
	/**
	 * Skips a conditional branch on the interpreter.
	 *
	 * @memberof Game_Interpreter
	 */
	skipBranch(): void;
	/**
	 * Returns the current event command.
	 *
	 * @returns {RPG.EventCommand}
	 * @memberof Game_Interpreter
	 */
	currentCommand(): rm.types.EventCommand;
	/**
	 * Returns the next event code.
	 *
	 * @returns {Int}
	 * @memberof Game_Interpreter
	 */
	nextEventCode(): number;
	iterateActorId(param: number, callback: (actor: Game_Actor) => void): void;
	iterateActorEx(param1: number, param2: number, callback: (actor: Game_Actor) => void): void;
	iterateActorIndex(param: number, callback: (actor: Game_Actor) => void): void;
	iterateEnemyIndex(param: number, callback: (enemt: Game_Enemy) => void): void;
	iterateBattler(param1: number, param2: number, callback: (battler: Game_Battler) => void): void;
	character(param: number): Game_Character;
	operateValue(operation: number, operandType: number, operand: number): number;
	changeHp(target: number, value: number, allowDeath: boolean): void;
	/**
	 * Show Text
	 */
	command101(): boolean;
	/**
	 * Show Choices
	 */
	command102(): boolean;
	setupChoices(params: any[]): void;
	/**
	 * When [**]
	 */
	command402(): boolean;
	/**
	 * When Cancel
	 */
	command403(): boolean;
	/**
	 * Input Number
	 */
	command103(): boolean;
	/**
	 *
	 * @param params
	 */
	setupNumInput(params: number[]): void;
	/**
	 * Select Item
	 */
	command104(): boolean;
	setupItemChoice(params: number[]): void;
	/**
	 * Show Scrolling Text
	 */
	command105(): boolean;
	/**
	 * Comment
	 */
	command108(): boolean;
	/**
	 * Conditional Branch
	 */
	command111(): boolean;
	/**
	 * Else
	 */
	command411(): boolean;
	/**
	 * Loop
	 */
	command112(): boolean;
	/**
	 * Repeat Above
	 */
	command413(): boolean;
	/**
	 * Break Loop
	 */
	command113(): boolean;
	/**
	 * Exit Event Processing
	 */
	command115(): boolean;
	/**
	 * Common Event
	 */
	command117(): boolean;
	setupChild(list: rm.types.EventCommand[], eventId: number): void;
	/**
	 * Label
	 */
	command118(): boolean;
	/**
	 * Jump to Label
	 */
	command119(): boolean;
	jumpTo(index: number): void;
	/**
	 * Control Switches
	 */
	command121(): boolean;
	/**
	 * Control Variables
	 */
	command122(): boolean;
	gameDataOperand(type: number, param1: number, param2: number): number;
	operateVariable(variableId: number, operationType: number, value: number): void;
	/**
	 * Control Self Switch
	 */
	command123(): boolean;
	/**
	 * Control Timer
	 */
	command124(): boolean;
	/**
	 * Change Gold
	 */
	command125(): boolean;
	/**
	 * Change Items
	 */
	command126(): boolean;
	/**
	 * Change Weapons
	 */
	command127(): boolean;
	/**
	 * Change Armors
	 */
	command128(): boolean;
	/**
	 * Change Party Member
	 */
	command129(): boolean;
	/**
	 * Change Battle BGM
	 */
	command132(): boolean;
	/**
	 * Change Victory ME
	 */
	command133(): boolean;
	/**
	 * Change Save Access
	 */
	command134(): boolean;
	/**
	 * Change Menu Access
	 */
	command135(): boolean;
	/**
	 * Change Encounter Disable
	 */
	command136(): boolean;
	/**
	 * Change Formation Access
	 */
	command137(): boolean;
	/**
	 * Change Window Color
	 */
	command138(): boolean;
	/**
	 * Change Defeat ME
	 */
	command139(): boolean;
	/**
	 * Change Vehicle BGM
	 */
	command140(): boolean;
	/**
	 * Transfer Player
	 */
	command201(): boolean;
	/**
	 * Set Vehicle Location
	 */
	command202(): boolean;
	/**
	 * Set Event Location
	 */
	command203(): boolean;
	/**
	 * Scroll Map
	 */
	command204(): boolean;
	/**
	 * Set Movement Route
	 */
	command205(): boolean;
	/**
	 * Getting On and Off Vehicles
	 */
	command206(): boolean;
	/**
	 * Change Transparency
	 */
	command211(): boolean;
	/**
	 * Show Animation
	 */
	command212(): boolean;
	/**
	 * Show Balloon Icon
	 */
	command213(): boolean;
	/**
	 * Erase Event
	 */
	command214(): boolean;
	/**
	 * Change Player Followers
	 */
	command216(): boolean;
	/**
	 * Gather Followers
	 */
	command217(): boolean;
	/**
	 * Fadeout Screen
	 */
	command221(): boolean;
	/**
	 * Fadein Screen
	 */
	command222(): boolean;
	/**
	 * Tint Screen
	 */
	command223(): boolean;
	/**
	 * Flash Screen
	 */
	command224(): boolean;
	/**
	 * Shake Screen
	 */
	command225(): boolean;
	/**
	 * Wait
	 */
	command230(): boolean;
	/**
	 * Show Picture
	 */
	command231(): boolean;
	/**
	 * Move Picture
	 */
	command232(): boolean;
	/**
	 * Rotate Picture
	 */
	command233(): boolean;
	/**
	 * Tint Picture
	 */
	command234(): boolean;
	/**
	 * Erase Picture
	 */
	command235(): boolean;
	/**
	 * Set Weather Effect
	 */
	command236(): boolean;
	/**
	 * Play BGM
	 */
	command241(): boolean;
	/**
	 * Fadeout BGM
	 */
	command242(): boolean;
	/**
	 * Save BGM
	 */
	command243(): boolean;
	/**
	 * Resume BGM
	 */
	command244(): boolean;
	/**
	 * Play BGS
	 */
	command245(): boolean;
	/**
	 * Fadeout BGS
	 */
	command246(): boolean;
	/**
	 * Play ME
	 */
	command249(): boolean;
	/**
	 * Play SE
	 */
	command250(): boolean;
	/**
	 * Stop SE
	 */
	command251(): boolean;
	/**
	 * Play Movie
	 */
	command261(): boolean;
	videoFileExt(): string;
	/**
	 * Change Map Name Display
	 */
	command281(): boolean;
	/**
	 * Change Tileset
	 */
	command282(): boolean;
	/**
	 * Change Battle Back
	 */
	command283(): boolean;
	/**
	 * Change Parallax
	 */
	command284(): boolean;
	/**
	 * Get Location Info
	 */
	command285(): boolean;
	/**
	 * Battle Processing
	 */
	command301(): boolean;
	/**
	 * If Win
	 */
	command601(): boolean;
	/**
	 * If Escape
	 */
	command602(): boolean;
	/**
	 * If Lose
	 */
	command603(): boolean;
	/**
	 * Shop Processing
	 */
	command302(): boolean;
	/**
	 * Name Input Processing
	 */
	command303(): boolean;
	/**
	 * Change HP
	 */
	command311(): boolean;
	/**
	 * Change MP
	 */
	command312(): boolean;
	/**
	 * Change TP
	 */
	command326(): boolean;
	/**
	 * Change State
	 */
	command313(): boolean;
	/**
	 * Recover All
	 */
	command314(): boolean;
	/**
	 * Change EXP
	 */
	command315(): boolean;
	/**
	 * Change Level
	 */
	command316(): boolean;
	/**
	 * Change Parameter
	 */
	command317(): boolean;
	/**
	 * Change Skill
	 */
	command318(): boolean;
	/**
	 * Change Equipment
	 */
	command319(): boolean;
	/**
	 * Change Name
	 */
	command320(): boolean;
	/**
	 * Change Class
	 */
	command321(): boolean;
	/**
	 * Change Actor Images
	 */
	command322(): boolean;
	/**
	 * Change Vehicle Image
	 */
	command323(): boolean;
	/**
	 * Change Nickname
	 */
	command324(): boolean;
	/**
	 * Change Profile
	 */
	command325(): boolean;
	/**
	 * Change Enemy HP
	 */
	command331(): boolean;
	/**
	 * Change Enemy MP
	 */
	command332(): boolean;
	/**
	 * Change Enemy TP
	 */
	command342(): boolean;
	/**
	 * Change Enemy State
	 */
	command333(): boolean;
	/**
	 * Enemy Recover All
	 */
	command334(): boolean;
	/**
	 * Enemy Appear
	 */
	command335(): boolean;
	/**
	 * Enemy Transform
	 */
	command336(): boolean;
	/**
	 * Show Battle Animation
	 */
	command337(): boolean;
	/**
	 * Force Action
	 */
	command339(): boolean;
	/**
	 * Abort Battle
	 */
	command340(): boolean;
	/**
	 * Open Menu Screen
	 */
	command351(): boolean;
	/**
	 * Open Save Screen
	 */
	command352(): boolean;
	/**
	 * Game Over
	 */
	command353(): boolean;
	/**
	 * Return to Title Screen
	 */
	command354(): boolean;
	/**
	 * Script
	 */
	command355(): boolean;
	/**
	 * Plugin Command
	 */
	command356(): boolean;
	pluginCommand(command: string, args: string[]): void;
}

/**
 * Game_Item
 * The game object class for handling skills, items, weapons. armor.
 * This is required, because the save data should not include the database object itself.
 * @class Game_Item
 */
declare class Game_Item {
	constructor(item: rm.types.BaseItem);
	_dataClass: string;
	_itemId: number;
	initialize(): void;
	/**
	 * Returns true the item is a skill.
	 *
	 * @returns {boolean}
	 * @memberof Game_Item
	 */
	isSkill(): boolean;
	/**
	 * Returns true if the item is an item.
	 *
	 * @returns {boolean}
	 * @memberof Game_Item
	 */
	isItem(): boolean;
	/**
	 * Returns true if the item is a usable item, similar to a potion.
	 *
	 * @returns {boolean}
	 * @memberof Game_Item
	 */
	isUsableItem(): boolean;
	/**
	 * Returns true if the item is a weapon.
	 *
	 * @returns {boolean}
	 * @memberof Game_Item
	 */
	isWeapon(): boolean;
	/**
	 * Returns true if the item is an armor.
	 *
	 * @returns {boolean}
	 * @memberof Game_Item
	 */
	isArmor(): boolean;
	/**
	 * Returns true if the item is equippable (weapon or armor).
	 *
	 * @returns {boolean}
	 * @memberof Game_Item
	 */
	isEquipItem(): boolean;
	/**
	 * Returns true if the item is 'null'.
	 *
	 * @returns {boolean}
	 * @memberof Game_Item
	 */
	isNull(): boolean;
	/**
	 * Returns the current itemId.
	 *
	 * @returns {number}
	 * @memberof Game_Item
	 */
	itemId(): number;
	object(): rm.types.BaseItem;
	/**
	 * Sets the current item of the current Game_Item object.
	 *
	 * @param {RPG.BaseItem} item
	 * @memberof Game_Item
	 */
	setObject(item: rm.types.BaseItem): void;
	setEquip(isWeapon: boolean, itemId: number): void;
}

declare namespace rm.types {
	/**
	 * The data class for tile sets.
	 */
	export type Tileset = {
		doc: string;
		/**
		 * The flags table. A 1-dimensional array containing a variety of flags (Table).
		 *
		 * Uses tile IDs as subscripts. The correspondence of each bit is as shown below:
		 *
		 * 0x0001: Impassable downward
		 * 0x0002: Impassable leftward
		 * 0x0004: Impassable rightward
		 * 0x0008: Impassable upward
		 * 0x0010: Display on normal character
		 * 0x0020: Ladder
		 * 0x0040: Bush
		 * 0x0080: Counter
		 * 0x0100: Damage floor
		 * 0x0200: Impassable by boat
		 * 0x0400: Impassable by ship
		 * 0x0800: Airship cannot land
		 * 0xF000: Terrain tag
		 * This manual does not discuss bit operations, but they are similar to those in C.
		 * We recommend an Internet search using keywords such as "hexadecimal bit operations" when necessary.
		 */
		flags: number[];
		/**
		 * The ID of the tile set.
		 */
		id: number;
		internal: boolean;
		links: string[];
		/**
		 * The mode of the tile set (0: Field type, 1: Area type, 2: VX compatible type).
		 */
		mode: number;
		/**
		 * The name of the tile set.
		 */
		name: string;
		parameters: string[];
		platforms: haxe.display.Platform[];
		targets: haxe.display.MetadataTarget[];
		/**
		 * The file name of the graphic used as the number index (0-8) tile set.
		 *
		 * The correspondence between numbers and sets is illustrated in the table below.
		 *
		 * 0 TileA1
		 * 1 TileA2
		 * 2 TileA3
		 * 3 TileA4
		 * 4 TileA5
		 * 5 TileB
		 * 6 TileC
		 * 7 TileD
		 * 8 TileE
		 */
		tilesetNames: string[];
	}
}

declare namespace rm.types {
	export type MapEncounter = {
		/**
		 * An array containing Region IDs.
		 */
		regionSet: number[];
		/**
		 * The enemy Troop ID.
		 */
		troopId: number;
		/**
		 * Weight/chance  among enemies on the map that you'll
		 * meet this enemy.
		 */
		weight: number;
	}
}

/**
 * The game object for the map. It contains scrolling and passage functions
 * along with the game interpreter.
 */
declare class Game_Map {
	constructor();
	_interpreter: Game_Interpreter;
	_mapId: number;
	_tilesetId: number;
	_events: Game_Event[];
	_commonEvents: Game_CommonEvent[];
	_vehicles: Game_Vehicle[];
	_displayX: number;
	_displayY: number;
	_nameDisplay: boolean;
	_scrollDirection: number;
	_scrollRest: number;
	_scrollSpeed: number;
	_parallaxName: string;
	_parallaxZero: boolean;
	_parallaxLoopX: boolean;
	_parallaxLoopY: boolean;
	_parallaxSx: number;
	_parallaxSy: number;
	_parallaxX: number;
	_parallaxY: number;
	_battleback1Name: string;
	_battleback2Name: string;
	_needsRefresh: boolean;
	initialize(): void;
	setup(mapId: number): void;
	/**
	 * Returns true if an event is running.
	 *
	 * @returns {Bool}
	 * @memberof Game_Map
	 */
	isEventRunning(): boolean;
	/**
	 * Returns tile width.
	 *
	 * @returns {Int}
	 * @memberof Game_Map
	 */
	tileWidth(): number;
	/**
	 * Returns tile height.
	 *
	 * @returns {Int}
	 * @memberof Game_Map
	 */
	tileHeight(): number;
	/**
	 * Returns map id.
	 *
	 * @returns {Int}
	 * @memberof Game_Map
	 */
	mapId(): number;
	/**
	 * Returns the tileset id.
	 *
	 * @returns {Int}
	 * @memberof Game_Map
	 */
	tilesetId(): number;
	/**
	 * Returns the display x coordinate.
	 *
	 * @returns {Int}
	 * @memberof Game_Map
	 */
	displayX(): number;
	/**
	 * Returns the display y coordinate.
	 *
	 * @returns {Int}
	 * @memberof Game_Map
	 */
	displayY(): number;
	parallaxName(): string;
	/**
	 * Returns the name of battle back 1.
	 *
	 * @returns {String}
	 * @memberof Game_Map
	 */
	battleback1Name(): string;
	/**
	 * Returns the name of battle back 2.
	 *
	 * @returns {String}
	 * @memberof Game_Map
	 */
	battleback2Name(): string;
	requestRefresh(mapId: number): void;
	/**
	 * Returns true if the name display is enabled.
	 *
	 * @returns {Bool}
	 * @memberof Game_Map
	 */
	isNameDisplayEnabled(): boolean;
	/**
	 * Disables name display.
	 *
	 * @memberof Game_Map
	 */
	disableNameDisplay(): void;
	/**
	 * Enable name display.
	 *
	 * @memberof Game_Map
	 */
	enableNameDisplay(): void;
	/**
	 * Creates the vehicles for the game map.
	 *
	 * @memberof Game_Map
	 */
	createVehicles(): void;
	/**
	 * Refreshes the vehicles on the game map.
	 *
	 * @memberof Game_Map
	 */
	refereshVehicles(): void;
	vehicles(): Game_Vehicle[];
	/**
	 * Returns the game vehicle specified by type.
	 *
	 * @param {String} type
	 * @returns {Game_Vehicle}
	 * @memberof Game_Map
	 */
	vehicle(type: string): Game_Vehicle;
	/**
	 * Returns the game boat.
	 *
	 * @returns {Game_Vehicle}
	 * @memberof Game_Map
	 */
	boat(): Game_Vehicle;
	/**
	 * Returns the game ship.
	 *
	 * @returns {Game_Vehicle}
	 * @memberof Game_Map
	 */
	ship(): Game_Vehicle;
	/**
	 * Returns the game airship.
	 *
	 * @returns {Game_Vehicle}
	 * @memberof Game_Map
	 */
	airship(): Game_Vehicle;
	setupEvents(): void;
	/**
	 * Returns all events on the game map.
	 *
	 * @returns {Array<Game_Event>}
	 * @memberof Game_Map
	 */
	events(): Game_Event[];
	/**
	 * Returns an event, given the event id.
	 *
	 * @param {Int} eventId
	 * @returns {Game_Event}
	 * @memberof Game_Map
	 */
	event(eventId: number): Game_Event;
	/**
	 * Erases the event given the event id.
	 *
	 * @param {Int} eventId
	 * @memberof Game_Map
	 */
	eraseEvent(eventId: number): void;
	/**
	 * Returns all the parallel running common events.
	 *
	 * @returns {Array<RPG.CommonEvent>}
	 * @memberof Game_Map
	 */
	parallelCommonEvents(): rm.types.CommonEvent[];
	setupScroll(): void;
	setupParallax(): void;
	setupBattleback(): void;
	setDisplayPos(x: number, y: number): void;
	parallaxOx(): number;
	parallaxOy(): number;
	/**
	 * Returns the tilset of the game map.
	 *
	 * @returns {RPG.Tileset}
	 * @memberof Game_Map
	 */
	tileset(): rm.types.Tileset;
	/**
	 * Returns the tileset flags of the game map.
	 *
	 * @returns {Array<Int>}
	 * @memberof Game_Map
	 */
	tilesetFlags(): number[];
	/**
	 * Returns the display name of the game map.
	 *
	 * @returns {String}
	 * @memberof Game_Map
	 */
	displayName(): string;
	/**
	 * Returns the map width.
	 *
	 * @returns {Int}
	 * @memberof Game_Map
	 */
	width(): number;
	/**
	 * Returns the map height.
	 *
	 * @returns {Int}
	 * @memberof Game_Map
	 */
	height(): number;
	/**
	 * Returns the map data.
	 *
	 * @returns {Array<Int>}
	 * @memberof Game_Map
	 */
	data(): number[];
	/**
	 * Returns true if the map loops horizontally.
	 *
	 * @returns {Bool}
	 * @memberof Game_Map
	 */
	isLoopHorizontal(): boolean;
	/**
	 * Returns true if the map loops vertically.
	 *
	 * @returns {Bool}
	 * @memberof Game_Map
	 */
	isLoopVertical(): boolean;
	/**
	 * Returns true if dash is disabled on the map.
	 *
	 * @returns {Bool}
	 * @memberof Game_Map
	 */
	isDashDisabled(): boolean;
	/**
	 * Returns the list of possible encounters on the current map.
	 *
	 * @returns {Array<RPG.Map.Encounter>}
	 * @memberof Game_Map
	 */
	encounterList(): rm.types.MapEncounter[];
	/**
	 * Returns the Int of encounter steps on the map.
	 *
	 * @returns {Int}
	 * @memberof Game_Map
	 */
	encounterStep(): number;
	/**
	 * Returns true if the map is an over world map.
	 *
	 * @returns {Bool}
	 * @memberof Game_Map
	 */
	isOverworld(): boolean;
	/**
	 * Returns the screen tile x coordinate.
	 *
	 * @returns {Int}
	 * @memberof Game_Map
	 */
	screenTileX(): number;
	/**
	 * Returns the screen tile y coordinate.
	 *
	 * @returns {Int}
	 * @memberof Game_Map
	 */
	screenTileY(): number;
	adjustX(x: number): number;
	adjustY(y: number): number;
	roundX(x: number): number;
	roundY(y: number): number;
	xWithDirection(x: number, d: number): number;
	yWithDirection(y: number, d: number): number;
	roundXWithDirection(x: number, d: number): number;
	roundYWithDirection(y: number, d: number): number;
	deltaX(x1: number, x2: number): number;
	deltaY(y1: number, y2: number): number;
	distance(x1: number, y1: number, x2: number, y2: number): number;
	/**
	 * Converts the x coordinate from canvas to map coordinate x.
	 *
	 * @param {Int} x
	 * @returns {Int}
	 * @memberof Game_Map
	 */
	canvasToMapX(x: number): number;
	/**
	 * Converts the y coordinate from canvas to map y coordinate.
	 *
	 * @param {Int} y
	 * @returns {Int}
	 * @memberof Game_Map
	 */
	canvasToMapY(y: number): number;
	/**
	 * Auto plays the game map.
	 *
	 * @memberof Game_Map
	 */
	autoplay(): void;
	refreshIfNeeded(): void;
	refresh(): void;
	refreshTileEvents(): void;
	/**
	 * Returns the game events at the specified
	 * x and y position.
	 * @param {Int} x
	 * @param {Int} y
	 * @returns {Array<Game_Event>}
	 * @memberof Game_Map
	 */
	eventsXy(x: number, y: number): Game_Event[];
	eventsXyNt(x: number, y: number): Game_Event[];
	tileEventsXy(x: number, y: number): Game_Event[];
	eventIdXy(x: number, y: number): number;
	scrollDown(distance: number): void;
	scrollLeft(distance: number): void;
	scrollRight(distance: number): void;
	scrollUp(distance: number): void;
	/**
	 * Returns true if the x and y coordinates are valid.
	 *
	 * @param {Int} x
	 * @param {Int} y
	 * @returns {Bool}
	 * @memberof Game_Map
	 */
	isValid(x: number, y: number): boolean;
	checkPassage(x: number, y: number, bit: number): boolean;
	/**
	 * Returns the tile id at the specified x, y, and z coordinates.
	 *
	 * @param {Int} x
	 * @param {Int} y
	 * @param {Int} z
	 * @returns {Int}
	 * @memberof Game_Map
	 */
	tileId(x: number, y: number, z: number): number;
	layeredTiles(x: number, y: number): number[];
	allTiles(x: number, y: number): number[];
	autotileType(x: number, y: number, z: number): number;
	isPassable(x: number, y: number, d: number): boolean;
	isBoatPassable(x: number, y: number): boolean;
	isShipPassable(x: number, y: number): boolean;
	isAirshipLandOk(x: number, y: number): boolean;
	checkLayeredTilesFlags(x: number, y: number, bit: number): boolean;
	/**
	 * Returns true if the specified element at the given x and y coordinates
	 * is a ladder.
	 * @param {Int} x
	 * @param {Int} y
	 * @returns {Bool}
	 * @memberof Game_Map
	 */
	isLadder(x: number, y: number): boolean;
	isBush(x: number, y: number): boolean;
	isCounter(x: number, y: number): boolean;
	isDamageFloor(x: number, y: number): boolean;
	terrainTag(x: number, y: number): number;
	regionId(x: number, y: number): number;
	startScroll(direction: number, distance: number, speed: number): void;
	isScrolling(): boolean;
	/**
	 * Updates the game map, given that the scene is active.
	 *
	 * @param {Bool} sceneActive
	 * @memberof Game_Map
	 */
	update(sceneActive: boolean): void;
	updateScroll(): void;
	scrollDistance(): number;
	doScroll(direction: number, distance: number): void;
	/**
	 * Updates all events on the map.
	 *
	 * @memberof Game_Map
	 */
	updateEvents(): void;
	/**
	 * Updates all game vehicles on the map.
	 *
	 * @memberof Game_Map
	 */
	updateVehicles(): void;
	/**
	 * Updates the map parallaxes.
	 *
	 * @memberof Game_Map
	 */
	updateParallax(): void;
	/**
	 * Changes them ap tileset, given the tileset id.
	 *
	 * @param {Int} tilesetId
	 * @memberof Game_Map
	 */
	changeTileset(tilesetId: number): void;
	changeBattleback(battleback1Name: string, battleback2Name: string): void;
	changeParallax(name: string, loopX: boolean, loopY: boolean, sx: number, sy: number): void;
	/**
	 * Updates the map's game interpreter.
	 *
	 * @memberof Game_Map
	 */
	updateInterpreter(): void;
	/**
	 * Unlocks an event on the map given the event id.
	 *
	 * @param {Int} eventId
	 * @memberof Game_Map
	 */
	unlockEvent(eventId: number): void;
	setupStartingEvent(): boolean;
	setupTestEvent(): boolean;
	setupStartingMapEvent(): boolean;
	/**
	 * Sets up an auto run common event.
	 *
	 * @returns {Bool}
	 * @memberof Game_Map
	 */
	setupAutorunCommonEvent(): boolean;
	/**
	 * Returns true if any event is starting on the map.
	 *
	 * @returns {Bool}
	 * @memberof Game_Map
	 */
	isAnyEventStarting(): boolean;
}

declare namespace rm.types {
	export const enum MessageBackgroundType {
		base = -1,
	}
}

declare namespace rm.types {
	export const enum MessagePositionType {
		base = -1,
	}
}

declare namespace rm.types {
	export const enum ChoiceDefaultType {
		base = -1,
	}
}

declare namespace rm.types {
	export const enum ChoiceCancelType {
		base = -1,
	}
}

declare namespace rm.types {
	export const enum ChocieBackgroundType {
		base = -1,
	}
}

declare namespace rm.types {
	export const enum ChoicePositionType {
		base = -1,
	}
}

declare class Game_Message {
	constructor();
	_texts: string[];
	_choices: string[];
	_faceName: string;
	_faceIndex: number;
	_background: rm.types.MessageBackgroundType;
	_positionType: rm.types.MessagePositionType;
	_choiceDefaultType: rm.types.ChoiceDefaultType;
	_choiceCancelType: rm.types.ChoiceCancelType;
	_choiceBackground: rm.types.ChocieBackgroundType;
	_choicePositionType: rm.types.ChoicePositionType;
	_numInputVariableId: number;
	_numInputMaxDigits: number;
	_itemChoiceVariableId: number;
	_itemChoiceItypeId: number;
	_scrollMode: boolean;
	_scrollSpeed: number;
	_scrollNoFast: boolean;
	_choiceCallback: (n: number) => void;
	initialize(): void;
	clear(): void;
	choices(): string[];
	/**
	 * Returns the name of the face image used for the message.
	 *
	 * @returns {String}
	 * @memberof Game_Message
	 */
	faceName(): string;
	/**
	 * Returns the face index within the face image to display the
	 * correct face.
	 * @returns {number}
	 * @memberof Game_Message
	 */
	faceIndex(): number;
	/**
	 * Returns the background associated with the message;
	 * this is the background
	 * @returns {number}
	 * @memberof Game_Message
	 */
	background(): number;
	/**
	 * Returns the current position type of the message window.
	 *
	 * @returns {number}
	 * @memberof Game_Message
	 */
	positionType(): number;
	choiceDefaultType(): number;
	choiceCancelType(): number;
	/**
	 * Returns the background type of the choice window.
	 *
	 * @returns {number}
	 * @memberof Game_Message
	 */
	choiceBackground(): number;
	/**
	 * Returns the position of the choice window.
	 *
	 * @returns {number}
	 * @memberof Game_Message
	 */
	choicePositionType(): number;
	/**
	 * Returns the number input variable id.
	 *
	 * @returns {number}
	 * @memberof Game_Message
	 */
	numInputVariableId(): number;
	/**
	 * Returns the number input maximum digits.
	 *
	 * @returns {number}
	 * @memberof Game_Message
	 */
	numInputMaxDigits(): number;
	/**
	 * Returns the item choice variable id.
	 *
	 * @returns {number}
	 * @memberof Game_Message
	 */
	itemChoiceVariableId(): number;
	/**
	 * Returns the item choice item type id.
	 *
	 * @returns {number}
	 * @memberof Game_Message
	 */
	itemChoiceItypeId(): number;
	/**
	 * Returns true if the scroll mode is set to true.
	 *
	 * @returns {boolean}
	 * @memberof Game_Message
	 */
	scrollMode(): boolean;
	/**
	 * Returns the scroll speed.
	 *
	 * @returns {number}
	 * @memberof Game_Message
	 */
	scrollSpeed(): number;
	/**
	 * Returns true if the scroll is set to not being fast.
	 *
	 * @returns {boolean}
	 * @memberof Game_Message
	 */
	scrollNoFast(): boolean;
	/**
	 * Adds text to the game message object.
	 *
	 * @param {String} text
	 * @memberof Game_Message
	 */
	add(text: string): void;
	setFaceImage(faceName: string, faceIndex: number): void;
	/**
	 * Sets the background of the message window;
	 * options are 0 (fully opaque), 1 (transparent), 2 (invisible background).
	 * The default is 0.
	 * @param {number} background
	 * @memberof Game_Message
	 */
	setBackground(background: number): void;
	/**
	 * Sets the position of the message window;
	 * default is 2.
	 * @param {number} positionType
	 * @memberof Game_Message
	 */
	setPositionType(positionType: number): void;
	/**
	 * Sets the choices within the choice window;
	 * sets the default and cancel choices for the window.
	 * @param {Array<String>} choices
	 * @param {number} defaultType
	 * @param {number} cancelType
	 * @memberof Game_Message
	 */
	setChoices(choices: string[], defaultType: number, cancelType: number): void;
	setChoiceBackground(background: number): void;
	/**
	 * Sets the position of the choice window associated with the
	 * message window.
	 * @param {number} positionType
	 * @memberof Game_Message
	 */
	setChoicePositionType(positionType: number): void;
	/**
	 * Sets the number input and associates it with a variable id;
	 * the max number of digits can also be set.
	 * @param {number} variableId
	 * @param {number} maxDigits
	 * @memberof Game_Message
	 */
	setNumberInput(variableId: number, maxDigits: number): void;
	/**
	 * Sets the choice and associates it with a variable id;
	 * sets the itemtype id associated with the choice.
	 * @param {number} variableId
	 * @param {number} itemType
	 * @memberof Game_Message
	 */
	setItemChoice(variableId: number, itemType: number): void;
	/**
	 * Sets the scroll speed of the message window;
	 * disable fast movement if noFast is set to true.
	 * @param {number} speed
	 * @param {boolean} noFast
	 * @memberof Game_Message
	 */
	setScroll(speed: number, noFast: boolean): void;
	/**
	 * Sets a callback to be associated with a specific choice;
	 * a callback is a JavaScript function that will be run when the
	 * choice is selected.
	 * @param {((n: number) => Void)} callback
	 * @memberof Game_Message
	 */
	setChoiceCallback(callback: (n: number) => void): void;
	onChoice(n: number): void;
	/**
	 * Returns true if the game message object has text.
	 *
	 * @returns {boolean}
	 * @memberof Game_Message
	 */
	hasText(): boolean;
	/**
	 * Returns true if the game message object has a set of choices.
	 *
	 * @returns {boolean}
	 * @memberof Game_Message
	 */
	isChoice(): boolean;
	/**
	 * Returns true if the game message object has a number input attached.
	 *
	 * @returns {boolean}
	 * @memberof Game_Message
	 */
	isNumberInput(): boolean;
	/**
	 * Returns true if the game message object has an item choice attached.
	 *
	 * @returns {boolean}
	 * @memberof Game_Message
	 */
	isItemChoice(): boolean;
	/**
	 * Returns true if the game message object has text, choices, number input,
	 * or item choice.
	 * @returns {boolean}
	 * @memberof Game_Message
	 */
	isBusy(): boolean;
	/**
	 * Creates a new page for the text within the message window.
	 *
	 * @memberof Game_Message
	 */
	newPage(): void;
	/**
	 * Returns all of the text contained within the message.
	 *
	 * @returns {String}
	 * @memberof Game_Message
	 */
	allText(): string;
}

/**
 * Superclass of Game_Party & Game_Troop
 *
 * @class Game_Unit
 */
declare class Game_Unit {
	constructor();
	_inBattle: boolean;
	initialize(): void;
	/**
	 * Returns true if unit is in battle.
	 *
	 * @returns {boolean}
	 * @memberof Game_Unit
	 */
	inBattle(): boolean;
	/**
	 * Returns the list of battlers.
	 *
	 * @returns {Array<Game_Battler>}
	 * @memberof Game_Unit
	 */
	members(): Game_Battler[];
	/**
	 * Returns the list of alive battlers.
	 *
	 * @returns {Array<Game_Battler>}
	 * @memberof Game_Unit
	 */
	aliveMembers(): Game_Battler[];
	/**
	 * Returns the list of dead battlers.
	 *
	 * @returns {Array<Game_Battler>}
	 * @memberof Game_Unit
	 */
	deadMembers(): Game_Battler[];
	/**
	 * Returns the list of movable members.
	 *
	 * @returns {Array<Game_Battler>}
	 * @memberof Game_Unit
	 */
	movableMembers(): Game_Battler[];
	/**
	 * Clears the unit's actions.
	 *
	 * @memberof Game_Unit
	 */
	clearActions(): void;
	/**
	 * Returns the agility of the unit.
	 *
	 * @returns {Int}
	 * @memberof Game_Unit
	 */
	agility(): number;
	tgrSum(): number;
	/**
	 * Returns a random target from the game unit.
	 *
	 * @returns {Game_Battler}
	 * @memberof Game_Unit
	 */
	randomTarget(): Game_Battler;
	/**
	 * Returns a random dead target from the game unit.
	 *
	 * @returns {Game_Battler}
	 * @memberof Game_Unit
	 */
	randomDeadTarget(): Game_Battler;
	smoothTarget(index: number): Game_Battler;
	smoothDeadTarget(index: number): Game_Battler;
	/**
	 * Clears the action results.
	 *
	 * @memberof Game_Unit
	 */
	clearResults(): void;
	/**
	 * Handler for when battle is started.
	 *
	 * @memberof Game_Unit
	 */
	onBattleStart(): void;
	/**
	 * Handler for when battle has ended.
	 *
	 * @memberof Game_Unit
	 */
	onBattleEnd(): void;
	/**
	 * Creates the action's of the game unit.
	 *
	 * @memberof Game_Unit
	 */
	makeActions(): void;
	/**
	 * Selects a member of the unit given a battler.
	 *
	 * @param {Game_Battler} activeMember
	 * @memberof Game_Unit
	 */
	select(activeMember: Game_Battler): void;
	/**
	 * Returns true if all members of the unit are dead.
	 *
	 * @returns {Bool}
	 * @memberof Game_Unit
	 */
	isAllDead(): boolean;
	substituteBattler(): Game_Battler;
}

/**
 * The game object for the party. Contains information
 * such as gold and items.
 */
declare class Game_Party extends Game_Unit {
	protected constructor();
	_gold: number;
	_steps: number;
	_lastItem: Game_Item;
	_menuActorId: number;
	_targetActorId: number;
	_actors: Game_Actor[];
	/**
	 * Data structure.
	 * [ItemId:Int] : Int
	 */
	_items: { [key: string]: any };
	/**
	 * Data structure.
	 * [weaponId:Int] : Int
	 */
	_weapons: { [key: string]: any };
	/**
	 * Data structure.
	 * [armorId:Int] : Int
	 */
	_armors: { [key: string]: any };
	/**
	 * Returns all party members.
	 *
	 * @returns {Array<Game_Actor>}
	 * @memberof Game_Party
	 */
	members(): Game_Actor[];
	/**
	 * Returns the living party members.
	 *
	 * @returns {Array<Game_Actor>}
	 * @memberof Game_Party
	 */
	aliveMembers(): Game_Actor[];
	/**
	 * Returns the dead party members.
	 *
	 * @returns {Array<Game_Actor>}
	 * @memberof Game_Party
	 */
	deadMembers(): Game_Actor[];
	/**
	 * Returns the movable members in the party.
	 *
	 * @returns {Array<Game_Actor>}
	 * @memberof Game_Party
	 */
	movableMembers(): Game_Actor[];
	/**
	 * Returns the battle members in the party.
	 *
	 * @returns {Array<Game_Actor>}
	 * @memberof Game_Party
	 */
	battleMembers(): Game_Actor[];
	/**
	 * Initialize all party items.
	 *
	 * @memberof Game_Party
	 */
	initAllItems(): void;
	/**
	 * Returns true if the game party exists.
	 *
	 * @returns {Bool}
	 * @memberof Game_Party
	 */
	exists(): boolean;
	/**
	 * Returns the size of the party.
	 *
	 * @returns {Int}
	 * @memberof Game_Party
	 */
	size(): number;
	/**
	 * Returns true if the game party is empty.
	 *
	 * @returns {Bool}
	 * @memberof Game_Party
	 */
	isEmpty(): boolean;
	/**
	 * Returns the maximum battle members in the party.
	 *
	 * @returns {Int}
	 * @memberof Game_Party
	 */
	maxBattleMembers(): number;
	/**
	 * Returns the leader of the party.
	 *
	 * @returns {Game_Actor}
	 * @memberof Game_Party
	 */
	leader(): Game_Actor;
	/**
	 * Revive the battle members of the party.
	 *
	 * @memberof Game_Party
	 */
	reviveBattleMembers(): void;
	items(): rm.types.Item[];
	/**
	 * Returns the weapons of the party.
	 *
	 * @returns {Array<RPG.Weapon>}
	 * @memberof Game_Party
	 */
	weapons(): rm.types.Weapon[];
	/**
	 * Returns the party's armor.
	 *
	 * @returns {Array<RPG.Armor>}
	 * @memberof Game_Party
	 */
	armors(): rm.types.Armor[];
	/**
	 * Returns the party's equippable items.
	 *
	 * @returns {Array<RPG.EquipItem>}
	 * @memberof Game_Party
	 */
	equipItems(): rm.types.EquipItem[];
	/**
	 * Returns all items within the party's posession.
	 * Items can be of equip item, or item type.
	 * @returns {Array<RPG.BaseItem>}
	 * @memberof Game_Party
	 */
	allItems(): rm.types.BaseItem[];
	itemContainer(item: rm.types.BaseItem): {ItemId: number};
	/**
	 * Sets up the starting party members.
	 *
	 * @memberof Game_Party
	 */
	setupStartingMembers(): void;
	name(): string;
	/**
	 * Sets up a test battle with the party.
	 *
	 * @memberof Game_Party
	 */
	setupBattleTest(): void;
	/**
	 * Sets up the battle test members.
	 *
	 * @memberof Game_Party
	 */
	setupBattleTestMembers(): void;
	/**
	 * Sets up the battle test items.
	 *
	 * @memberof Game_Party
	 */
	setupBattleTestItems(): void;
	/**
	 * Returns the highest level in the party.
	 *
	 * @returns {Int}
	 * @memberof Game_Party
	 */
	highestLevel(): number;
	/**
	 * Adds an actor to the party given the actor id.
	 *
	 * @param {Int} actorId
	 * @memberof Game_Party
	 */
	addActor(actorId: number): void;
	/**
	 * Removes an actor from the party given the actor id.
	 *
	 * @param {Int} actorId
	 * @memberof Game_Party
	 */
	removeActor(actorId: number): void;
	/**
	 * Returns party gold.
	 *
	 * @returns {Int}
	 * @memberof Game_Party
	 */
	gold(): number;
	/**
	 * Increases the party gold given a specified amount.
	 *
	 * @param {Int} amount
	 * @memberof Game_Party
	 */
	gainGold(amount: number): void;
	/**
	 * Decreases the party gold given a specified amount.
	 *
	 * @param {Int} amount
	 * @memberof Game_Party
	 */
	loseGold(amount: number): void;
	/**
	 * Returns maximum gold of the party.
	 *
	 * @returns {Int}
	 * @memberof Game_Party
	 */
	maxGold(): number;
	/**
	 * Returns the Int of steps the party has taken.
	 *
	 * @returns {Int}
	 * @memberof Game_Party
	 */
	steps(): number;
	/**
	 * Increases the Int of steps the party has taken.
	 *
	 * @memberof Game_Party
	 */
	increaseSteps(): void;
	/**
	 * Returns the Int of items in the possession of the party of the
	 * given item.
	 * @param {RPG.BaseItem} item
	 * @returns {Int}
	 * @memberof Game_Party
	 */
	numItems(item: rm.types.BaseItem): number;
	/**
	 * Returns the maximum Int of items of the given item.
	 *
	 * @param {RPG.BaseItem} item
	 * @returns {Int}
	 * @memberof Game_Party
	 */
	maxItems(item: rm.types.BaseItem): number;
	hasMaxItems(item: rm.types.BaseItem): boolean;
	/**
	 * Returns true if the party has the given item;
	 * if includeEquip is set to true, this will also check party equipment.
	 * @param {RPG.BaseItem} item
	 * @param {Bool} includeEquip
	 * @returns {Bool}
	 * @memberof Game_Party
	 */
	hasItem(item: rm.types.BaseItem, includeEquip: boolean): boolean;
	/**
	 * Returns true if any party member has the specified equip item.
	 *
	 * @param {RPG.EquipItem} item
	 * @returns {Bool}
	 * @memberof Game_Party
	 */
	isAnyMemberEquipped(item: rm.types.EquipItem): boolean;
	gainItem(item: rm.types.BaseItem, amount: number, includeEquip: boolean): void;
	discardMembersEquip(item: rm.types.EquipItem, amount: number): void;
	loseItem(item: rm.types.BaseItem, amount: number, includeEquip: boolean): void;
	/**
	 * Has the party consume the given item.
	 *
	 * @param {RPG.BaseItem} item
	 * @memberof Game_Party
	 */
	consumeItem(item: rm.types.BaseItem): void;
	/**
	 * Returns true if the party can use the item.
	 *
	 * @param {RPG.BaseItem} item
	 * @returns {Bool}
	 * @memberof Game_Party
	 */
	canUse(item: rm.types.BaseItem): boolean;
	canInput(): boolean;
	/**
	 * Handler for when the player walks.
	 *
	 * @memberof Game_Party
	 */
	onPlayerWalk(): void;
	/**
	 * Returns the actor that will be used in the current menu;
	 * this is for menu scenes that target one actor.
	 * @returns {Game_Actor}
	 * @memberof Game_Party
	 */
	menuActor(): Game_Actor;
	setMenuActor(actor: Game_Actor): void;
	makeMenuActorNext(): void;
	makeMenuActorPrevious(): void;
	targetActor(): Game_Actor;
	setTargetActor(actor: Game_Actor): void;
	/**
	 * Returns the last item selected by the game party.
	 *
	 * @returns {RPG.BaseItem}
	 * @memberof Game_Party
	 */
	lastItem(): rm.types.BaseItem;
	setLastItem(item: rm.types.BaseItem): void;
	swapOrder(index1: number, index2: number): void;
	/**
	 * Returns the characters that go on the save life.
	 *
	 * @returns {Array<Array<any>>}
	 * @memberof Game_Party
	 */
	charactersForSavefile(): any[][];
	/**
	 * Returns the actor faces for the save file.
	 *
	 * @returns {Array<Array<any>>}
	 * @memberof Game_Party
	 */
	facesForSavefile(): any[][];
	partyAbility(abilityId: number): boolean;
	/**
	 * Returns true if the encounter rate is set to half.
	 *
	 * @returns {Bool}
	 * @memberof Game_Party
	 */
	hasEncounterHalf(): boolean;
	/**
	 * Returns true if the encounter rate is set to none.
	 *
	 * @returns {Bool}
	 * @memberof Game_Party
	 */
	hasEncounterNone(): boolean;
	hasCancelSurprise(): boolean;
	/**
	 * Returns true if the party has an increased chance of preemptive strike.
	 *
	 * @returns {Bool}
	 * @memberof Game_Party
	 */
	hasRaisePreemptive(): boolean;
	/**
	 * Returns true if the party has double gold in effect.
	 *
	 * @returns {Bool}
	 * @memberof Game_Party
	 */
	hasGoldDouble(): boolean;
	hasDropItemDouble(): boolean;
	ratePreemptive(troopAgi: number): number;
	rateSurprise(troopAgi: number): number;
	/**
	 * Performs victory motion for the entire party.
	 *
	 * @memberof Game_Party
	 */
	performVictory(): void;
	/**
	 * Performs escape motion for the entire party.
	 *
	 * @memberof Game_Party
	 */
	performEscape(): void;
	/**
	 * Remove battle states from all actors in the party.
	 *
	 * @memberof Game_Party
	 */
	removeBattleStates(): void;
	/**
	 * Refreshes the motion on all actors in the party.
	 *
	 * @memberof Game_Party
	 */
	requestMotionRefresh(): void;
	static ABILITY_ENCOUNTER_HALF: number;
	static ABILITY_ENCOUNTER_NONE: number;
	static ABILITY_CANCEL_SURPRISE: number;
	static ABILITY_RAISE_PREEMPTIVE: number;
	static ABILITY_GOLD_DOUBLE: number;
	static ABILITY_DROP_ITEM_DOUBLE: number;
}

/**
 * -----------
 * The game object class for a picture.
 *
 */
declare class Game_Picture {
	constructor();
	/**
	 * _name property of the current picture.
	 *
	 * @protected
	 * @type {string}
	 * @memberof Game_Picture
	 */
	_name: string;
	_origin: number;
	_x: number;
	_y: number;
	_scaleX: number;
	_scaleY: number;
	_opacity: number;
	/**
	 * Blend Mode, accepts an integer.
	 */
	_blendMode: number;
	_targetX: number;
	_targetY: number;
	_targetScaleX: number;
	_targetScaleY: number;
	_targetOpacity: number;
	_duration: number;
	/**
	 * Tone of the picture, in RGB format.
	 * 0 - 255, for all three tone elements.
	 */
	_tone: number[];
	_toneTarget: number[];
	_toneDuration: number;
	_angle: number;
	_rotationSpeed: number;
	initialize(): void;
	/**
	 * Returns the name of the game picture.
	 *
	 * @returns {string}
	 * @memberof Game_Picture
	 */
	name(): string;
	/**
	 * Returns the origin of the game picture.
	 *
	 * @returns {number}
	 * @memberof Game_Picture
	 */
	origin(): number;
	/**
	 * Returns the picture x coordinate.
	 *
	 * @returns {number}
	 * @memberof Game_Picture
	 */
	x(): number;
	/**
	 * Returns the picture y coordinate.
	 *
	 * @returns {number}
	 * @memberof Game_Picture
	 */
	y(): number;
	/**
	 * Returns x scale of the game picture.
	 *
	 * @returns {number}
	 * @memberof Game_Picture
	 */
	scaleX(): number;
	/**
	 * Returns the y scale of the game picture.
	 *
	 * @returns {number}
	 * @memberof Game_Picture
	 */
	scaleY(): number;
	/**
	 * Returns the opacity of the game picture.
	 *
	 * @returns {number}
	 * @memberof Game_Picture
	 */
	opacity(): number;
	/**
	 * Returns the blend mode of the game picture.
	 *
	 * @returns {number}
	 * @memberof Game_Picture
	 */
	blendMode(): number;
	/**
	 * Returns the tone of the game picture.
	 *
	 * @returns {Array<number>}
	 * @memberof Game_Picture
	 */
	tone(): number[];
	/**
	 * Returns the angle of the game picture.
	 *
	 * @returns {number}
	 * @memberof Game_Picture
	 */
	angle(): number;
	initBasic(): void;
	initTarget(): void;
	initTone(): void;
	initRotation(): void;
	show(name: string, origin: number, x: number, y: number, scaleX: number, scaleY: number, opacity: number, blendMode: number): void;
	move(origin: number, x: number, y: number, scaleX: number, scaleY: number, opacity: number, blendMode: number, duration: number): void;
	rotate(speed: number): void;
	tint(tone: number[], duration: number): void;
	/**
	 * Erases the game picture.
	 *
	 * @memberof Game_Picture
	 */
	erase(): void;
	/**
	 * Updates the game picture.
	 *
	 * @memberof Game_Picture
	 */
	update(): void;
	/**
	 * Updates the movement of the game picture.
	 *
	 * @memberof Game_Picture
	 */
	updateMove(): void;
	/**
	 * Updates the tone of the game picture.
	 *
	 * @memberof Game_Picture
	 */
	updateTone(): void;
	/**
	 * Updates the rotation of the game picture.
	 *
	 * @memberof Game_Picture
	 */
	updateRotation(): void;
}

/**
 * The game object class for the player. It contains,
 * encounter information, x, y, vehicle type, and whether
 * the player is dashing. The Game Player State is this
 * object.
 */
declare class Game_Player extends Game_Character {
	protected constructor();
	_vehicleType: string;
	_vehicleGettingOn: boolean;
	_vehicleGettingOff: boolean;
	_dashing: boolean;
	_needsMapReload: boolean;
	_transferring: boolean;
	_newX: number;
	_newY: number;
	_newDirection: rm.types.Direction;
	_fadeType: number;
	_followers: Game_Followers;
	_encounterCount: number;
	/**
	 * Clears the transfer information for the player.
	 *
	 * @memberof Game_Player
	 */
	clearTransferInfo(): void;
	/**
	 * Returns the player followers (party members).
	 *
	 * @returns {Game_Followers}
	 * @memberof Game_Player
	 */
	followers(): Game_Followers;
	/**
	 * Refreshes the game player.
	 *
	 * @memberof Game_Player
	 */
	refresh(): void;
	/**
	 * Returns true if the player is stopping.
	 *
	 * @returns {Bool}
	 * @memberof Game_Player
	 */
	isStopping(): boolean;
	/**
	 * Reserves a transfer of the player to the specified map, at the given
	 * x and y coordinates, facing the given direction (d). Using a specific fade.
	 * @param {Int} mapId
	 * @param {Int} x
	 * @param {Int} y
	 * @param {Int} [d]
	 * @param {Int} [fadeType]
	 * @memberof Game_Player
	 */
	reserveTransfer(mapId: number, x: number, y: number, d?: number, fadeType?: number): void;
	requestMapReload(): void;
	isTransferring(): boolean;
	/**
	 * Returns the new map id.
	 *
	 * @returns {Int}
	 * @memberof Game_Player
	 */
	newMapId(): number;
	fadeType(): number;
	/**
	 * Performs a transfer of the player to a different area or map.
	 *
	 * @memberof Game_Player
	 */
	performTransfer(): void;
	isMapPassable(x: number, y: number, d: number): boolean;
	/**
	 * Returns the current vehicles the player is riding in.
	 *
	 * @returns {Game_Vehicle}
	 * @memberof Game_Player
	 */
	vehicle(): Game_Vehicle;
	/**
	 * Returns true if the player is in a boat.
	 *
	 * @returns {Bool}
	 * @memberof Game_Player
	 */
	isInBoat(): boolean;
	/**
	 * Returns true if the player is in a ship.
	 *
	 * @returns {Bool}
	 * @memberof Game_Player
	 */
	isInShip(): boolean;
	/**
	 * Returns true if the player is in an airship.
	 *
	 * @returns {Bool}
	 * @memberof Game_Player
	 */
	isInAirship(): boolean;
	/**
	 * Returns true if the player is in a vehicle.
	 *
	 * @returns {Bool}
	 * @memberof Game_Player
	 */
	isInVehicle(): boolean;
	/**
	 * Returns true if the player is in their normal state.
	 *
	 * @returns {Bool}
	 * @memberof Game_Player
	 */
	isNormal(): boolean;
	/**
	 * Returns true if the player is dashing.
	 *
	 * @returns {Bool}
	 * @memberof Game_Player
	 */
	isDashRing(): boolean;
	isDebugThrough(): boolean;
	isCollided(x: number, y: number): boolean;
	/**
	 * Returns the player's center x coordinate.
	 *
	 * @returns {Int}
	 * @memberof Game_Player
	 */
	centerX(): number;
	/**
	 * Returns the player's center y coordinate.
	 *
	 * @returns {Int}
	 * @memberof Game_Player
	 */
	centerY(): number;
	center(x: number, y: number): void;
	locate(x: number, y: number): void;
	increaseSteps(): void;
	/**
	 * Creates the encounter count for the player.
	 *
	 * @memberof Game_Player
	 */
	makeEncounterCount(): void;
	/**
	 * Creates the encounter troop id and returns it.
	 *
	 * @returns {Int}
	 * @memberof Game_Player
	 */
	makeEncounterTroopId(): number;
	meetsEncounterConditions(encounter: rm.types.MapEncounter): boolean;
	/**
	 * Executes an encounter.
	 *
	 * @returns {Bool}
	 * @memberof Game_Player
	 */
	executeEncounter(): boolean;
	/**
	 * Has the player start a map event at the given x and y coordinates.
	 * Also passing the triggers and whether the event start is normal.
	 * @param {Int} x
	 * @param {Int} y
	 * @param {Array<Int>} triggers
	 * @param {Bool} normal
	 * @memberof Game_Player
	 */
	startMapEvent(x: number, y: number, triggers: number[], normal: boolean): void;
	moveByInput(): void;
	/**
	 * Returns true if the player can move.
	 *
	 * @returns {Bool}
	 * @memberof Game_Player
	 */
	canMove(): boolean;
	/**
	 * Gets the input direction of the player as a Int.
	 *
	 * @returns {Int}
	 * @memberof Game_Player
	 */
	getInputDirection(): number;
	executeMove(direction: number): void;
	update(sceneActive?: boolean): void;
	/**
	 * Updates the dashing of the player.
	 *
	 * @memberof Game_Player
	 */
	updateDashing(): void;
	/**
	 * Returns true if the dash button is pressed.
	 *
	 * @returns {Bool}
	 * @memberof Game_Player
	 */
	isDashButtonPressed(): boolean;
	updateScroll(lastScrolledX: number, lastScrolledY: number): void;
	/**
	 * Updates the vehicle.
	 *
	 * @memberof Game_Player
	 */
	updateVehicle(): void;
	/**
	 * Updates the player getting on the vehicle.
	 *
	 * @memberof Game_Player
	 */
	updateVehicleGetOn(): void;
	/**
	 * Updates the player getting off the vehicle.
	 *
	 * @memberof Game_Player
	 */
	updateVehicleGetOff(): void;
	updateNonmoving(wasMoving: boolean): void;
	triggerAction(): boolean;
	triggerButtonAction(): boolean;
	/**
	 * Returns true if the player triggered a touch action.
	 *
	 * @returns {Bool}
	 * @memberof Game_Player
	 */
	triggerTouchAction(): boolean;
	triggerTouchActionD1(x1: number, y1: number): boolean;
	triggerTouchActionD2(x2: number, y2: number): boolean;
	triggerTouchActionD3(x2: number, y2: number): boolean;
	/**
	 * Updates the player encounter count.
	 *
	 * @memberof Game_Player
	 */
	updateEncounterCount(): void;
	/**
	 * Returns true if the player can encounter enemies.
	 *
	 * @returns {Bool}
	 * @memberof Game_Player
	 */
	canEncounter(): boolean;
	/**
	 * Returns the encounter progress value of the player.
	 *
	 * @returns {Int}
	 * @memberof Game_Player
	 */
	encounterProgressValue(): number;
	checkEventTriggerHere(triggers: number[]): void;
	checkEventTriggerThere(triggers: number[]): void;
	/**
	 * Returns true if the player can start local events.
	 *
	 * @returns {Bool}
	 * @memberof Game_Player
	 */
	canStartLocalEvents(): boolean;
	/**
	 * Returns true if the player is getting on/off a vehicle.
	 *
	 * @returns {Bool}
	 * @memberof Game_Player
	 */
	getOnOffVehicle(): boolean;
	/**
	 * Returns true if the player is getting on a vehicle.
	 *
	 * @returns {Bool}
	 * @memberof Game_Player
	 */
	getOnVehicle(): boolean;
	/**
	 * Returns true if the player is getting off a vehicle.
	 *
	 * @returns {Bool}
	 * @memberof Game_Player
	 */
	getOffVehicle(): boolean;
	/**
	 * Forces the player to move forward.
	 *
	 * @memberof Game_Player
	 */
	forceMoveForward(): void;
	/**
	 * Returns true if the player is on a floor that does damage.
	 *
	 * @returns {Bool}
	 * @memberof Game_Player
	 */
	isOnDamageFloor(): boolean;
	/**
	 * Moves the player straight, given a direction.
	 *
	 * @param {Int} d
	 * @memberof Game_Player
	 */
	moveStraight(d: number): void;
	/**
	 * Moves the player diagonally, given a horizontal
	 * and vertical direction. The numpad represents the directions.
	 * @param {Int} horz
	 * @param {Int} vert
	 * @memberof Game_Player
	 */
	moveDiagonally(horz: number, vert: number): void;
	/**
	 * Has the player jump in the given direction at the specified
	 * x and y coordinate. This x and y will be added to the player's current
	 * position.
	 * @param {Int} xPlus
	 * @param {Int} yPlus
	 * @memberof Game_Player
	 */
	jump(xPlus: number, yPlus: number): void;
	/**
	 * Shows the player followers.
	 *
	 * @memberof Game_Player
	 */
	showFollowers(): void;
	/**
	 * Hides the player followers.
	 *
	 * @memberof Game_Player
	 */
	hideFollowers(): void;
	/**
	 * Gather followers around the player.
	 *
	 * @memberof Game_Player
	 */
	gatherFollowers(): void;
	/**
	 * Returns true if the followers are currently gathering.
	 *
	 * @returns {Bool}
	 * @memberof Game_Player
	 */
	areFollowersGathering(): boolean;
	/**
	 * Returns true if the followers are gathered.
	 *
	 * @returns {Bool}
	 * @memberof Game_Player
	 */
	areFollowersGathered(): boolean;
}

/**
 * The game object class for screen effect data, such as
 * changes in color tone and flashes.
 * aliased as $gameScreen.
 * @class Game_Screen
 */
declare class Game_Screen {
	constructor();
	initialize(): void;
	clear(): void;
	/**
	 * Handler for when the battle starts in game; prepares
	 * the screen for the battle scene.
	 * @memberof Game_Screen
	 */
	onBattleStart(): void;
	/**
	 * Returns the brightness of the game screen.
	 *
	 * @returns {number}
	 * @memberof Game_Screen
	 */
	brightness(): number;
	tone(): number[];
	flashColor(): number[];
	shake(): number;
	/**
	 * Returns the  zoom x coordinate of the screen.
	 *
	 * @returns {number}
	 * @memberof Game_Screen
	 */
	zoomX(): number;
	/**
	 * Returns the zoom y coordiante of the screen.
	 *
	 * @returns {number}
	 * @memberof Game_Screen
	 */
	zoomY(): number;
	/**
	 * Returns the zoom scale of the screen.
	 *
	 * @returns {number}
	 * @memberof Game_Screen
	 */
	zoomScale(): number;
	/**
	 * Returns the current weather type.
	 *
	 * @returns {string}
	 * @memberof Game_Screen
	 */
	weatherType(): string;
	/**
	 * Returns the weather power.
	 *
	 * @returns {number}
	 * @memberof Game_Screen
	 */
	weatherPower(): number;
	/**
	 * Returns the specified picture given the picture id.
	 *
	 * @param {number} pictureId
	 * @returns {Game_Picture}
	 * @memberof Game_Screen
	 */
	picture(pictureId: number): Game_Picture;
	/**
	 * Returns the real picture id, given the picture id.
	 *
	 * @param {number} pictureId
	 * @returns {number}
	 * @memberof Game_Screen
	 */
	realPictureId(pictureId: number): number;
	/**
	 * Clears the screen fade.
	 *
	 * @memberof Game_Screen
	 */
	clearFade(): void;
	/**
	 * Clears the screen tone.
	 *
	 * @memberof Game_Screen
	 */
	clearTone(): void;
	/**
	 * Clears the screen flash.
	 *
	 * @memberof Game_Screen
	 */
	clearFlash(): void;
	/**
	 * Clears the screen shake.
	 *
	 * @memberof Game_Screen
	 */
	clearShake(): void;
	/**
	 * Clears the screen zoom.
	 *
	 * @memberof Game_Screen
	 */
	clearZoom(): void;
	/**
	 * Clears the screen weather.
	 *
	 * @memberof Game_Screen
	 */
	clearWeather(): void;
	/**
	 * Clears the pictures set on the game screen.
	 *
	 * @memberof Game_Screen
	 */
	clearPictures(): void;
	/**
	 * Erases the battle pictures.
	 *
	 * @memberof Game_Screen
	 */
	eraseBattlePictures(): void;
	/**
	 * Returns the maximum number of pictures set on the game screen.
	 *
	 * @returns {number}
	 * @memberof Game_Screen
	 */
	maxPictures(): number;
	startFadeOut(duration: number): void;
	startFadeIn(duration: number): void;
	startTint(tone: number[], duration: number): void;
	startFlash(color: number[], duration: number): void;
	startShake(power: number, speed: number, duration: number): void;
	startZoom(x: number, y: number, scale: number, duration: number): void;
	setZoom(x: number, y: number, scale: number): void;
	changeWeather(type: string, power: number, duration: number): void;
	/**
	 * Updates the game screen.
	 *
	 * @memberof Game_Screen
	 */
	update(): void;
	/**
	 * Updates the screen fade out.
	 *
	 * @memberof Game_Screen
	 */
	updateFadeOut(): void;
	/**
	 * Updates the screen fade in.
	 *
	 * @memberof Game_Screen
	 */
	updateFadeIn(): void;
	/**
	 * Updates the screen tone.
	 *
	 * @memberof Game_Screen
	 */
	updateTone(): void;
	/**
	 * Update the screen flash.
	 *
	 * @memberof Game_Screen
	 */
	updateFlash(): void;
	/**
	 * Update the screen shake.
	 *
	 * @memberof Game_Screen
	 */
	updateShake(): void;
	/**
	 * Update the screen zoom.
	 *
	 * @memberof Game_Screen
	 */
	updateZoom(): void;
	/**
	 * Update the screen weather.
	 *
	 * @memberof Game_Screen
	 */
	updateWeather(): void;
	/**
	 * Update the screen pictures.
	 *
	 * @memberof Game_Screen
	 */
	updatePictures(): void;
	startFlashForDamage(): void;
	showPicture(pictureId: number, name: string, origin: number, x: number, y: number, scaleX: number, scaleY: number, opacity: number, blendMode: number): void;
	movePicture(pictureId: number, origin: number, x: number, y: number, scaleX: number, scaleY: number, opacity: number, blendMode: number, duration: number): void;
	rotatePicture(pictureId: number, speed: number): void;
	tintPicture(pictureId: number, tone: number[], duration: number): void;
	/**
	 * Erases a picture from the screen given the respected picture id.
	 *
	 * @param {number} pictureId
	 * @memberof Game_Screen
	 */
	erasePicture(pictureId: number): void;
}

/**
 *  The game object class for self switches.
 */
declare class Game_SelfSwitches {
	constructor();
	/**
	 * {key: Array<Any>}
	 */
	_data: { [key: string]: any };
	initialize(): void;
	/**
	 * Clears the array of data for the game's self switches.
	 *
	 * @memberof Game_SelfSwitches
	 */
	clear(): void;
	/**
	 * Returns the value of the switch at the current key;
	 * the value is a boolean (true or false).
	 * @param {Array<any>} key
	 * @returns {boolean}
	 * @memberof Game_SelfSwitches
	 */
	value(key: any[]): boolean;
	/**
	 * Sets the value of the key of the respected self switch.
	 *
	 * @param {Array<any>} key
	 * @param {boolean} value
	 * @memberof Game_SelfSwitches
	 */
	setValue(key: any[], value: boolean): void;
	onChange(): void;
}

/**
 * The game object class for game switches.
 *
 * @class Game_Switches
 */
declare class Game_Switches {
	constructor();
	_data: boolean[];
	initialize(): void;
	clear(): void;
	value(switchId: number): boolean;
	setValue(switchId: number, value: boolean): void;
	onChange(): void;
}

declare namespace rm.types {
	/**
	 * The data class for audio file.
	 */
	export type AudioFile = {
		/**
		 * The sound file name.
		 */
		name: string;
		/**
		 * The pan.
		 */
		pan: number;
		/**
		 * The sound's pitch (50..150). The default value is 100.
		 */
		pitch: number;
		/**
		 * The sound's volume (0..100). The default values are 100 for BGM and ME and 80 for BGS and SE.
		 */
		volume: number;
	}
}

/**
 * Game_System
 * The game object class representing system data.
 * @class Game_System
 */
declare class Game_System {
	protected constructor();
	initialize(): void;
	isJapanese(): boolean;
	isChinese(): boolean;
	isKorean(): boolean;
	isCJK(): boolean;
	isRussian(): boolean;
	isSideView(): boolean;
	isAutoSaveEnabled(): boolean;
	isSaveEnabled(): boolean;
	/**
	 * Disables the ability to save the game.
	 *
	 * @memberof Game_System
	 */
	disableSave(): void;
	/**
	 * Enables the ability to save the game.
	 *
	 * @memberof Game_System
	 */
	enableSave(): void;
	/**
	 * Returns true if the menu is enabled.
	 *
	 * @returns {Bool}
	 * @memberof Game_System
	 */
	isMenuEnabled(): boolean;
	/**
	 * Disables the menu from being accessed.
	 *
	 * @memberof Game_System
	 */
	disableMenu(): void;
	/**
	 * Enables the menu to be accessed.
	 *
	 * @memberof Game_System
	 */
	enableMenu(): void;
	isEncounterEnabled(): boolean;
	/**
	 * Returns true if the player can encounter enemies.
	 *
	 * @memberof Game_System
	 */
	disableEncounter(): void;
	enableEncounter(): void;
	isFormationEnabled(): boolean;
	/**
	 * Disables the use of the formation command in the menu.
	 *
	 * @memberof Game_System
	 */
	disableFormation(): void;
	/**
	 * Enables the use of the formation command in the menu.
	 *
	 * @memberof Game_System
	 */
	enableFormation(): void;
	/**
	 * Returns the number of battles the player has participated in.
	 *
	 * @returns {number}
	 * @memberof Game_System
	 */
	battleCount(): number;
	/**
	 * Returns the number of the wins the player has gained in battle.
	 *
	 * @returns {number}
	 * @memberof Game_System
	 */
	winCount(): number;
	/**
	 * Returns the number of battles the player has escaped from in battle.
	 *
	 * @returns {number}
	 * @memberof Game_System
	 */
	escapeCount(): number;
	/**
	 * Returns the number of saves the player has made in game.
	 *
	 * @returns {number}
	 * @memberof Game_System
	 */
	saveCount(): number;
	/**
	 * Returns the version id represented in the database.
	 *
	 * @returns {number}
	 * @memberof Game_System
	 */
	versionId(): number;
	/**
	 * Returns the current save file id
	 *
	 * @returns {number}
	 * @memberof Game_System
	 */
	savefileId(): number;
	/**
	 * Sets the save file id
	 *
	 * @returns {Void}
	 * @memberof Game_System
	 */
	setSavefileId(savefileId: number): void;
	/**
	 * Returns the tone of the window in the database.
	 *
	 * @returns {Array<Int>}
	 * @memberof Game_System
	 */
	windowTone(): number[];
	/**
	 * Sets the window tone, given an array
	 * of rgb. Example:  [0, 255, 255].
	 * @param {Array<Int>} value
	 * @memberof Game_System
	 */
	setWindowTone(value: number[]): void;
	/**
	 * Returns the current battle background music.
	 *
	 * @returns {AudioFile}
	 * @memberof Game_System
	 */
	battleBgm(): rm.types.AudioFile;
	/**
	 * Sets the battle background music.
	 *
	 * @param {AudioFile} value
	 * @memberof Game_System
	 */
	setBattleBgm(value: rm.types.AudioFile): void;
	/**
	 * Returns the victory musical effect.
	 *
	 * @returns {AudioFile}
	 * @memberof Game_System
	 */
	victoryMe(): rm.types.AudioFile;
	/**
	 * Sets the victory musical effect.
	 *
	 * @param {AudioFile} value
	 * @memberof Game_System
	 */
	setVictoryMe(value: rm.types.AudioFile): void;
	/**
	 * Returns the defeat musical effect.
	 *
	 * @returns {AudioFile}
	 * @memberof Game_System
	 */
	defeatMe(): rm.types.AudioFile;
	onBattleStart(): void;
	onBattleWin(): void;
	onBattleEscape(): void;
	onBeforeSave(): void;
	onAfterLoad(): void;
	/**
	 * Returns the total play time.
	 *
	 * @returns {number}
	 * @memberof Game_System
	 */
	playtime(): number;
	playtimeText(): string;
	/**
	 * Saves background music to the game system object.
	 *
	 * @memberof Game_System
	 */
	saveBgm(): void;
	/**
	 * Replays the saved background music.
	 *
	 * @memberof Game_System
	 */
	replayBgm(): void;
	/**
	 * Saves the walking background music.
	 *
	 * @memberof Game_System
	 */
	saveWalkingBgm(): void;
	/**
	 * Replays the saved walking background music.
	 *
	 * @memberof Game_System
	 */
	replayWalkingBgm(): void;
	/**
	 * Saves the second walking bgm from the map data.
	 *
	 * @memberof Game_System
	 */
	saveWalkingBgm2(): void;
	/**
	 * Returns the main font face
	 *
	 * @returns {String}
	 * @memberof Game_System
	 */
	mainFontFace(): string;
	/**
	 * Returns the font face for number
	 *
	 * @returns {String}
	 * @memberof Game_System
	 */
	numberFontFace(): string;
	/**
	 * Returns the main font size
	 *
	 * @returns {Int}
	 * @memberof Game_System
	 */
	mainFontSize(): number;
	/**
	 * Returns the window padding
	 *
	 * @returns {Int}
	 * @memberof Game_System
	 */
	windowPadding(): number;
}

/**
 * The game object class for temporary data that is not
 * included in the save data.
 * @class Game_Temp
 */
declare class Game_Temp {
	constructor();
	_isPlaytest: boolean;
	_commonEventId: number;
	_destinationX: number;
	_destinationY: number;
	initialize(): void;
	/**
	 * Determines if the game is in Play Test mode.
	 *
	 * @returns {boolean}
	 * @memberof Game_Temp
	 */
	isPlaytest(): boolean;
	/**
	 * Reserves the given commonEventId to be processed later.
	 *
	 * @param {number} commonEventId
	 * @memberof Game_Temp
	 */
	reserveCommonEvent(commonEventId: number): void;
	/**
	 * Clears the current reserved common event.
	 *
	 * @memberof Game_Temp
	 */
	clearCommonEvent(): void;
	/**
	 * Returns true if a common event has been reserved.
	 *
	 * @returns {boolean}
	 * @memberof Game_Temp
	 */
	isCommonEventReserved(): boolean;
	/**
	 * Returns common event data from the database.
	 *
	 * @returns {any}
	 * @memberof Game_Temp
	 */
	reservedCommonEvent(): any;
	/**
	 * Sets the destination of the player for movement.
	 *
	 * @param {number} x
	 * @param {number} y
	 * @memberof Game_Temp
	 */
	setDestination(x: number, y: number): void;
	/**
	 * Clears the destination of movement for the player.
	 *
	 * @memberof Game_Temp
	 */
	clearDestination(): void;
	/**
	 * Determines if the destination for the player to move to is valid.
	 *
	 * @returns {boolean}
	 * @memberof Game_Temp
	 */
	isDestinationValid(): boolean;
	/**
	 * Returns the x coordinate of the destination.
	 *
	 * @returns {number}
	 * @memberof Game_Temp
	 */
	destinationX(): number;
	/**
	 * Returns the y coordinate of the destination.
	 *
	 * @returns {number}
	 * @memberof Game_Temp
	 */
	destinationY(): number;
}

/**
 * The game object class for the timer.
 *
 * @class Game_Timer
 */
declare class Game_Timer {
	constructor();
	_frames: number;
	_working: boolean;
	initialize(): void;
	/**
	 * Updates the game timer.
	 *
	 * @param {boolean} sceneActive
	 * @memberof Game_Timer
	 */
	update(sceneActive: boolean): void;
	/**
	 * Starts the timer with the specified number of frames as count.
	 *
	 * @param {number} count
	 * @memberof Game_Timer
	 */
	start(count: number): void;
	/**
	 * Stops the timer.
	 *
	 * @memberof Game_Timer
	 */
	stop(): void;
	/**
	 * Returns true if the timer is working and counting down.
	 *
	 * @returns {boolean}
	 * @memberof Game_Timer
	 */
	isWorking(): void;
	/**
	 * Returns the number of seconds on the timer.
	 *
	 * @returns {number}
	 * @memberof Game_Timer
	 */
	seconds(): number;
	/**
	 * Handler for when the time expires on the timer.
	 *
	 * @memberof Game_Timer
	 */
	onExpire(): void;
}

declare namespace rm.types {
	export type TroopMember = {
		/**
		 * The enemy ID.
		 */
		enemyId: number;
		/**
		 * The truth value of the [Appear Halfway] option.
		 */
		hidden: boolean;
		/**
		 * The troop member's x-coordinate.
		 */
		x: number;
		/**
		 * The troop member's y-coordinate.
		 */
		y: number;
	}
}

declare namespace rm.types {
	/**
	 * The data class of battle event [Conditions].
	 */
	export type PageCondition = {
		/**
		 * The HP percentage specified in the [Actor] condition.
		 */
		actorHp: number;
		/**
		 * The actor ID specified in the [Actor] condition.
		 */
		actorId: number;
		/**
		 * The truth value indicating whether the [Actor] condition is valid.
		 */
		actorValid: boolean;
		/**
		 * The HP percentage specified in the [Enemy] condition.
		 */
		enemyHp: number;
		/**
		 * The troop member index specified in the [Enemy] condition (0..7).
		 */
		enemyIndex: number;
		/**
		 * The truth value indicating whether the [Enemy] condition is valid.
		 */
		enemyValid: boolean;
		/**
		 * The switch ID specified in the [Switch] condition.
		 */
		switchId: number;
		/**
		 * The truth value indicating whether the [Switch] condition is valid.
		 */
		switchValid: boolean;
		/**
		 * The a and b values specified in the [Turn No.] condition. To be input in the form A + B * X.
		 */
		turnA: number;
		/**
		 * The a and b values specified in the [Turn No.] condition. To be input in the form A + B * X.
		 */
		turnB: number;
		/**
		 * The truth value indicating whether the [At End of Turn] condition is valid.
		 */
		turnEnding: boolean;
		/**
		 * The truth value indicating whether the [Turn No.] condition is valid.
		 */
		turnValid: boolean;
	}
}

declare namespace rm.types {
	/**
	 * The data class for battle events (pages).
	 */
	export type Page = {
		/**
		 * Condition (RPG.Troop.Page.Condition).
		 */
		condition: rm.types.PageCondition;
		/**
		 * Program contents. An RPG.EventCommand array.
		 */
		list: rm.types.EventCommand[];
		/**
		 * Span (0: battle, 1: turn, 2: moment).
		 */
		span: number;
	}
}

declare namespace rm.types {
	export type Troop = {
		/**
		 * The troop ID.
		 */
		id: number;
		/**
		 * The troop members. An RPG.Troop.Member array.
		 */
		members: rm.types.TroopMember[];
		/**
		 * The troop name.
		 */
		name: string;
		/**
		 * The battle events. An RPG.Troop.Page array.
		 */
		pages: rm.types.Page[];
	}
}

/**
 * -----------------------------------------------------------------------------
 * Game_Troop
 *
 * The game object declare class for a troop and the battle-related data.
 * @class Game_Troop
 */
declare class Game_Temp extends Game_Unit {
	constructor();
	_interpreter: Game_Interpreter;
	_troopId: number;
	/**
	 * Returns all enemies in the battle.
	 *
	 * @returns {Array<Game_Enemy>}
	 * @memberof Game_Troop
	 */
	members(): Game_Enemy[];
	/**
	 * Returns all alive enemies.
	 *
	 * @returns {Array<Game_Enemy>}
	 * @memberof Game_Troop
	 */
	aliveMembers(): Game_Enemy[];
	/**
	 * Returns all dead enemies.
	 *
	 * @returns {Array<Game_Enemy>}
	 * @memberof Game_Troop
	 */
	deadMembers(): Game_Enemy[];
	/**
	 * Returns movable enemies.
	 *
	 * @returns {Array<Game_Enemy>}
	 * @memberof Game_Troop
	 */
	movableMembers(): Game_Enemy[];
	/**
	 * Returns true if event is running.
	 *
	 * @returns {boolean}
	 * @memberof Game_Troop
	 */
	isEventRunning(): boolean;
	/**
	 * Updates the game interpreter.
	 *
	 * @memberof Game_Troop
	 */
	updateInterpreter(): void;
	/**
	 * Returns the turn count.
	 *
	 * @returns {number}
	 * @memberof Game_Troop
	 */
	turnCount(): number;
	clear(): void;
	/**
	 * Returns troop information from the database.
	 *
	 * @returns {RPG.Troop}
	 * @memberof Game_Troop
	 */
	troop(): rm.types.Troop;
	setup(troopId: number): void;
	/**
	 * Creates unique names for each enemy.
	 *
	 * @memberof Game_Troop
	 */
	makeUniqueNames(): void;
	/**
	 * Returns the letter table for enemy troops.
	 *
	 * @returns {Array<string>}
	 * @memberof Game_Troop
	 */
	letterTable(): string[];
	/**
	 * Returns the name of enemies within the troop.
	 *
	 * @returns {Array<string>}
	 * @memberof Game_Troop
	 */
	enemyNames(): string[];
	meetsConditions(page: rm.types.EventPage): boolean;
	setupBattleEvent(): void;
	/**
	 * Increases the turn number.
	 *
	 * @memberof Game_Troop
	 */
	increaseTurn(): void;
	/**
	 * Returns the total exp of all members of the enemy troop.
	 *
	 * @returns {number}
	 * @memberof Game_Troop
	 */
	expTotal(): number;
	/**
	 * Return the total gold of all enemies.
	 *
	 * @returns {number}
	 * @memberof Game_Troop
	 */
	goldTotal(): number;
	/**
	 * Returns the gold rate based on game party gold rate.
	 *
	 * @returns {number}
	 * @memberof Game_Troop
	 */
	goldRate(): number;
	/**
	 * Creates the drop items for all members of the enemy troop, and
	 * returns the item information.
	 * @returns {Array<RPG.BaseItem>}
	 * @memberof Game_Troop
	 */
	makeDropItems(): rm.types.BaseItem[];
	static LETTER_TABLE_HALF: string[];
	static LETTER_TABLE_FULL: string[];
}

/**
 * The game object class for game variables.
 */
declare class Game_Variables {
	constructor();
	_data: number[];
	initialize(): void;
	clear(): void;
	value(variableId: number): number;
	setValue(variableId: number, value: number): void;
	onChange(): void;
}

declare namespace rm.types {
	/**
	 * The data class for vehicles.
	 */
	export type SystemVehicle = {
		/**
		 * The vehicle's BGM (RPG.AudioFile).
		 */
		bgm: rm.types.AudioFile;
		/**
		 * The index of the vehicle's walking graphic (0..7).
		 */
		characterIndex: number;
		/**
		 * The file name of the vehicle's walking graphic.
		 */
		characterName: string;
		/**
		 * The map ID of the vehicle's initial position.
		 */
		startMapId: number;
		/**
		 * The map's x-coordinate of the vehicle's initial position.
		 */
		startX: number;
		/**
		 * The map's y-coordinate of the vehicle's initial position.
		 */
		startY: number;
	}
}

/**
 * The game object class for a vehicle.
 */
declare class Game_Vehicle extends Game_Character {
	constructor(type: string);
	_type: string;
	_mapId: number;
	_altitude: number;
	_driving: boolean;
	_bgm: rm.types.AudioFile;
	initMembers(): void;
	/**
	 * Returns true if the vehicle is a boat.
	 *
	 * @returns {Bool}
	 * @memberof Game_Vehicle
	 */
	isBoat(): boolean;
	/**
	 * Returns true if the vehicle is a ship.
	 *
	 * @returns {Bool}
	 * @memberof Game_Vehicle
	 */
	isShip(): boolean;
	/**
	 * Returns true if the vehicle is an airship.
	 *
	 * @returns {Bool}
	 * @memberof Game_Vehicle
	 */
	isAirship(): boolean;
	/**
	 * Resets the direction of the vehicle.
	 *
	 * @memberof Game_Vehicle
	 */
	resetDirection(): void;
	initMoveSpeed(): void;
	/**
	 * Returns the current vehicle.
	 *
	 * @returns {RPG.System.Vehicle}
	 * @memberof Game_Vehicle
	 */
	vehicle(): rm.types.SystemVehicle;
	loadSystemSettings(): void;
	/**
	 * Refreshes the game vehicle.
	 *
	 * @memberof Game_Vehicle
	 */
	refresh(): void;
	setLocation(mapId: number, x: number, y: number): void;
	pos(x: number, y: number): boolean;
	isMapPassable(x: number, y: number, d: rm.types.Direction): boolean;
	/**
	 * Gets on the vehicle.
	 *
	 * @memberof Game_Vehicle
	 */
	getOn(): void;
	/**
	 * Gets off the vehicle.
	 *
	 * @memberof Game_Vehicle
	 */
	getOff(): void;
	/**
	 * Sets the bgm associated with the vehicle.
	 *
	 * @param {RPG.AudioFile} bgm
	 * @memberof Game_Vehicle
	 */
	setBgm(bgm: rm.types.AudioFile): void;
	/**
	 * Plays the bgm associated with the vehicle.
	 *
	 * @memberof Game_Vehicle
	 */
	playBgm(): void;
	/**
	 * Syncs the vehicle with the player.
	 *
	 * @memberof Game_Vehicle
	 */
	syncWithPlayer(): void;
	/**
	 * Returns the screen y position of the vehicle.
	 *
	 * @returns {number}
	 * @memberof Game_Vehicle
	 */
	screenY(): number;
	/**
	 * Returns the shadow x position of the vehicle's shadow.
	 *
	 * @returns {number}
	 * @memberof Game_Vehicle
	 */
	shadowX(): number;
	/**
	 * Returns the shadow y position of the vehicle's shadow.
	 *
	 * @returns {number}
	 * @memberof Game_Vehicle
	 */
	shadowY(): number;
	/**
	 * Returns the shadow opacity of the vehicle's shadow.
	 *
	 * @returns {number}
	 * @memberof Game_Vehicle
	 */
	shadowOpacity(): number;
	/**
	 * Returns true if the vehicle can move.
	 *
	 * @returns {Bool}
	 * @memberof Game_Vehicle
	 */
	canMove(): boolean;
	/**
	 * Updates the vehicle.
	 *
	 * @memberof Game_Vehicle
	 */
	update(): void;
	/**
	 * Updates the airship.
	 *
	 * @memberof Game_Vehicle
	 */
	updateAirship(): void;
	/**
	 * Updates airship altitude.
	 *
	 * @memberof Game_Vehicle
	 */
	updateAirshipAltitude(): void;
	/**
	 * Returns the max altitude of the vehicle.
	 *
	 * @returns {number}
	 * @memberof Game_Vehicle
	 */
	maxAltitude(): number;
	/**
	 * Returns true if the vehicle is at it's lowest altitude.
	 *
	 * @returns {Bool}
	 * @memberof Game_Vehicle
	 */
	isLowest(): boolean;
	/**
	 * Returns true if the vehicle is at it's highest altitude.
	 *
	 * @returns {Bool}
	 * @memberof Game_Vehicle
	 */
	isHighest(): boolean;
	/**
	 * Returns true if take off is ok.
	 *
	 * @returns {Bool}
	 * @memberof Game_Vehicle
	 */
	isTakeoffOk(): boolean;
	/**
	 * Returns true if the vehicle is capable of landing at the specified
	 * x, y coordinate, with the specified direction (d).
	 * @param {number} x
	 * @param {number} y
	 * @param {number} d
	 * @returns {Bool}
	 * @memberof Game_Vehicle
	 */
	isLandOk(x: number, y: number, d: rm.types.Direction): boolean;
}

declare class Scene_Base extends Stage {
	constructor();
	_windowLayer: WindowLayer;
	/**
	 * Initializes the scene.
	 * @return Void
	 */
	initialize(): void;
	/**
	 * Creates the scene's important properties.
	 */
	create(): void;
	/**
	 * Returns whether the scene is active or not.
	 * @return Bool
	 */
	isActive(): boolean;
	/**
	 * Returns if the scene is ready or not.
	 * @return Bool
	 */
	isReady(): boolean;
	/**
	 * Starts the scene.
	 */
	start(): void;
	/**
	 * Updates the scene.
	 */
	update(): void;
	/**
	 * Stops the scene.
	 */
	stop(): void;
	/**
	 * Checks if the Scene is busy processing an event
	 * or other conditions.
	 * @return Bool
	 */
	isBusy(): boolean;
	/**
	 * Terminates/ends the scene.
	 */
	terminate(): void;
	/**
	 * Creates the window layer on the current scene
	 * for displaying any and all windows.
	 */
	createWindowLayer(): void;
	/**
	 * Adds a child window to the window layer for processing.
	 * @param window
	 */
	addWindow(window: Window_Base): void;
	/**
	 * Request a fadeIn screen process
	 * @param duration  [duration=30] The time the process will take to fadeIn the screen.
	 * @param white  [white=false] If true the fadeIn will process with a white color else it will be black.
	 */
	startFadeIn(duration: number, white: boolean): void;
	/**
	 * Request a fadeOut screen process
	 * @param duration  [duration=30] The time the process will take to fadeOut the screen.
	 * @param white  [white=false] If true the fadeOut will process with a white color else it will be black.
	 */
	startFadeOut(duration: number, white: boolean): void;
	createFadeSprite(white: boolean): void;
	/**
	 * Updates the scene's fade
	 */
	updateFade(): void;
	updateChildren(): void;
	/**
	 * Pops the current scene and returns to the previous scene if available.
	 */
	popScene(): void;
	/**
	 * Checks for game over.
	 */
	checkGameOver(): void;
	fadeOutAll(): void;
	/**
	 * Returns the fade speed.
	 * @return Int
	 */
	fadeSpeed(): number;
	/**
	 * Returns the slow fade speed.
	 * @return Int
	 */
	slowFadeSpeed(): number;
}

/**
 * Scene class of the battle screen.
 */
declare class Scene_Battle extends Scene_Base {
	protected constructor();
	updateBattleProcess(): void;
	isAnyInputWindowActive(): boolean;
	changeInputWindow(): void;
	/**
	 * Stops the battle scene.
	 *
	 * @memberof Scene_Battle
	 */
	stop(): void;
	/**
	 * Returns true if the battle needs a slow fade out.
	 *
	 * @returns {boolean}
	 * @memberof Scene_Battle
	 */
	needsSlowFadeOut(): boolean;
	/**
	 * Updates the status window on the battle scene.
	 *
	 * @memberof Scene_Battle
	 */
	updateStatusWindow(): void;
	/**
	 * Updates the position of the battle scene windows.
	 *
	 * @memberof Scene_Battle
	 */
	updateWindowPositions(): void;
	/**
	 * Creates all the display objects including:
	 * the spritesheet, window layer, windows, and more.
	 *
	 * @memberof Scene_Battle
	 */
	createDisplayObjects(): void;
	/**
	 * Creates the spriteset within
	 * the battle scene. This includes
	 * sprites for actors, enemies, etc.
	 * @memberof Scene_Battle
	 */
	createSpriteset(): void;
	/**
	 * Creates all the windows within the
	 * battle scene.
	 * @memberof Scene_Battle
	 */
	createAllWindows(): void;
	/**
	 * Creates the log window.
	 *
	 * @memberof Scene_Battle
	 */
	createLogWindow(): void;
	createStatusWindow(): void;
	createPartyCommandWindow(): void;
	/**
	 * Creates the actor command window.
	 *
	 * @memberof Scene_Battle
	 */
	createActorCommandWindow(): void;
	/**
	 * Creates the help window.
	 *
	 * @memberof Scene_Battle
	 */
	createHelpWindow(): void;
	/**
	 * Creates the skill window.
	 *
	 * @memberof Scene_Battle
	 */
	createSkillWindow(): void;
	/**
	 * Creates the item window.
	 *
	 * @memberof Scene_Battle
	 */
	createItemWindow(): void;
	/**
	 * Creates the actor window.
	 *
	 * @memberof Scene_Battle
	 */
	createActorWindow(): void;
	/**
	 * Creates the enemy window.
	 *
	 * @memberof Scene_Battle
	 */
	createEnemyWindow(): void;
	/**
	 * Creates the message window on the battle scene.
	 *
	 * @memberof Scene_Battle
	 */
	createMessageWindow(): void;
	/**
	 * Creates the scroll text window.
	 *
	 * @memberof Scene_Battle
	 */
	createScrollTextWindow(): void;
	refreshStatus(): void;
	startPartyCommandSelection(): void;
	/**
	 * Handler for the fight command on battle start..
	 *
	 * @memberof Scene_Battle
	 */
	commandFight(): void;
	/**
	 * Handler for the escape command on battle start.
	 *
	 * @memberof Scene_Battle
	 */
	commandEscape(): void;
	startActorCommandSelection(): void;
	/**
	 * Handler for the attack command.
	 *
	 * @memberof Scene_Battle
	 */
	commandAttack(): void;
	/**
	 *
	 * Handler for the skill command.
	 *
	 * @memberof Scene_Battle
	 */
	commandSkill(): void;
	/**
	 * Handler for the guard command.
	 *
	 * @memberof Scene_Battle
	 */
	commandGuard(): void;
	/**
	 * Handler for the item command.
	 *
	 * @memberof Scene_Battle
	 */
	commandItem(): void;
	/**
	 * Selects the next command in the battle scene.
	 *
	 * @memberof Scene_Battle
	 */
	selectNextCommand(): void;
	/**
	 * Selects the previous command in the battle scene.
	 *
	 * @memberof Scene_Battle
	 */
	selectPreviousCommand(): void;
	selectActorSelection(): void;
	onActorOk(): void;
	onActorCancel(): void;
	selectEnemySelection(): void;
	/**
	 * Handler for when an enemy is selected.
	 *
	 * @memberof Scene_Battle
	 */
	onEnemyOk(): void;
	onEnemyCancel(): void;
	/**
	 * Handler for when a skill is selected.
	 *
	 * @memberof Scene_Battle
	 */
	onSkillOk(): void;
	onSkillCancel(): void;
	onItemOk(): void;
	onItemCancel(): void;
	onSelectAction(): void;
	endCommandSelection(): void;
}

declare class Scene_Boot extends Scene_Base {
	protected constructor();
	_databaseLoaded: boolean;
	/**
	 * Loads the system images upon booting the game.
	 */
	loadSystemImages(): void;
	/**
	 * Loads the system window image for showing all windows in game.
	 */
	loadSystemWindowImage(): void;
	/**
	 * Returns true if the game font is loaded.
	 * @return Bool
	 */
	isGameFontLoaded(): boolean;
	updateDocumentTitle(): void;
	/**
	 * Checks the player location upon booting the game.
	 */
	checkPlayerLocation(): void;
}

/**
 * The super class of all menu-type scenes
 */
declare class Scene_MenuBase extends Scene_Base {
	protected constructor();
	/**
	 * Returns the current game actor.
	 *
	 * @returns {Game_Actor}
	 * @memberof Scene_MenuBase
	 */
	actor(): Game_Actor;
	/**
	 * Updates the current actor.
	 *
	 * @memberof Scene_MenuBase
	 */
	updateActor(): void;
	/**
	 * Creates the background of the base menu scene.
	 *
	 * @memberof Scene_MenuBase
	 */
	createBackground(): void;
	/**
	 * Sets the background opacity of the base menu scene background.
	 *
	 * @param {number} opacity
	 * @memberof Scene_MenuBase
	 */
	setBackgroundOpacity(opacity: number): void;
	/**
	 * Creates the help window.
	 *
	 * @memberof Scene_MenuBase
	 */
	createHelpWindow(): void;
	/**
	 * Moves to the next actor in the party.
	 *
	 * @memberof Scene_MenuBase
	 */
	nextActor(): void;
	/**
	 * Moves to the previous actor in the party.
	 *
	 * @memberof Scene_MenuBase
	 */
	previousActor(): void;
	onActorChange(): void;
}

/**
 * Scene class of the debug menu screen.
 */
declare class Scene_Debug extends Scene_MenuBase {
	protected constructor();
	/**
	 * Creates the range window.
	 *
	 * @memberof Scene_Debug
	 */
	createRangeWindow(): void;
	/**
	 * Creates the edit window.
	 *
	 * @memberof Scene_Debug
	 */
	createEditWindow(): void;
	/**
	 * Creates the debug help .window.
	 *
	 * @memberof Scene_Debug
	 */
	createDebugHelpWindow(): void;
	onRangeOk(): void;
	onEditCancel(): void;
	refreshHelpWindow(): void;
	/**
	 * Returns the help text within the
	 * debug scene.
	 * @returns {String}
	 * @memberof Scene_Debug
	 */
	helpText(): string;
}

/**
 * Scene class of the equipment screen.
 */
declare class Scene_Equip extends Scene_MenuBase {
	protected constructor();
	/**
	 * Creates the status window within the equip scene.
	 *
	 * @memberof Scene_Equip
	 */
	createStatusWindow(): void;
	/**
	 * Creates the status window within the equip scene.
	 *
	 * @memberof Scene_Equip
	 */
	createCommandWindow(): void;
	/**
	 * Creates the slot window within the  equip scene.
	 *
	 * @memberof Scene_Equip
	 */
	createSlotWindow(): void;
	/**
	 * Creates the item window within the equip scene.
	 *
	 * @memberof Scene_Equip
	 */
	createItemWindow(): void;
	/**
	 * Refreshes the actor within the equip scene.
	 *
	 * @memberof Scene_Equip
	 */
	refreshActor(): void;
	/**
	 * Handler for the equip command.
	 *
	 * @memberof Scene_Equip
	 */
	commandEquip(): void;
	/**
	 * Handler for the optimize command.
	 *
	 * @memberof Scene_Equip
	 */
	commandOptimize(): void;
	commandClear(): void;
	onSlotOk(): void;
	onSlotCancel(): void;
	onItemOk(): void;
	onItemCancel(): void;
	onActorChange(): void;
}

/**
 *  Super class of Scene_Save and Scene_Load
 */
declare class Scene_File extends Scene_MenuBase {
	protected constructor();
	/**
	 * Returns the index of the first
	 * save file.
	 * @returns {number}
	 * @memberof Scene_File
	 */
	firstSavefileIndex(): number;
	/**
	 * Returns the current savefileId.
	 *
	 * @memberof Scene_File
	 */
	savefileId(): number;
	createHelpWindow(): void;
	createListWindow(): void;
	/**
	 * The current mode of the scene;
	 * the modes are 'save' or 'load'.
	 * @memberof Scene_File
	 */
	mode(): void;
	activateListWindow(): void;
	helpWindowText(): string;
	/**
	 * Handler for when a
	 * save file is selected within the file scene.
	 * @memberof Scene_File
	 */
	onSavefileOk(): void;
}

/**
 * Scene class of the game end screen.
 */
declare class Scene_GameEnd extends Scene_MenuBase {
	protected constructor();
	stop(): void;
	/**
	 * Creates the background for
	 * the game end scene.
	 * @memberof Scene_GameEnd
	 */
	createBackground(): void;
	/**
	 * Creates the command window
	 * for the game end screen.
	 * @memberof Scene_GameEnd
	 */
	createCommandWindow(): void;
	/**
	 * Handler for when to title
	 * is clicked within the game end screen.
	 * @memberof Scene_GameEnd
	 */
	commandToTitle(): void;
}

/**
 * Scene class of the game over screen.
 */
declare class Scene_Gameover extends Scene_Base {
	protected constructor();
	stop(): void;
	/**
	 * Plays the game over music
	 * within the game over scene.
	 * @memberof Scene_Gameover
	 */
	playGameoverMusic(): void;
	/**
	 * Creates the background of
	 * the game over scene.
	 * @memberof Scene_Gameover
	 */
	createBackground(): void;
	isTriggered(): boolean;
	/**
	 * Returns to the title scene (Scene_Title).
	 * @memberof Scene_Gameover
	 */
	gotoTitle(): void;
}

/**
 * Super class of all public function item(skill, items, etc) screen scenes.
 * Super class of Scene_Item & Scene_Skill.
 */
declare class Scene_ItemBase extends Scene_Base {
	protected constructor();
	/**
	 * Creates the actor window within the base item scene.
	 *
	 * @memberof Scene_ItemBase
	 */
	createActorWindow(): void;
	/**
	 * Returns the item attached to the item window within the base item scene.
	 *
	 * @returns {*}
	 * @memberof Scene_ItemBase
	 */
	item(): any;
	/**
	 * Returns the current game actor.
	 *
	 * @returns {Game_Actor}
	 * @memberof Scene_ItemBase
	 */
	user(): Game_Actor;
	/**
	 * Returns true if the cursor is left.
	 *
	 * @returns {boolean}
	 * @memberof Scene_ItemBase
	 */
	isCursorLeft(): boolean;
	/**
	 * Shows the sub window.
	 *
	 * @param {Window_Base} window
	 * @memberof Scene_ItemBase
	 */
	showSubWindow(window: Window_Base): void;
	/**
	 * Hides the sub window.
	 *
	 * @param {Window_Base} window
	 * @memberof Scene_ItemBase
	 */
	hideSubWindow(window: Window_Base): void;
	onActorOk(): void;
	onActorCancel(): void;
	determineItem(): void;
	/**
	 * Uses the current item.
	 *
	 * @memberof Scene_ItemBase
	 */
	useItem(): void;
	/**
	 * Activates the item window.
	 *
	 * @memberof Scene_ItemBase
	 */
	activateItemWindow(): void;
	itemTargetActors(): Game_Actor;
	/**
	 * Returns true if the user (game actor) can use the item.
	 *
	 * @returns {boolean}
	 * @memberof Scene_ItemBase
	 */
	canUse(): boolean;
	/**
	 * Returns true if the item effects are valid on the public function target(the user).
	 *
	 * @returns {boolean}
	 * @memberof Scene_ItemBase
	 */
	isItemEffectsValid(): boolean;
	applyItem(): void;
	/**
	 * Checks the common event set on the item.
	 *
	 * @memberof Scene_ItemBase
	 */
	checkCommonEvent(): void;
}

/**
 * -----------------------------------------------------------------------------
 * Scene_Item
 *
 * The scene class of the item screen.
 * @class Scene_Item
 * @extends {Scene_ItemBase}
 */
declare class Scene_Item extends Scene_ItemBase {
	protected constructor();
	/**
	 * Creates the category window on the
	 * item scene.
	 * @memberof Scene_Item
	 */
	createCategoryWindow(): void;
	/**
	 * Creates the item window on the item
	 * scene.
	 * @memberof Scene_Item
	 */
	createItemWindow(): void;
	/**
	 * Handler for when a cataegory is selected
	 * on the item scene.
	 * @memberof Scene_Item
	 */
	onCategoryOk(): void;
	/**
	 * Handler for when an item is selected
	 * on the item scene.
	 * @memberof Scene_Item
	 */
	onItemOk(): void;
	/**
	 * Handler for when an item selection
	 * is canceled on the item scene.
	 * @memberof Scene_Item
	 */
	onItemCancel(): void;
	/**
	 * Plays a sound effect when the
	 * item is confirmed.
	 * @memberof Scene_Item
	 */
	playSeForItem(): void;
}

/**
 * The scene class of the load game screen.
 */
declare class Scene_Load extends Scene_File {
	protected constructor();
	/**
	 * Returns the mode of the
	 * load scene.
	 * @returns {string}
	 * @memberof Scene_Load
	 */
	mode(): string;
	/**
	 * Returns the help window text on the
	 * game load scene.
	 * @returns {string}
	 * @memberof Scene_Load
	 */
	helpWindowText(): string;
	firstSavefileIndex(): number;
	onSavefileOk(): void;
	onLoadSuccess(): void;
	onLoadFailure(): void;
	reloadMapIfUpdated(): void;
}

/**
 * The scene class for the map screen.
 */
declare class Scene_Map extends Scene_Base {
	protected constructor();
	menuCalling: boolean;
	/**
	 * Handler for when the map scene is loaded.
	 *
	 * @memberof Scene_Map
	 */
	onMapLoaded(): void;
	/**
	 * Speeds up the updateMain if
	 * the map scene is in fast forward mode.
	 * @memberof Scene_Map
	 */
	updateMainMultiply(): void;
	/**
	 * Updates the main $game globals
	 * if the map scene is active.
	 * @memberof Scene_Map
	 */
	updateMain(): void;
	/**
	 * Returns true if the player
	 * is holding down the confirm button to
	 * fast forward through text.
	 * @returns {boolean}
	 * @memberof Scene_Map
	 */
	isFastForward(): boolean;
	/**
	 * Stops the map scene and prepares
	 * for a new scene.
	 * @memberof Scene_Map
	 */
	stop(): void;
	/**
	 * Returns true if the map scene needs a slow fade in.
	 *
	 * @returns {boolean}
	 * @memberof Scene_Map
	 */
	needsFadeIn(): boolean;
	/**
	 * Returns true if the map scene needs a slow fade out.
	 *
	 * @returns {boolean}
	 * @memberof Scene_Map
	 */
	needsSlowFadeOut(): boolean;
	updateWaitCount(): boolean;
	/**
	 * Constantly checks if the player
	 * is touching the map, then processes
	 * a map touch for mouse based player character movement.
	 * @memberof Scene_Map
	 */
	updateDestination(): void;
	/**
	 * Returns true if the map scene is
	 * active and the player can move. Used for
	 * mouse movement on the map scene.
	 * @returns {boolean}
	 * @memberof Scene_Map
	 */
	isMapTouchOk(): boolean;
	/**
	 * Processes the map touch and turns it
	 * into coordinates for the player character to move to.
	 * @memberof Scene_Map
	 */
	processMapTouch(): void;
	isSceneChangeOk(): boolean;
	/**
	 * Updates the scene.
	 *
	 * @memberof Scene_Map
	 */
	updateScene(): void;
	/**
	 * Creates all the display objects on the map scene;
	 * this includes the sprites, window layer, windows, and more.
	 * @memberof Scene_Map
	 */
	createDisplayObjects(): void;
	/**
	 * Creates the spriteset on the map scene;
	 * this shows all the characters and events on the map.
	 * @memberof Scene_Map
	 */
	createSpriteset(): void;
	/**
	 * Creates all the windows on the map scene
	 * contains other window creation methods.
	 * @memberof Scene_Map
	 */
	createAllWindows(): void;
	/**
	 * Creates the map name window within
	 * the map scene; display map name.
	 * @memberof Scene_Map
	 */
	createMapNameWindow(): void;
	/**
	 * Creates the message window for displaying
	 * text on the map scene. Commonly used with the
	 * showText command.
	 * @memberof Scene_Map
	 */
	createMessageWindow(): void;
	/**
	 * Creates a scrolling text window on the map scene.
	 *
	 * @memberof Scene_Map
	 */
	createScrollTextWindow(): void;
	/**
	 * Checks if the player is transferring;
	 * if the player is transferring, move to a new map scene.
	 * @memberof Scene_Map
	 */
	updateTransferPlayer(): void;
	/**
	 * Processes starting an encounter on the map scene.
	 *
	 * @memberof Scene_Map
	 */
	updateEncounter(): void;
	/**
	 * Processes calling the menu on the map scene.
	 *
	 * @memberof Scene_Map
	 */
	updateCallMenu(): void;
	/**
	 * Returns true if the menu is enabled
	 * in the database.
	 * @returns {boolean}
	 * @memberof Scene_Map
	 */
	isMenuEnabled(): boolean;
	/**
	 * Returns true if the menu is called
	 * via an input trigger.
	 * @returns {boolean}
	 * @memberof Scene_Map
	 */
	isMenuCalled(): boolean;
	/**
	 * Calls the standard RPGMakerMV menu scene.
	 *
	 * @memberof Scene_Map
	 */
	callMenu(): void;
	/**
	 * Checks if debug is called via input trigger
	 * and starts the debug scene.
	 *
	 * @memberof Scene_Map
	 */
	updateCallDebug(): void;
	/**
	 * Returns true if the debug
	 * scene is called via button press and in play test mode.
	 * @returns {boolean}
	 * @memberof Scene_Map
	 */
	isDebugCalled(): void;
	fadeInForTransfer(): void;
	fadeOutForTransfer(): void;
	/**
	 * Launches into the battle scene.
	 *
	 * @memberof Scene_Map
	 */
	launchBattle(): void;
	/**
	 * Stops all audio on battle start.
	 *
	 * @memberof Scene_Map
	 */
	stopAudioOnBattleStart(): void;
	/**
	 * Starts the encounter effect on the map scene.
	 *
	 * @memberof Scene_Map
	 */
	startEncounterEffect(): void;
	updateEncounterEffect(): void;
	/**
	 * Takes a snapshot of the map scene for displaying
	 * on the battle scene if no battleback is present.
	 * @memberof Scene_Map
	 */
	snapForBattleBackground(): void;
	/**
	 * Starts a flash encounter effect on the map scene
	 * given a duration of the flash.
	 * @param {number} duration
	 * @memberof Scene_Map
	 */
	startFlashForEncounter(duration: number): void;
	/**
	 * Returns the speed of the encounter effect.
	 *
	 * @returns {number}
	 * @memberof Scene_Map
	 */
	encounterEffectSpeed(): number;
}

/**
 * The menu scene in your RPGMakerMV game.
 */
declare class Scene_Menu extends Scene_MenuBase {
	protected constructor();
	/**
	 * Creates the main menu window on the
	 * menu scene; contains the commands for
	 * menu usage.
	 * @memberof Scene_Menu
	 */
	createCommandWindow(): void;
	/**
	 * Creates the gold window on the menu scene.
	 *
	 * @memberof Scene_Menu
	 */
	createGoldWindow(): void;
	/**
	 * Creates the status window on the menu scene.
	 *
	 * @memberof Scene_Menu
	 */
	createStatusWindow(): void;
	/**
	 * Handler for what to do when the 'item'
	 * command is clicked.
	 * @memberof Scene_Menu
	 */
	commandItem(): void;
	commandPersonal(): void;
	commandFormation(): void;
	/**
	 * Handler for what to do when the 'option'
	 * command is clicked.
	 * @memberof Scene_Menu
	 */
	commandOptions(): void;
	/**
	 * Handler for what to do when the 'save'
	 * command is clicked.
	 * @memberof Scene_Menu
	 */
	commandSave(): void;
	/**
	 * Handler for what to do when the 'game end'
	 * command is clicked.
	 * @memberof Scene_Menu
	 */
	commandGameEnd(): void;
	onPersonalOk(): void;
	onPersonalCancel(): void;
	onFormationOk(): void;
	onFormationCancel(): void;
}

/**
 * Scene class of the name input screen.
 */
declare class Scene_Name extends Scene_MenuBase {
	protected constructor();
	/**
	 * Prepares the name input scene for giving the specified
	 * actor at actorId a name with a maximum number of characters
	 * given by maxLength.
	 * @param {number} actorId
	 * @param {number} maxLength
	 * @memberof Scene_Name
	 */
	prepare(actorId: number, maxLength: number): void;
	/**
	 * Creates the edit window.
	 *
	 * @memberof Scene_Name
	 */
	createEditWindow(): void;
	/**
	 * Creates the input window.
	 *
	 * @memberof Scene_Name
	 */
	createInputWindow(): void;
	/**
	 * Handler for when ok is processed on the name input scene.
	 *
	 * @memberof Scene_Name
	 */
	onInputOk(): void;
}

/**
 * Scene class of the options screen.
 */
declare class Scene_Options extends Scene_MenuBase {
	protected constructor();
	createOptionsWindow(): void;
}

/**
 * Save game screen scene for RPGMakerMV.
 */
declare class Scene_Save extends Scene_File {
	protected constructor();
	/**
	 * Returns the mode of the
	 * save scene.
	 * @returns {string}
	 * @memberof Scene_Save
	 */
	mode(): string;
	helpWindowText(): string;
	/**
	 * Returns the index of the first
	 * save file within the save scene.
	 * @returns {number}
	 * @memberof Scene_Save
	 */
	firstSavefileIndex(): number;
	/**
	 * Handler for when a save file
	 * is confirmed within the save scene.
	 * @memberof Scene_Save
	 */
	onSavefileOk(): void;
	/**
	 * Handler for when save is a success.
	 *
	 * @memberof Scene_Save
	 */
	onSaveSuccess(): void;
	/**
	 * Handler for when save fails.
	 *
	 * @memberof Scene_Save
	 */
	onSaveFailure(): void;
}

declare namespace rm.types {
	export const enum Money {
		base = -1,
	}
}

/**
 * Scene class of the shop screen.
 */
declare class Scene_Shop extends Scene_MenuBase {
	protected constructor();
	prepare(goods: any[][], purchaseOnly: boolean): void;
	/**
	 * Creates the gold window on the shop scene.
	 *
	 * @memberof Scene_Shop
	 */
	createGoldWindow(): void;
	/**
	 * Creates the command window for buying or selling.
	 *
	 * @memberof Scene_Shop
	 */
	createCommandWindow(): void;
	createDummyWindow(): void;
	/**
	 * Creates the number input window on the shop scene.
	 *
	 * @memberof Scene_Shop
	 */
	createNumberWindow(): void;
	/**
	 * Creates the status window.
	 *
	 * @memberof Scene_Shop
	 */
	createStatusWindow(): void;
	/**
	 * Creates the buy window.
	 *
	 * @memberof Scene_Shop
	 */
	createBuyWindow(): void;
	/**
	 * Creates the category window.
	 *
	 * @memberof Scene_Shop
	 */
	createCategoryWindow(): void;
	/**
	 * Creates the sell window.
	 *
	 * @memberof Scene_Shop
	 */
	createSellWindow(): void;
	/**
	 * Activates the buy window within the shop scene.
	 *
	 * @memberof Scene_Shop
	 */
	activateBuyWindow(): void;
	/**
	 * Activates the sell window within the shop scene.
	 *
	 * @memberof Scene_Shop
	 */
	activateSellWindow(): void;
	/**
	 * Handler for pressing buy within the shop scene.
	 *
	 * @memberof Scene_Shop
	 */
	commandBuy(): void;
	/**
	 * Handler for pressing sell within the shop scene.
	 *
	 * @memberof Scene_Shop
	 */
	commandSell(): void;
	/**
	 * Handler for when buying is confirmed.
	 *
	 * @memberof Scene_Shop
	 */
	onBuyOk(): void;
	/**
	 * Handler for when buying is cancelled.
	 *
	 * @memberof Scene_Shop
	 */
	onBuyCancel(): void;
	onCategoryOk(): void;
	onCategoryCancel(): void;
	onSellOk(): void;
	onSellCancel(): void;
	onNumberOk(): void;
	onNumberCancel(): void;
	/**
	 * Amount of item to buy.
	 * @param number
	 */
	doBuy(number: number): void;
	/**
	 * Amount of item to sell.
	 * @param number
	 */
	doSell(number: number): void;
	endNumberInput(): void;
	/**
	 * Returns the maximum number bought.
	 *
	 * @returns {number}
	 * @memberof Scene_Shop
	 */
	maxBuy(): number;
	/**
	 * Returns the maximum number sold.
	 *
	 * @returns {number}
	 * @memberof Scene_Shop
	 */
	maxSell(): number;
	/**
	 * Returns the player gold within
	 * the shop scene.
	 * @returns {number}
	 * @memberof Scene_Shop
	 */
	money(): rm.types.Money;
	/**
	 * Returns the currency unit of the
	 * game within the shop scene.
	 * @returns {string}
	 * @memberof Scene_Shop
	 */
	currencyUnit(): string;
	/**
	 * Returns the buying price for the current item.
	 *
	 * @returns {number}
	 * @memberof Scene_Shop
	 */
	buyingPrice(): rm.types.Money;
	/**
	 * Returns the selling price for the current item.
	 *
	 * @returns {number}
	 * @memberof Scene_Shop
	 */
	sellingPrice(): rm.types.Money;
}

/**
 * The scene class of the skill screen.
 */
declare class Scene_Skill extends Scene_ItemBase {
	protected constructor();
	/**
	 * Creates the window for skill types
	 * within the skill scene.
	 * @memberof Scene_Skill
	 */
	createSkillTypeWindow(): void;
	/**
	 * Creates the status window within
	 * the skill scene.
	 * @memberof Scene_Skill
	 */
	createStatusWindow(): void;
	/**
	 * Creates the item window
	 * within the skill scene.
	 * @memberof Scene_Skill
	 */
	createItemWindow(): void;
	/**
	 * Refreshes the current actor displayed in the Skill
	 * window with updated information on changes.
	 */
	refreshActor(): void;
	/**
	 * Handler for when a skill is
	 * selected/confirmed within the skill scene.
	 * @memberof Scene_Skill
	 */
	commandSkill(): void;
	/**
	 * Function to run when selection is cancelled
	 * on the skill scene.
	 */
	onItemCancel(): void;
	/**
	 * Plays a sound effect on item
	 * confirmation withiin the skill scene.
	 * @memberof Scene_Skill
	 */
	playSeForItem(): void;
	/**
	 * Handler for when an an actor is
	 * changed within the skill scene.
	 * @memberof Scene_Skill
	 */
	onActorChange(): void;
}

/**
 * Scene class of the status screen in RPGMakerMV.
 */
declare class Scene_Status extends Scene_MenuBase {
	protected constructor();
	/**
	 * Refreshes the actor within the status scene.
	 *
	 * @memberof Scene_Status
	 */
	refreshActor(): void;
	/**
	 * Handler for when the actor is changed within the status scene.
	 *
	 * @memberof Scene_Status
	 */
	onActorChange(): void;
}

declare class Scene_Title extends Scene_Base {
	protected constructor();
	/**
	 * The command window for title scene commands like new game, continue, or options.
	 */
	_commandWindow: Window_TitleCommand;
	/**
	 * The background sprite which loads the $dataSystem.title1Name image.
	 */
	_backSprite1: Sprite;
	/**
	 * The background sprite which loads the $dataSystem.title2Name image.
	 */
	_backSprite2: Sprite;
	/**
	 * The sprite which holds the game title text.
	 */
	_gameTitleSprite: Sprite;
	/**
	 * Creates the title scene background.
	 */
	createBackground(): void;
	/**
	 * Creates the title screen foreground.
	 */
	createForeground(): void;
	/**
	 * Draws the game title.
	 */
	drawGameTitle(): void;
	/**
	 * Scales the background images and centers it.
	 */
	adjustBackground(): void;
	/**
	 * Creates the command window and sets it's handlers.
	 */
	createCommandWindow(): void;
	commandWindowRect(): Rectangle;
	centerSprite(sprite: Sprite): void;
	/**
	 * Handler for the new game command.
	 */
	commandNewGame(): void;
	/**
	 * Handler for the continue command.
	 */
	commandContinue(): void;
	/**
	 * Handler for the options command.
	 */
	commandOptions(): void;
	/**
	 * Plays the title screen music upon entering the scene.
	 */
	playTitleMusic(): void;
}

declare namespace rm.types {
	/**
	 * The data class for the timing of an animation's SE and flash effects.
	 */
	export type AnimationTiming = {
		/**
		 * The color of the flash (Color).
		 */
		flashColor: number[];
		/**
		 * The duration of the flash.
		 */
		flashDuration: number;
		/**
		 * The flash area (0: none, 1: target, 2: screen; 3: hide target).
		 */
		flashScope: number;
		/**
		 * The frame number. 1 less than the number displayed in RPG Maker.
		 */
		frame: number;
		/**
		 * The sound effect or SE (RPG.AudioFile).
		 */
		se: rm.types.AudioFile;
	}
}

declare namespace rm.types {
	/**
	 * The data class for animation.
	 */
	export type Animation = {
		/**
		 * The adjustment value for the hue of the first animation's graphic (0..360).
		 */
		animation1Hue: string;
		/**
		 * The file name of the first animation's graphic.
		 */
		animation1Name: string;
		/**
		 * The adjustment value for the hue of the second animation's graphic (0..360).
		 */
		animation2Hue: number;
		/**
		 * The file name of the second animation's graphic.
		 */
		animation2Name: string;
		/**
		 * Number of frames.
		 */
		frameMax: number;
		/**
		 * The three-dimensional array containing the frame contents.
		 */
		frames: number[][][];
		/**
		 * The animation ID.
		 */
		id: number;
		/**
		 * The animation name.
		 */
		name: string;
		/**
		 * The base position (0: head, 1: center, 2: feet, 3: screen).
		 */
		position: number;
		/**
		 * Timing for SE and flash effects. An RPG.Animation.Timing array.
		 */
		timings: rm.types.AnimationTiming[];
	}
}

declare class Sprite_Base extends Sprite {
	constructor();
	/**
	 * The animation sprites assigned to the
	 * sprite object.
	 * @protected
	 * @type {Array<Sprite_Animation>}
	 * @memberof Sprite_Base
	 */
	_animationSprites: Sprite_Animation[];
	/**
	 * The target that will have the animations applied
	 * to it.
	 * @protected
	 * @type {Sprite_Base}
	 * @memberof Sprite_Base
	 */
	_effectTarget: Sprite_Base;
	/**
	 * Determines sprite's visibility
	 */
	_hiding: boolean;
	/**
	 * Initializes the sprite.
	 *
	 * @memberof Sprite_Base
	 */
	initialize(): void;
	/**
	 * Hides the sprite.
	 */
	hide(): void;
	/**
	 * Shows the sprite.
	 */
	show(): void;
	/**
	 * Updadtes the visibility of the sprite based
	 * on the _hiding property.
	 * @memberof Sprite_Base
	 */
	updateVisibility(): void;
	/**
	 * Updates the animation sprites, cloning them;
	 * if the sprite is playing, pushes the sprites into
	 * animation sprites, otherwise the sprite is removed.
	 * @memberof Sprite_Base
	 */
	updateAnimationSprites(): void;
	/**
	 * Starts a new animation on the current
	 * sprite by assigning a new Sprite_Animation object to the
	 * sprite's parent.
	 * @param {RPG.Animation} animation
	 * @param {boolean} mirror
	 * @param {number} delay
	 * @memberof Sprite_Base
	 */
	startAnimation(animation: rm.types.Animation, mirror: boolean, delay: number): void;
	/**
	 * Returns true if an animation is currently playing.
	 * @returns {boolean}
	 * @memberof Sprite_Base
	 */
	isAnimationPlaying(): boolean;
}

declare class Sprite_Battler extends Sprite_Base {
	protected constructor();
	_battler: Game_Battler;
	_homeX: number;
	_homeY: number;
	_offsetX: number;
	_offsetY: number;
	_targetOffsetX: number;
	_targetOffsetY: number;
	_movementDuration: number;
	_selectionEffectCount: number;
	initMembers(): void;
	setHome(x: number, y: number): void;
	/**
	 * Updates the main loop of the sprite battler.
	 */
	updateMain(): void;
	/**
	 * Updates the bitmap of the sprite battler.
	 */
	updateBitmap(): void;
	/**
	 * Updates movement on the sprite battler.
	 */
	updateMove(): void;
	/**
	 * Updates the position of the sprite battler.
	 */
	updatePosition(): void;
	/**
	 * Updates the sprite battler animation.
	 */
	updateAnimation(): void;
}

declare namespace rm.types {
	export type Motion = {
		index: number;
		loop: boolean;
	}
}

/**
 * -----------------------------------------------------------------------------
 * Sprite_Actor
 *
 * The sprite for displaying an actor.
 */
declare class Sprite_Actor extends Sprite_Battler {
	/**
	 * Creates an instance of Sprite_Actor; can be passed
	 * a battler on creation.
	 * @param {Game_Actor} [battler]
	 * @memberof Sprite_Actor
	 */
	constructor(battler?: Game_Actor);
	_battlerName: string;
	_motion: rm.types.Motion;
	_motionCount: number;
	_pattern: rm.types.CharacterPattern;
	_mainSprite: Sprite_Base;
	_shadowSprite: Sprite;
	_weaponSprite: Sprite_Weapon;
	_stateSprite: Sprite_StateOverlay;
	_actor: Game_Actor;
	initialize(battler?: Game_Actor): void;
	/**
	 * Creates the main sprite of the sprite actor.
	 *
	 * @memberof Sprite_Actor
	 */
	createMainSprite(): void;
	/**
	 * Creates the shadow sprite of the sprite actor.
	 *
	 * @memberof Sprite_Actor
	 */
	createShadowSprite(): void;
	/**
	 * Sets the weapon sprite of the sprite actor.
	 *
	 * @memberof Sprite_Actor
	 */
	createWeaponSprite(): void;
	/**
	 * Creates the state sprite of the sprite actor.
	 *
	 * @memberof Sprite_Actor
	 */
	createStateSprite(): void;
	/**
	 * Sets the battler of the sprite actor.
	 *
	 * @param {Game_Actor} battler
	 * @memberof Sprite_Actor
	 */
	setBattler(battler: Game_Actor): void;
	/**
	 * Moves the sprite actor to the start position.
	 *
	 * @memberof Sprite_Actor
	 */
	moveToStartPosition(): void;
	setActorHome(index: number): void;
	updateShadow(): void;
	/**
	 * Sets up motion on the sprite actor.
	 *
	 * @memberof Sprite_Actor
	 */
	setupMotion(): void;
	/**
	 * Sets up weapon animation on the sprite actor.
	 *
	 * @memberof Sprite_Actor
	 */
	setupWeaponAnimation(): void;
	/**
	 * Starts the motion given the specified motion
	 * type.
	 * @param {string} motionType
	 * @memberof Sprite_Actor
	 */
	startMotion(motionType: string): void;
	updateTargetPosition(): void;
	/**
	 * Updates the sprite actor's movement.
	 *
	 * @memberof Sprite_Actor
	 */
	updateMove(): void;
	/**
	 * Updates the sprite actor's motion.
	 *
	 * @memberof Sprite_Actor
	 */
	updateMotion(): void;
	updateMotionCount(): void;
	/**
	 * Returns the speed of the motion for the sprite actor.
	 *
	 * @returns {Int}
	 * @memberof Sprite_Actor
	 */
	motionSpeed(): number;
	/**
	 * Refreshes the motion of the sprite actor.
	 *
	 * @memberof Sprite_Actor
	 */
	refreshMotion(): void;
	/**
	 * Starts the entry motion of the sprite actor.
	 *
	 * @memberof Sprite_Actor
	 */
	startEntryMotion(): void;
	/**
	 * Has the sprite actor step forward.
	 *
	 * @memberof Sprite_Actor
	 */
	stepForward(): void;
	/**
	 * Has the sprite actor step back.
	 *
	 * @memberof Sprite_Actor
	 */
	stepBack(): void;
	/**
	 * Has the sprite actor retreat.
	 *
	 * @memberof Sprite_Actor
	 */
	retreat(): void;
	damageOffsetX(): number;
	damageOffsetY(): number;
	static MOTIONS: {abnormal: rm.types.Motion, chant: rm.types.Motion, damage: rm.types.Motion, dead: rm.types.Motion, dying: rm.types.Motion, escape: rm.types.Motion, evade: rm.types.Motion, guard: rm.types.Motion, item: rm.types.Motion, missile: rm.types.Motion, skill: rm.types.Motion, sleep: rm.types.Motion, spell: rm.types.Motion, swing: rm.types.Motion, thrust: rm.types.Motion, victory: rm.types.Motion, wait: rm.types.Motion, walk: rm.types.Motion};
}

/**
 * -----------------------------------------------------------------------------
 * Sprite_Animation
 *
 * The sprite for displaying an animation.
 */
declare class Sprite_Animation extends Sprite {
	protected constructor();
	/**
	 * {
	 * key: Animation
	 * };
	 */
	_checker1: { [key: string]: any };
	_target: Sprite_Base;
	_animation: rm.types.Animation;
	_mirror: boolean;
	_delay: number;
	_rate: number;
	_duration: number;
	_flashColor: number[];
	_flashDuration: number;
	_screenFlashDuration: number;
	_hidingDuration: number;
	_bitmap1: Bitmap;
	_bitmap2: Bitmap;
	_cellSprites: Sprite[];
	_screenFlashSprite: ScreenSprite;
	_duplicated: boolean;
	_reduceArtifacts: boolean;
	initMembers(): void;
	setup(target: Sprite_Base, animation: rm.types.Animation, mirror: boolean, delay: number): void;
	/**
	 * Removes the sprite animation.
	 *
	 * @memberof Sprite_Animation
	 */
	remove(): void;
	setupRate(): void;
	setupDuration(): void;
	/**
	 * Updates the flash animation of the sprite animation.
	 *
	 * @memberof Sprite_Animation
	 */
	updateFlash(): void;
	updateScreenFlash(): void;
	/**
	 * Returns the absolute x position of the sprite animation.
	 *
	 * @returns {number}
	 * @memberof Sprite_Animation
	 */
	absoluteX(): number;
	/**
	 * Returns the absolute y position of the sprite aniamtion.
	 *
	 * @returns {number}
	 * @memberof Sprite_Animation
	 */
	absoluteY(): number;
	/**
	 * Updates the hiding of the sprite animation.
	 *
	 * @memberof Sprite_Animation
	 */
	updateHiding(): void;
	/**
	 * Returns true if the sprite animation is playing.
	 *
	 * @returns {boolean}
	 * @memberof Sprite_Animation
	 */
	isPlaying(): boolean;
	/**
	 * Loads the bitmaps of the sprite animation.
	 *
	 * @memberof Sprite_Animation
	 */
	loadBitmaps(): void;
	/**
	 * Returns true if the sprite animation is ready.
	 *
	 * @returns {boolean}
	 * @memberof Sprite_Animation
	 */
	isReady(): boolean;
	/**
	 * Create the sprites of the sprite animation.
	 *
	 * @memberof Sprite_Animation
	 */
	createSprites(): void;
	/**
	 * Create the cell sprites of the sprite animation.
	 *
	 * @memberof Sprite_Animation
	 */
	createCellSprites(): void;
	/**
	 * Create the screen flash sprite of the sprite animation.
	 *
	 * @memberof Sprite_Animation
	 */
	createScreenFlashSprite(): void;
	/**
	 * Updates the main loop of the sprite animation.
	 *
	 * @memberof Sprite_Animation
	 */
	updateMain(): void;
	/**
	 * Updates the position of the sprite animation.
	 *
	 * @memberof Sprite_Animation
	 */
	updatePosition(): void;
	/**
	 * Updates the frame of the sprite aniamtion.
	 *
	 * @memberof Sprite_Animation
	 */
	updateFrame(): void;
	/**
	 * Returns the current frame index of the sprite aniamtion.
	 *
	 * @returns {number}
	 * @memberof Sprite_Animation
	 */
	currentFrameIndex(): number;
	updateAllCellSprites(frame: number[][]): void;
	updateCellSprite(sprite: Sprite, cell: number[]): void;
	processTimingData(timing: rm.types.AnimationTiming): void;
	startFlash(color: number[], duration: number): void;
	startScreenFlash(color: number[], duration: number): void;
	/**
	 * Starts hiding the sprite animation.
	 *
	 * @param {number} duration The duration of the hide.
	 * @memberof Sprite_Animation
	 */
	startHiding(duration: number): void;
	/**
	 * Structure
	 * {
	 * key: Animation
	 * };
	 */
	static _checker2: { [key: string]: any };
}

/**
 * -----------------------------------------------------------------------------
 * Sprite_Balloon
 *
 * The sprite for displaying a balloon icon.
 */
declare class Sprite_Balloon extends Sprite_Base {
	protected constructor();
	_balloonId: rm.types.BalloonId;
	_duration: number;
	initMembers(): void;
	loadBitmap(): void;
	setup(balloonId: rm.types.BalloonId): void;
	/**
	 * Updates the balloon sprite.
	 *
	 * @memberof Sprite_Balloon
	 */
	update(): void;
	/**
	 * Updates the balloon sprite frame.
	 *
	 * @memberof Sprite_Balloon
	 */
	updateFrame(): void;
	/**
	 * Returns the speed of the balloon animation.
	 *
	 * @returns {number}
	 * @memberof Sprite_Balloon
	 */
	speed(): number;
	/**
	 * Returns the wait time.
	 *
	 * @returns {number}
	 * @memberof Sprite_Balloon
	 */
	waitTime(): number;
	/**
	 * Returns the frame index of the balloon animation.
	 *
	 * @returns {number}
	 * @memberof Sprite_Balloon
	 */
	frameIndex(): number;
	/**
	 * Returns true if the balloon animation is playing.
	 *
	 * @returns {boolean}
	 * @memberof Sprite_Balloon
	 */
	isPlaying(): boolean;
}

/**
 * -----------------------------------------------------------------------------
 * Sprite_Button
 *
 * The sprite for displaying a button.
 */
declare class Sprite_Button extends Sprite {
	protected constructor();
	_touching: boolean;
	_coldFrame: Rectangle;
	_hotFrame: Rectangle;
	_clickHandler: () => void;
	/**
	 * Update method, which checks if the sprite is being touched and updates
	 * the current frame.
	 *
	 * @memberof Sprite_Button
	 */
	updateFrame(): void;
	/**
	 * Set the button sprites cold frame.
	 *
	 * @param {Int} x
	 * @param {Int} y
	 * @param {Int} width
	 * @param {Int} height
	 *
	 * @memberof Sprite_Button
	 *
	 */
	setColdFrame(x: number, y: number, width: number, height: number): void;
	/**
	 * Set the button sprites hot frame
	 *
	 * @param {Int} x
	 * @param {Int} y
	 * @param {Int} width
	 * @param {Int} height
	 *
	 * @memberof Sprite_Button
	 *
	 */
	setHotFrame(x: number, y: number, width: number, height: number): void;
	/**
	 * Creates a new handler and binds it to the button.
	 *
	 * @param {function} height
	 * @memberof Sprite_Button
	 */
	setClickHandler(method: () => void): void;
	/**
	 * Calls the handler method bound to the button.
	 *
	 * @param {function} height
	 * @memberof Sprite_Button
	 */
	callClickHandler(): void;
	/**
	 * Processes weather or not the button is being touched and calls the handler
	 * bound to the button.
	 * @memberof Sprite_Button
	 */
	processTouch(): void;
	/**
	 * Returns true if the sprite button is currently active.
	 * @returns {Bool}
	 * @memberof Sprite_Button
	 */
	isActive(): boolean;
	/**
	 * Returns true is the button is presently being touched.
	 * @returns {Bool}
	 * @memberof Sprite_Button
	 */
	isButtonTouched(): boolean;
	/**
	 * Changes the x coordinate of the screen to local sprite x coordinate.
	 * @param {Int} x
	 * @returns {Int}
	 * @memberof Sprite_Button
	 */
	canvasToLocalX(x: number): number;
	/**
	 * Changes the y coordinate of the screen
	 * to local sprite y coordinate.
	 * @param {Int} y
	 * @returns {Int}
	 * @memberof Sprite_Button
	 */
	canvasToLocalY(y: number): number;
}

/**
 * -----------------------------------------------------------------------------
 * Sprite_Character
 *
 * The sprite for displaying a character.
 */
declare class Sprite_Character extends Sprite_Base {
	/**
	 * Creates an instance of Sprite_Character.
	 * @param {Game_Character} character
	 * @memberof Sprite_Character
	 */
	constructor(character: Game_Character);
	/**
	 * The Game_Character object assigned
	 * to the sprite.
	 * @private var
	 * @type {Game_Character}
	 * @memberof Sprite_Character
	 */
	_character: Game_Character;
	_balloonDuration: number;
	_tilesetId: number;
	_upperBody: Sprite;
	_lowerBody: Sprite;
	_bushDepth: number;
	/**
	 * The current balloon sprite
	 * assigned to the sprite.
	 * @private var
	 * @type {Sprite_Balloon}
	 * @memberof Sprite_Character
	 */
	_balloonSprite: Sprite_Balloon;
	initialize(character: Game_Character): void;
	initMembers(): void;
	/**
	 * Sets the current Game_Character object
	 * attached to the sprite.
	 * @param {Game_Character} character
	 * @memberof Sprite_Character
	 */
	setCharacter(character: Game_Character): void;
	/**
	 * Returns true if the Game_Character object
	 * tileId is greater than 0.
	 * @returns {Bool}
	 * @memberof Sprite_Character
	 */
	isTile(): boolean;
	tilesetBitmap(tileId: number): Bitmap;
	/**
	 * Updates the bitmap of the sprite character.
	 *
	 * @memberof Sprite_Character
	 */
	updateBitmap(): void;
	/**
	 * Returns true if the sprite character image has changed.
	 *
	 * @returns {Bool}
	 * @memberof Sprite_Character
	 */
	isImageChanged(): boolean;
	setTileBitmap(): void;
	/**
	 * Sets the sprite character bitmap.
	 *
	 * @memberof Sprite_Character
	 */
	setCharacterBitmap(): void;
	/**
	 * Updates the sprite character frame.
	 *
	 * @memberof Sprite_Character
	 */
	updateFrame(): void;
	/**
	 * Updates the sprite character tile frame.
	 *
	 * @memberof Sprite_Character
	 */
	updateTileFrame(): void;
	/**
	 * Updates the sprite character -- character frame.
	 *
	 * @memberof Sprite_Character
	 */
	updateCharacterFrame(): void;
	characterBlockX(): number;
	characterBlockY(): number;
	/**
	 * Returns the character x pattern.
	 *
	 * @returns {number}
	 * @memberof Sprite_Character
	 */
	characterPatternX(): rm.types.CharacterPattern;
	/**
	 * Returns the character y pattern.
	 *
	 * @returns {number}
	 * @memberof Sprite_Character
	 */
	characterPatternY(): rm.types.CharacterPattern;
	/**
	 * Returns the pattern width.
	 *
	 * @returns {number}
	 * @memberof Sprite_Character
	 */
	patternWidth(): number;
	/**
	 * Returns the pattern height.
	 *
	 * @returns {number}
	 * @memberof Sprite_Character
	 */
	patternHeight(): number;
	updateHalfBodySprites(): void;
	createHalfBodySprites(): void;
	/**
	 * Updates the position of the sprite character.
	 *
	 * @memberof Sprite_Character
	 */
	updatePosition(): void;
	updateAnimation(): void;
	updateOther(): void;
	setupAnimation(): void;
	/**
	 * Sets up the Game_Character object
	 * balloon sprite, and calls the startBalloon method.
	 * @memberof Sprite_Character
	 */
	setupBalloon(): void;
	/**
	 * Starts the balloon sprite on the
	 * Game_Character object.
	 * @memberof Sprite_Character
	 */
	startBalloon(): void;
	/**
	 * Processes the balloon sprite, calls
	 * the endBaloon method if the balloon sprite is done playing.
	 * @memberof Sprite_Character
	 */
	updateBalloon(): void;
	/**
	 * Ends the balloon sprite, removing it from
	 * the Game_Character object sprite.
	 * @memberof Sprite_Character
	 */
	endBalloon(): void;
	/**
	 * Returns true if a balloon animation
	 * is playing on the character.
	 * @returns {Bool}
	 * @memberof Sprite_Character
	 */
	isBalloonPlaying(): boolean;
}

/**
 * -----------------------------------------------------------------------------
 * Sprite_Damage
 *
 * The sprite for displaying a popup damage.
 */
declare class Sprite_Damage extends Sprite {
	protected constructor();
	__duration: number;
	/**
	 * Array of 3 numbers of RGB
	 */
	_flashColor: number[];
	_flashDuration: number;
	_damageBitmap: Bitmap;
	setup(target: Game_Actor): void;
	setupCriticalEffect(): void;
	/**
	 * Returns the digit width of the sprite damage.
	 *
	 * @returns {number}
	 * @memberof Sprite_Damage
	 */
	digitWidth(): number;
	/**
	 * Returns the digit height of the sprite damage.
	 *
	 * @returns {number}
	 * @memberof Sprite_Damage
	 */
	digitHeight(): number;
	/**
	 * Creates the miss display of the damage sprite.
	 *
	 * @memberof Sprite_Damage
	 */
	createMiss(): void;
	createDigits(baseRow: number, value: number): void;
	/**
	 * Creates the child sprite of the damage sprite for displaying damage.
	 *
	 * @returns {Sprite}
	 * @memberof Sprite_Damage
	 */
	createChildSprite(): Sprite;
	updateChild(sprite: Sprite): void;
	/**
	 * Updates the flash of the damage sprite.
	 *
	 * @memberof Sprite_Damage
	 */
	updateFlash(): void;
	/**
	 * Updates the opacity of the damage sprite.
	 *
	 * @memberof Sprite_Damage
	 */
	updateOpacity(): void;
	/**
	 * Returns true if the damage sprite is playing.
	 *
	 * @returns {boolean}
	 * @memberof Sprite_Damage
	 */
	isPlaying(): boolean;
}

/**
 * -----------------------------------------------------------------------------
 * Sprite_Destination
 *
 * The sprite for displaying the destination place of the touch input.
 */
declare class Sprite_Destination extends Sprite {
	protected constructor();
	_frameCount: number;
	/**
	 * Creates the destination bitmap of the destination sprite.
	 *
	 * @memberof Sprite_Destination
	 */
	createBitmap(): void;
	/**
	 * Updates the position of the destination sprite.
	 *
	 * @memberof Sprite_Destination
	 */
	updatePosition(): void;
	/**
	 * Updates the destination sprite animation.
	 *
	 * @memberof Sprite_Destination
	 */
	updateAnimation(): void;
}

/**
 * -----------------------------------------------------------------------------
 * Sprite_Enemy
 *
 * The sprite for displaying an enemy.
 */
declare class Sprite_Enemy extends Sprite_Battler {
	constructor(battler: Game_Enemy);
	_enemy: Game_Enemy;
	_appeared: boolean;
	_battlerName: string;
	_battlerHue: number;
	_effectType: string;
	_effectDuration: number;
	_shake: number;
	_stateIconSprite: Sprite_StateIcon;
	initialize(battler: Game_Enemy): void;
	createStateIconSprite(): void;
	/**
	 * Sets the battler to an instance of game enemy.
	 *
	 * @param {Game_Enemy} battler Instance of game enemy.
	 * @memberof Sprite_Enemy
	 */
	setBattler(battler: Game_Enemy): void;
	loadBitmap(name: string, hue: number): void;
	/**
	 * Updates the state sprite on the sprite enemy.
	 *
	 * @memberof Sprite_Enemy
	 */
	updateStateSprite(): void;
	initVisibility(): void;
	setupEffect(): void;
	startEffect(effectType: string): void;
	/**
	 * Starts the appearinig effect on the sprite enemy.
	 *
	 * @memberof Sprite_Enemy
	 */
	startAppear(): void;
	/**
	 * Starts the disappearing effect on the sprite enemy.
	 *
	 * @memberof Sprite_Enemy
	 */
	startDisappear(): void;
	/**
	 * Starts the whiten effect on the sprite enemy.
	 *
	 * @memberof Sprite_Enemy
	 */
	startWhiten(): void;
	/**
	 * Starts the blink effect on the sprite enemy.
	 *
	 * @memberof Sprite_Enemy
	 */
	startBlink(): void;
	/**
	 * Starts the collapse effect of the sprite
	 * enemy.
	 * @memberof Sprite_Enemy
	 */
	startCollapse(): void;
	/**
	 * Starts the boss collapse effect of the sprite
	 * enemy.
	 * @memberof Sprite_Enemy
	 */
	startBossCollapse(): void;
	/**
	 * Starts the instant collapse effect of the sprite enemy.
	 *
	 * @memberof Sprite_Enemy
	 */
	startInstantCollapse(): void;
	updateEffect(): void;
	/**
	 * Returns true if the effect type on the sprite enemy
	 * is not null.
	 * @returns {Bool}
	 * @memberof Sprite_Enemy
	 */
	isEffecting(): boolean;
	/**
	 * Revers the sprite enemy to a normal state.
	 *
	 * @memberof Sprite_Enemy
	 */
	revertToNormal(): void;
	/**
	 * Updates the whiten effect on the sprite enemy.
	 *
	 * @memberof Sprite_Enemy
	 */
	updateWhiten(): void;
	/**
	 * Updates the blink effect on the sprite enemy.
	 *
	 * @memberof Sprite_Enemy
	 */
	updateBlink(): void;
	/**
	 * Updates the appear effect on the sprite enemy.
	 *
	 * @memberof Sprite_Enemy
	 */
	updateAppear(): void;
	updateDisappear(): void;
	/**
	 * Updates the collapse effect.
	 *
	 * @memberof Sprite_Enemy
	 */
	updateCollapse(): void;
	/**
	 * Updates the boss collapse effect.
	 *
	 * @memberof Sprite_Enemy
	 */
	updateBossCollapse(): void;
	/**
	 * Updates the instant collapse effect.
	 *
	 * @memberof Sprite_Enemy
	 */
	updateInstantCollapse(): void;
	damageOffsetX(): number;
	damageOffsetY(): number;
}

/**
 * -----------------------------------------------------------------------------
 * Sprite_Picture
 *
 * The sprite for displaying a picture.
 */
declare class Sprite_Picture {
	constructor(pictureId: number);
	_pictureId: number;
	_pictureName: string;
	_isPicture: boolean;
	picture(): Game_Picture;
	updateBitmap(): void;
	updateOrigin(): void;
	updatePosition(): void;
	updateScale(): void;
	updateTone(): void;
	updateOther(): void;
	loadBitmap(): void;
}

/**
 * -----------------------------------------------------------------------------
 * Sprite_StateIcon
 *
 * The sprite for displaying state icons.
 */
declare class Sprite_StateIcon extends Sprite {
	protected constructor();
	_battler: Game_Battler;
	_iconIndex: number;
	_animationCount: number;
	_animationIndex: number;
	/**
	 * Initializes the sprite state icon properties.
	 *
	 * @memberof Sprite_StateIcon
	 */
	initMembers(): void;
	/**
	 * Loads the bitmap of the sprite state icon.
	 *
	 * @memberof Sprite_StateIcon
	 */
	loadBitmap(): void;
	setup(battler: Game_Battler): void;
	animationWait(): number;
	/**
	 * Updates the icon displayed in the icon sprite.
	 *
	 * @memberof Sprite_StateIcon
	 */
	updateIcon(): void;
	/**
	 * Updates the state icon sprite frame.
	 *
	 * @memberof Sprite_StateIcon
	 */
	updateFrame(): void;
	static _iconWidth: number;
	static _iconHeight: number;
}

/**
 * -----------------------------------------------------------------------------
 * Sprite_StateOverlay
 *
 * The sprite for displaying an overlay image for a state.
 */
declare class Sprite_StateOverlay extends Sprite_Base {
	protected constructor();
	_battler: Game_Battler;
	_overlayIndex: number;
	_animationCount: number;
	_pattern: number;
	/**
	 * Initialize the overlay sprite properties.
	 *
	 * @memberof Sprite_StateOverlay
	 */
	initMembers(): void;
	/**
	 * Loads the bitmap of the overlay sprite.
	 *
	 * @memberof Sprite_StateOverlay
	 */
	loadBitmap(): void;
	setup(battler: Game_Battler): void;
	animationWait(): number;
	/**
	 * Updates the overlay sprite pattern.
	 *
	 * @memberof Sprite_StateOverlay
	 */
	updatePattern(): void;
	/**
	 * Updates the overlay sprite frame.
	 *
	 * @memberof Sprite_StateOverlay
	 */
	updateFrame(): void;
}

/**
 * -----------------------------------------------------------------------------
 * Sprite_Timer
 *
 * The sprite for displaying the timer.
 */
declare class Sprite_Timer extends Sprite {
	protected constructor();
	_seconds: number;
	/**
	 * Creates the bitmap of the sprite timer.
	 *
	 * @memberof Sprite_Timer
	 */
	createBitmap(): void;
	/**
	 * Updates the bitmap of the sprite timer.
	 *
	 * @memberof Sprite_Timer
	 */
	updateBitmap(): void;
	/**
	 * Redraws the sprite timer.
	 *
	 * @memberof Sprite_Timer
	 */
	redraw(): void;
	/**
	 * Returns the text of the timer.
	 *
	 * @returns {string} The text displayed on the timer.
	 * @memberof Sprite_Timer
	 */
	timerText(): string;
	/**
	 * Updates the positon of the sprite timer.
	 *
	 * @memberof Sprite_Timer
	 */
	updatePosition(): void;
	/**
	 * Updates the visibility of the sprite timer.
	 *
	 * @memberof Sprite_Timer
	 */
	updateVisibility(): void;
}

/**
 * -----------------------------------------------------------------------------
 * Sprite_Weapon
 *
 * The sprite for displaying a weapon image for attacking.
 */
declare class Sprite_Weapon extends Sprite_Base {
	protected constructor();
	_weaponImageId: rm.types.WeaponImageId;
	_animaationCount: number;
	_pattern: number;
	/**
	 * Initializes the members of the weapon sprite object.
	 *
	 * @memberof Sprite_Weapon
	 */
	initMembers(): void;
	setup(weaponImageId: rm.types.WeaponImageId): void;
	animationWait(): number;
	/**
	 * Updates the pattern of the weapon sprite.
	 *
	 * @memberof Sprite_Weapon
	 */
	updatePattern(): void;
	/**
	 * Loads the bitmap of the weapon sprite.
	 *
	 * @memberof Sprite_Weapon
	 */
	loadBitmap(): void;
	/**
	 * Updates the weapon sprite frames.
	 *
	 * @memberof Sprite_Weapon
	 */
	updateFrame(): void;
	/**
	 * Returns true if the weapon sprite is playing.
	 *
	 * @returns {boolean}
	 * @memberof Sprite_Weapon
	 */
	isPlaying(): boolean;
}

/**
 * -----------------------------------------------------------------------------
 * Spriteset_Base
 *
 * The superdeclare class of Spriteset_Map and Spriteset_Battle.
 */
declare class Spriteset_Base extends Sprite {
	protected constructor();
	_tone: number[];
	_baseSprite: Sprite;
	_blackScreen: ScreenSprite;
	_toneFilter: ToneFilter;
	_toneSprite: ToneSprite;
	_pictureContainer: Sprite;
	_timerSprite: Sprite_Timer;
	_flashSprite: ScreenSprite;
	_fadeSprite: ScreenSprite;
	/**
	 * Creates the lower layer including the base sprites.
	 *
	 * @memberof Spriteset_Base
	 */
	createLowerLayer(): void;
	/**
	 * Creates the upper layer including the pictures,
	 * timer, and screen sprites.
	 * @memberof Spriteset_Base
	 */
	createUpperLayer(): void;
	/**
	 * Create the base sprite.
	 *
	 * @memberof Spriteset_Base
	 */
	createBaseSprite(): void;
	/**
	 * Creates the tone changer sprite.
	 *
	 * @memberof Spriteset_Base
	 */
	createToneChanger(): void;
	/**
	 * Creates the WebGL toner.
	 *
	 * @memberof Spriteset_Base
	 */
	createWebGLToneChanger(): void;
	/**
	 * Creates the Canvas tone.
	 *
	 * @memberof Spriteset_Base
	 */
	createCanvasToneChanger(): void;
	/**
	 * Creates a new sprite picture on the spritesetb ase.
	 *
	 * @memberof Spriteset_Base
	 */
	createPictures(): void;
	/**
	 * Creates a new Sprite timer on the spriteset base.
	 *
	 * @memberof Spriteset_Base
	 */
	createTimer(): void;
	/**
	 * Creates the screen sprite.
	 *
	 * @memberof Spriteset_Base
	 */
	createScreenSprites(): void;
	/**
	 * Updates the screen sprites on the spriteset base.
	 *
	 * @memberof Spriteset_Base
	 */
	updateScreenSprites(): void;
	updateToneChanger(): void;
	/**
	 * Updates the WebGL tone changer.
	 *
	 * @memberof Spriteset_Base
	 */
	updateWebGLToneChanger(): void;
	/**
	 * Updates the Canvas tone changer.
	 *
	 * @memberof Spriteset_Base
	 */
	updateCanvasToneChanger(): void;
	/**
	 * Updates the position of spriteset base.
	 *
	 * @memberof Spriteset_Base
	 */
	updatePosition(): void;
}

/**
 * -----------------------------------------------------------------------------
 * Spriteset_Battle
 *
 * The set of sprites on the battle screen.
 */
declare class Spriteset_Battle extends Spriteset_Base {
	protected constructor();
	_battlebackLocated: boolean;
	_backgroundSprite: Sprite;
	_battleField: Sprite;
	_back1Sprite: TilingSprite;
	_back2Sprite: TilingSprite;
	_enemySprites: Sprite_Enemy[];
	_actorSprites: Sprite_Actor[];
	/**
	 * Creates the background of the battle spriteset.
	 *
	 * @memberof Spriteset_Battle
	 */
	createBackground(): void;
	/**
	 * Creates the battlefield of the battle spriteset.
	 *
	 * @memberof Spriteset_Battle
	 */
	createBattleField(): void;
	/**
	 * Creates the battleback of the battle spriteset.
	 *
	 * @memberof Spriteset_Battle
	 */
	createBattleback(): void;
	/**
	 * Updates the battleback of the battle spriteset.
	 *
	 * @memberof Spriteset_Battle
	 */
	updateBattleback(): void;
	/**
	 * Locates the battleback and adjusts the coordinates of the
	 * battleback.
	 * @memberof Spriteset_Battle
	 */
	locateBattleback(): void;
	/**
	 * Returns battleb ack 2 of the battle spriteset.
	 *
	 * @returns {Bitmap} Instance of the Bitmap class.
	 * @memberof Spriteset_Battle
	 */
	battleback1Bitmap(): Bitmap;
	/**
	 * Returns battleback 2 of the battle spriteset.
	 *
	 * @returns {Bitmap} Instance of the Bitmap class.
	 * @memberof Spriteset_Battle
	 */
	battleback2Bitmap(): Bitmap;
	/**
	 *
	 *
	 * @returns {string} Name of battleback 1 bitmap.
	 * @memberof Spriteset_Battle
	 */
	battleback1Name(): string;
	/**
	 *
	 *
	 * @returns {string} Name of battleback 2 bitmap.
	 * @memberof Spriteset_Battle
	 */
	battleback2Name(): string;
	/**
	 * Returns the battleback 1 name as a string.
	 *
	 * @returns {string} Name of overworld battleback 1 bitmap.
	 * @memberof Spriteset_Battle
	 */
	overworldBattleback1Name(): string;
	/**
	 * Returns the battleback 2 name as a string.
	 *
	 * @returns {string} Name of overworld battleback 2 bitmap.
	 * @memberof Spriteset_Battle
	 */
	overworldBattleback2Name(): string;
	/**
	 *
	 *
	 * @returns {string} Name of the normal battleback 1 bitmap.
	 * @memberof Spriteset_Battle
	 */
	normalBattleback1Name(): string;
	/**
	 *
	 *
	 * @returns {string} Name of the normal battleback 2 bitmap.
	 * @memberof Spriteset_Battle
	 */
	normalBattleback2Name(): string;
	/**
	 * Given the specified terrtain type, return
	 * the battleback 1 name.
	 * @param {number} type Terrain type.
	 * @returns {string} Name of the terrtain battleback 1 bitmap.
	 * @memberof Spriteset_Battle
	 */
	terrainBattleback1Name(type: number): string;
	/**
	 * Given the specified terrain type, return
	 * the battleback 2 name.
	 * @param {number} type Terrain type.
	 * @returns {string} Name of the terrain battleback 2 bitmap.
	 * @memberof Spriteset_Battle
	 */
	terrainBattleback2Name(type: number): string;
	/**
	 *
	 *
	 * @returns {string} Name of the default battleback 1 name.
	 * @memberof Spriteset_Battle
	 */
	defaultBattleback1Name(): string;
	/**
	 *
	 *
	 * @returns {string} Name of the default battleback 2 name.
	 * @memberof Spriteset_Battle
	 */
	defaultBattleback2Name(): string;
	/**
	 *
	 *
	 * @returns {string} Name of the ship battleback 1  bitmap.
	 * @memberof Spriteset_Battle
	 */
	shipBattleback1Name(): string;
	/**
	 *
	 *
	 * @returns {string} Name of the ship battleback 2 bitmap.
	 * @memberof Spriteset_Battle
	 */
	shipBattleback2Name(): string;
	autotileType(z: number): number;
	/**
	 * Creates sprite enemies for the battle spriteset.
	 *
	 * @memberof Spriteset_Battle
	 */
	createEnemies(): void;
	compareEnemySprite(a: Sprite_Enemy, b: Sprite_Enemy): number;
	/**
	 * Creates sprite actors for the battle spriteset.
	 *
	 * @memberof Spriteset_Battle
	 */
	createActors(): void;
	/**
	 * Updates the actor sprites on the battle spriteset.
	 *
	 * @memberof Spriteset_Battle
	 */
	updateActors(): void;
	/**
	 * Returns all battler sprites on the battle spriteset.
	 *
	 * @returns {Array<Sprite_Battler>}
	 * @memberof Spriteset_Battle
	 */
	battlerSprites(): Sprite_Battler[];
	/**
	 * Returns true if animation is playing on the battle spriteset.
	 *
	 * @returns {boolean}
	 * @memberof Spriteset_Battle
	 */
	isAnimationPlaying(): boolean;
	isEffecting(): boolean;
	/**
	 * Returns true if any sprite actor or enemy is moving.
	 *
	 * @returns {boolean} Representing whether any battle participants are moving.
	 * @memberof Spriteset_Battle
	 */
	isAnyoneMoving(): boolean;
	/**
	 * Returns true if the battle spriteset is busy.
	 *
	 * @returns {boolean}
	 * @memberof Spriteset_Battle
	 */
	isBusy(): boolean;
}

/**
 * -----------------------------------------------------------------------------
 * Spriteset_Map
 *
 * The set of sprites on the map screen.
 */
declare class Spriteset_Map extends Spriteset_Base {
	protected constructor();
	_parallax: TilingSprite;
	_tilemap: Tilemap | ShaderTilemap;
	_tileset: rm.types.Tileset;
	_characterSprites: Sprite_Character[];
	_shadowSprite: Sprite;
	_destinationSprite: Sprite_Destination;
	_weather: Weather;
	_parallaxName: string;
	/**
	 * Hides the map spriteset character sprites.
	 *
	 * @memberof Spriteset_Map
	 */
	hideCharacters(): void;
	/**
	 * Creates the map spriteset parallax.
	 *
	 * @memberof Spriteset_Map
	 */
	createParallax(): void;
	/**
	 * Creates the map spriteset tile map.
	 *
	 * @memberof Spriteset_Map
	 */
	createTilemap(): void;
	/**
	 * Loads the map spriteset tileset.
	 *
	 * @memberof Spriteset_Map
	 */
	loadTileset(): void;
	/**
	 * Creates the map spriteset character sprite.
	 *
	 * @memberof Spriteset_Map
	 */
	createCharacters(): void;
	/**
	 * Creates the map spriteset shadow sprite.
	 *
	 * @memberof Spriteset_Map
	 */
	createShadow(): void;
	/**
	 * Creates the map spriteset destination sprite.
	 *
	 * @memberof Spriteset_Map
	 */
	createDestination(): void;
	/**
	 * Creates the map spriteset weather.
	 *
	 * @memberof Spriteset_Map
	 */
	createWeather(): void;
	/**
	 * Updates the map spriteset tileset.
	 *
	 * @memberof Spriteset_Map
	 */
	updateTileset(): void;
	updateParallax(): void;
	/**
	 * Updates the map spriteset tile map.
	 *
	 * @memberof Spriteset_Map
	 */
	updateTilemap(): void;
	/**
	 * Updates the map spriteset shadow.
	 *
	 * @memberof Spriteset_Map
	 */
	updateShadow(): void;
	/**
	 * Updates the map spriteset weather.
	 *
	 * @memberof Spriteset_Map
	 */
	updateWeather(): void;
}

declare class Window_Selectable extends Window_Base {
	constructor(x: number, y: number, width: number, height: number);
	initialize(x: number, y: number, height: number, width: number): void;
	/**
	 * Returns the current position of the _index property.
	 *
	 * @returns {Int}
	 * @memberof Window_Selectable
	 */
	index(): number;
	/**
	 * Returns true if the _cursorFixed property is true;
	 * this means the cursor is locked to a position.
	 * @returns {boolean}
	 * @memberof Window_Selectable
	 */
	cursorFixed(): boolean;
	/**
	 * Sets the _cursorFixed property of the
	 * window.
	 * @param {boolean} cursorFixed
	 * @memberof Window_Selectable
	 */
	setCursorFixed(cursorFixed: boolean): void;
	cursorAll(): boolean;
	setCursorAll(cursorAll: boolean): void;
	/**
	 * Returns the maximum number of columns
	 * for the window.
	 * @returns {number}
	 * @memberof Window_Selectable
	 */
	maxCols(): number;
	/**
	 * Returns the maximum number of items within the window;
	 * useful to overwrite when creating a new window.
	 * This method is used to calculate the number of rows and more.
	 * @returns {number}
	 * @memberof Window_Selectable
	 */
	maxItems(): number;
	spacing(): number;
	/**
	 * Returns the width of an item within the window;
	 * determines the width of a column.
	 * @returns {number}
	 * @memberof Window_Selectable
	 */
	itemWidth(): number;
	/**
	 * Returns the height of an item within the window;
	 * determines the height of a row.
	 * @returns {number}
	 * @memberof Window_Selectable
	 */
	itemHeight(): number;
	/**
	 * Selects the current index within the window given a number.
	 *
	 * @param {number} index
	 * @memberof Window_Selectable
	 */
	select(index: number): void;
	/**
	 * Deselects the currently selected index.
	 *
	 * @memberof Window_Selectable
	 */
	deselect(): void;
	/**
	 * Reselects the index based on the window's _index property.
	 *
	 * @memberof Window_Selectable
	 */
	reselect(): void;
	row(): number;
	topRow(): number;
	maxTopRow(): number;
	/**
	 * Sets the current top row of the given a number.
	 * The top row will then be moved to an index
	 * of the window.
	 * @param {number} row
	 * @memberof Window_Selectable
	 */
	setTopRow(row: number): void;
	resetScroll(): void;
	maxPageRows(): number;
	maxPageItems(): number;
	/**
	 * Returns true if the window is horizontal;
	 * means the window only has a single row.
	 * @returns {boolean}
	 * @memberof Window_Selectable
	 */
	isHorizontal(): boolean;
	bottomRow(): number;
	setBottomRow(row: number): void;
	/**
	 * Creates a new rectangle based on itemWidth and itemHeight.
	 * The rectangle is mainly used for positioning items within
	 * the selectable window.
	 * @param {number} index
	 * @returns {Rectangle}
	 * @memberof Window_Selectable
	 */
	itemRect(index: number): Rectangle;
	/**
	 * Creates a new rectangle based on itemWidth and itemHeight
	 * The rectangle is used for positioning text within
	 * the selectable window.
	 * @param {number} index
	 * @returns {Rectangle}
	 * @memberof Window_Selectable
	 */
	itemRectForText(index: number): Rectangle;
	setHelpWindow(helpWindow: Window_Help): void;
	/**
	 * Shows the attached help window.
	 *
	 * @memberof Window_Selectable
	 */
	showHelpWindow(): void;
	/**
	 * Hides the attached help window.
	 *
	 * @memberof Window_Selectable
	 */
	hideHelpWindow(): void;
	/**
	 * Creates a new handler with the symbol as the handler name
	 * and a method (JS function) bound to it.
	 * @param {string} symbol
	 * @param {*} method
	 * @memberof Window_Selectable
	 */
	setHandler(symbol: string, method: any): void;
	isHandled(symbol: string): boolean;
	callHandler(symbol: string): void;
	isOpenAndActive(): boolean;
	isCursorMovable(): boolean;
	/**
	 * Moves the cursor down; if wrap is passed
	 * as true, then it will return to the top when
	 * at the end of the list.
	 * @param {boolean} wrap
	 * @memberof Window_Selectable
	 */
	cursorDown(wrap: boolean): void;
	/**
	 * Moves the cursor up; if wrap is passed
	 * as true, then it will return to the bottom
	 * when at the top of the list.
	 * @param {boolean} wrap
	 * @memberof Window_Selectable
	 */
	cursorUp(wrap: boolean): void;
	cursorRight(wrap: boolean): void;
	cursorLeft(wrap: boolean): void;
	cursorPagedown(): void;
	cursorPageup(): void;
	scrollDown(): void;
	scrollUp(): void;
	updateArrows(): void;
	/**
	 * Handles the processing of cursor movement.
	 *
	 * @memberof Window_Selectable
	 */
	processCursorMove(): void;
	/**
	 * Handles the process of attached handlers.
	 *
	 * @memberof Window_Selectable
	 */
	processHandling(): void;
	/**
	 * Handles the processing of the scroll wheel within
	 * the window.
	 * @memberof Window_Selectable
	 */
	processWheel(): void;
	/**
	 * Handles the processing of touch input.
	 *
	 * @memberof Window_Selectable
	 */
	processTouch(): void;
	isTouchedInsideFrame(): boolean;
	onTouch(triggered: boolean): void;
	hitTest(x: number, y: number): number;
	isContentsArea(x: number, y: number): boolean;
	/**
	 * Determines if touch ok is enabled as an option;
	 * this means whether you can confirm the selection
	 * of an item within the window with touch input.
	 * @returns {boolean}
	 * @memberof Window_Selectable
	 */
	isTouchOkEnabled(): boolean;
	/**
	 * Determines if ok is enabled as an option;
	 * this means whether you can confirm selection
	 * of an item within the window.
	 * @returns {boolean}
	 * @memberof Window_Selectable
	 */
	isOkEnabled(): boolean;
	isCancelEnabled(): boolean;
	isOkTriggered(): boolean;
	isCancelTriggered(): boolean;
	processOk(): void;
	callOkHandler(): void;
	processCancel(): void;
	callCancelHandler(): void;
	processPageup(): void;
	processPagedown(): void;
	updateInputData(): void;
	updateCursor(): void;
	/**
	 * Determines if the cursor is visible within
	 * the window.
	 * @returns {boolean}
	 * @memberof Window_Selectable
	 */
	isCursorVisible(): boolean;
	ensureCursorVisible(): void;
	callUpdateHelp(): void;
	updateHelp(): void;
	setHelpWindowItem(item: any): void;
	isCurrentItemEnabled(): boolean;
	/**
	 * Draws all items within the window; this method
	 * cals drawItem multiple times.
	 * @memberof Window_Selectable
	 */
	drawAllItems(): void;
	drawItem(index: number): void;
	clearItem(index: number): void;
	redrawItem(index: number): void;
	redrawCurrentItem(): void;
	/**
	 * Refreshes the window contents.
	 *
	 * @memberof Window_Selectable
	 */
	refresh(): void;
}

declare class Window_Command extends Window_Selectable {
	/**
	 * Creates an instance of Window_Command.
	 * @param {number} x
	 * @param {number} y
	 * @memberof Window_Command
	 */
	constructor(x: number, y: number);
	initialize(x: number, y: number): void;
	/**
	 * Returns the width of the window;
	 * default is 240.
	 * @returns {number}
	 * @memberof Window_Command
	 */
	windowWidth(): number;
	/**
	 * Returns the height of the window;
	 * takes the visible rows and passes it to the fittingHeight method.
	 * @returns {number}
	 * @memberof Window_Command
	 */
	windowHeight(): number;
	/**
	 * Returns the number of visible rows within the window.
	 *
	 * @returns {number}
	 * @memberof Window_Command
	 */
	numVisibleRows(): number;
	/**
	 * Returns the maximum number of items within the window.
	 *
	 * @returns {number}
	 * @memberof Window_Command
	 */
	maxItems(): number;
	/**
	 * Clears the list of commands from the window;
	 * this is useful for refreshing changing commands.
	 * @memberof Window_Command
	 */
	clearCommandList(): void;
	/**
	 * Convenient method for overwriting and adding
	 * commands with the addCommand method.
	 * @memberof Window_Command
	 */
	makeCommandList(): void;
	/**
	 * Adds commands to the window list with the specified
	 * parameters. The actual command can be found as an object.
	 * @param {String} name
	 * @param {String} symbol
	 * @param {boolean} enabled
	 * @param {(any | object)} [ext]
	 * @memberof Window_Command
	 */
	addCommand(name: string, symbol: string, enabled: boolean, ext?: any): void;
	/**
	 * Returns the command name given an index.
	 *
	 * @param {number} index
	 * @returns {String}
	 * @memberof Window_Command
	 */
	commandName(index: number): string;
	/**
	 * Returns the command symbol given an index.
	 *
	 * @param {number} index
	 * @returns {String}
	 * @memberof Window_Command
	 */
	commandSymbol(index: number): string;
	/**
	 * Determines if the command is enabled;
	 * checks the enabled property of the command.
	 * @param {number} index
	 * @returns {boolean}
	 * @memberof Window_Command
	 */
	isCommandEnabled(index: number): boolean;
	/**
	 * Returns the command object at the current index.
	 *
	 * @returns {object}
	 * @memberof Window_Command
	 */
	currentData(): any;
	/**
	 * Returns the command symbol at the current index.
	 *
	 * @returns {String}
	 * @memberof Window_Command
	 */
	currentSymbol(): string;
	/**
	 * Returns the ext property of the command at the current index.
	 *
	 * @returns {(any | object)}
	 * @memberof Window_Command
	 */
	currentExt(): any;
	/**
	 * Finds a command object and returns the index number based
	 * on the symbol property.
	 * @param {String} symbol
	 * @returns {number}
	 * @memberof Window_Command
	 */
	findSymbol(symbol: string): boolean;
	/**
	 * Selects a command object based on the symbol property.
	 *
	 * @param {String} symbol
	 * @memberof Window_Command
	 */
	selectSymbol(symbol: string): void;
	/**
	 * Finds a command object and returns the index number
	 * based on the ext property.
	 * @param {(any | object)} ext
	 * @returns {number}
	 * @memberof Window_Command
	 */
	findExt(ext: any): number;
	/**
	 * Selects a command object based on the ext property.
	 *
	 * @param {(any | object)} ext
	 * @memberof Window_Command
	 */
	selectExt(ext: any): void;
	/**
	 * Returns the text align of the commands;
	 * possible values are: 'left', 'center', 'right'.
	 * @returns {String}
	 * @memberof Window_Command
	 */
	itemTextAlign(): string;
}

/**
 * -----------------------------------------------------------------------------
 * Window_ActorCommand
 *
 * The window for selecting an actor's action on the battle screen.
 * @class Window_ActorCommand
 */
declare class Window_ActorCommand extends Window_Command {
	constructor();
	/**
	 * Adds the attack command to the actor command window.
	 *
	 * @memberof Window_ActorCommand
	 */
	addAttackCommand(): void;
	/**
	 * Adds the skill command to the actor command window.
	 *
	 * @memberof Window_ActorCommand
	 */
	addSkillCommands(): void;
	/**
	 * Adds the guard command to the actor command window.
	 *
	 * @memberof Window_ActorCommand
	 */
	addGuardCommand(): void;
	/**
	 * Adds the item command to the actor command window.
	 *
	 * @memberof Window_ActorCommand
	 */
	addItemCommand(): void;
	/**
	 * Sets up the actor command window with a specified actor.
	 *
	 * @param {Game_Actor} actor
	 * @memberof Window_ActorCommand
	 */
	setup(actor: Game_Actor): void;
	selectLast(): void;
}

/**
 * -----------------------------------------------------------------------------
 * Window_BattleStatus
 *
 * The window for displaying the status of party members on the battle screen.
 * @class Window_BattleStatus
 */
declare class Window_BattleStatus extends Window_Selectable {
	constructor();
	/**
	 * Returns the window width.
	 *
	 * @returns {number}
	 * @memberof Window_BattleStatus
	 */
	windowWidth(): number;
	/**
	 * Returns the window height.
	 *
	 * @returns {number}
	 * @memberof Window_BattleStatus
	 */
	windowHeight(): number;
	/**
	 * Returns the number of visible rows.
	 *
	 * @returns {number}
	 * @memberof Window_BattleStatus
	 */
	numVisibleRows(): number;
	basicAreaRect(index: number): Rectangle;
	/**
	 * returns a rectangle for the gauges in the gauge area.
	 *
	 * @param {number} index
	 * @returns {Rectangle}
	 * @memberof Window_BattleStatus
	 */
	gaugeAreaRect(index: number): Rectangle;
	/**
	 * Returns the width of the guage area.
	 *
	 * @returns {number}
	 * @memberof Window_BattleStatus
	 */
	gaugeAreaWidth(): number;
	/**
	 * Draws the basic area for actors within the battle status window.
	 *
	 * @param {Rectangle} rect
	 * @param {Game_Actor} actor
	 * @memberof Window_BattleStatus
	 */
	drawBasicArea(rect: Rectangle, actor: Game_Actor): void;
	/**
	 * Draws the gauge area for the actors within the battle status window.
	 *
	 * @param {Rectangle} rect
	 * @param {Game_Actor} actor
	 * @memberof Window_BattleStatus
	 */
	drawGaugeArea(rect: Rectangle, actor: Game_Actor): void;
	/**
	 * Draws the gauges in the basic area with tp included.
	 *
	 * @param {Rectangle} rect
	 * @param {Game_Actor} actor
	 * @memberof Window_BattleStatus
	 */
	drawGaugeAreaWithTp(rect: Rectangle, actor: Game_Actor): void;
	/**
	 * Draws the gauges in the basic area without tp included.
	 *
	 * @param {Rectangle} rect
	 * @param {Game_Actor} actor
	 * @memberof Window_BattleStatus
	 */
	drawGaugeAreaWithoutTp(rect: Rectangle, actor: Game_Actor): void;
}

/**
 * -----------------------------------------------------------------------------
 * Window_BattleActor
 *
 * The window for selecting a target actor on the battle screen.
 * @class Window_BattleActor
 */
declare class Window_BattleActor extends Window_BattleStatus {
	constructor(x: number, y: number);
	initialize(x: number, y: number): void;
	/**
	 * Selects an actor within the battle actor window.
	 *
	 * @param {number} index
	 * @memberof Window_BattleActor
	 */
	select(index: number): void;
	/**
	 * Returns the current selected actor.
	 *
	 * @returns {Game_Actor}
	 * @memberof Window_BattleActor
	 */
	actor(): Game_Actor;
}

/**
 * -----------------------------------------------------------------------------
 * Window_BattleEnemy
 *
 * The window for selecting a target enemy on the battle screen.
 * @class Window_BattleEnemy
 */
declare class Window_BattleEnemy extends Window_Selectable {
	constructor(x: number, y: number);
	initialize(x: number, y: number): void;
	/**
	 * Returns the window width.
	 *
	 * @returns {number}
	 * @memberof Window_BattleEnemy
	 */
	windowWidth(): number;
	/**
	 * Returns the window height.
	 *
	 * @returns {number}
	 * @memberof Window_BattleEnemy
	 */
	windowHeight(): number;
	/**
	 * Returns the number of visible rows.
	 *
	 * @returns {number}
	 * @memberof Window_BattleEnemy
	 */
	numVisibleRows(): number;
	/**
	 * Returns the current enemy.
	 *
	 * @returns {Game_Enemy}
	 * @memberof Window_BattleEnemy
	 */
	enemy(): Game_Enemy;
	/**
	 * Returns the current index selected.
	 *
	 * @returns {number}
	 * @memberof Window_BattleEnemy
	 */
	enemyIndex(): number;
	/**
	 * Selects a specified enemy using the index.
	 *
	 * @param {number} index
	 * @memberof Window_BattleEnemy
	 */
	select(index: number): void;
}

declare class Window_ItemList extends Window_Selectable {
	constructor(x: number, y: number, width: number, height: number);
	initialize(x: number, y: number, width: number, height: number): void;
	needsNumber(): boolean;
	selectLast(): void;
	makeItemList(): void;
	numberWidth(): number;
}

/**
 * -----------------------------------------------------------------------------
 * Window_BattleItem
 *
 * The window for selecting an item to use on the battle screen.
 * @class Window_BattleItem
 */
declare class Window_BattleItem extends Window_ItemList {
	constructor(x: number, y: number, width: number, height: number);
	initialize(x: number, y: number, width: number, height: number): void;
	includes(item: rm.types.UsableItem): boolean;
}

/**
 * -----------------------------------------------------------------------------
 * Window_BattleLog
 *
 * The window for displaying battle progress. No frame is displayed, but it is
 * handled as a window for convenience.
 * @class Window_BattleLog
 */
declare class Window_BattleLog extends Window_Base {
	constructor();
	initialize(): void;
	setSpriteset(spriteset: Spriteset_Battle): void;
	windowWidth(): number;
	windowHeight(): number;
	maxLines(): number;
	createBackBitmap(): void;
	createBackSprite(): void;
	numLines(): number;
	messageSpeed(): number;
	isBusy(): boolean;
	updateWait(): boolean;
	updateWaitCount(): boolean;
	updateWaitMode(): boolean;
	setWaitMode(waitMode: string): void;
	callNextMethod(): void;
	isFastForward(): boolean;
	push(methodName: string, args: any[]): void;
	clear(): void;
	wait(): void;
	waitForEffect(): void;
	waitForMovement(): void;
	addText(text: string): void;
	pushBaseLine(): void;
	popBaseLine(): void;
	waitForNewLine(): void;
	popupDamage(target: Game_Battler): void;
	performActionStart(subject: Game_Battler, action: Game_Action): void;
	performAction(subject: Game_Battler, action: Game_Action): void;
	performActionEnd(subject: Game_Battler): void;
	performDamage(target: Game_Battler): void;
	performMiss(target: Game_Battler): void;
	performRecovery(target: Game_Battler): void;
	performEvasion(target: Game_Battler): void;
	performMagicEvasion(target: Game_Battler): void;
	performCounter(target: Game_Battler): void;
	performReflection(target: Game_Battler): void;
	performSubstitute(substitute: Game_Battler, target: Game_Battler): void;
	performCollapse(target: Game_Battler): void;
	showAnimation(subject: Game_Battler, targets: Game_Battler, animationId: number): void;
	showAttackAnimation(subject: Game_Battler, targets: Game_Battler): void;
	showActorAttackAnimation(subject: Game_Battler, targets: Game_Battler): void;
	showEnemyAttackAnimation(subject: Game_Battler, targets: Game_Battler): void;
	showNormalAnimation(targets: Game_Battler, animationId: number, mirror: boolean): void;
	animationBaseDelay(): number;
	animationNextDelay(): number;
	drawBackground(): void;
	backRect(): Rectangle;
	backColor(): string;
	backPaintOpacity(): number;
	drawLineText(index: number): void;
	startTurn(): void;
	startAction(subject: Game_Battler, action: Game_Action, targets: Game_Battler[]): void;
	endAction(subject: Game_Battler): void;
	displayCurrentState(subject: Game_Battler): void;
	displayRegeneration(subject: Game_Battler): void;
	displayAction(subject: Game_Battler, item: rm.types.UsableItem): void;
	displayCounter(target: Game_Battler): void;
	displayReflection(target: Game_Battler): void;
	displaySubstitute(substitute: Game_Battler, target: Game_Battler): void;
	displayActionResults(subject: Game_Battler, targt: Game_Battler): void;
	displayFailure(target: Game_Battler): void;
	displayCritical(target: Game_Battler): void;
	displayDamage(target: Game_Battler): void;
	displayMiss(target: Game_Battler): void;
	displayEvasion(target: Game_Battler): void;
	displayHpDamage(target: Game_Battler): void;
	displayMpDamage(target: Game_Battler): void;
	displayTpDamage(target: Game_Battler): void;
	displayAffectedStatus(target: Game_Battler): void;
	displayAutoAffectedStatus(target: Game_Battler): void;
	displayChangedStates(target: Game_Battler): void;
	displayAddedStates(target: Game_Battler): void;
	displayRemovedStates(target: Game_Battler): void;
	displayChangedBuffs(target: Game_Battler): void;
	/**
	 *
	 * @param target
	 * @param buffs list of integers representing buff Ids
	 * @param fmt
	 */
	displayBuffs(target: Game_Battler, buffs: number[], fmt: string): void;
	makeHpDamageText(target: Game_Battler): void;
	makeMpDamageText(target: Game_Battler): string;
	makeTpDamageText(target: Game_Battler): string;
}

declare namespace rm.types {
	export const enum SkillTypeIdA {
		base = -1,
	}
}

/**
 * -----------------------------------------------------------------------------
 * Window_SkillList
 *
 * The window for selecting a skill on the skill screen.
 * @class Window_SkillList
 */
declare class Window_SkillList extends Window_Selectable {
	constructor(x: number, y: number, witth: number, height: number);
	_actor: Game_Actor;
	/**
	 * Returns the Skill Type Id, which is an Int.
	 */
	_stypeId: rm.types.SkillTypeIdA;
	_data: rm.types.Skill[];
	initialize(x: number, y: number, width: number, height: number): void;
	/**
	 * Sets the current actor of the skill list window.
	 *
	 * @param {Game_Actor} actor
	 * @memberof Window_SkillList
	 */
	setActor(actor: Game_Actor): void;
	/**
	 * Sets the skill type id of the skill list window.
	 *
	 * @param {number} stypeId - Integer
	 * @memberof Window_SkillList
	 */
	setStypeId(stypeId: rm.types.SkillTypeIdA): void;
	/**
	 * Returns the current skill at the window index
	 * loaded from the databse.
	 *
	 * @returns {RPG.Skill}
	 * @memberof Window_SkillList
	 */
	item(): rm.types.Skill;
	/**
	 * Returns true if the given skill is included.
	 *
	 * @param {RPG.Skill} item
	 * @returns {boolean}
	 * @memberof Window_SkillList
	 */
	includes(item: rm.types.Skill): boolean;
	/**
	 * Returns true if the given skill is enabled.
	 *
	 * @param {RPG.Skill} item
	 * @returns {boolean}
	 * @memberof Window_SkillList
	 */
	isEnabled(item: rm.types.Skill): boolean;
	/**
	 * Creates the item list.
	 *
	 * @memberof Window_SkillList
	 */
	makeItemList(): void;
	selectLast(): void;
	costWidth(): number;
	drawSkillCost(skill: rm.types.Skill, x: number, y: number, width: number): void;
}

/**
 * -----------------------------------------------------------------------------
 * Window_BattleSkill
 *
 * The window for selecting a skill to use on the battle screen.
 * @class Window_BattleSkill
 */
declare class Window_BattleSkill extends Window_SkillList {
	constructor(x: number, y: number, width: number, height: number);
	initialize(x: number, y: number, width: number, height: number): void;
}

/**
 * -----------------------------------------------------------------------------
 * Window_ChoiceList
 *
 * The window used for the event command [Show Choices].
 * @class Window_ChoiceList
 */
declare class Window_ChoiceList extends Window_Command {
	constructor(messageWindow: Window_Message);
	initialize(messageWindow: Window_Message): void;
	start(): void;
	selectDefault(): void;
	updatePlacement(): void;
	updateBackground(): void;
	maxChoiceWidth(): number;
	textWidthEx(text: string): number;
}

/**
 * -----------------------------------------------------------------------------
 * Window_DebugEdit
 *
 * The window for displaying switches and variables on the debug screen.
 * @class Window_DebugEdit
 */
declare class Window_DebugEdit extends Window_Selectable {
	constructor(x: number, y: number, width: number);
	itemName(dataId: number): string;
	itemStatus(dataId: string): string;
	setMode(mode: string): void;
	setTopId(id: number): void;
	currentId(): number;
	updateSwitch(): void;
	updateVariable(): void;
}

/**
 * -----------------------------------------------------------------------------
 * Window_DebugRange
 *
 * The window for selecting a block of switches/variables on the debug screen.
 * @class Window_DebugRange
 */
declare class Window_DebugRange extends Window_Selectable {
	constructor(x: number, y: number);
	windowWidth(): number;
	windowHeight(): number;
	mode(): string;
	topId(): number;
	setEditWindow(editWindow: Window_DebugEdit): void;
}

declare class Window_HorzCommand extends Window_Command {
	constructor(x: number, y: number);
}

declare class Window_EquipCommand extends Window_HorzCommand {
	protected constructor();
}

/**
 * -----------------------------------------------------------------------------
 * Window_EquipItem
 *
 * The window for selecting an equipment item on the equipment screen.
 * @class Window_EquipItem
 */
declare class Window_EquipItem {
	constructor(x: number, y: number, width: number, height: number);
	setActor(actor: Game_Actor): void;
	setSlotId(slotId: number): void;
	includes(item: rm.types.EquipItem): boolean;
	isEnabled(item: rm.types.EquipItem): boolean;
	setStatusWindow(statusWindow: Window_EquipStatus): void;
}

/**
 * -----------------------------------------------------------------------------
 * Window_EquipSlot
 *
 * The window for selecting an equipment slot on the equipment screen.
 * @class Window_EquipSlot
 */
declare class Window_EquipSlot extends Window_Selectable {
	constructor(x: number, y: number, width: number, height: number);
	initialize(x: number, y: number, width: number, height: number): void;
	/**
	 * Sets the current game actor.
	 *
	 * @param {Game_Actor} actor
	 * @memberof Window_EquipSlot
	 */
	setActor(actor: Game_Actor): void;
	/**
	 * Returns the current equip item.
	 *
	 * @returns {RPG.EquipItem}
	 * @memberof Window_EquipSlot
	 */
	item(): rm.types.EquipItem;
	/**
	 * Returns the name of the slot at the specified index.
	 *
	 * @param {number} index
	 * @returns {string}
	 * @memberof Window_EquipSlot
	 */
	slotName(index: number): string;
	/**
	 * Returns true if the current slot is enabled.
	 *
	 * @param {number} index
	 * @returns {boolean}
	 * @memberof Window_EquipSlot
	 */
	isEnabled(index: number): boolean;
	/**
	 * Sets the status window within the equip slot window.
	 *
	 * @param {Window_EquipStatus} statusWindow
	 * @memberof Window_EquipSlot
	 */
	setStatusWindow(statusWindow: Window_EquipStatus): void;
	/**
	 * Sets the item window within the equip slot window.
	 *
	 * @param {Window_EquipItem} itemWindow
	 * @memberof Window_EquipSlot
	 */
	setItemWindow(itemWindow: Window_EquipItem): void;
}

declare class Window_EquipStatus extends Window_Base {
	protected constructor();
}

/**
 * -----------------------------------------------------------------------------
 * Window_EventItem
 *
 * The window used for the event command [Select Item].
 * @class Window_EventItem
 */
declare class Window_EventItem extends Window_ItemList {
	constructor(messageWindow: Window_Message);
	/**
	 * Returns the height off the window.
	 *
	 * @returns {number}
	 * @memberof Window_EventItem
	 */
	windowHeight(): number;
	/**
	 * Returns the number of visible rows.
	 *
	 * @returns {number}
	 * @memberof Window_EventItem
	 */
	numVisibleRows(): number;
	/**
	 * Starts the event item window.
	 *
	 * @memberof Window_EventItem
	 */
	start(): void;
	updatePlacement(): void;
	includes(item: rm.types.BaseItem): boolean;
	isEnabled(item: rm.types.BaseItem): boolean;
	onOk(): void;
	onCancel(): void;
}

/**
 * -----------------------------------------------------------------------------
 * Window_GameEnd
 *
 * The window for selecting "Go to Title" on the game end screen.
 * @class Window_GameEnd
 */
declare class Window_GameEnd extends Window_Base {
	constructor();
	updatePlacement(): void;
}

declare class Window_Gold extends Window_Base {
	constructor(x: number, y: number);
	/**
	 * Returns the $gameParty gold as a number.
	 *
	 * @returns {number}
	 * @memberof Window_Gold
	 */
	value(): number;
	/**
	 * Returns the RPGMakerMV database currency
	 * as a string.
	 * @returns {string}
	 * @memberof Window_Gold
	 */
	currencyUnit(): string;
}

declare class Window_Help extends Window_Base {
	/**
	 * Creates an instance of Window_Help.
	 * @param {number} numLines
	 * @memberof Window_Help
	 */
	constructor(numLines: number);
	/**
	 * Sets the _text property of the window;
	 * this text will be displayed within the window.
	 * @param {string} text
	 * @memberof Window_Help
	 */
	setText(text: string): void;
	clear(): void;
	/**
	 * Sets the current item of the help window.
	 *
	 * @param {RPG.BaseItem} item
	 * @memberof Window_Help
	 */
	setItem(item: rm.types.BaseItem): void;
}

declare class Window_ItemCategory extends Window_HorzCommand {
	protected constructor();
}

/**
 * -----------------------------------------------------------------------------
 * Window_MapName
 *
 * The window for displaying the map name on the map screen.
 * @class Window_MapName
 */
declare class Window_MapName extends Window_Base {
	constructor();
	/**
	 * Returns the window width.
	 *
	 * @returns {number}
	 * @memberof Window_MapName
	 */
	windowWidth(): number;
	/**
	 * Returns the window height.
	 *
	 * @returns {number}
	 * @memberof Window_MapName
	 */
	windowHeight(): number;
	updateFadeIn(): void;
	updateFadeOut(): void;
	/**
	 * Windows the map name window.
	 *
	 * @memberof Window_MapName
	 */
	refresh(): void;
	/**
	 * Draws the background of the map name window.
	 *
	 * @param {number} x
	 * @param {number} y
	 * @param {number} width
	 * @param {number} height
	 * @memberof Window_MapName
	 */
	drawBackground(x: number, y: number, width: number, height: number): void;
}

/**
 * -----------------------------------------------------------------------------
 * Window_MenuStatus
 *
 * The window for displaying party member status on the menu screen.
 * @class Window_MenuStatus
 * @extends {Window_Selectable}
 */
declare class Window_MenuStatus extends Window_Selectable {
	/**
	 * Creates an instance of Window_MenuStatus.
	 * @param {number} x
	 * @param {number} y
	 * @memberof Window_MenuStatus
	 */
	constructor(x: number, y: number);
	/**
	 * Window width.
	 * @return Int
	 */
	windowWidth(): number;
	/**
	 * Window height.
	 * @return Int
	 */
	windowHeight(): number;
	/**
	 * Returns the height of each item (actor status) in the main menu
	 * window.
	 * @returns {number}
	 * @memberof Window_MenuStatus
	 */
	itemHeight(): number;
	/**
	 * Returns the number of visible rows in
	 * menu status.
	 * @returns {number}
	 * @memberof Window_MenuStatus
	 */
	numVisibleRows(): number;
	/**
	 * Loads the images for the main menu status window.
	 *
	 * @memberof Window_MenuStatus
	 */
	loadImages(): void;
	/**
	 * Draws the item background at the given index.
	 *
	 * @param {number} index
	 * @memberof Window_MenuStatus
	 */
	drawItemBackground(index: number): void;
	drawItemImage(index: number): void;
	drawItemStatus(index: number): void;
	selectLast(): void;
	/**
	 * Determines if the window is in formation mode;
	 * if true, the player can select characters to swap
	 * positions with.
	 * @returns {boolean}
	 * @memberof Window_MenuStatus
	 */
	formationMode(): boolean;
	/**
	 * Sets the formation mode to true or false.
	 *
	 * @param {boolean} formationMode
	 * @memberof Window_MenuStatus
	 */
	setFormationMode(formationMode: boolean): void;
	pendingIndex(): number;
	setPendingIndex(index: number): void;
}

declare class Window_MenuActor extends Window_MenuStatus {
	constructor();
	initialize(): void;
	selectForItem(item: rm.types.BaseItem): void;
}

declare class Window_MenuCommand extends Window_Command {
	constructor(x: number, y: number);
	/**
	 * Adds the standard game commands to the
	 * RPGMakerMV main menu.
	 * @memberof Window_MenuCommand
	 */
	addMainCommands(): void;
	/**
	 * Adds the standard formation command to the
	 * RPGMakerMV main menu.
	 * @memberof Window_MenuCommand
	 */
	addFormationCommand(): void;
	/**
	 * Adds any user created commands to the
	 * RPGMakerMV main menu.
	 * @memberof Window_MenuCommand
	 */
	addOriginalCommands(): void;
	/**
	 * Adds the save command to the
	 * RPGMakerMV main menu.
	 * @memberof Window_MenuCommand
	 */
	addSaveCommand(): void;
	addGameEndCommand(): void;
	/**
	 * Checks if the standard game commands for the menu
	 * are needed based on database system options.
	 * @param {string} name
	 * @returns {boolean}
	 * @memberof Window_MenuCommand
	 */
	needsCommand(name: string): boolean;
	/**
	 * Determines if the main commands are enabled;
	 * this is based on the settings in the database.
	 * @returns {boolean}
	 * @memberof Window_MenuCommand
	 */
	areMainCommandsEnabled(): boolean;
	/**
	 * Determines if the option command is enabled;
	 * based on the setting in the database.
	 * @returns {boolean}
	 * @memberof Window_MenuCommand
	 */
	isOptionsEnabled(): boolean;
	/**
	 * Determines if the save command is enabled;
	 * based on the setting in the database.
	 * @returns {boolean}
	 * @memberof Window_MenuCommand
	 */
	isSaveEnabled(): boolean;
	/**
	 * Selects the last command in menu.
	 *
	 * @memberof Window_MenuCommand
	 */
	selectLast(): void;
	static initCommandPosition(): void;
	static _lastCommandSymbol: any;
}

declare class Window_Message extends Window_Base {
	protected constructor();
	initialize(): void;
	initMembers(): void;
	/**
	 * Processes normal characters displayed within the message window.
	 * @param textState
	 */
	processNormalCharacter(textState: string): void;
	/**
	 * Returns the sub windows attached to the message window.
	 *
	 * @returns {Array<Window_Base>}
	 * @memberof Window_Message
	 */
	subWindows(): Window_Base[];
	/**
	 * Creates the sub windows for the message window.
	 *
	 * @memberof Window_Message
	 */
	createSubWindows(): void;
	/**
	 * Returns the width of the window.
	 *
	 * @returns {number}
	 * @memberof Window_Message
	 */
	windowWidth(): number;
	/**
	 * Returns the height of the window.
	 *
	 * @returns {number}
	 * @memberof Window_Message
	 */
	windowHeight(): number;
	/**
	 * Returns the number of visible rows within the message window.
	 *
	 * @returns {number}
	 * @memberof Window_Message
	 */
	numVisibleRows(): number;
	checkToNotClose(): void;
	/**
	 * Returns true if the message window can start.
	 *
	 * @returns {boolean}
	 * @memberof Window_Message
	 */
	canStart(): boolean;
	/**
	 * Starts the displaying of the message within the message window.
	 *
	 * @memberof Window_Message
	 */
	startMessage(): void;
	/**
	 * Updates the placement of the message window.
	 *
	 * @memberof Window_Message
	 */
	updatePlacement(): void;
	/**
	 * Clears the message window flags for
	 * fast text, pause skip, and line show fast
	 */
	clearFlags(): void;
	/**
	 * Sets the background type of the window in terms
	 * of transparency.
	 * 0,
	 * 1,
	 * 2
	 */
	setBackgroundType(backgroundType: number): void;
	/**
	 * Processes the escape characters in the message window.
	 * @param code
	 * @param textState
	 */
	processEscapeCharacter(code: string, textState: string): void;
	/**
	 * Starts the wait count for the message window.
	 * @param count
	 */
	startWait(count: number): void;
	/**
	 * Starts the pause for the window.
	 * Sets the wait count to 10 and pauses
	 * the window.
	 */
	startPause(): void;
	/**
	 * Updates the background of the message window.
	 *
	 * @memberof Window_Message
	 */
	updateBackground(): void;
	/**
	 * Terminates the message and closes the gold and message window.
	 *
	 * @memberof Window_Message
	 */
	terminateMessage(): void;
	/**
	 * Updates the wait of the message window.
	 *
	 * @returns {Bool}
	 * @memberof Window_Message
	 */
	updateWait(): boolean;
	updateLoading(): boolean;
	/**
	 * Updates input when the message window is processing.
	 *
	 * @returns {Bool}
	 * @memberof Window_Message
	 */
	updateInput(): boolean;
	/**
	 * Returns true if any sub window is active.
	 *
	 * @returns {Bool}
	 * @memberof Window_Message
	 */
	isAnySubWindowActive(): boolean;
	/**
	 * Updates the message.
	 *
	 * @returns {Bool}
	 * @memberof Window_Message
	 */
	updateMessage(): boolean;
	/**
	 * Handler for when there is no text left to display within
	 * the message window.
	 * @memberof Window_Message
	 */
	onEndOfText(): void;
	startInput(): boolean;
	/**
	 * Returns true if the ok or cancel inputs have been triggered
	 * multiple times.
	 * @returns {Bool}
	 * @memberof Window_Message
	 */
	isTriggered(): boolean;
	/**
	 * Returns true if the message window still has text
	 * and settings have not changed.
	 * @returns {Bool}
	 * @memberof Window_Message
	 */
	doesContinue(): boolean;
	/**
	 * Returns true if the message window settings have been changed.
	 *
	 * @returns {Bool}
	 * @memberof Window_Message
	 */
	areSettingsChanged(): boolean;
	updateShowFast(): void;
	newPage(textState: rm.types.TextState): void;
	loadMessageFace(): void;
	drawMessageFace(): void;
	newLineX(): number;
	processNewLine(textState: rm.types.TextState): void;
	processNewPage(textState: rm.types.TextState): void;
}

declare class Window_NameBox extends Window_Base {
	constructor();
	baseTextRect(): Rectangle;
}

/**
 * -----------------------------------------------------------------------------
 * Window_NameEdit
 *
 * The window for editing an actor's name on the name input screen.
 * @class Window_NameEdit
 */
declare class Window_NameEdit {
	/**
	 * Creates an instance of Window_NameEdit.
	 * @param {Game_Actor} actor
	 * @param {number} maxLength
	 * @memberof Window_NameEdit
	 */
	constructor(actor: Game_Actor, maxLength: number);
	/**
	 * Returns the window width.
	 *
	 * @returns {number}
	 * @memberof Window_NameEdit
	 */
	windowWidth(): number;
	/**
	 * Returns the window height.
	 *
	 * @returns {number}
	 * @memberof Window_NameEdit
	 */
	windowHeight(): number;
	restoreDefault(): boolean;
	add(ch: string): boolean;
	back(): boolean;
	/**
	 * Returns the width of the character face.
	 *
	 * @returns {number}
	 * @memberof Window_NameEdit
	 */
	faceWidth(): number;
	/**
	 * Returns the width of a character.
	 *
	 * @returns {number}
	 * @memberof Window_NameEdit
	 */
	charWidth(): number;
	left(): number;
	underlineRect(index: number): Rectangle;
	/**
	 * Returns the color of the underline as a css color String.
	 *
	 * @returns {String}
	 * @memberof Window_NameEdit
	 */
	underlineColor(): string;
	/**
	 * Draws the underline at the given index of the window.
	 *
	 * @param {number} index
	 * @memberof Window_NameEdit
	 */
	drawUnderline(index: number): void;
	/**
	 * Draws a character within the window at the specified index.
	 *
	 * @param {number} index
	 * @memberof Window_NameEdit
	 */
	drawChar(index: number): void;
	/**
	 * Refreshes the window contents.
	 *
	 * @memberof Window_NameEdit
	 */
	refresh(): void;
}

/**
 * -----------------------------------------------------------------------------
 * Window_NameInput
 *
 * The window for selecting text characters on the name input screen.
 * @class Window_NameInputt
 */
declare class Window_NameInput extends Window_Selectable {
	constructor(editWindow: Window_NameEdit);
	/**
	 * Returns the window height.
	 *
	 * @returns {number}
	 * @memberof Window_NameInput
	 */
	windowHeight(): number;
	/**
	 * Returns the table of characters to input.
	 *
	 * @returns {Array<Array<String>>}
	 * @memberof Window_NameInput
	 */
	table(): string[][];
	character(): string;
	isPageChange(): boolean;
	isOk(): boolean;
	processJump(): void;
	processBack(): void;
	onNameAdd(): void;
	onNameOk(): void;
	static LATIN1: string[];
	static LATIN2: string[];
	static RUSSIA: string[];
	static JAPAN1: string[];
	static JAPAN2: string[];
	static JAPAN3: string[];
}

declare class Window_NumberInput extends Window_Selectable {
	constructor(messageWindow: Window_Message);
	start(): void;
	updatePlacement(): void;
	/**
	 * Returns the window width.
	 *
	 * @returns {number}
	 * @memberof Window_NumberInput
	 */
	windowWidth(): number;
	/**
	 * Returns the window height.
	 *
	 * @returns {number}
	 * @memberof Window_NumberInput
	 */
	windowHeight(): number;
	/**
	 * Returns the item width.
	 *
	 * @returns {number}
	 * @memberof Window_NumberInput
	 */
	itemWidth(): number;
	/**
	 * Creates the number input window buttons.
	 *
	 * @memberof Window_NumberInput
	 */
	createButtons(): void;
	/**
	 * Places the number input window buttons.
	 *
	 * @memberof Window_NumberInput
	 */
	placeButtons(): void;
	updateButtonsVisiblity(): void;
	showButtons(): void;
	hideButtons(): void;
	buttonY(): number;
	processDigitChange(): void;
	changeDigit(up: boolean): void;
	onButtonUp(): void;
	onButtonDown(): void;
	onButtonOk(): void;
}

declare class Window_Options extends Window_Command {
	constructor();
	updatePlacement(): void;
	addGeneralOptions(): void;
	addVolumeOptions(): void;
	statusWidth(): number;
	statusText(index: number): string;
	isVolumeSymbol(symbol: string): boolean;
	booleanStatusText(value: boolean): string;
	volumeStatusText(value: number): string;
	volumeOffset(): number;
	changeValue(symbol: string, value: boolean | number): void;
	getConfigValue(symbol: string): boolean;
	setConfigValue(symbol: string, volume: boolean | number): void;
}

/**
 * -----------------------------------------------------------------------------
 * Window_PartyCommand
 *
 * The window for selecting whether to fight or escape on the battle screen.
 * @class Window_PartyCommand
 */
declare class Window_PartyCommand extends Window_Command {
	constructor();
	setup(): void;
}

declare namespace rm.windows {
	export type Info = {
		key: string;
	}
}

declare class Window_SavefileList extends Window_Selectable {
	constructor(x: number, y: number, width: number, height: number);
	/**
	 * Sets the mode of the save file window.
	 *
	 * @param {string} mode
	 * @memberof Window_SavefileList
	 */
	setMode(mode: string): void;
	/**
	 * Returns the maximum number of visible items.
	 *
	 * @returns {number}
	 * @memberof Window_SavefileList
	 */
	maxVisibleItems(): number;
	itemHeight(): number;
	/**
	 * Draws the file id at the specified x and y coordinates.
	 *
	 * @param {number} id
	 * @param {number} x
	 * @param {number} y
	 * @memberof Window_SavefileList
	 */
	drawFileId(id: number, x: number, y: number): void;
	drawContents(info: rm.windows.Info, rect: Rectangle, valid: boolean): void;
	drawGameTitle(info: rm.windows.Info, x: number, y: number, width: number): void;
	drawPartyCharacters(info: rm.windows.Info, x: number, y: number): void;
	/**
	 * Draws the current playtime at the specified x and y coordinates within the given
	 * width.
	 * @param {{key: string}} info
	 * @param {number} x
	 * @param {number} y
	 * @param {number} width
	 * @memberof Window_SavefileList
	 */
	drawPlaytime(info: rm.windows.Info, x: number, y: number, width: number): void;
}

/**
 * -----------------------------------------------------------------------------
 * Window_ScrollText
 *
 * The window for displaying scrolling text. No frame is displayed, but it
 * is handled as a window for convenience.
 * @class Window_ScrollText
 */
declare class Window_ScrollText extends Window_Base {
	constructor();
	/**
	 * Starts the displaying of a message in the scroll text window.
	 *
	 * @memberof Window_ScrollText
	 */
	startMessage(): void;
	refresh(): void;
	updateMessage(): void;
	scrollSpeed(): number;
	/**
	 * Returns true if the scene is in fast forward mode.
	 *
	 * @returns {boolean}
	 * @memberof Window_ScrollText
	 */
	isFastForward(): boolean;
	/**
	 * Returns the fast forward rate of the scroll text window.
	 *
	 * @returns {number}
	 * @memberof Window_ScrollText
	 */
	fastForwardRate(): number;
	/**
	 * Terminates the message and the scroll text window is hidden.
	 *
	 * @memberof Window_ScrollText
	 */
	terminateMessage(): void;
}

/**
 * -----------------------------------------------------------------------------
 * Window_ShopBuy
 *
 * The window for selecting an item to buy on the shop screen.
 * @class Window_ShopBuy
 */
declare class Window_ShopBuy extends Window_Selectable {
	/**
	 * Creates an instance of Window_ShopBuy.
	 * @param {number} x
	 * @param {number} y
	 * @param {number} height
	 * @param {Array<Array<any>>} shopGoods
	 * @memberof Window_ShopBuy
	 */
	constructor(x: number, y: number, height: number, shopGoods: any[][]);
	/**
	 * Returns the width of the window.
	 *
	 * @returns {number}
	 * @memberof Window_ShopBuy
	 */
	windowWidth(): number;
	/**
	 * Returns the current item of the window.
	 *
	 * @returns {RPG.BaseItem}
	 * @memberof Window_ShopBuy
	 */
	item(): rm.types.BaseItem;
	setMoney(money: number): void;
	/**
	 * Returns the p rice of an item
	 * @param item
	 * @return Int
	 */
	price(item: rm.types.BaseItem): number;
	/**
	 * Checks if the current item is enabled (can be bought/sold).
	 *
	 * @param {RPG.BaseItem} item
	 * @returns {boolean}
	 * @memberof Window_ShopBuy
	 */
	isEnabled(item: rm.types.BaseItem): boolean;
	/**
	 * Creates a list of items for the shop window.
	 *
	 * @memberof Window_ShopBuy
	 */
	makeItemList(): void;
	/**
	 * Sets the status window for the shop buy window.
	 * @param statusWindow
	 */
	setStatusWindow(statusWindow: Window_ShopStatus): void;
}

/**
 * -----------------------------------------------------------------------------
 * Window_ShopCommand
 *
 * The window for selecting buy/sell on the shop screen.
 * @class Window_ShopCommand
 */
declare class Window_ShopCommand extends Window_HorzCommand {
	protected constructor();
	_purchaseOnly: boolean;
	/**
	 * Determines the width of the shop buy/sell window;
	 * also determines if the shop is purchase only.
	 * @param {number} width
	 * @param {boolean} purchaseOnly
	 * @memberof Window_ShopCommand
	 */
	initialize(width: number, purchaseOnly: boolean): void;
}

/**
 * -----------------------------------------------------------------------------
 * Window_ShopNumber
 *
 * The window for inputting quantity of items to buy or sell on the shop
 * screen.
 * @class Window_ShopNumber
 */
declare class Window_ShopNumber extends Window_Selectable {
	/**
	 * Creates an instance of Window_ShopNumber.
	 * @param {number} x
	 * @param {number} y
	 * @param {number} height
	 * @memberof Window_ShopNumber
	 */
	constructor(x: number, y: number, height: number);
	/**
	 * Returns the width of the window.
	 *
	 * @returns {number}
	 * @memberof Window_ShopNumber
	 */
	windowWidth(): number;
	number(): number;
	setup(item: rm.types.BaseItem, max: number, price: number): void;
	setCurrencyUnit(currencyUnit: string): void;
	createButtons(): void;
	placeButtons(): void;
	updateButtonsVisiblity(): void;
	/**
	 * Shows the quantity input buttons.
	 *
	 * @memberof Window_ShopNumber
	 */
	showButtons(): void;
	/**
	 * Hides the quantity input buttons.
	 *
	 * @memberof Window_ShopNumber
	 */
	hideButtons(): void;
	drawMultiplicationSign(): void;
	/**
	 * Draws the number.
	 */
	drawNumber(): void;
	/**
	 * Draws the total price of the selected
	 * quantity of item.
	 * @memberof Window_ShopNumber
	 */
	drawTotalPrice(): void;
	/**
	 * Item y position.
	 * @return Int
	 */
	itemY(): number;
	/**
	 * Y position of the price.
	 * @return Int
	 */
	priceY(): number;
	/**
	 * Y position of the button.
	 * @return Int
	 */
	buttonY(): number;
	/**
	 * Returns the width of the cursor.
	 *
	 * @returns {number}
	 * @memberof Window_ShopNumber
	 */
	cursorWidth(): number;
	/**
	 * Cursor x position.
	 * @return Int
	 */
	cursorX(): number;
	/**
	 * The max number of digits for the shop number display
	 * window.
	 */
	maxDigits(): number;
	/**
	 * Processes the change in quantity.
	 *
	 * @memberof Window_ShopNumber
	 */
	processNumberChange(): void;
	/**
	 * Changes the quantity, given a number.
	 *
	 * @param {number} amount
	 * @memberof Window_ShopNumber
	 */
	changeNumber(amount: number): void;
	/**
	 * Handle for button up event.
	 */
	onButtonUp(): void;
	/**
	 * Handler for button up event 2.
	 */
	onButtonUp2(): void;
	/**
	 * Handler for button down event.
	 */
	onButtonDown(): void;
	/**
	 * Handler for button down event.
	 */
	onButtonDown2(): void;
	/**
	 * Handler for button ok event.
	 */
	onButtonOk(): void;
}

/**
 * -----------------------------------------------------------------------------
 * Window_ShopSell
 *
 * The window for selecting an item to sell on the shop screen.
 * @class Window_ShopSell
 */
declare class Window_ShopSell extends Window_ItemList {
	constructor(x: number, y: number, width: number, height: number);
	/**
	 * Determines if the item is sellable, otherwise, greyed out.
	 *
	 * @param {RPG.BaseItem} item
	 * @returns {boolean}
	 * @memberof Window_ShopSell
	 */
	isEnabled(item: rm.types.BaseItem): boolean;
}

declare namespace rm.types {
	export const enum EquipTypeId {
		base = -1,
	}
}

/**
 * -----------------------------------------------------------------------------
 * Window_ShopStatus
 *
 * The window for displaying number of items in possession and the actor's
 * equipment on the shop screen.
 * @class Window_ShopStatus
 */
declare class Window_ShopStatus extends Window_Base {
	/**
	 * Creates an instance of Window_ShopStatus.
	 * @param {number} x
	 * @param {number} y
	 * @param {number} width
	 * @param {number} height
	 * @memberof Window_ShopStatus
	 */
	constructor(x: number, y: number, width: number, height: number);
	/**
	 * Refreshes the window contents.
	 *
	 * @memberof Window_ShopStatus
	 */
	refresh(): void;
	/**
	 * Sets the item in the window shop status for display.
	 */
	setItem(item: rm.types.BaseItem): void;
	/**
	 * Returns true if the item in the
	 * shop status window is an equippable item.
	 */
	isEquipItem(): boolean;
	drawPossession(x: number, y: number): void;
	/**
	 * Draw Equip Information.
	 */
	drawEquipInfo(x: number, y: number): void;
	statusMembers(): Game_Actor[];
	/**
	 * Returns the page size.
	 *
	 * @returns {number}
	 * @memberof Window_ShopStatus
	 */
	pageSize(): number;
	/**
	 * Returns the max number of pages.
	 *
	 * @returns {number}
	 * @memberof Window_ShopStatus
	 */
	maxPages(): number;
	drawActorEquipInfo(x: number, y: number, actor: Game_Actor): void;
	drawActorParamChange(x: number, y: number, actor: Game_Actor, item1: rm.types.EquipItem): void;
	/**
	 * Returns the parameter id.
	 *
	 * @returns {number}
	 * @memberof Window_ShopStatus
	 */
	paramId(): number;
	/**
	 * Returns the current item equiped by the given actor when
	 * the respective equipment Id is passed.
	 * @param {Game_Actor} actor
	 * @param {number} etypeId
	 * @returns {RPG.EquipItem}
	 * @memberof Window_ShopStatus
	 */
	currentEquippedItem(actor: Game_Actor, etypeId: rm.types.EquipTypeId): rm.types.EquipItem;
	/**
	 * Updates the current page.
	 *
	 * @memberof Window_ShopStatus
	 */
	updatePage(): void;
	/**
	 * Determines if page can be changed.
	 *
	 * @returns {boolean}
	 * @memberof Window_ShopStatus
	 */
	isPageChangeEnabled(): boolean;
	isPageChangeRequested(): boolean;
	/**
	 * Determines if the window is touched within it's frame.
	 *
	 * @returns {boolean}
	 * @memberof Window_ShopStatus
	 */
	isTouchedInsideFrame(): boolean;
	/**
	 * Changes the current page.
	 *
	 * @memberof Window_ShopStatus
	 */
	changePage(): void;
}

/**
 * -----------------------------------------------------------------------------
 * Window_SkillStatus
 *
 * The window for displaying the skill user's status on the skill screen.
 * @class Window_SkillStatus
 */
declare class Window_SkillStatus extends Window_Base {
	/**
	 * Creates an instance of Window_SkillStatus.
	 * @param x
	 * @param y
	 * @param width
	 * @param height
	 * @memberof Window_SkillStatus
	 */
	constructor(x: number, y: number, width: number, height: number);
	/**
	 * Sets the current actor for the window.
	 *
	 * @param {Game_Actor} actor
	 * @memberof Window_SkillStatus
	 */
	setActor(actor: Game_Actor): void;
	/**
	 * Refreshes the window contents.
	 *
	 * @memberof Window_SkillStatus
	 */
	refresh(): void;
}

/**
 * -----------------------------------------------------------------------------
 * Window_SkillType
 *
 * The window for selecting a skill type on the skill screen.
 * @class Window_SkillType
 */
declare class Window_SkillType extends Window_Command {
	/**
	 * Creates an instance of Window_SkillType.
	 * @param  x
	 * @param  y
	 * @memberof Window_SkillType
	 */
	constructor(x: number, y: number);
	/**
	 * Sets the current actor for the skill type window.
	 *
	 * @param {Game_Actor} actor
	 * @memberof Window_SkillType
	 */
	setActor(actor: Game_Actor): void;
	/**
	 * Sets the skill window for the current skill type.
	 *
	 * @param {Window_SkillList} skillWindow
	 * @memberof Window_SkillType
	 */
	setSkillWindow(skillWindow: Window_SkillList): void;
	/**
	 * Selects the last command in the window.
	 *
	 * @memberof Window_SkillType
	 */
	selectLast(): void;
}

declare class Window_Status extends Window_Selectable {
	constructor(x: number, y: number, width: number, height: number);
	initialize(x: number, y: number, width: number, height: number): void;
	/**
	 * Sets the skill type id of the skill list window.
	 *
	 * @param {number} stypeId
	 * @memberof Window_SkillList
	 */
	setStypeId(stypeId: number): void;
	/**
	 * Returns the current skill from the databse.
	 *
	 * @returns {RPG.Skill}
	 * @memberof Window_SkillList
	 */
	item(): rm.types.Skill;
	/**
	 * Returns true if the given skill is included.
	 *
	 * @param {RPG.Skill} item
	 * @returns {boolean}
	 * @memberof Window_SkillList
	 */
	includes(item: rm.types.Skill): boolean;
	/**
	 * Returns true if the given skill is enabled.
	 *
	 * @param {RPG.Skill} item
	 * @returns {boolean}
	 * @memberof Window_SkillList
	 */
	isEnabled(item: rm.types.Skill): boolean;
	/**
	 * Creates the item list.
	 *
	 * @memberof Window_SkillList
	 */
	makeItemList(): void;
	selectLast(): void;
	costWidth(): number;
	drawSkillCost(skill: rm.types.Skill, x: number, y: number, width: number): void;
	/**
	 * Sets the current actor of the skill list window.
	 *
	 * @param {Game_Actor} actor
	 * @memberof Window_SkillList
	 */
	setActor(actor: Game_Actor): void;
}

/**
 * -----------------------------------------------------------------------------
 * Window_TitleCommand
 *
 * The window for selecting New Game/Continue on the title screen.
 * @class Window_TitleCommand
 */
declare class Window_TitleCommand extends Window_Command {
	protected constructor();
	updatePlacement(): void;
	isContinueEnabled(): boolean;
	initCommandPosition(): void;
	selectLast(): void;
}


interface AttackMotion {
  /**
   * The type of the motion.
   */
  type: number;

  /**
   * The ID of the weapon image.
   */
  weaponImageId: number;
}

interface Terms {
  /**
   * The basic status. A string array with the following subscripts:
   *
   * 0: Level
   * 1: Level (short)
   * 2: HP
   * 3: HP (short)
   * 4: MP
   * 5: MP (short)
   * 6: TP
   * 7: TP (short)
   * 8: EXP
   * 9: EXP (short)
   */
  basic: Array<string>;

  /**
   * Parameters. A string array with the following subscripts:
   *
   * 0: Maximum hit points
   * 1: Maximum magic points
   * 2: Attack power
   * 3: Defense power
   * 4: Magic attack power
   * 5: Magic defense power
   * 6: Agility
   * 7: Luck
   * 8: Hit
   * 9: Evasion
   */
  params: Array<string>;

  /**
   * 0: Fight
   * 1: Escape
   * 2: Attack
   * 3: Defend
   * 4: Item
   * 5: Skill
   * 6: Equip
   * 7: Status
   * 8: Sort
   * 9: Save
   * 10: Exit Game
   * 11: Option
   * 12: Weapon
   * 13: Armor
   * 14: Key Item
   * 15: Change Equipment
   * 16: Ultimate Equipment
   * 17: Remove All
   * 18: New Game
   * 19: Continue
   * 20: (not used)
   * 21: Go to Title
   * 22: Cancel
   * 23: (not used)
   * 24: Buy
   * 25: Sell
   */
  commands: Array<string>;

  /**
   * The messages.
   */
  messages: {[key: string]: string};
}

interface TestBattler {
  /**
   * The actor ID.
   */
  actorId: number;

  /**
   * The actor's level.
   */
  level: number;

  /**
   * The actor's equipment. An array of weapon IDs or armor IDs with the following subscripts:
   *
   * 0: Weapon
   * 1: Shield
   * 2: Head
   * 3: Body
   * 4: Accessory
   */
  equips: Array<number>;
}

 type MapInfo = {
    /**
     * The map name.
     */
    name: string;
   
    /**
     * The parent map ID.
     */
     parentId: number;
   
    /**
     * The map tree display order, which is used internally.
     */
     order: number;
   }

    interface MetaData {
    /**
     * The text of the note.
     */
    note: string;

    /**
     * The Meta.
     */
    meta: {[key: string]: any};
}

/**
 * The data class for maps.
 */
 interface Map extends MetaData {
    /**
     * The map's display name.
     */
    displayName: string;

    /**
     * The map's tile set.
     */
    tilesetId: number;

    /**
     * The map's width.
     */
    width: number;

    /**
     * The map's height.
     */
    height: number;

    /**
     * The scroll type (0: No Loop, 1: Vertical Loop, 2: Horizontal Loop, 3: Both Loop).
     */
    scrollType: number;

    /**
     * The truth value indicating whether the battle background specification is enabled.
     */
    specifyBattleback: boolean;

    /**
     * The file name of the floor graphic if the battle background specification is enabled.
     */
    battleback1Name: string;

    /**
     * The file name of the wall graphic if the battle background specification is enabled.
     */
    battleback2_name: string;

    /**
     * The truth value indicating whether BGM autoswitching is enabled.
     */
    autoplayBgm: boolean;

    /**
     * The name of that BGM (RPG.AudioFile) if BGM autoswitching is enabled.
     */
    bgm: rm.types.AudioFile;

    /**
     * The truth value indicating whether BGS autoswitching is enabled.
     */
    autoplayBgs: boolean;

    /**
     * The name of that BGS (RPG.AudioFile) if BGS autoswitching is enabled.
     */
    bgs: rm.types.AudioFile;

    /**
     * The truth value of the [Disable Dashing] option.
     */
    disableDashing: boolean;

    /**
     * An encounter list. A RPG.Map.Encounter ID array.
     */
    encounterList: Array<rm.types.MapEncounter>;

    /**
     * The average number of steps between encounters.
     */
    encounterStep: number;

    /**
     * The file name of the parallax background's graphic.
     */
    parallaxName: string;

    /**
     * The truth value of the [Loop Horizontal] option for the parallax background.
     */
    parallaxLoopX: boolean;

    /**
     * The truth value of the [Loop Vertical] option for the parallax background.
     */
    parallaxLoopY: boolean;

    /**
     * The automatic x-axis scrolling speed for the parallax background.
     */
    parallaxSx: number;

    /**
     * The automatic y-axis scrolling speed for the parallax background.
     */
    parallaxSy: number;

    /**
     * The truth value of the [Show in the Editor] option for the parallax background.
     */
    parallaxShow: boolean;

    /**
     * The map data. A 3-dimensional tile ID array (Table).
     */
    data: Array<number>;

    /**
     * The array of RPG.Event data.
     */
    events: Array<Event>;
}

interface System {
  /**
   * The game title.
   */
  gameTitle: string;

  /**
   * A random number used for update checks. The number changes every time data is saved in RPG Maker.
   */
  versionId: number;

  /**
   * The locale string such as "ja_JP" and "en_US".
   */
  locale: string;

  /**
   * The initial party. An array of actor IDs.
   */
  partyMembers: Array<number>;

  /**
   * The unit of currency.
   */
  currencyUnit: string;

  /**
   * The window color.
   */
  windowTone: Array<number>;

  /**
   * The array of System.AttackMotion data.
   */
  attackMotions: Array<rm.types.Motion>;

  /**
   * A list of elements. A string array using element IDs as subscripts, with the element in the 0 position being nil.
   */
  elements: Array<string>;

  /**
   * he equipment type. A string array with the following subscripts:
   * 1: Weapon
   * 2: Shield
   * 3: Head
   * 4: Body
   * 5: Accessory
   */
  equipTypes: Array<string>;

  /**
   * A list of skill types. A string array using skill type IDs as subscripts, with the element in the 0 position being nil.
   */
  skillTypes: Array<string>;

  /**
   * A list of weapon types. A string array using weapon type IDs as subscripts, with the element in the 0 position being nil.
   */
  weaponTypes: Array<string>;

  /**
   * A list of armor types. A string array using armor type IDs as subscripts, with the element in the 0 position being nil.
   */
  armorTypes: Array<string>;

  /**
   * A switch name list. A string array using switch IDs as subscripts, with the element in the 0 position being nil.
   */
  switches: Array<string>;

  /**
   * A variable name list. A string array using variable IDs as subscripts, with the element in the 0 position being nil.
   */
  variables: Array<string>;

  /**
   * Boat settings (RPG.System.Vehicle).
   */
  boat: rm.types.SystemVehicle;

  /**
   * Ship settings (RPG.System.Vehicle).
   */
  ship: rm.types.SystemVehicle;

  /**
   * Airship settings (RPG.System.Vehicle).
   */
  airship: rm.types.SystemVehicle;

  /**
   * The file name of the title (background) graphic.
   */
  title1Name: string;

  /**
   * The file name of the title (frame) graphic.
   */
  title2Name: string;

  /**
   * The truth value of the [Draw Game Title] option.
   */
  optDrawTitle: boolean;

  /**
   * The truth value of the [Start Transparent] option.
   */
  optTransparent: boolean;

  /**
   * The truth value of the [Show Player Followers] option.
   */
  optFollowers: boolean;

  /**
   * The truth value of the [K.O. by Slip Damage] option.
   */
  optSlipDeath: boolean;

  /**
   * The truth value of the [K.O. by Floor Damage] option.
   */
  optFloorDeath: boolean;

  /**
   * The truth value of the [Display TP in Battle] option.
   */
  optDisplayTp: boolean;

  /**
   * The truth value of the [Reserve Members' EXP] option.
   */
  optExtraExp: boolean;

  /**
   * The truth value of the [use side-view battle] option.
   */
  optSideView: boolean;

  /**
   * The title BGM (RPG.AudioFile).
   */
  titleBgm: rm.types.AudioFile;

  /**
   * The battle BGM (RPG.AudioFile).
   */
  battleBgm: rm.types.AudioFile;

  /**
   * The battle end ME (RPG.AudioFile).
   */
  battleEndMe: rm.types.AudioFile;

  /**
   * The gameover ME (RPG.AudioFile).
   */
  gameoverMe: rm.types.AudioFile;

  /**
   * Sound effects. An RPG.SE array.
   */
  sounds: Array<rm.types.AudioFile>;

  /**
   * The map ID of the player's initial position.
   */
  startMapId: number;

  /**
   * The map's x-coordinate of the player's initial position.
   */
  startX: number;

  /**
   * The map's y-coordinate of the player's initial position.
   */
  startY: number;

  /**
   * Terms (RPG.System.Terms).
   */
  terms: Terms;

  /**
   * Party settings for battle tests. An RPG.System.TestBattler array.
   */
  testBattlers: Array<TestBattler>;

  /**
   * The enemy troop ID for battle tests.
   */
  testTroopId: number;

  /**
   * The file name of the battle background (floor) graphic for use in editing enemy troops and battle tests.
   */
  battleback1Name: string;

  /**
   * The file name of the battle background (wall) graphic for use in editing enemy troops and battle tests.
   */
  battleback2Name: string;

  /**
   * The battler graphic file name for use in editing animations.
   */
  battlerName: string;

  /**
   * The adjustment value for the battler graphic's hue (0..360) for use in editing animations.
   */
  battlerHue: number;

  /**
   * The ID of the map currently being edited. For internal use.
   */
  editMapId: number;
}

   

/** @global RPGMaker Plugin's Object */
declare var $plugins: Array<rm.types.PluginSettings>;
/** @global RPGMakerMV Actor data. */
declare var $dataActors: Array<rm.types.Actor>;
/** @global RPGMakerMV Class data. */
declare var $dataClasses: Array<rm.types.RPGClass>;
/** @global RPGMakerMV Skill data. */
declare var $dataSkills: Array<rm.types.Skill>;
/** @global RPGMakerMV Item data. */
declare var $dataItems: Array<rm.types.Item>;
/** @global RPGMakerMV Weapon data. */
declare var $dataWeapons: Array<rm.types.Weapon>;
/** @global RPGMakerMV Armor data. */
declare var $dataArmors: Array<rm.types.Armor>;
/** @global RPGMakerMV Enemy data. */
declare var $dataEnemies: Array<rm.types.Enemy>;
/** @global RPGMakerMV Troop data. */
declare var $dataTroops: Array<rm.types.Troop>;
/** @global RPGMakerMV State data. */
declare var $dataStates: Array<rm.types.State>;
/** @global RPGMakerMV Animation data. */
declare var $dataAnimations: Array<rm.types.Animation>;
/** @global RPGMakerMV Tileset data. */
declare var $dataTilesets: Array<rm.types.Tileset>;
/** @global RPGMakerMV CommonEvent data. */
declare var $dataCommonEvents: Array<rm.types.CommonEvent>;
/** @global RPGMakerMV System data. */
declare var $dataSystem: System;
/** @global RPGMakerMV MapInfo data. */
declare var $dataMapInfos: Array<MapInfo>;
/** @global RPGMakerMV Map data for the current map. */
declare var $dataMap: Map;
/** @global RPGMakerMV Temporary game data; not saved with the game. */
declare var $gameTemp: Game_Temp;
/** @global RPGMakerMV Game System data; saved with the game.
 * @type {Game_Temp}
*/
declare var $gameSystem: Game_System;
/** @global RPGMakerMV Game Screen; contains properties and methods
 * for adjusting the game screen.
 * @type {Game_Screen}
 */
declare var $gameScreen: Game_Screen;
declare var $gameTimer: Game_Timer;
/** @global RPGMakerMV Game Message; contains properties and methods
 * for displaying messages in the game message window. 
 * @type {Game_Message}
*/
declare var $gameMessage: Game_Message;
/** @global RPGMakerMV Game Switches; contains properties and methods
 * for modifying in game switches while the game is running.
 * These are boolean values: true or false.
 * @type {Game_Switches}
 */
declare var $gameSwitches: Game_Switches;
/** @global RPGMakerMV Game Variables; contains properties and methods
 * for modifying the values of game variables.
 * The variables can contain anything.
 * @type {Game_Variables}
 */
declare var $gameVariables: Game_Variables;
declare var $gameSelfSwitches: Game_SelfSwitches;
declare var $gameActors: Game_Actors;
/** @global RPGmakerMV Game Party; contains properties and methods
 * for interacting with the game party. Some of the methods include
 * number of party members, etc.
 * @type {Game_Party}
 */
declare var $gameParty: Game_Party;
/** @global RPGMakerMV Game Troop; contains properties and methods
 * for interacting with the game troops. Some of the methods include
 * enemy data, enemy names, etc.
 * @type {Game_Troop}
 */
declare var $gameTroop: Game_Troop;
/** @global RPGMakerMV Game Map; contains properties and methods
 * for interacting with the game map. Some of these methods include
 * interacting with the map's game_interpreter, and event information.
 * @type {Game_Map}
 */
declare var $gameMap: Game_Map;
/** @global RPGMakerMV Game Player; contains properties and methods
 * for interacting with the game player. Some of these methods
 * include interacting with the player's position and move route.
 * @type {Game_Player}
 */
declare var $gamePlayer: Game_Player;
declare var $testEvent: Array<rm.types.EventCommand>;