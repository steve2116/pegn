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
    }
  | {
      type: "speech";
      talk: Array<{ speaker: string; text: string }>;
    }
  | {
      type: "quest";
      quests: Array<string>;
      specialQuests: Array<string>;
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
    if (user === null || game === null) return { type: "none" };
    else {
      const data = { ...game.data[game.max < user ? game.max : user] };
      data.unlocks.forEach((path) => {
        path.split("/").reduce((acc, curr, ind, arr) => {
          if (ind === arr.length - 1) {
            acc[curr]++;
            return acc[curr];
          }
          return acc[curr];
        }, this.game.locations);
      });
      data.progress.forEach((path) => {
        path.split("/").reduce((acc, curr, ind, arr) => {
          if (ind === arr.length - 1) {
            const [place, increment]: [string, string] = curr.split("#");
            acc[place] += parseInt(increment);
            return acc[place];
          } else return acc[curr];
        }, this.game.locations);
      });
      // data.relocks.forEach((path) => {});
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
        };
      } else if (data.type === "speech") {
        return { type: "speech", talk: data.talk };
      } else return { type: "none" };
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

// enum Locations {
//   kcea = "Cleodores Earldom",
//   kcle = "Cleodores",
// }

// enum Kingdoms {
//   na = "None",
//   k = "Kingdom of Kales",
// }

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
  type: string;
}

interface gameDataInfo {
  name: string;
  type: string;
  weather: string | null;
  environment: string | null;
  population: number;
  religions: Array<string>;
  occupiedBy: string | null;
  ruler: string | null;
  rulingType: string | null;
  quests: Array<string>;
}

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
  };
  quests: {
    [questId: string]: questT;
  };
  loadingMessages: {
    dyk: Array<string>;
    tips: Array<string>;
  };
}
