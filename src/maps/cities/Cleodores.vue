<template>
  <section id="map-city-cleodores">
    <BackButton :backTab="() => dataFile.backTab()" />
    <SpeechBox
      v-if="!!speech"
      :textCycle="speech"
      :onComplete="
        () => {
          speech = false;
          stopAction();
        }
      "
    />

    <header>
      <h1>Cleodores</h1>
    </header>
    <main>
      <button
        :class="`cleodores-option${unlockedMayor ? '' : ' disabled'}`"
        :disabled="!!speech || !unlockedMayor"
      >
        Mayor's Office
      </button>
      <button
        :class="`cleodores-option${unlockedMercGuild ? '' : ' disabled'}`"
        @click="mercenaryGuildClick"
        :disabled="!!speech || !unlockedMercGuild"
      >
        Mercenary Guild
      </button>
      <button
        :class="`cleodores-option${unlockedJobsBoard ? '' : ' disabled'}`"
        @click="jobsBoardClick"
        :disabled="!!speech || !unlockedJobsBoard"
      >
        Job's Board
      </button>
      <button
        :class="`cleodores-option${unlockedMarket ? '' : ' disabled'}`"
        :disabled="!!speech || !unlockedMarket"
      >
        Marketplace
      </button>
      <button
        :class="`cleodores-option${unlockedGuard ? '' : ' disabled'}`"
        :disabled="!!speech || !unlockedGuard"
      >
        Guard's Tower
      </button>
      <button
        :class="`cleodores-option${unlockedCityGate ? '' : ' disabled'}`"
        @click="cityGateClick"
        :disabled="!!speech || !unlockedCityGate"
      >
        City Gate
      </button>
      <button
        :class="`cleodores-option${unlockedChurch ? '' : ' disabled'}`"
        :disabled="!!speech || !unlockedChurch"
      >
        Church
      </button>
      <section
        id="jobs-board"
        v-if="showJobsBoard"
      >
        <button
          id="close-jobs-board"
          @click="
            () => {
              showJobsBoard = false;
              stopAction();
            }
          "
        >
          Close
        </button>
        <h2>Local Jobs</h2>
        <ul id="jobs-list">
          <li v-for="item in availableQuests">
            <div class="job-note-pin" />
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
            <p>Reward: {{ item.reward }}</p>
          </li>
        </ul>
      </section>
      <section
        id="city-gate"
        v-if="showCityGate"
      ></section>
    </main>
  </section>
</template>

<script lang="ts">
import BackButton from "../../parts/BackButton.vue";
import SpeechBox from "../../parts/SpeechBox.vue";

import { gameData, locationActionT, questT, jsonDataT } from "../../../types.d";
import { numberToCoin } from "../../utils";

