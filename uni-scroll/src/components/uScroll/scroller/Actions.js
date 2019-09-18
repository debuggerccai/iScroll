import DirectionLockAction from "./DirectionLock";
import EventEmitter from "../base/EventEmitter";
import { Probe } from "../enums";

export default class ScrollerActions {
  constructor(scrollBehaviorX, scrollBehaviorY, options) {
    this.scrollBehaviorX = scrollBehaviorX;
    this.scrollBehaviorY = scrollBehaviorY;
    this.options = options;

    this.directionLockAction = new DirectionLockAction(
      options.directionLockThreshold,
      options.freeScroll,
      options.eventPassthrough
    );

    this.hooks = new EventEmitter(["scrollTo", 'start']);
  }

  handleStart(e) {
    const timestamp = +new Date();
    this.moved = false;

    this.startTime = timestamp;

    this.directionLockAction.reset();

    this.scrollBehaviorX.start();
    this.scrollBehaviorY.start();

    // this.
    this.scrollBehaviorX.reset
  }

  handlerMove(deltaX, deltaY, e) {
    const absDistX = this.scrollBehaviorX.getAbsDist(deltaX);
    const absDistY = this.scrollBehaviorY.getAbsDist(deltaY);
    const timestamp = +new Date();

    if (this.checkMomentum(absDistX, absDistY, timestamp)) {
      return true;
    }

    if (
      this.directionLockAction.checkoutMovingDirection(absDistX, absDistY, e)
    ) {
      return true;
    }

    const delta = this.directionLockAction.adjustDelta(deltaX, deltaY);

    const newX = this.scrollBehaviorX.move(delta.deltaX);
    const newY = this.scrollBehaviorY.move(delta.deltaY);

    this.scrollTo(newX, newY);
    this.updatePositions({ x: newX, y: newY });

    this.dispatchScroll(timestamp);
  }

  dispatchScroll(timestamp) {
    if (timestamp - this.startTime > this.options.momentumLimitTime) {
      this.startTime = timestamp;
      this.scrollBehaviorX.updateStartPos();
      this.scrollBehaviorY.updateStartPos();
      if (this.options.probeType === Probe.Throttle) {
        this.hooks.trigger(this.hooks.eventTypes.scroll, this.getCurrentPos());
      }
    }

    if (this.options.probeType > Probe.Throttle) {
      this.hooks.trigger(this.hooks.eventTypes.scroll, this.getCurrentPos());
    }
  }

  checkMomentum(absDistX, absDistY, timestamp) {
    return (
      timestamp - this.endTime > this.options.momentumLimitTime &&
      absDistY < this.options.momentumLimitDistance &&
      absDistX < this.options.momentumLimitDistance
    );
  }

  handlerEnd(e) {
    const currentPos = this.getCurrentPos();

    this.scrollBehaviorX.updateDirection();
    this.scrollBehaviorY.updateDirection();

    if (this.hooks.trigger(this.hooks.eventTypes.end, e, currentPos)) {
      return true;
    }

    this.scrollTo(currentPos.x, currentPos.y)
    this.updatePositions(currentPos);

    this.endTime = +new Date();

    const duration = this.endTime - this.startTime;

    this.hooks.trigger(this.hooks.eventTypes.scrollEnd, currentPos, duration);
  }

  getCurrentPos() {
    return {
      x: this.scrollBehaviorX.getCurrentPos(),
      y: this.scrollBehaviorY.getCurrentPos()
    };
  }

  updatePositions(pos) {
    this.scrollBehaviorX.updatePosition(pos.x);
    this.scrollBehaviorY.updatePosition(pos.y);
  }

  scrollTo(x, y, time, easying) {
    this.hooks.trigger(this.hooks.eventTypes.scrollTo, x, y, time, easying);
  }
}
