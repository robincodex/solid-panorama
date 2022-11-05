declare interface PanelAttributes<T extends PanelBase = Panel> {
    /**
     * Auto call SetDialogVariable on string,
     * SetDialogVariableInt on number,
     * SetDialogVariableTime on Date,
     * SetDialogVariableLocString on string start with `#`
     */
    vars?: Record<string, string | number | Date>;
    /**
     * Auto call SetDialogVariable on string,
     * SetDialogVariableInt on number,
     * SetDialogVariableTime on Date,
     * SetDialogVariableLocString on string start with `#`
     */
    dialogVariables?: Record<string, string | number | Date>;

    id?: string;
    class?: string;
    className?: string;
    classList?: Record<string, boolean>;
    style?: PanelStyle;
    hittest?: boolean;
    hittestchildren?: boolean;
    acceptsfocus?: boolean;
    tabindex?: number | 'auto';
    inputnamespace?: string;
    draggable?: boolean;
    enabled?: boolean;
    visible?: boolean;

    ref?: T | ((element: T) => void);

    onload?: EventHandler<T>;
    onfocus?: EventHandler<T>;
    onactivate?: EventHandler<T>;
    onmouseactivate?: EventHandler<T>;
    ondblclick?: EventHandler<T>;
    oncontextmenu?: EventHandler<T>;
    onmouseover?: EventHandler<T>;
    onmouseout?: EventHandler<T>;
    onmovedown?: EventHandler<T>;
    onmoveleft?: EventHandler<T>;
    onmoveright?: EventHandler<T>;
    onmoveup?: EventHandler<T>;
    oncancel?: EventHandler<T>;
    ontabforward?: EventHandler<T>;
}

declare interface LabelLikeAttributes<T extends Panel>
    extends PanelAttributes<T> {
    text?: string | number;
    html?: boolean;
}

declare interface LabelAttributes extends LabelLikeAttributes<LabelPanel> {
    allowtextselection?: boolean;
}

declare interface ImageAttributes<T extends ImagePanel = ImagePanel>
    extends PanelAttributes<T> {
    src?: string;
    scaling?: ScalingFunction;
}

declare interface DOTAAbilityImageAttributes
    extends ImageAttributes<AbilityImage> {
    abilityname?: string;
    abilityid?: number;
    contextEntityIndex?: AbilityEntityIndex;
    /** @default false */
    showtooltip?: boolean;
}

declare interface DOTAItemImageAttributes extends ImageAttributes<ItemImage> {
    itemname?: string;
    contextEntityIndex?: ItemEntityIndex;
    /** @default true */
    showtooltip?: boolean;
}

declare interface DOTAHeroImageAttributes extends ImageAttributes<HeroImage> {
    heroname?: string;
    heroid?: HeroID;
    heroimagestyle?: 'icon' | 'portrait' | 'landscape';
    usedefaultimage?: boolean;
}

declare interface DOTACountryFlagImageAttributes extends ImageAttributes {
    country_code?: string;
}

declare interface DOTALeagueImageAttributes
    extends ImageAttributes<LeagueImage> {
    leagueid?: number;
    /** @default 'Banner' */
    leagueimagestyle?: 'Banner' | 'Square' | 'LargeIcon';
}

declare interface EconItemImageAttributes extends ImageAttributes {
    itemdef: number;
}

declare interface AnimatedImageStripAttributes extends ImageAttributes {
    frametime?: string;
    defaultframe?: number;
    animating?: boolean;
}

declare interface DOTAEmoticonAttributes extends AnimatedImageStripAttributes {
    emoticonid?: number;
    alias?: string;
}

declare type MovieAutoPlay = 'off' | 'onload' | 'onfocus';

declare interface MovieAttributes extends PanelAttributes<MoviePanel> {
    src?: string;
    repeat?: boolean;
    controls?: Parameters<MoviePanel['SetControls']>[0];
    title?: string;
    /** @default 'onload' */
    autoplay?: MovieAutoPlay;
}

declare interface DOTAHeroMovieAttributes extends PanelAttributes<HeroMovie> {
    heroid?: HeroID;
    heroname?: string;
    persona?: any;
    /** @default 'off' */
    autoplay?: MovieAutoPlay;
}

declare interface DOTAScenePanelAttributes extends PanelAttributes<ScenePanel> {
    unit?: string;
    'activity-modifier'?: string;

    map?: string;
    camera?: string;
    light?: string;

    pitchmin?: number;
    pitchmax?: number;
    yawmin?: number;
    yawmax?: number;
    allowrotation?: boolean;
    rotateonhover?: boolean;
    rotateonmousemove?: boolean;

    // acceleration?: number;
    antialias?: boolean;
    // deferredalpha?: any;
    // drawbackground?: boolean;
    // environment?: any;
    // 'live-mode'?: any;
    panoramasurfaceheight?: number;
    panoramasurfacewidth?: number;
    panoramasurfacexml?: string;
    particleonly?: boolean;
    // 'pin-fov'?: any;
    renderdeferred?: boolean;
    rendershadows?: boolean;
    // renderwaterreflections?: boolean;
}

