<template>
  <section id="character-creation">
    <header>
      <h1>
        <p>Welcome</p>
        <p>{{ name }}!</p>
      </h1>
    </header>
    <section id="character-sheet-selection">
      <h2>Make your character</h2>
      <button
        @click="randomiseClick"
        :disabled="rerolls < 1"
      >
        Randomise</button
      >Rolls left: {{ rerolls }}
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
    </section>
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
  display: inline-block;
  width: 50%;
  height: 100%;
  background-color: transparent;
}
#character-sheet-selection {
  display: inline-block;
  position: relative;
  width: 50%;
  height: 100%;
  background-color: transparent;
}

@media (max-width: 600px) and (min-height: 100vw) {
  #character-creation {
    display: block;
    background-image: url("../assets/CS-hill-s.jpeg");
    background-position: 14% 60%;
  }
  header {
    width: 100%;
    height: 50%;
  }
  #character-sheet-selection {
    width: 100%;
    height: 50%;
  }
  h1 {
    text-align: center;
    margin: 30% 0 0 0;
    font-size: 3.5em;
  }
  h1 > p {
    margin: 0;
  }
  #CC-SS {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  #CC-SS > p {
    display: flex;
    justify-content: space-between;
    margin: 0.4em;
    padding: 0.7em;
    border-radius: 1em;
    font-size: 1.2em;
    background-color: green;
    color: white;
    font-weight: bold;
  }
  #CC-total {
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
