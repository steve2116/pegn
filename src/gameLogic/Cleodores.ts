import { gameData } from "../../types.d";

export function MercGuild(
  dataFile: gameData
): Array<{ speaker: string; text: string }> {
  const index = dataFile.locations("cleodores", "mercenaryGuild", true);
  if (index === null)
    return [
      {
        speaker: "Receptionist",
        text: "Please take a look at our jobs board.",
      },
    ];
  return [
    [
      {
        speaker: "Receptionist",
        text: "Welcome to the Mercenary Guild!",
      },
      {
        speaker: "Receptionist",
        text: "We have a variety of jobs available for you to take.",
      },
      {
        speaker: "Receptionist",
        text: "It seems you have already been signed up, so you can get started immediately.",
      },
      {
        speaker: "Receptionist",
        text: "Please take a look at our jobs board.",
      },
    ],
  ][index];
}
