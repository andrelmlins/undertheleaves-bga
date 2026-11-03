class ChooseBeing implements Game {
  private handlers: any[];
  private terrainSelected: HTMLElement;
  private actionButton: HTMLButtonElement;
  private squareCandidates: number[][][] = [];
  private selectedSquare: number[][] | null = null;
  private squareButton: HTMLButtonElement;

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
      const beingTypes = Object.keys(notif.args.beings) as BeingType[];

      if (
        beingTypes.length == 1 &&
        notif.args.beings[beingTypes[0]].length == 1 &&
        !this.isWholeGroupSelection(beingTypes[0])
      ) {
        this.chooseTerrain(beingTypes[0], notif.args.beings[beingTypes[0]][0], notif.args);
        return;
      }

      this.setupSquareMarkers(notif.args);
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

    document.querySelectorAll('.undertheleaves-square-marker').forEach((el) => el.remove());

    this.terrainSelected = null;
    this.actionButton = null;
    this.squareCandidates = [];
    this.selectedSquare = null;
    this.squareButton = null;

    document.getElementById(`undertheleaves-player-beings-${playerId}`).classList.remove('selectable');
  }

  // Flirty ('leaf') offers whole 2x2 squares: the player clicks the center dot of the square
  // they want, and the piece goes there. Puddle/mushroom pairs still pick one space.
  private isWholeGroupSelection(beingType: BeingType): boolean {
    return beingType === 'leaf';
  }

  private setupSquareMarkers(args: ChooseBeingState) {
    this.squareCandidates = args.beings['leaf'] ?? [];

    const playerId = this.game.bga.players.getActivePlayerId();

    this.squareCandidates.forEach((square) => {
      const maxY = Math.max(...square.map((c) => c[1]));
      const topLeft = square.filter((c) => c[1] === maxY).sort((a, b) => a[0] - b[0])[0];
      const anchorDiv = this.game.games.beingsManager.getTerrainDiv(playerId, topLeft);

      if (!anchorDiv) {
        return;
      }

      const marker = document.createElement('div');
      marker.className = 'undertheleaves-square-marker selectable';
      anchorDiv.appendChild(marker);

      this.handlers.push(dojo.connect(marker, 'onclick', () => this.toggleSquareMarker(square, marker)));
    });
  }

  private toggleSquareMarker(square: number[][], marker: HTMLElement) {
    document.querySelectorAll('.undertheleaves-square-marker.selected').forEach((el) => el.classList.remove('selected'));

    if (this.selectedSquare === square) {
      this.selectedSquare = null;
    } else {
      this.selectedSquare = square;
      marker.classList.add('selected');
    }

    this.updateSquareButton();
  }

  private updateSquareButton() {
    if (this.squareButton) {
      this.squareButton.disabled = !this.selectedSquare;
    }
  }

  public onUpdateActionButtons(stateName: string, args: ChooseBeingState) {
    if (stateName === 'client_ChooseBeing') {
      this.squareCandidates = args.beings['leaf'] ?? [];

      for (const beingType in args.beings) {
        if (this.isWholeGroupSelection(beingType as BeingType)) {
          continue;
        }

        args.beings[beingType].forEach((terrains) => {
          this.game.statusBar.addActionButton(
            this.game.games.beingsManager.formatPiece(beingType),
            () => this.chooseTerrain(beingType, terrains, args),
            { color: 'secondary' },
          );
        });
      }

      if (this.squareCandidates.length > 0) {
        this.squareButton = this.game.statusBar.addActionButton(
          _('Place the dweller'),
          () => this.onClickSelectedSquare(),
          { disabled: true },
        );
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

  // The square's anchor cell (its top-left corner, always index 0) uniquely identifies it on
  // the server even when it overlaps another candidate square on the other 3 spaces.
  public onClickSquare(beingType: BeingType, group: number[][]) {
    const [x, y] = group[0];

    this.game.bga.actions.performAction('actChooseBeing', { beingType, x, y }).then(() => this.cleanupTerrain());
  }

  private onClickSelectedSquare() {
    if (this.selectedSquare) {
      this.onClickSquare('leaf', this.selectedSquare);
    }
  }

  public onClickTerrain(beingType: BeingType) {
    const x = parseInt(this.terrainSelected.dataset.x);
    const y = parseInt(this.terrainSelected.dataset.y);

    this.game.bga.actions.performAction('actChooseBeing', { beingType, x, y }).then(() => this.cleanupTerrain());
  }
}
