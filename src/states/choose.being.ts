class ChooseBeing implements Game {
  private handlers: any[];
  private terrainSelected: HTMLElement;
  private actionButton: HTMLButtonElement;

  constructor(public game: UndertheLeavesGame) {
    this.handlers = [];
  }

  public setup() {
    //
  }

  public onEnteringState(stateName: string, notif: Notif<ChooseBeingState>) {
    if (stateName === 'ChooseBeing' && this.game.bga.players.isCurrentPlayerActive()) {
      this.game.bga.states.setClientState('client_ChooseBeing', {
        descriptionmyturn: _('${you} must choose a dweller'),
      });
    } else if (stateName === 'client_ChooseBeing') {
      const beingTypes = Object.keys(notif.args.beings);

      if (beingTypes.length == 1 && notif.args.beings[beingTypes[0]].length == 1) {
        this.chooseTerrain(beingTypes[0], notif.args.beings[beingTypes[0]][0], notif.args);
      }
    } else if (stateName === 'client_ChooseTerrain') {
      const playerId = this.game.bga.players.getActivePlayerId();

      document.getElementById(`undertheleaves-player-beings-${playerId}`).classList.add('selectable');

      notif.args.beingTerrains.forEach((terrain) => {
        const terrainDiv = this.game.games.beingsManager.getTerrainDiv(playerId, terrain);
        terrainDiv.classList.add('selectable');

        this.handlers.push(
          dojo.connect(terrainDiv, 'onclick', () => {
            if (this.terrainSelected) {
              this.terrainSelected.classList.remove('selected');
            }

            if (
              this.terrainSelected?.dataset.x == terrainDiv.dataset.x &&
              this.terrainSelected?.dataset.y == terrainDiv.dataset.y
            ) {
              this.terrainSelected = null;
            } else {
              terrainDiv.classList.add('selected');
              this.terrainSelected = terrainDiv;
            }

            this.actionButton.disabled = !this.terrainSelected;
          }),
        );
      });
    }
  }

  public onLeavingState(stateName: string) {
    if (stateName === 'ChooseBeing') {
      this.cleanupTerrain();
    }
  }

  private cleanupTerrain() {
    const playerId = this.game.bga.players.getActivePlayerId();

    this.handlers.forEach((h) => dojo.disconnect(h));
    this.handlers = [];

    document
      .querySelectorAll('.undertheleaves-terrain.selectable, .undertheleaves-terrain.selected')
      .forEach((el) => el.classList.remove('selectable', 'selected'));

    this.terrainSelected = null;
    this.actionButton = null;

    document.getElementById(`undertheleaves-player-beings-${playerId}`).classList.remove('selectable');
  }

  public onUpdateActionButtons(stateName: string, args: ChooseBeingState) {
    if (stateName === 'client_ChooseBeing') {
      for (const beingType in args.beings) {
        args.beings[beingType].forEach((terrains) => {
          this.game.statusBar.addActionButton(
            this.game.games.beingsManager.formatPiece(beingType),
            () => this.chooseTerrain(beingType, terrains, args),
            { color: 'secondary' },
          );
        });
      }
      this.game.statusBar.addActionButton(_('Restart'), () => this.onClickRestart(), { color: 'alert' });
    } else if (stateName === 'client_ChooseTerrain') {
      this.actionButton = this.game.statusBar.addActionButton(
        _('Place the dweller'),
        () => this.onClickTerrain(args.beingType),
        { disabled: true },
      );
      this.game.statusBar.addActionButton(_('Restart'), () => this.onClickRestart(), { color: 'alert' });
    }
  }

  public setupNotifications() {
    //
  }

  public chooseTerrain(beingType: string, beingTerrains: number[][], args: ChooseBeingState) {
    this.game.bga.states.setClientState('client_ChooseTerrain', {
      descriptionmyturn: _('${you} must choose a plot of land for ${being_icon}'),
      args: { ...args, beingType, beingTerrains, being_icon: beingType },
    });
  }

  public onClickRestart() {
    this.game.bga.actions.performAction('actChooseBeingRestart');
  }

  public onClickTerrain(beingType: BeingType) {
    const x = parseInt(this.terrainSelected.dataset.x);
    const y = parseInt(this.terrainSelected.dataset.y);

    this.game.bga.actions.performAction('actChooseBeing', { beingType, x, y }).then(() => this.cleanupTerrain());
  }
}
