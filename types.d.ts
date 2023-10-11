import CryptoJS from "crypto-js";

type tabT =
  | "title"
  | "login-menu"
  | "character-creation"
  | "game-menu"
  | "character-info"
  | "game-maps"
  | "map-city-cleodores";

type stats =
  | "strength"
  | "endurance"
  | "agility"
  | "perception"
  | "intelligence"
  | "wisdom"
  | "charisma"
  | "luck";

interface loginGuestT {
  username: string;
}

interface characterSheetT {
  username: string;
  stats: Record<stats, number>;
}

interface gameDataGameT {
  locations: {
    [continent: string]: {
      [country: string]: {
        [territory: string]: {
          [city: string]: {
            [area: string]: number;
          };
        };
      };
    };
  };
  questsCompleted: string;
}

export type locationActionT =
  | {
      type: "none";
      afterFuncs: Array<{ func: () => void; remove: boolean }>;
    }
  | {
      type: "speech";
      talk: Array<{ speaker: string; text: string }>;
      afterFuncs: Array<{ func: () => void; remove: boolean }>;
    }
  | {
      type: "quest";
      quests: Array<string>;
      specialQuests: Array<string>;
      afterFuncs: Array<{ func: () => void; remove: boolean }>;
    };

export class gameData {
  private navigation: { tabStack: tabStack };
  private user: {
    name: string;
    stats: Record<stats, number>;
    new: boolean;
  };
  private game: gameDataGameT;

  constructor() {
    this.navigation = {
      tabStack: new tabStack("title"),
    };
    this.user = {
      name: "default name",
      stats: {
        strength: 1,
        endurance: 1,
        agility: 1,
        perception: 1,
        intelligence: 1,
        wisdom: 1,
        charisma: 1,
        luck: 0,
      },
      new: true,
    };
    this.game = {
      locations: {
        hidar: {},
        midgar: {},
        migi: {
          kales: {
            cleodores: {
              cleodores: {
                mayorsOffice: -1,
                mercenaryGuild: 0,
                jobsBoard: -1,
                marketplace: -1,
                guardsTower: -1,
                cityGate: -1,
                church: -1,
              },
            },
          },
        },
        penin: {},
        isles: {},
      },
      questsCompleted: "",
    };
  }

  get tab() {
    return this.navigation.tabStack.peak;
  }

  set tab(tab: tabT) {
    this.navigation.tabStack.next(tab);
  }

  get check() {
    return this.navigation.tabStack.check;
  }

  backTab(): tabT | null {
    return this.navigation.tabStack.previous();
  }

  get name() {
    return this.user.name;
  }

  loginGuest({ username }: loginGuestT) {
    this.user.name = username;
    return this;
  }

  henry(stats: Record<stats, number>) {
    if (this.user.new) {
      this.user.stats = stats;
      this.user.new = false;
      this.navigation.tabStack.new();
    }
    return this;
  }

  get characterSheet(): characterSheetT {
    return {
      username: this.user.name,
      stats: this.user.stats,
    };
  }

