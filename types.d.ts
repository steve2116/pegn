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

type loginGuestT = {
  username: string;
};

interface characterSheetT {
  username: string;
  stats: Record<stats, number>;
}

interface gameDataGameT {
  locations: {
    cleodores: {
      mayorsOffice: {
        value: number;
        max: number;
        unlocked: boolean;
      };
      mercenaryGuild: {
        value: number;
        max: number;
        unlocked: boolean;
      };
      jobsBoard: {
        value: number;
        max: number;
        unlocked: boolean;
      };
      marketplace: {
        value: number;
        max: number;
        unlocked: boolean;
      };
      guardsTower: {
        value: number;
        max: number;
        unlocked: boolean;
      };
      cityGate: {
        value: number;
        max: number;
        unlocked: boolean;
      };
      church: {
        value: number;
        max: number;
        unlocked: boolean;
      };
    };
  };
}

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
        cleodores: {
          mayorsOffice: {
            value: 0,
            max: 0,
            unlocked: false,
          },
          mercenaryGuild: {
            value: 0,
            max: 1,
            unlocked: true,
          },
          jobsBoard: {
            value: 0,
            max: 0,
            unlocked: false,
          },
          marketplace: {
            value: 0,
            max: 0,
            unlocked: false,
          },
          guardsTower: {
            value: 0,
            max: 0,
            unlocked: false,
          },
          cityGate: {
            value: 0,
            max: 0,
            unlocked: false,
          },
          church: {
            value: 0,
            max: 0,
            unlocked: false,
          },
        },
      },
    };
  }

  get tab() {
    return this.navigation.tabStack.peak;
  }

  set tab(tab: tabT) {
    this.navigation.tabStack.next(tab);
  }

  get check() {
    return this.navigation.tabStack.previous;
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

  load(data: string): void {
    const decrypt = (data: string): string => {
      return CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8);
    };
    const { tab, user, game } = JSON.parse(decrypt(data));
    this.user = user;
    this.game = game;
    this.tab = tab;
  }

  locations(
    place: keyof gameDataGameT["locations"],
    area: string,
    index: boolean = false
  ): number | null {
    const { value, max } = this.game.locations[place][area] || {
      value: 0,
      max: 0,
    };
    if (value >= max) return null;
    else if (index) this.game.locations[place][area].value++;
    return value;
  }

  unlocked(path: string): boolean {
    return (
      path.split("/").reduce((acc, curr) => {
        return acc[curr];
      }, this.game.locations) || { unlocked: false }
    ).unlocked;
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

  get testingtesting() {
    return this.game;
  }
}

class tabStack {
  private tabs: Array<tabT>;

  constructor(startingTab?: tabT) {
    this.tabs = startingTab ? [startingTab] : [];
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
