<template>
  <!-- Add some ionic markup... -->
  <ion-app>
    <ion-header :translucent="true">
      <!-- <ion-toolbar collapse="condense">
        <ion-title>Blank</ion-title>
        <ion-spacer></ion-spacer>
        <ion-button>Samuel</ion-button>
      </ion-toolbar> -->
      <ion-toolbar collapse="condense">
        <ion-buttons slot="secondary">
          <ion-button>
            <ion-icon slot="icon-only" :icon="search"></ion-icon>
          </ion-button>
          <ion-button>
            <ion-icon slot="icon-only" :icon="personCircle"></ion-icon>
          </ion-button>
        </ion-buttons>
        <!-- <ion-buttons slot="primary">
          <ion-button color="secondary">
            <ion-icon
              slot="icon-only"
              ios="ellipsis-horizontal"
              md="ellipsis-vertical"
            ></ion-icon>
          </ion-button>
        </ion-buttons> -->
        <ion-title v-if="$vuetify.breakpoint.width > 800"
          >Desktop Appbar</ion-title
        >
        <ion-title v-if="$vuetify.breakpoint.width < 800"
          >Mobile Appbar</ion-title
        >
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <!-- <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Blank</ion-title>
        </ion-toolbar>
      </ion-header> -->

      <div id="container">
        <strong>Ready to create an app?</strong>
        <p>
          Start with Ionic
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://ionicframework.com/docs/components"
            >UI Components</a
          >
        </p>
        <ion-list>
          <ion-item>
            <ion-input placeholder="Title"></ion-input>
          </ion-item>
          <ion-item>
            <ion-input placeholder="Location"></ion-input>
          </ion-item>
          <ion-item-divider></ion-item-divider>
          <ion-item>
            <ion-label>Start Date</ion-label>
            <ion-datetime
              value="1990-02-19"
              placeholder="Select Date"
            ></ion-datetime>
          </ion-item>
          <ion-item>
            <ion-label>Start Time</ion-label>
            <ion-datetime
              display-format="h:mm A"
              picker-format="h:mm A"
              value="1990-02-19T07:43Z"
            ></ion-datetime>
          </ion-item>
          <ion-item>
            <ion-label>Ends</ion-label>
            <ion-datetime
              value="1990-02-20"
              placeholder="Select Date"
            ></ion-datetime>
          </ion-item>
          <ion-item>
            <ion-label>Repeat</ion-label>
            <ion-datetime placeholder="Never" disabled></ion-datetime>
          </ion-item>
          <ion-item>
            <ion-label>Travel Time</ion-label>
            <ion-datetime placeholder="None" disabled></ion-datetime>
          </ion-item>
          <ion-item-divider></ion-item-divider>
          <ion-item>
            <ion-label>Alert</ion-label>
            <ion-datetime placeholder="None" disabled></ion-datetime>
          </ion-item>
        </ion-list>
        <ion-icon name="albums-outline"></ion-icon>
      </div>
      <!-- fab placed to the top start -->
      <ion-fab horizontal="end" vertical="bottom" slot="fixed">
        <ion-fab-button color="light">
          <ion-icon ios="ellipsis-horizontal" md="ellipsis-vertical"></ion-icon>
        </ion-fab-button>
        <ion-fab-list side="top">
          <ion-fab-button color="light">
            <ion-icon name="logo-facebook"></ion-icon>
          </ion-fab-button>
          <ion-fab-button color="light">
            <ion-icon name="logo-twitter"></ion-icon>
          </ion-fab-button>
          <ion-fab-button color="light">
            <ion-icon name="logo-vimeo"></ion-icon>
          </ion-fab-button>
        </ion-fab-list>
      </ion-fab>
    </ion-content>
    <ion-footer>
      <ion-button><ion-icon name="ellipsis-vertical" slot="" size="small"></ion-icon> Samuel</ion-button>
    </ion-footer>
  </ion-app>
</template>

<script>
import {
  add,
  arrowBackCircle,
  arrowForwardCircle,
  logoFacebook,
  logoInstagram,
  logoTwitter,
  logoVimeo,
  person,
  settings,
  share,
  ellipsisHorizontal,
  ellipsisVertical,
  helpCircle,
  personCircle,
  search,
  star
} from "ionicons/icons";
export default {
  layout: 'full-screen',
  data: () => {
    return {
      name: "Samuel",
      add,
      arrowBackCircle,
      arrowForwardCircle,
      logoFacebook,
      logoInstagram,
      logoTwitter,
      logoVimeo,
      person,
      settings,
      share,
      ellipsisHorizontal,
      ellipsisVertical,
      helpCircle,
      personCircle,
      search,
      star
    };
  },

  mounted() {
    console.log(this.$vuetify.breakpoint)
  }
};
</script>

<style>
:root {
  height: 100vh;
}

ion-toolbar {
  padding-left: 1rem;
  padding-right: 1rem;
}

/* ion-fab {
  position: absolute;
} */
ion-fab-list > ion-fab-button {
  margin: 0.25rem;
}
ion-fab-list {
  margin-bottom: 4rem;
}
</style>