export default {
  name: "Cleodores",
  components: {
    BackButton,
    SpeechBox,
  },
  props: {
    dataFile: {
      type: gameData,
      required: true,
    },
    gameFiles: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      speech: false,
      showJobsBoard: false,
      availableQuests: [],
      afterAction: [],
      showCityGate: false,
    } as {
      speech: false | Array<{ speaker: string; text: string }>;
      showJobsBoard: boolean;
      availableQuests: Array<{
        title: string;
        description: string;
        reward: string;
        id: string;
        type: string;
      }>;
      afterAction: Array<{ func: Function; remove: boolean }>;
      showCityGate: boolean;
    };
  },
  computed: {
    unlockedMayor() {
      return this.dataFile.unlocked(
        this.gameFiles as jsonDataT,
        "migi/kales/cleodores/cleodores/mayorsOffice"
      );
    },
    unlockedMercGuild() {
      return this.dataFile.unlocked(
        this.gameFiles as jsonDataT,
        "migi/kales/cleodores/cleodores/mercenaryGuild"
      );
    },
    unlockedJobsBoard() {
      return this.dataFile.unlocked(
        this.gameFiles as jsonDataT,
        "migi/kales/cleodores/cleodores/jobsBoard"
      );
    },
    unlockedMarket() {
      return this.dataFile.unlocked(
        this.gameFiles as jsonDataT,
        "migi/kales/cleodores/cleodores/marketplace"
      );
    },
    unlockedGuard() {
      return this.dataFile.unlocked(
        this.gameFiles as jsonDataT,
        "migi/kales/cleodores/cleodores/guardsTower"
      );
    },
    unlockedCityGate() {
      return this.dataFile.unlocked(
        this.gameFiles as jsonDataT,
        "migi/kales/cleodores/cleodores/cityGate"
      );
    },
    unlockedChurch() {
      return this.dataFile.unlocked(
        this.gameFiles as jsonDataT,
        "migi/kales/cleodores/cleodores/church"
      );
    },
  },
  methods: {
    mercenaryGuildClick() {
      this.handleType(
        this.dataFile.goToLocation(
          this.gameFiles as jsonDataT,
          "migi/kales/cleodores/cleodores/mercenaryGuild"
        )
      );
    },
    jobsBoardClick() {
      this.handleType(
        this.dataFile.goToLocation(
          this.gameFiles as jsonDataT,
          "migi/kales/cleodores/cleodores/jobsBoard"
        )
      );
    },
    cityGateClick() {
      this.handleType(
        this.dataFile.goToLocation(
          this.gameFiles as jsonDataT,
          "migi/kales/cleodores/cleodores/cityGate"
        )
      );
    },
    stopAction() {
      this.afterAction.forEach(({ func }) => func());
      this.afterAction = this.afterAction.filter(({ remove }) => !remove);
    },
    handleType(obj: locationActionT) {
      if (obj.type === "speech") {
        this.speech = obj.talk;
      } else if (obj.type === "quest") {
        this.availableQuests = obj.quests
          .concat(obj.specialQuests)
          .map((questId) => {
            const quest: questT = (this.gameFiles as jsonDataT).quests[questId];
            return {
              title: quest.title,
              description: quest.description,
              reward: numberToCoin(quest.reward),
              id: questId,
              type: quest.type,
            };
          });
        this.showJobsBoard = true;
      }
      this.afterAction = this.afterAction.concat(obj.afterFuncs);
    },
  },
};
</script>

<style scoped>
#map-city-cleodores {
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
}
header {
  box-sizing: border-box;
  width: 100%;
  height: 30%;
  text-align: center;
  overflow: hidden;
}
main {
  box-sizing: border-box;
  width: 100%;
  height: 70%;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  flex-wrap: wrap;
  overflow-x: hidden;
}
.cleodores-option {
  box-sizing: border-box;
  width: min(8em, 40%);
  height: 4em;
  margin: 0.5em;
  border: 1px solid black;
  border-radius: 2em;
  background-color: rgb(139, 59, 224);
  color: white;
  font-weight: bold;
  font-size: 1.2em;
  overflow: hidden;
}
.disabled {
  background-color: rgb(139, 59, 224, 0.5);
  color: rgb(139, 59, 224, 0.5);
  border: 1px solid rgb(139, 59, 224, 0.5);
  cursor: not-allowed;
}
#jobs-board {
  box-sizing: border-box;
  position: absolute;
  top: 25%;
  left: 10%;
  width: 80%;
  height: 60%;
  padding: 1em;
  border: 4px solid rgb(217, 163, 102);
  border-radius: 2em;
  background-image: url("../../assets/jobs-board.jpg");
  color: white;
  font-size: 1.2em;
  overflow-x: hidden;
  overflow-y: scroll;
  text-align: center;
}
h2 {
  margin-top: 0.5em;
}
#jobs-list {
  padding: 0;
  margin: 0;
}
#jobs-list > li {
  box-sizing: border-box;
  background-image: url("../../assets/job-note.jpg");
  margin: 0.5em;
  padding: 0.5em;
  border-radius: 1em;
  list-style: none;
}
#jobs-list > li > p,
#jobs-list > li > h3 {
  padding: 0;
  margin: 0.5em 0 0.5em 0;
  color: black;
}
.job-note-pin {
  position: absolute;
  margin: -0.25em 0 0 -0.25em;
  background-color: black;
  border: 0.3em solid grey;
  border-radius: 100%;
  height: 0.65em;
  width: 0.65em;
}
#close-jobs-board {
  width: 50%;
  height: fit-content;
  color: white;
  font-size: 1.1em;
  font-weight: bold;
  border-radius: 1em;
  background: rgba(81, 182, 41, 0.3);
}
</style>
