// @ts-ignore
GameGui = (function () {
  function GameGui() {}
  return GameGui;
})();

class UndertheLeavesGame extends GameGui<Player, UndertheLeavesGamedatas> {
  games: UndertheLeavesGames;

  animationManager: AnimationManager;

  scoreCtrl: Record<string, Counter>;

  constructor() {
    super();

    this.games = {
      tileManager: new TileManager(this),
      cardManager: new CardManager(this),
      playerManager: new PlayerManager(this),
      placeTile: new PlaceTile(this),
      beingsManager: new BeingsManager(this),
      chooseBeing: new ChooseBeing(this),
    };
  }

  public setup(gamedatas: UndertheLeavesGamedatas) {
    this.animationManager = new AnimationManager(this, {
      duration: 800,
    });

    document.getElementById('game_play_area').insertAdjacentHTML(
      'beforeend',
      `
        <div id="undertheleaves-box" class="undertheleaves-box">
          <div id="undertheleaves-cards" class="undertheleaves-cards"></div>
          <div id="undertheleaves-offer" class="undertheleaves-offer"></div>
        </div>
      `,
    );

    document
      .getElementById('page-title')
      .insertAdjacentHTML(
        'afterbegin',
        '<div id="undertheleaves-general-void-stock" class="undertheleaves-void-stock"></div>',
      );

    for (let gameName in this.games) {
      this.games[gameName].setup(gamedatas);
    }

    this.setupNotifications();
  }

  public bgaFormatText(log, args) {
    try {
      if (log && args && !args.processed) {
        const formatStrings = new FormatStrings(this, args);
        formatStrings.format();

        args = formatStrings.args;
        args.processed = true;
      }
    } catch (e) {
      console.error(log, args, 'Exception thrown', e.stack);
    }

    return { log, args };
  }

  public onEnteringState(stateName: string, notif: Notif<any>) {
    for (let gameName in this.games) {
      this.games[gameName].onEnteringState(stateName, notif);
    }
  }

  public onLeavingState(stateName: string) {
    for (let gameName in this.games) {
      this.games[gameName].onLeavingState(stateName);
    }
  }

  public onUpdateActionButtons(stateName: string, notif: any) {
    if (this.bga.players.isCurrentPlayerActive()) {
      for (let gameName in this.games) {
        this.games[gameName].onUpdateActionButtons(stateName, notif);
      }
    }
  }

  public setupNotifications() {
    for (let gameName in this.games) {
      this.games[gameName].setupNotifications();
    }
  }
}
