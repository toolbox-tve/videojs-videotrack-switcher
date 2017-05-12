# videojs-videotrack-switcher

This VideoJS plugin add button switcher for videotracks when player is setted
with an array of sources thtat includes VideoTracks attributes (http://docs.videojs.com/docs/guides/video-tracks.html)

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [<script> Tag](#script-tag)
  - [Browserify](#browserify)
  - [RequireJS/AMD](#requirejs-amd)
- [Plugin options](#plugin-options)
- [License](#license)

<!-- START doctoc -->
<!-- END doctoc -->



## Installation

Install via npm (preferred):

```sh
npm install --save videojs-videotrack-switcher
```

## Usage

To include videojs-videotrack-switcher on your website or web application, use any of the following methods.

### `<script>` Tag

This is the simplest case. Get the script in whatever way you prefer and include the plugin _after_ you include [video.js][videojs], so that the `videojs` global is available.

```html
<script src="//path/to/video.min.js"></script>
<script src="//path/to/videojs-videotrack-switcher.min.js"></script>
<script>
  var player = videojs('my-video');

  player.videotrackSwitcher();
</script>
```

### Browserify

When using with Browserify, install videojs-videotrack-switcher via npm and `require` the plugin as you would any other module.

```js
var videojs = require('video.js');

// The actual plugin function is exported by this module, but it is also
// attached to the `Player.prototype`; so, there is no need to assign it
// to a variable.
require('videojs-videotrack-switcher');

var player = videojs('my-video');

player.videotrackSwitcher();
```

### RequireJS/AMD

When using with RequireJS (or another AMD library), get the script in whatever way you prefer and `require` the plugin as you normally would:

```js
require(['video.js', 'videojs-videotrack-switcher'], function(videojs) {
  var player = videojs('my-video');

  player.videotrackSwitcher();
});
```

## Plugin Options

#### defaultSelected
* Type: `number`
* Optional

Indicates the track index selected to play first. (If browser can play it).
If it is not specified, the first one with the `kind` attribute 'main' is selected.

#### continued
* Type: `boolean`
* Optional

When `continued` is set to `true` the playback continued at last position when track changes.


## License

MIT. Copyright (c) Davi <dluna@tbxnet.com>


[videojs]: http://videojs.com/
