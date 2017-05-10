/**
 * @file videotrack-menu-item.js
 */
import videojs from 'video.js';
import * as Fn from './utils/fn';

const MenuItem = videojs.getComponent('MenuItem');

/**
 * The specific menu item type for selecting a video within a video track kind
 *
 * @extends MenuItem
 */
class VideoTrackMenuItem extends MenuItem {

  /**
   * Creates an instance of this class.
   *
   * @param {Player} player
   *        The `Player` that this class should be attached to.
   *
   * @param {Object} [options]
   *        The key/value store of player options.
   */
  constructor(player, options) {
    const {track} = options;
    const tracks = player.videoTracks();

    // Modify options for parent MenuItem class's init.
    options.label = track.label || track.language || 'Unknown';
    options.selected = track.selected;

    super(player, options);

    this.track = track;
    const changeHandler = Fn.bind(this, this.handleTracksChange);

    tracks.addEventListener('change', changeHandler);
    this.on('dispose', () => {
      tracks.removeEventListener('change', changeHandler);
    });

  }

  /**
   * Click track item in list handler
   *
   *  @param {Event} e
   *    click event object
   */
  handleClick(e) {
    const tracks = this.player_.videoTracks();

    super.handleClick(e);

    if (!tracks || tracks.length < 2) {
      return;
    }

    for (let i = 0; i < tracks.length; i += 1) {
      const track = tracks[i];

      track.selected = track === this.track;
    }

  }

  /**
   * Handle text track list change
   *
   * @param {Event} e
   *        The `change` event that caused this function to be called.
   *
   * @listens TextTrackList#change
   */
  handleTracksChange(e) {

    this.selected(this.track.selected);
  }
}

videojs.registerComponent('VideoTrackMenuItem', VideoTrackMenuItem);
export default VideoTrackMenuItem;
