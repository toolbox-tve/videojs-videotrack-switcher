import videojs from 'video.js';
import {version as VERSION} from '../package.json';
import VideoTrackMenuItem from './videoTrackMenuItem/videoTrackMenuItem';

const Plugin = videojs.getPlugin('plugin');

// Default options for the plugin.
const defaults = {
  track: {
    id: '1',
    kind: 'alternative'
  }
};

/**
 * An advanced Video.js plugin. For more information on the API
 *
 * See: https://blog.videojs.com/feature-spotlight-advanced-plugins/
 */
class VideotrackSwitcher extends Plugin {

  /**
   * Create a VideotrackSwitcher plugin instance.
   *
   * @param  {Player} player
   *         A Video.js Player instance.
   *
   * @param  {Object} [options]
   *         An optional options object.
   *
   *         While not a core part of the Video.js plugin architecture, a
   *         second argument of options is a convenient way to accept inputs
   *         from your plugin's caller.
   */
  constructor(player, options) {
    // the parent class will add player under this.player
    super(player);

    this.options = videojs.mergeOptions(defaults, options);

    window.VideoTrackMenuItem = VideoTrackMenuItem;

    this.player.on('loadedmetadata',() => {
      this.player.addClass('vjs-videotrack-switcher');
      this.player.controlBar.audioTrackButton.show();
      this.player.controlBar.audioTrackButton.menu.addItem(new VideoTrackMenuItem(this.player, this.options));
    });
  }
}

// Define default values for the plugin's `state` object here.
VideotrackSwitcher.defaultState = {};

// Include the version number.
VideotrackSwitcher.VERSION = VERSION;

// Register the plugin with video.js.
videojs.registerPlugin('videotrackSwitcher', VideotrackSwitcher);

export default VideotrackSwitcher;