  save(): string {
    const encrypt = (text: string): string => {
      return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text));
    };
    return encrypt(
      JSON.stringify({
        tab: this.navigation.tabStack.peak,
        user: this.user,
        game: this.game,
      })
    );
  }

  load(data: string): () => void {
    const decrypt = (data: string): string => {
      return CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8);
    };
    const { tab, user, game } = JSON.parse(decrypt(data));
    this.user = user;
    this.game = game;
    return () => this.navigation.tabStack.new();
  }

  goToLocation(
    gameDataFiles: jsonDataT,
    locationString: string
  ): locationActionT {
    const {
      user,
      game,
    }: {
      user: number | null;
      game: {
        max: number;
        unlockedAt: Array<string>;
        data: Array<{
          [key: string]: any;
          type: string;
          unlocks: Array<string>;
          progress: Array<string>;
          relocks: Array<string>;
        }>;
      } | null;
    } = locationString.split("/").reduce(
      (acc, curr) => ({
        user: acc.user[curr] || acc.user[curr] === 0 ? acc.user[curr] : null,
        game: acc.game[curr] ? acc.game[curr] : null,
      }),
      { user: this.game.locations, game: gameDataFiles.locations }
    );
    if (user === null || game === null)
      return {
        type: "none",
        afterFuncs: [
          { func: () => console.log("Location not found"), remove: true },
        ],
      };
    else {
      const data = {
        ...game.data[game.max < user ? game.max : user],
        afterFuncs: [],
      };
      data.afterFuncs.push(
        ...data.unlocks.reduce(
          (acc, path) =>
            acc.concat([
              {
                func: () => {
                  path.split("/").reduce((acc, curr, ind, arr) => {
                    if (ind === arr.length - 1 && acc[curr] === -1) {
                      acc[curr]++;
                      return;
                    }
                    return acc[curr];
                  }, this.game.locations);
                },
                remove: true,
              },
            ]),
          []
        )
      );
      data.afterFuncs.push(
        ...data.progress.reduce(
          (acc, path) =>
            acc.concat([
              {
                func: () => {
                  path.split("/").reduce((acc, curr, ind, arr) => {
                    if (ind === arr.length - 1) {
                      const [place, increment]: [string, string] =
                        curr.split("#");
                      acc[place] += parseInt(increment);
                      return acc[place];
                    } else return acc[curr];
                  }, this.game.locations);
                },
                remove: true,
              },
            ]),
          []
        )
      );
      // data.afterFuncs.push(...data.relocks.reduce((acc, path) => acc.concat([{ func: () => {}, remove: true }]), []));
      if (data.type === "quests") {
        let quests: Array<string> = [];
        locationString
          .split("/")
          .slice(0, -1)
          .reduce((acc, curr, ind, arr) => {
            quests = quests.concat(acc[curr].info.quests);
            return acc[curr];
          }, gameDataFiles.locations);
        return {
          type: "quest",
          quests,
          specialQuests: data.specialQuests,
          afterFuncs: data.afterFuncs,
        };
      } else if (data.type === "speech") {
        return { type: "speech", talk: data.talk, afterFuncs: data.afterFuncs };
      } else return { type: "none", afterFuncs: data.afterFuncs };
    }
  }

  unlocked(
    gameDataFiles: { locations: Object; quests: Object },
    path: string
  ): boolean {
    return (
      path.split("/").reduce((acc, curr) => acc[curr], gameDataFiles.locations)
        .unlockedAt as Array<string>
    ).every((location) => {
      const newPath = location.split("/");
      if (newPath.length === 0) return true;
      else {
        return newPath.reduce((acc, curr, ind, arr) => {
          if (ind === arr.length - 1) {
            const [place, value]: [string, number] = curr.split("-");
            return acc[place] >= value;
          } else return acc[curr];
        }, this.game.locations);
      }
    });
  }

  unlock(path: string): boolean {
    return path.split("/").reduce((acc, curr, ind, arr) => {
      if (ind === arr.length - 1) {
        if (acc[curr]) {
          acc[curr].unlocked = true;
          return true;
        } else return false;
      }
      return acc[curr];
    }, this.game.locations);
  }

  get questsCompleted(): Array<string> {
    return this.game.questsCompleted.split("-");
  }

  get all() {
    return this.navigation.tabStack.all;
  }
}

class tabStack {
  private tabs: Array<tabT>;

  constructor(startingTab?: tabT) {
    this.tabs = startingTab ? [startingTab] : [];
  }

  get all() {
    return this.tabs;
  }

  get length(): number {
    return this.tabs.length;
  }

  get check() {
    if (this.length < 2) return null;
    return this.tabs[this.tabs.length - 2];
  }

  previous(): tabT | null {
    if (this.length === 0) return null;
    return this.tabs.pop();
  }

  get peak(): tabT | null {
    if (this.length === 0) return null;
    return this.tabs[this.tabs.length - 1];
  }

  next(tab: tabT): void {
    this.tabs.push(tab);
  }

  new(): void {
    this.tabs = [];
  }
}

// enum Weather {
//   rain = "Rainy",
//   snow = "Snowy",
//   trop = "Tropical",
//   dry = "Dry",
//   windy = "Windy",
//   grey = "Grey",
//   sun = "Sunny",
// }

// enum Environments {
//   na = "None",
//   forest = "Forest",
//   plains = "Plains",
//   mountains = "Mountains",
//   desert = "Desert",
//   swamp = "Swamp",
//   jungle = "Jungle",
//   tundra = "Tundra",
//   ocean = "Ocean",
//   volcano = "Volcanic",
// }

// type Directions =
//   | "north"
//   | "south"
//   | "east"
//   | "west"
//   | "north-east"
//   | "north-west"
//   | "south-east"
//   | "south-west";

// enum Religions {
//   na = "None",
// }

// enum Races {
//   h = "Human",
//   hs = "Humans",
// }

// interface AreaConstructor {
//   name: Locations;
//   territoryOf: Kingdoms;
//   weather: Weather;
//   environment: Environments;
//   bordering: Array<{ name: Locations; direction: Directions }>;
//   apartOf: Locations;
//   locatedWithin: Array<Locations>;
// }

// interface PopulatedLocationConstructor extends AreaConstructor {
//   population: number;
//   ReligionsE: Array<Religions>;
//   occupiedBy: Array<Races>;
// }

// interface CityConstructor extends PopulatedLocationConstructor {
//   leadBy: string;
// }

// class Area {
//   name: AreaConstructor["name"];
//   territoryOf: AreaConstructor["territoryOf"];
//   weather: AreaConstructor["weather"];
//   environment: AreaConstructor["environment"];
//   bordering: AreaConstructor["bordering"];
//   apartOf: AreaConstructor["apartOf"];
//   locatedWithin: AreaConstructor["locatedWithin"];

