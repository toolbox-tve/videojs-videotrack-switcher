import document from 'global/document';
import QUnit from 'qunitjs';
import sinon from 'sinon';
import videojs from 'video.js';

import plugin from '../src/js/index.js';

const Player = videojs.getComponent('Player');

QUnit.module('sanity tests');

QUnit.test('the environment is sane', assert => {
  assert.strictEqual(typeof Array.isArray, 'function', 'es5 exists');
  assert.strictEqual(typeof sinon, 'object', 'sinon exists');
  assert.strictEqual(typeof videojs, 'function', 'videojs exists');
  assert.strictEqual(typeof plugin, 'function', 'plugin is a function');
});

QUnit.module('videojs-videotrack-switcher', {

  afterEach() {
    this.player.dispose();
    this.clock.restore();
  },

  beforeEach() {

    // Mock the environment's timers because certain things - particularly
    // player readiness - are asynchronous in video.js 5. This MUST come
    // before any player is created; otherwise, timers could get created
    // with the actual timer methods!
    this.clock = sinon.useFakeTimers();

    this.fixture = document.getElementById('qunit-fixture');
    this.video = document.createElement('video');
    this.fixture.appendChild(this.video);
    this.player = videojs(this.video);
  }
});

QUnit.test('registers itself with video.js', assert => {
  assert.expect(2);

  assert.strictEqual(
    typeof Player.prototype.videotrackSwitcher,
    'function',
    'videojs-videotrack-switcher plugin was registered'
  );

  this.player.videotrackSwitcher({
    defaultSelected: 0,
    sourceTracks: [
      {
        kind: 'main',
        label: 'Enligsh',
        language: 'en',
        type: 'video/mp4',
        url: '//english_video.mp4'
      },
      {
        language: 'fr',
        type: 'video/mp4',
        url: '//french_video.mp4'
      }
    ]
  });

  // Tick the clock forward enough to trigger the player to be "ready".
  this.clock.tick(1);

  assert.ok(
    this.player.hasClass('vjs-videotrack-switcher'),
    'the plugin adds a class to the player'
  );
});
