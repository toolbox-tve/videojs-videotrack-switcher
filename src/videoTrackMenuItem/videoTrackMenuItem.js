import videojs from 'video.js';

const MenuItem = videojs.getComponent('MenuItem');

class VideoTrackMenuItem extends MenuItem {
  constructor(player, options) {
    const track = options.track;
    const tracks = player.audioTracks();

    // Modify options for parent MenuItem class's init.
    options.label = track.label || track.language || 'Unknown';
    options.selected = track.enabled;

    super(player, options);

    this.track = track;

    this.addClass(`vjs-${track.kind}-menu-item`);

    const changeHandler = (...args) => {
      this.handleTracksChange.apply(this, args);
    };

    tracks.addEventListener('change', changeHandler);
    this.on('dispose', () => {
      tracks.removeEventListener('change', changeHandler);
    });
  }

  handleClick(event) {
    const tracks = this.player_.audioTracks();

    super.handleClick(event);

    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i];

      track.enabled = track === this.track;
    }
  }

}

export default VideoTrackMenuItem;