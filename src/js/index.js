import videojs from 'video.js';
import VideoTrackMenuToggle from './videotrack-menu-toggle';

const Plugin = videojs.getPlugin('plugin');

videojs.registerComponent('VideoTrackMenuToggle', VideoTrackMenuToggle);

// Default options for the plugin.
const defaults = {};

/**
 * A plugin class.
 */
class VideotrackSwitcher extends Plugin {

  /**
   * Create an instance of the VideotrackSwitcher plugin class.
   *
   * @param  {Player} player
   *         An instance of a Video.js player.
   *
   * @param  {Object} options
   *         An object of options for the plugin author to define, if desired.
   */
  constructor(player, options) {
    super(player, options);
    this.options = videojs.mergeOptions(defaults, options);

    // If tracksList is not provided the VideoTracksList
    // try to generate from current sources:
    const sources = this.options.sourceTracks = player.currentSources();

    if (!(typeof sources !== 'undefined' && sources.length && sources.length > 1)) {
      // Disable plugin control if no valid source was found:
      return;
    }

    player.one('loadstart', this.handleInitialize.bind(this));

    player.on('loadstart', this.handleSourceChange.bind(this));

    player.ready(() => {
      this.player.addClass('vjs-videotrack-switcher');
    });
  }

  /**
   * Handles "statechanged" events on the plugin.
   *
   * @param    {Event} e
   *           An event object provided by a "statechanged" event.
   *
   * @param    {Object} e.changes
   *           An object describing changes that occurred with the "statechanged"
   *           event.
   */
  handleStateChanged(e) {}

  /**
   * Handles once on "loadstart" player event to setup the initialization
   * and generation of the videoTracks detected.
   *
   * @param    {Event} e
   *           An event object provided by a "loadstart" event.
   */
  handleInitialize(e) {
    const sources = this.options.sourceTracks;
    const currentVideoTracks = this.generateVideoTracks(sources);
    const currentOptions = this.options;

    if (currentVideoTracks.length > 1) {

      currentVideoTracks.map(videoTrack => {
        this.player.videoTracks().addTrack(videoTrack);
      });

      this.player.videoTracks().addEventListener('change', () => {
        // Save current time to continue on alternative track if continue is true:
        currentOptions.bookmarkTime = this.player.currentTime();
        const thisTrackList = this.player.videoTracks();

        if (thisTrackList.selectedIndex === -1) {
          return;
        }

        const trackID = thisTrackList[thisTrackList.selectedIndex].id;
        const source = currentOptions.sourceTracks.find(item => {
          return item.id === trackID;
        });

        this.player.src(source);
      });

      currentOptions.videoTracksList = this.player.videoTracks();
      const toggle = this.player.controlBar
        .addChild('VideoTrackMenuToggle', currentOptions);

      this.player.controlBar.el()
      .insertBefore(toggle.el(), this.player.controlBar.fullscreenToggle.el());
    }
  }

/**
   * Handles on "loadstart" player event to setup the track playback.
   *
   * @param    {Event} e
   *           An event object provided by a "loadstart" event.
   */
  handleSourceChange(e) {
    if (this.options.continued && this.options.bookmarkTime) {
      this.player.currentTime(this.options.bookmarkTime);
    }
  }

  /**
   * Generates a list of valid videoTracks from an array of sources.
   *
   * @param   {Array} currentSources
   *           Array with sources provided by videojs initialization.
   * @return  {Array}
   *            VideoTrackList Array with valid videoTracks detected.
   */
  generateVideoTracks(currentSources) {
    const pluginOpts = this.options;
    const playableSource = this.player.currentSource();
    const currentTech = videojs.getTech(this.player.techName_);
    const tracksDetected = [];

    if (!(currentSources && playableSource && currentTech)) {
      return tracksDetected;
    }

    // Gets alternative source videos that are playable on the current browser instance.
    currentSources.filter((item, index, self) => {
      const canTechPlay = currentTech.canPlaySource(item);
      const playable = (canTechPlay === '' || canTechPlay === false) ? false : true;
      const hasLanguage = item.language && item.language !== '';

      // Returns only playable with valid language property
      // (filters duplicate language)
      if (playable && !hasLanguage) {
        console.warn('[videotrack-switcher-plugin] Playable item filtered. Missing required videoTrack property "language"');
        return false;
      }

      return playable && hasLanguage &&
        self.findIndex(t => t.language === item.language) === index;
    })
    .forEach((item, index) => {
       // If label is not provided set the language as label.
      const track = new videojs.VideoTrack({
        id: item.id,
        kind: item.kind,
        label: item.label || item.language,
        language: item.language
      });

      // Set to source the generated GUID if id not exists:
      if (!item.id) {
        item.id = track.id;
      }

      // Using default settings:
      if (typeof pluginOpts.defaultSelected !== 'undefined') {

        if (pluginOpts.defaultSelected === index) {
          track.selected = true;
        }
      } else if (index === 0) {
        // First track is selected:
        track.selected = true;
      }

      tracksDetected.push(track);
    });

    return tracksDetected;
  }

}

// Define default values for the plugin's `state`.
VideotrackSwitcher.defaultState = {};

// Register the plugin with video.js.
videojs.registerPlugin('videotrackSwitcher', VideotrackSwitcher);

// Include the version number.
VideotrackSwitcher.VERSION = '__VERSION__';

export default VideotrackSwitcher;
