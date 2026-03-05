class BgaLocalAnimation {
  private origin: HTMLElement;
  private destination: HTMLElement;
  private duration: number;
  private where: string = 'beforeend';
  private rotation: number = 0;
  private scale: number;

  private element: HTMLElement;
  private fromElement: HTMLElement;

  constructor(public game: UndertheLeavesGame) {}

  public setOptions(origin: HTMLElement, destination: HTMLElement, duration: number) {
    this.origin = origin;
    this.destination = destination;
    this.duration = duration;
  }

  public setToOptions(element: HTMLElement, fromElement: HTMLElement, duration: number) {
    this.element = element;
    this.fromElement = fromElement;
    this.duration = duration;
  }

  public setWhere(where: InsertPosition) {
    this.where = where;
  }

  public setRotation(rotation: number) {
    this.rotation = rotation;
  }

  public setScale(scale: number) {
    this.scale = scale;
  }

  public call(handle?: (node: HTMLElement) => void, handlePreAnim?: (node: HTMLElement) => void): Promise<void> {
    return new Promise(async (resolve, _) => {
      let animation = new BgaSlideAnimation({
        element: this.origin,
        duration: this.duration,
        rotationDelta: this.rotation,
        scale: this.scale,
      });

      await this.game.animationManager.play(
        new BgaAttachWithAnimation({
          animation,
          where: this.where,
          attachElement: this.destination,
          afterAttach: (element: HTMLElement) => handlePreAnim?.call(null, element),
        }),
      );

      if (handle) {
        handle(this.origin);
      }

      resolve();
    });
  }

  public callTo(handle: (node: HTMLElement) => void): Promise<void> {
    return new Promise(async (resolve, _) => {
      let animation = new BgaSlideAnimation({
        element: this.element,
        fromElement: this.fromElement,
        duration: this.duration,
        rotationDelta: this.rotation,
        scale: this.scale,
      });

      await this.game.animationManager.play(animation);

      handle(this.element);
      resolve();
    });
  }
}
