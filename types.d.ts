type tabT = "title" | "login-menu" | "character-creation" | "game-menu";

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

export interface characterSheetT {
  username: string;
  stats: Record<stats, number>;
}

export class gameData {
  private navigation: { current: tabT; previous: tabT | null };
  private user: {
    name: string;
    stats: Record<stats, number>;
    new: boolean;
  };
  private game;

  constructor() {
    this.navigation = {
      current: "title",
      previous: null,
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
    this.game = {};
  }

  get tab() {
    return this.navigation.current;
  }

  set tab(tab: tabT) {
    this.navigation.previous = this.navigation.current;
    this.navigation.current = tab;
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
    }
    return this;
  }

  get characterSheet(): characterSheetT {
    return {
      username: this.user.name,
      stats: this.user.stats,
    };
  }
}
