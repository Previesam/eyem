<template>
  <div id="el">
    <div>
      <video
        :hidden="captured"
        ref="video"
        id="video"
        width="640"
        height="480"
        autoplay
      ></video>
      <canvas
        :hidden="!captured"
        ref="canvas"
        id="canvas"
        width="640"
        height="480"
      ></canvas>
    </div>
    <div class="my-5 mx-auto text-center">
      <v-btn
        v-if="!captured"
        outlined
        color="primary"
        id="snap"
        v-on:click="capture()"
        >Snap Photo</v-btn
      >
      <v-btn v-else outlined color="primary" id="snap" v-on:click="cancel()"
        >Cancel</v-btn
      >
    </div>

    <!-- <ul>
      <li v-for="c in captures" :key="c">
        <img v-bind:src="c" height="50" />
      </li>
    </ul> -->
  </div>
</template>

<script>

export default {
  data: function () {
    return {
      video: {},
      canvas: {},
      image: null,
      captured: false,
    };
  },
  mounted: function () {
    this.captured = false;
    this.video = this.$refs.video;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
          console.log(stream);
          video.srcObject = stream;
          this.video.play();
        });
    }
  },
  methods: {
    capture() {
      this.captured = true;
      this.canvas = this.$refs.canvas;
      var context = this.canvas
        .getContext("2d")
        .drawImage(this.video, 0, 0, 640, 480);
      this.image = canvas.toDataURL("image/png");
    //   this.save(this.image)
    },

    // save(image) {
    //   fs.writeFile('~/assets/user/image.png',  image, (err) => {
    //     if (err) return console.error(err);
    //     console.log("file saved to ", part.filename);
    //   });
    // },

    cancel() {
      this.captured = false;
    },
  },
};
</script>

<style scoped>
body {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

#el {
  align-self: center;
  width: 50%;
  height: 40%;
  margin: 0 auto;
  overflow-y: scroll;
  overflow-x: hidden;
}
</style>