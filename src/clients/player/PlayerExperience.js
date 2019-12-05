import { Experience } from '@soundworks/core/client';
import { render, html } from 'lit-html';
import loaders from 'waves-loaders';
import renderAppInitialization from '../views/renderAppInitialization';
import playerView from '../views/playerView';

import TriggerSynth from './audio/TriggerSynth';
import StartStopSynth from './audio/StartStopSynth';
import AudioBus from './audio/AudioBus';

class PlayerExperience extends Experience {
  constructor(client, config = {}, $container, audioContext) {
    super(client);

    this.config = config;
    this.$container = $container;
    this.audioContext = audioContext;

    // require services
    this.platform = this.require('platform');

    // default initialization views
    renderAppInitialization(client, config, $container);
  }

  async start() {
    this.playerState = await this.client.stateManager.create('player');
    this.globalsState = await this.client.stateManager.attach('globals');

    this.playerState.set({ id: this.client.id });

    // audio chain
    const master = new AudioBus(this.audioContext);
    master.mute = this.globalsState.get('mute');
    master.volume = this.globalsState.get('master');
    master.connect(this.audioContext.destination);

    const mixer = new AudioBus(this.audioContext);
    mixer.connect(master.input);

    const frequency = 200 * (this.client.id % 7 + 1);
    const triggerSynth = new TriggerSynth(this.audioContext, frequency);
    triggerSynth.connect(mixer.input);

    const bufferLoader = new loaders.AudioBufferLoader();
    const buffer = await bufferLoader.load('sounds/drum-loop.mp3');
    const startStopSynth = new StartStopSynth(this.audioContext, buffer);
    startStopSynth.connect(mixer.input);

    this.eventListeners = {
      triggerSynth: e => {
        this.playerState.set({ triggerSynth: true });
      },
      startStopSynth: e => {
        const value = e.target.checked ? 'start' : 'stop';
        this.playerState.set({ startStopSynth: value });
      },
      updateVolume: e => {
        const volume = parseInt(e.target.value);
        this.playerState.set({ volume });
      },
    };

    this.globalsState.subscribe(updates => {
      for (let key in updates) {
        switch (key) {
          case 'mute':
            master.mute = updates[key];
            break;
          case 'master':
            master.volume = updates[key];
            break;
        }
      }

      this.renderApp();
    });

    this.playerState.subscribe(updates => {
      console.log(updates);
      for (let key in updates) {
        switch (key) {
          case 'volume':
            mixer.volume = updates[key];
            break;
          case 'triggerSynth':
            console.log('am I here');
            triggerSynth.trigger();
            break;
          case 'synthStarted':
            const method = updates[key] ? 'start' : 'stop';
            startStopSynth[method]();
            break;
        }
      }

      this.renderApp();
    });

    super.start();

    this.renderApp();
  }

  renderApp(msg) {
    window.cancelAnimationFrame(this.rafId);

    this.rafId = window.requestAnimationFrame(() => {
      const globalsValues = this.globalsState.getValues();

      render(html`
        <div class="screen">
          ${playerView(this.playerState, globalsValues)}
        </div>
      `, this.$container);
    });
  }
}

export default PlayerExperience;
