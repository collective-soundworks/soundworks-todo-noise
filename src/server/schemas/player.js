export default {
  id: {
    type: 'integer',
    default: null,
    nullable: true,
  },
  volume: {
    type: 'integer',
    default: 0,
    min: -60,
    max: 6,
    step: 1,
  },
  cutoffFrequency: {
    type: 'integer',
    default: 200,
    min: 50,
    max: 2000,
    step: 1,
  },
  synthStarted: {
    type: 'boolean',
    default: false,
  },
  triggerSynth: {
    type: 'any',
    event: true,
    default: true,
  },
};

