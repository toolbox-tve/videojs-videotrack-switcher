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
    let sources = this.options.sourceTracks = player.currentSources();

    if (!(typeof(sources) !== 'undefined' && sources.length && sources.length > 1)) {
      // Disable plugin control if no valid source was found:
      return;
    }

    player.one('loadstart', () => {
      let currentVideoTracks = this.generateVideoTracks(sources); 
      let currentOptions = this.options;

      if (currentVideoTracks.length > 1) {
        
        currentVideoTracks.map(videoTrack => {
          this.player.videoTracks().addTrack(videoTrack);
        });

         this.player.videoTracks().addEventListener('change', (e) => {
          const thisTrackList = this.player.videoTracks();

          if (thisTrackList.selectedIndex === -1) {
            return;
          }

          let trackID = thisTrackList[thisTrackList.selectedIndex].id;
          let source = currentOptions.sourceTracks.find(item => {
            return item.id === trackID;
          });

          //this.player.setStartTime(this.player.currentTime()); // Setea el tiempo en el source actual para mantenerlo en el siguiente
          this.player.src(source);
        });
        
        currentOptions.videoTracksList = player.videoTracks();
        let toggle = this.player.controlBar.addChild('VideoTrackMenuToggle', currentOptions);

        this.player.controlBar.el()
        .insertBefore(toggle.el(), this.player.controlBar.fullscreenToggle.el());
      }

    });


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
   * Generates a list of valid videoTracks from an array of sources.
   */
  generateVideoTracks(currentSources) {
    const pluginOpts = this.options;
    const playableSource = this.player.currentSource();
    const currentTech = videojs.getTech(this.player.techName_);
    let tracksDetected = [];

    if (!(currentSources && playableSource && currentTech)) {
      return tracksDetected;
    }

    // Gets alternative source videos that are playable on the current browser instance.
    currentSources.filter((item, index, self) => {
        let canTechPlay = currentTech.canPlaySource(item);
        let playable = (canTechPlay === '' || canTechPlay === false) ? false : true;
        let hasLanguage = item.language && item.language !== '';

        // Returns only playable with valid language property (filter duplicate language)        
        if (playable && !hasLanguage) {
          console.warn('[videotrack-switcher-plugin] Playable item filtered. Missing required videoTrack property "language"');
          return false;
        }

        return playable && hasLanguage &&
          self.findIndex(t => t.language === item.language) === index;
      })
      .forEach((item, index) => {
          let track = new videojs.VideoTrack({
            id: item.id,
            kind: item.kind,
            label: item.label || item.language, //If label is not provided set the language as label.
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
          } else {
            // First track is selected:
            if (index === 0) {
              track.selected = true;
            }
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
