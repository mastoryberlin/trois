import { watch } from 'vue';
import { FrontSide } from 'three';

export default {
  inject: ['three', 'mesh'],
  props: {
    color: { type: [String, Number], default: '#ffffff' },
    depthTest: { type: Boolean, default: true },
    depthWrite: { type: Boolean, default: true },
    flatShading: Boolean,
    fog: { type: Boolean, default: true },
    opacity: { type: Number, default: 1 },
    side: { type: Number, default: FrontSide },
    transparent: Boolean,
    vertexColors: Boolean,
  },
  provide() {
    return {
      material: this,
    };
  },
  created() {
    this.createMaterial();
    this.mesh.setMaterial(this.material);

    this._addWatchers();
    if (this.addWatchers) this.addWatchers();
  },
  unmounted() {
    this.material.dispose();
  },
  methods: {
    setProp(key, value, needsUpdate = false) {
      this.material[key] = value;
      this.material.needsUpdate = needsUpdate;
    },
    setTexture(texture, key = 'map') {
      this.setProp(key, texture, true);
    },
    _addWatchers() {
      // don't work for flatShading
      ['color', 'depthTest', 'depthWrite', 'fog', 'opacity', 'side', 'transparent'].forEach(p => {
        watch(() => this[p], () => {
          if (p === 'color') {
            this.material.color.set(this.color);
          } else {
            this.material[p] = this[p];
          }
        });
      });
    },
  },
  render() {
    return this.$slots.default ? this.$slots.default() : [];
  },
  __hmrId: 'Material',
};
