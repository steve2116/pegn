type tabT = "title" | "login-menu" | "character-creation";

type loginGuestT = {
  username: string;
};

export class gameData {
  private navigation: { current: tabT; previous: tabT | null };
  private user: { name: string };
  private game;

  constructor() {
    this.navigation = {
      current: "title",
      previous: null,
    };
    this.user = {
      name: "default name",
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
}
