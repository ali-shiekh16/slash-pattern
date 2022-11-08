const configurations = {
  maxPixelRatio: 2,
  sizes: {
    rendererWidth: 500,
    rendererHeight: 500,

    get width() {
      return this.rendererWidth;
    },

    set width(value) {
      this.rendererWidth = value;
    },

    get height() {
      return this.rendererHeight;
    },

    set height(value) {
      this.rendererHeight = value;
    },
  },
};

export default configurations;
