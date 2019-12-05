import { Experience } from '@soundworks/core/client';
import { render, html } from 'lit-html';

import '../views/elements/sw-slider-enhanced.js';
import '../views/elements/sw-preset';
import '../views/elements/sw-button';

import playerView from '../views/playerView';

class ControllerExperience extends Experience {
  constructor(client, config, $container) {
    super(client);

    this.config = config;
    this.$container = $container;

    this.players = new Map();

    this.player = null;
    this.unsubscribe = null;
  }

  async start() {
    this.globals = await this.client.stateManager.attach('globals');

    this.eventListeners = {
      attachPlayer: id => {
        if (this.player) {
          this.unsubscribe();
        }

        if (id === '') {
          this.player = null;
          this.unsubscribe = null;
        } else {
          this.player = this.players.get(id);
          this.unsubscribe = this.player.subscribe(() => this.renderApp());
        }

        this.renderApp();
      },
      // globals listeners
      updateGlobalsState: updates => {
        console.log(updates);
        this.globals.set(updates);
      },

      // player listeners
      updatePlayer: e => {
        this.player.set({ volume: parseInt(e.target.value) });
      },
      startStopSynth: e => {
        this.player.set({ startStopSynth: e.target.checked ? 'start' : 'stop' });
      },
      triggerSynth: e => {
        this.player.set({ triggerSynth: true });
      },
    };

    this.globals.subscribe(updates => this.renderApp());

    this.client.stateManager.observe(async (schemaName, nodeId) => {
      if (schemaName === 'player') {
        const player = await this.client.stateManager.attach('player', nodeId);
        // if client disconnect while attached
        player.onDetach(() => {
          if (player === this.player) {
            this.unsubscribe();
            this.player = null;
            this.unsubscribe = null;
          }

          this.players.delete(nodeId);
          this.renderApp();
        });

        this.players.set(nodeId, player);
        this.renderApp();
      }
    });
    // init app with current values
    // this.attachPlayer(this.globals.get('remoteControlled'));
    this.renderApp();

    super.start();
  }

  renderApp() {

    const globalsValues = this.globals.getValues();
    const globalsSchema = this.globals.getSchema();

    const playerIds = Array.from(this.players.keys());

    render(
      html`
        <div style="padding: 20px;">
          <h1 style="font-size: 3rem; padding: 30px 0">globals</h1>
          <sw-preset
            width="800"
            expanded
            definitions="${JSON.stringify(globalsSchema)}"
            values="${JSON.stringify(globalsValues)}"
            @update=${e => this.eventListeners.updateGlobalsState(e.detail)}
          ></sw-preset>

          <h1 style="font-size: 3rem; padding: 30px 0">attach clients</h1>
          <sw-button
            text="detach"
            value=""
            @click="${e => this.eventListeners.attachPlayer(e.detail.value)}"
          ></sw-button>
          ${playerIds.map((id) => {
            return html`
              <sw-button
                text="attach node ${id}"
                value="${id}"
                @click="${e => this.eventListeners.attachPlayer(parseInt(e.detail.value))}"
              ></sw-button>
            `
          })}

          ${this.player
            ? html`
              <div style="width: 500px; height: 700px; border: 1px solid white; margin-top: 20px;">
                ${playerView(this.player, globalsValues)}
              </div>`
            : ``
          }
        </div>
        `
      , this.$container
    );
  }
}

export default ControllerExperience;
