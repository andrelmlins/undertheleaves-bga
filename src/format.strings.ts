const BOLD_ARGS_VALUE = ['count_beings', 'count_label', 'size_label'];
const BOLD_ARGS_I18N = ['color_name'];

class FormatStrings {
  constructor(
    public game: UndertheLeavesGame,
    public args: Record<string, any>,
  ) {}

  public format() {
    Object.keys(this.args).forEach((key) => {
      if (BOLD_ARGS_VALUE.includes(key) && this.args[key] !== undefined) {
        this.args[key] = `<b>${this.args[key]}</b>`;
      }
    });

    Object.keys(this.args).forEach((key) => {
      if (BOLD_ARGS_I18N.includes(key) && this.args[key] !== undefined) {
        this.args[key] = `<b>${_(this.args[key])}</b>`;
      }
    });

    if (this.args.tile_image) {
      this.args.tile_image = this.game.games.tileManager.formatTile(this.args.tile_image, true);
    }

    if (this.args.being_icon) {
      this.args.being_icon = `<div class="undertheleaves-piece notif" piece="${this.args.being_icon}"></div>`;
    }

    if (this.args.previous_player !== undefined) {
      this.args.previous_player = this.game.bga.players.getFormattedPlayerName(this.args.previous_player, {});
    }

    if (this.args.burly_image) {
      const tree = this.game.gamedatas.cards.tree;
      // Same crop as CardManager.formatCard, but without a DOM id: safe to embed multiple times
      // in the game log without colliding with the actual card element (or with itself, across log entries).
      this.args.burly_image = tree
        ? `<div class="undertheleaves-card undertheleaves-card-mini notif" line="${tree.position.row}" column="${tree.position.column}"></div>`
        : '';
    }
  }
}
