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

  constructor(player, options) {
    super(player, options);

    this.tracks = options.videoTracksList;
  }

  buildCSSClass() {
    return `vjs-icon-audio ${super.buildCSSClass()}`;
  }

  /**
   * Create a videotrack menu item
   */
  createItems(items = [], MenuItem = VideoTrackMenuItem) {
    const tracks = this.options_.videoTracksList;

    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i];
      const item = new MenuItem(this.player_, {
        track,
        selectable: true
      });

      item.addClass(`vjs-${track.kind}-menu-item`);
      items.push(item);
    }

    return items;
  }

}

VideoTrackMenuToggle.prototype.controlText_ = 'Video Switcher';

export default VideoTrackMenuToggle;
