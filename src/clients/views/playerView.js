import { html } from 'lit-html';
import '../views/elements/sw-preset.js';

export default (player, globalsValues) => {
  const schema = player.getSchema();
  const clone = {};

  for (let name in schema) {
    if (name !== 'id') {
      clone[name] = schema[name];
    }
  }

  return html`
    <div style="padding: 20px">
      <h1 style="font-size: 3rem; padding: 30px 0">Player: ${player.get('id')}</h1>

      ${Object.keys(globalsValues).map(key => {
        const value = globalsValues[key];

        return html`
          <p style="font-size: 14px">
            <span style="display: inline-block; width:200px">${key}:</span>
            ${value}
          </p>
        `;
      })}

      <sw-preset
        style="margin-top: 40px"
        width="460"
        expanded
        definitions="${JSON.stringify(clone)}"
        values="${JSON.stringify(player.getValues())}"
        @update=${e => player.set(e.detail)}
      >
    </div>
  `
};
