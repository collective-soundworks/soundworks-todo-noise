import { Experience } from '@soundworks/core/server';

class PlayerExperience extends Experience {
  constructor(server, clientTypes, options = {}) {
    super(server, clientTypes);

    this.platform = this.require('platform');
  }

  start() {
    super.start();
  }

  enter(client) {

  }

  exit(client) {

  }
}

export default PlayerExperience;