declare interface DOTAEconItemAttributes
    extends PanelAttributes<EconItemPanel> {
    itemdef: number;
    itemstyle?: number;
}

declare interface ProgressBarAttributes extends PanelAttributes<ProgressBar> {
    value?: number;
    min?: number;
    max?: number;
}

declare interface CircularProgressBarAttributes
    extends PanelAttributes<CircularProgressBar> {
    value?: number;
    min?: number;
    max?: number;
}

declare interface ProgressBarWithMiddleAttributes
    extends PanelAttributes<ProgressBarWithMiddle> {
    lowervalue?: number;
    uppervalue?: number;
    min?: number;
    max?: number;
}

declare interface DOTAUserNameAttributes extends PanelAttributes<UserName> {
    steamid?: string | 'local';
}

declare interface DOTAUserRichPresenceAttributes
    extends PanelAttributes<UserRichPresence> {
    steamid?: string | 'local';
}

declare interface DOTAAvatarImageAttributes
    extends PanelAttributes<AvatarImage> {
    steamid?: string | 'local';
    nocompendiumborder?: boolean;
    lazy?: boolean;
}

declare interface CountdownAttributes extends PanelAttributes<CountdownPanel> {
    startTime?: number;
    endTime: number;
    /** @default 1 */
    updateInterval?: number;
    /** @default 'countdown_time' */
    timeDialogVariable?: string;
}

declare interface TextButtonAttributes
    extends LabelLikeAttributes<TextButton> {}

declare interface ToggleButtonAttributes
    extends LabelLikeAttributes<ToggleButton> {
    selected?: boolean; // checked?
    onselect?: EventHandler<RadioButton>;
    ondeselect?: EventHandler<RadioButton>;
}

declare interface RadioButtonAttributes extends PanelAttributes<RadioButton> {
    group?: string;
    text?: string;
    html?: boolean;

    selected?: boolean;
    onselect?: EventHandler<RadioButton>;
    ondeselect?: EventHandler<RadioButton>;
}

declare interface TextEntryAttributes extends PanelAttributes<TextEntry> {
    multiline?: boolean;
    placeholder?: string;
    maxchars?: number;
    textmode?: 'normal' | 'password' | 'numeric' | 'numericpassword';

    text?: string;
    ontextentrychange?: EventHandler<TextEntry>;
    oninputsubmit?: EventHandler<TextEntry>;
    // ontextentrysubmit doesn't seem to be ever triggered
}

declare interface NumberEntryAttributes extends PanelAttributes<NumberEntry> {
    value?: number;
    onvaluechanged?: EventHandler<NumberEntry>;
    /** @default 0 */
    min?: number;
    /** @default 1000000 */
    max?: number;
    /** @default 1 */
    increment?: number;
}

declare interface SliderAttributes<T extends SliderPanel = SliderPanel>
    extends PanelAttributes<T> {
    style?: never;

    value?: number;
    onvaluechanged?: EventHandler<T>;

    /** @default 0 */
    min?: number;

    /** @default 1 */
    max?: number;

    /**
     * Note: to make slider horizontal it also should have a `HorizontalSlider` class.
     *
     * @default 'vertical'
     */
    direction?: 'vertical' | 'horizontal';
}

declare interface SlottedSliderAttributes<
    T extends SlottedSlider = SlottedSlider
> extends SliderAttributes<T> {
    notches?: number;
}

declare interface DropDownAttributes extends PanelAttributes<DropDown> {
    selected?: string;
    oninputsubmit?: EventHandler<DropDown>;
}

// Untested
declare interface CarouselAttributes extends PanelAttributes<CarouselPanel> {
    focus?: 'center' | 'edge';
    'focus-offset'?: string;
    wrap?: boolean;
    selectionposboundary?: string;
    'panels-visible'?: number;
    clipaftertransform?: boolean;
    AllowOversized?: any;
    'autoscroll-delay'?: string;
    'x-offset'?: string;
}

declare interface CarouselNavAttributes extends PanelAttributes {
    carouselid?: string;
}

declare interface DOTAHUDOverlayMapAttributes
    extends PanelAttributes<HUDOverlayMap> {
    maptexture?: string;
    /** @default 4 */
    mapscale?: number;
    /** @default true */
    mapscroll?: boolean;
    /** @default false */
    fixedoffsetenabled?: boolean;
    fixedOffset?: { x: number; y: number };
    fixedBackgroundTexturePosition?: { size: number; x: number; y: number };
}

declare interface HTMLAttributes extends PanelAttributes<HTML> {
    url?: string;
    // SetIgnoreCursor doesn't seem to do anything
}

declare interface CustomLayoutPanelAttributes extends PanelAttributes {
    layout: string;
}
