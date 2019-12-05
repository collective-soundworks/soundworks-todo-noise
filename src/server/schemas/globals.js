export default {
  master: {
    type: 'integer',
    default: 0,
    min: -60,
    max: 6,
    step: 1,
  },
  mute: {
    type: 'boolean',
    default: false,
  },
};
