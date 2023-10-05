// import { gameData } from "../../types.d";

// export function mercGuild(
//   gameDataFiles: { locations: Object; quests: Object },
//   dataFile: gameData
// ) {
//   // : {
//   //   talk?: Array<{ speaker: string; text: string }>;
//   //   afterFuncs: Array<{ func: () => void; remove: boolean }>;
//   // }
//   const index = dataFile.goToLocation(
//     gameDataFiles,
//     "migi/kales/cleodores/cleodores/mercenaryGuild"
//   );
//   if (index === null) return { type: "none" };
// }

// export function jobsBoard(dataFile: gameData): {
//   quests?: Array<{
//     title: string;
//     description: string;
//     reward: number;
//     id: string;
//   }>;
//   talk?: Array<{ speaker: string; text: string }>;
//   afterFuncs: Array<{ func: () => void; remove: boolean }>;
// } {
//   const index = dataFile.locations(
//     "cleodores",
//     "jobsBoard",
//     (value) => value < 1
//   );
//   if (index === null) return { afterFuncs: [] };
//   const completed = dataFile.questsCompleted;

//   return [
//     {
//       talk: [
//         { speaker: "Information Note", text: "Welcome to the jobs board!" },
//         {
//           speaker: "Information Note",
//           text: "Here you can find quests for heroes of all strengths.",
//         },
//         { speaker: "Information Note", text: "Each quest has three sections:" },
//         {
//           speaker: "Information Note",
//           text: "First, Title. This will give you an idea of what the quest will entail. Use this to find a quest that interests you.",
//         },
//         {
//           speaker: "Information Note",
//           text: "Second, Description. This is more in depth, giving details about the quest and what is required to complete it. This should be the first place you look when you decide what quest to take.",
//         },
//         {
//           speaker: "Information Note",
//           text: "Lastly, Reward. This is the renumeration you will receive on completion. This is often an indicator of the difficulty and risk of the quest.",
//         },
//         {
//           speaker: "Information Note",
//           text: "Please note that while quests are first come first serve, that is no excuse to not be careful on outings.",
//         },
//       ],
//       afterFuncs: [],
//     },
//     {
//       quests: quests.filter((job) => completed.indexOf(job.id) === -1),
//       afterFuncs: [
//         {
//           func() {
//             dataFile.unlock("cleodores/cityGate");
//           },
//           remove: true,
//         },
//       ],
//     },
//   ][index];
// }

// export function cityGate(dataFile: gameData): {
//   talk?: Array<{ speaker: string; text: string }>;
//   afterFuncs: Array<{ func: () => void; remove: boolean }>;
// } {
//   const index = dataFile.locations("cleodores", "cityGate");

//   return;
// }

// const quests: Array<{
//   title: string;
//   description: string;
//   reward: number;
//   id: string;
// }> = [
//   {
//     title: "Collect Wrygrass",
//     description:
//       "Collect 5 bundles of wrygrass. They can be commonly seen growing in the fields outside the city gates",
//     reward: 7, // "7c" 7 copper
//     id: "000001",
//   },
//   {
//     title: "Collect Coksweed",
//     description:
//       "Collect 9 bundles of coksweed. They can be commonly seen growing in the fields outside the city gates",
//     reward: 15, // "15c" 15 copper
//     id: "000002",
//   },
//   {
//     title: "Collect Gustbloom",
//     description:
//       "Collect 21 gustbloom buds. They are found growing on the sides of cliffs and other areas with high wind",
//     reward: 294, // "3s" 3 silver
//     id: "000003",
//   },
//   {
//     title: "Subjugate Goblins",
//     description:
//       "Goblins are a nuisance to the area. They can be found roaming near roads around the city. Eliminate 14 of them",
//     reward: 112, // "1s 14c" 1 silver 14 copper
//     id: "000004",
//   },
//   {
//     title: "Eliminate Bandits",
//     description:
//       "A group of bandits have been harassing merchants near the city. Destroy their group. (Extra rewards available for capturing bandits alive)",
//     reward: 150234,
//     id: "000005",
//   },
// ];
