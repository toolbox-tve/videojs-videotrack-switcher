/**
 * @file videotrack-menu-toggle.js
 */
import videojs from 'video.js';
import VideoTrackMenuItem from './videotrack-menu-item';

const MenuButton = videojs.getComponent('MenuButton');

/**
 * Menu toggle button for videoTracks
 *
 * @extends MenuButton
 */
class VideoTrackMenuToggle extends MenuButton {

  /**
   * Switcher button toggle constructor
   *
   *  @param {Object} player
   *  Current videojs player instance.
   *  @param {Object} options
   *  Plugin options.
   */
  constructor(player, options) {
    super(player, options);

    this.tracks = options.videoTracksList;
  }

  /**
   * Generates button css class
   *
   * @return {string} CSS class
   */
  buildCSSClass() {
    return `vjs-videotrack-switcher vjs-icon-audio ${super.buildCSSClass()}`;
  }

  /**
   * Create a track menu item
   *
   * @param {Array} items
   *  Array of items
   * @param {Object} MenuItem
   *  VideoTrackMenuItem instance
   * @return {Array}
   *  items
   */
  createItems(items = [], MenuItem = VideoTrackMenuItem) {
    const tracks = this.options_.videoTracksList;

    for (let i = 0; i < tracks.length; i += 1) {
      const track = tracks[i];
      const item = new MenuItem(this.player_, {
        selectable: true,
        track
      });

      item.addClass(`vjs-${track.kind}-menu-item`);
      items.push(item);
    }

    return items;
  }

}

VideoTrackMenuToggle.prototype.controlText_ = 'Video Switcher';

export default VideoTrackMenuToggle;
