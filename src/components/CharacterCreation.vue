<template>
  <section id="character-creation">
    <header>
      <h1>
        <p>Welcome</p>
        <p>{{ name }}!</p>
      </h1>
      <button
        class="CC-confirm"
        @click="confirmStats"
      >
        Confirm Stats?
      </button>
    </header>
    <main>
      <h2>Make your character</h2>
      <button
        class="CC-randomise"
        @click="randomiseClick"
        :disabled="rerolls < 1"
      >
        Randomise
      </button>
      <p class="CC-rolls">Rerolls left: {{ rerolls }}</p>
      <section id="CC-SS">
        <p>
          <span>Strength:</span>
          <span>{{ strength }}</span>
        </p>
        <p>
          <span>Endurance:</span>
          <span>{{ endurance }}</span>
        </p>
        <p>
          <span>Agility:</span>
          <span>{{ agility }}</span>
        </p>
        <p>
          <span>Perception:</span>
          <span>{{ perception }}</span>
        </p>
        <p>
          <span>Intelligence:</span>
          <span>{{ intelligence }}</span>
        </p>
        <p>
          <span>Wisdom:</span>
          <span>{{ wisdom }}</span>
        </p>
        <p>
          <span>Charisma:</span>
          <span>{{ charisma }}</span>
        </p>
        <p>
          <span>Luck:</span>
          <span>{{ luck }}</span>
        </p>
      </section>
      <p id="CC-total">Total points: {{ sumStats }}</p>
    </main>
  </section>
</template>

<script lang="ts">
import { gameData } from "../../types.d";
import { normalStat, luckStat } from "../data/statChances";

export default {
  name: "CharacterCreation",
  props: {
    dataFile: {
      type: gameData,
      required: true,
    },
  },
  data() {
    return {
      strength: 10,
      endurance: 5,
      agility: 10,
      perception: 5,
      intelligence: 10,
      wisdom: 5,
      charisma: 10,
      luck: 5,
      rerolls: 5,
    };
  },
  computed: {
    name() {
      return this.dataFile.name;
    },
    sumStats() {
      return (
        this.strength +
        this.endurance +
        this.agility +
        this.perception +
        this.intelligence +
        this.wisdom +
        this.charisma +
        this.luck
      );
    },
  },
  methods: {
    randomiseClick() {
      const getStat = (stats: Record<any, number>) => {
        let num = Math.random() * stats.total;
        let stat = -1;
        for (let i = 1; stat < 0; i++) {
          num -= stats[i];
          if (num <= 0) {
            stat = i;
          }
        }
        return stat < 0 ? 5 : stat;
      };
      this.rerolls--;
      this.strength = getStat(normalStat);
      this.endurance = getStat(normalStat);
      this.agility = getStat(normalStat);
      this.perception = getStat(normalStat);
      this.intelligence = getStat(normalStat);
      this.wisdom = getStat(normalStat);
      this.charisma = getStat(normalStat);
      this.luck = getStat(luckStat);
    },
    confirmStats() {
      this.dataFile.henry({
        strength: this.strength,
        endurance: this.endurance,
        agility: this.agility,
        perception: this.perception,
        intelligence: this.intelligence,
        wisdom: this.wisdom,
        charisma: this.charisma,
        luck: this.luck,
      }).tab = "game-menu";
      localStorage.setItem("pegn-saveData", this.dataFile.save());
    },
  },
};
</script>

<style scoped>
#character-creation {
  display: flex;
  width: 100%;
  height: 100%;
  background-image: url("../assets/CS-hill-s.jpeg");
}
header {
  width: 50%;
  height: 100%;
  padding: 0.5em;
  background-color: transparent;
}
main {
  display: inline-block;
  position: relative;
  width: 50%;
  height: 100%;
  background-color: transparent;
}

@media (max-width: 600px) and (min-height: 100vw) {
  #character-creation {
    box-sizing: border-box;
    display: block;
    background-image: url("../assets/CS-hill-s.jpeg");
    background-position: 14% 60%;
  }
  header {
    box-sizing: border-box;
    width: 100%;
    height: 35%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }
  main {
    box-sizing: border-box;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 15% 15% 4fr 1fr;
    width: 100%;
    height: 65%;
    padding: 0.5em;
    font-size: 0.9em;
  }
  h1 {
    text-align: center;
    margin: 0.3em 0 0 0;
    font-size: 3em;
  }
  h1 > p {
    margin: 0;
  }
  .CC-confirm {
    width: fit-content;
    height: fit-content;
    margin-right: 0.7em;
    padding: 0.7em;
    border-radius: max(100vh, 100vw);
    background: linear-gradient(
      157deg,
      rgb(78, 160, 247, 0.8) 0%,
      rgb(95, 230, 239, 0.9) 23%,
      rgb(78, 160, 247, 0.8) 45%,
      rgb(95, 230, 239, 0.9) 68%,
      rgb(78, 160, 247, 0.8) 90%
    );
    font-weight: bold;
    font-size: 1.1em;
  }
  h2 {
    grid-area: 1 / 1 / 2 / 3;
    text-align: center;
    font-size: 2em;
    margin: auto 0;
  }
  .CC-randomise {
    grid-area: 2 / 1 / 3 / 2;
    align-self: center;
    justify-self: right;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 0.7em;
    padding: 0.7em;
    border-radius: max(100vh, 100vw);
    background: linear-gradient(
      157deg,
      rgb(24, 123, 47) 0%,
      rgb(64, 243, 100) 23%,
      rgb(24, 123, 47) 45%,
      rgb(64, 243, 100) 68%,
      rgb(24, 123, 47) 90%
    );
    font-weight: bold;
    font-size: 1.3em;
  }
  .CC-rolls {
    grid-area: 2 / 2 / 3 / 3;
    display: inline-block;
    align-self: center;
    justify-self: left;
    text-align: center;
    margin-left: 1.1em;
    font-weight: bold;
    font-size: 1.7em;
  }
  #CC-SS {
    box-sizing: border-box;
    grid-area: 3 / 1 / 4 / 3;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  #CC-SS > p {
    display: flex;
    justify-content: space-between;
  }
  #CC-total {
    grid-area: 4 / 1 / 5 / 3;
  }
  #CC-total,
  #CC-SS > p {
    margin: 0.4em;
    padding: 0.7em;
    border-radius: 1em;
    font-size: 1.2em;
    background-color: green;
    color: white;
    font-weight: bold;
  }
}
</style>
