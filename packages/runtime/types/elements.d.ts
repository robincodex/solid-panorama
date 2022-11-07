import { ParentComponent, VoidComponent } from 'solid-js';

declare global {
    const Panel: ParentComponent<PanelAttributes<Panel>>;
    const Label: VoidComponent<LabelAttributes>;
    const Image: ParentComponent<ImageAttributes>;

    const DOTAAbilityImage: ParentComponent<DOTAAbilityImageAttributes>;
    const DOTAItemImage: ParentComponent<DOTAItemImageAttributes>;
    const DOTAHeroImage: ParentComponent<DOTAHeroImageAttributes>;
    const DOTACountryFlagImage: ParentComponent<DOTACountryFlagImageAttributes>;
    const DOTALeagueImage: ParentComponent<DOTALeagueImageAttributes>;
    const EconItemImage: ParentComponent<EconItemImageAttributes>;

    const AnimatedImageStrip: ParentComponent<AnimatedImageStripAttributes>;
    const DOTAEmoticon: ParentComponent<DOTAEmoticonAttributes>;

    const Movie: ParentComponent<MovieAttributes>;
    const DOTAHeroMovie: ParentComponent<DOTAHeroMovieAttributes>;

    const DOTAScenePanel: ParentComponent<DOTAScenePanelAttributes>;
    const DOTAEconItem: ParentComponent<DOTAEconItemAttributes>;

    const ProgressBar: ParentComponent<ProgressBarAttributes>;
    const CircularProgressBar: ParentComponent<CircularProgressBarAttributes>;
    const ProgressBarWithMiddle: ParentComponent<ProgressBarWithMiddleAttributes>;

    const DOTAUserName: ParentComponent<DOTAUserNameAttributes>;
    const DOTAUserRichPresence: ParentComponent<DOTAUserRichPresenceAttributes>;
    const DOTAAvatarImage: ParentComponent<DOTAAvatarImageAttributes>;

    const Countdown: ParentComponent<CountdownAttributes>;

    const Button: ParentComponent<PanelAttributes<Button>>;
    const TextButton: ParentComponent<TextButtonAttributes>;
    const ToggleButton: ParentComponent<ToggleButtonAttributes>;
    const RadioButton: ParentComponent<RadioButtonAttributes>;

    const TextEntry: ParentComponent<TextEntryAttributes>;
    const NumberEntry: ParentComponent<NumberEntryAttributes>;
    const Slider: ParentComponent<SliderAttributes>;
    const SlottedSlider: ParentComponent<SlottedSliderAttributes>;

    const DropDown: ParentComponent<DropDownAttributes>;
    const ContextMenuScript: ParentComponent<PanelAttributes>;

    const Carousel: ParentComponent<CarouselAttributes>;
    const CarouselNav: ParentComponent<CarouselNavAttributes>;

    const DOTAHUDOverlayMap: ParentComponent<DOTAHUDOverlayMapAttributes>;
    const DOTAMinimap: ParentComponent<PanelAttributes>;

    const HTML: ParentComponent<HTMLAttributes>;

    const CustomLayoutPanel: ParentComponent<CustomLayoutPanelAttributes>;

    // Special elements for babel-plugin-panorama-all-in-jsx
    const root: ParentComponent<{}>;
    const styles: ParentComponent<{}>;
    const scripts: ParentComponent<{}>;
    const include: ParentComponent<{ src: string }>;
    const snippets: ParentComponent<{}>;
    const snippet: ParentComponent<{ name: string }>;
}
