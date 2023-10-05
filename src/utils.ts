import { jsonDataT } from "../types.d";

export function numberToCoin(currency: number): string {
  const conversion = [
    {
      name: "copper",
      value: 1, // 1 copper = 1 copper
      symbol: "c",
    },
    {
      name: "silver",
      value: 98, // 1 silver = 98 copper
      symbol: "s",
    },
    {
      name: "gold",
      value: 9604, // 9,604 1 gold = 98 silver
      symbol: "g",
    },
    {
      name: "platinum",
      value: 9373504, // 9,373,504 1 platinum = 976 gold
      symbol: "p",
    },
    {
      name: "black steel",
      value: 1002964928, // 1,002,964,928 1 black steel = 107 platinum
      symbol: "bs",
    },
  ];
  let coinString = "";
  for (const coin of conversion.reverse()) {
    const coinAmount = Math.floor(currency / coin.value);
    if (coinAmount > 0) {
      coinString += `${coinAmount}${coin.symbol} `;
    }
    currency -= coinAmount * coin.value;
  }
  return coinString.trimEnd();
}

export async function fetchGameDataFiles(): Promise<jsonDataT> {
  await new Promise<void>((resolve) => {
    setTimeout(() => resolve(), Math.random() * 3000);
  });
  return {
    locations: await fetch("../jsonData/locations.json").then((res) =>
      res.json()
    ),
    quests: await fetch("../jsonData/quests.json").then((res) => res.json()),
    loadingMessages: await fetch("../jsonData/loadingMessages.json").then(
      (res) => res.json()
    ),
  };
}