//   constructor({
//     name,
//     territoryOf,
//     weather,
//     environment,
//     bordering,
//     apartOf,
//     locatedWithin,
//   }: AreaConstructor) {
//     this.name = name;
//     this.territoryOf = territoryOf;
//     this.weather = weather;
//     this.environment = environment;
//     this.bordering = bordering.map((place) => ({ ...place }));
//     this.apartOf = apartOf;
//     this.locatedWithin = locatedWithin;
//   }
// }

// class PopulatedLocation extends Area {
//   population: PopulatedLocationConstructor["population"];
//   ReligionsE: PopulatedLocationConstructor["ReligionsE"];
//   occupiedBy: PopulatedLocationConstructor["occupiedBy"];
//   constructor(details: PopulatedLocationConstructor) {
//     super(details);
//     this.population = details.population;
//     this.ReligionsE = details.ReligionsE;
//     this.occupiedBy = details.occupiedBy;
//   }
// }

// class City extends PopulatedLocation {
//   leadBy: CityConstructor["leadBy"];

//   constructor(details: CityConstructor) {
//     super(details);
//     this.leadBy = details.leadBy;
//   }
// }

export interface questT {
  title: string;
  description: string;
  reward: number;
  type: "collect" | "subjugate" | "bounty";
}

interface gameDataInfo {
  name: string;
  type: string;
  weather: string | null;
  environment: string | null;
  population: number | null;
  religions: Array<string>;
  occupiedBy: string | null;
  ruler: string | null;
  rulingType: string | null;
  bordering: Array<string>;
  travel: Array<string>;
  quests: Array<string>;
}

type biomesT = "forest" | "plain";

type rarityT =
  | "common"
  | "uncommon"
  | "rare"
  | "special"
  | "legendary"
  | "mythic"
  | "unique";

export interface jsonDataT {
  locations: {
    hidar: { info: gameDataInfo };
    midgar: { info: gameDataInfo };
    migi: {
      info: gameDataInfo;
      kales: {
        info: gameDataInfo;
        cleodores: {
          info: gameDataInfo;
          cleodores: {
            info: gameDataInfo;
            [key in
              ("mayorsOffice" |
                "mercenaryGuild" |
                "jobsBoard" |
                "marketplace" |
                "guardsTower" |
                "cityGate" |
                "church")]: {
              max: number;
              unlockedAt: Array<string>;
              data: Array<locationActionT>;
            };
          };
        };
      };
    };
    penin: { info: gameDataInfo };
    isles: { info: gameDataInfo };
    travel: {
      [id: string]: {
        info: {
          name: string;
          type: biomesT;
        };
        encounterRates: {
          [mobId: string]: {
            chance: number;
            // N - noise, T - threat
            minN: number;
            maxN: number;
            minT: number;
            maxT: number;
          };
        };
        averageLevel: number;
        drops: {
          [itemId: string]: {
            [amount: string]: number;
          };
        };
        creatures: {
          [name: string]: {
            id: string;
          };
        };
        flora: {
          [name: string]: {
            id: string;
            getChance: {
              [quantity: string]: number;
            };
          };
        };
      };
    };
  };
  quests: {
    [questId: string]: questT;
  };
  loadingMessages: {
    dyk: Array<string>;
    tips: Array<string>;
    funFact: Array<string>;
  };
  creatures: {
    /* 
      custom regex for stats strings
      a-b+c-d*e-f
      a = min base stat; b = max base stat
      c = min growth stat; d = max growth stat
      e = min base stat growth multiplier; f = max base stat growth multiplier
      eg. 1-5+2-3*1-1.1 with a level of 10
      base stat between 1 and 5, lets choose 3
      stat growth between 2 and 3. lets choose 2,
      a multipler of between 1 and 1.1, lets choose 1.05
      the stat would have a value of (3 + 2 * 10) * 1.05^10 = 37
      (all values are min(floor(value),1))
      ie, the weakest would be 21, the strongest 90
      if a number doesn't appear, it is there in spirit
      1-2+1-2 = 1-2+1-2*1-1
      2*1.2 = 2-2+0-0*1.2-1.2
      +2 = 0-0+2-2*1-1
      etc.
    */
    monsters: {
      [id: string]: {
        name: string;
        drops: {
          [itemId: string]: {
            [amount: string]: number;
          };
        };
        stats: Record<stats, string>;
      };
    };
    animals: {
      [id: string]: {
        name: string;
        drops: {
          [itemId: string]: {
            [amount: string]: number;
          };
        };
      };
    };
    races: {
      [id: string]: {
        name: string;
      };
    };
  };
  flora: {
    [id: string]: {
      name: string;
      rarity: rarityT;
      yields: {
        [itemId: string]: number;
      };
    };
  };
  items: {
    [id: string]: {
      name: string;
      rarity: rarityT;
      stack: number;
    };
  };
}
