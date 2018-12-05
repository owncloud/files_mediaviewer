<template>
  <div class="viewer">
    <button class="viewer--close" @click="close">close</button>
    <img class="viewer--image" :src="imgSrc" :alt="file.name">
  </div>
</template>

<script>
export default {
  name: "Viewer",
  methods: {
    close() {
      $("#files_mediaviewer").remove();
      this.$parent.$destroy();
    }
  },
  computed: {
    file() {
      return _.findWhere(FileList.files, { name: this.$route.params.file });
    },
    dir() {
      return window._mediaviewer.context.dir;
    },
    list() {
      return _.filter(FileList.files, { mimetype: "image/png" });
    },
    viewport() {
      return {
        x: $(window).width(),
        y: $(window).height()
      };
    },
    imgSrc() {
      return (
        [OC.getRootPath(), "remote.php/dav/files/admin", this.file.name].join(
          "/"
        ) +
        "?" +
        $.param({
          c: this.file.etag,
          x: this.viewport.x,
          y: this.viewport.y,
          a: 1,
          preview: 1
        })
      );
    }
  }
};
</script>
<style lang="scss">
.viewer {
  position: absolute;
  top: 45px;
  right: 0;
  bottom: 0;
  left: 0;

  &--image {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &--close {
    position: absolute;
    top: 20px;
    right: 20px;
  }
}
</style>
