import EventEmitter from "../base/EventEmitter";
import { Direction } from "../enums";
import { getRect } from "../utils";

export default class Behavior {
  constructor(classNameW, classNameC, options) {
    this.hooks = new EventEmitter(["momentum", "end"]);
    this.classNameW = classNameW;
    this.classNameC = classNameC;
    this.options = options;
    this.currentPos = 0;
    this.startPos = 0;

    this.refresh();
  }

  start() {
    this.direction = Direction.Default;
    this.movingDirection = Direction.Default;
    this.dist = 0;
  }

  move(delta) {
    this.movingDirection =
      delta > 0
        ? Direction.Negative
        : delta < 0
        ? Direction.Positive
        : Direction.Default;

    let newPos = this.currentPos + delta;

    // Slow down or stop if outside of the boundaries
    if (newPos > this.minScrollPos || newPos < this.maxScrollPos) {
      if (
        (newPos > this.minScrollPos && this.options.bounces[0]) ||
        (newPos < this.maxScrollPos && this.options.bounces[1])
      ) {
        newPos = this.currentPos + delta / 3;
      } else {
        newPos =
          newPos > this.minScrollPos ? this.minScrollPos : this.maxScrollPos;
      }
    }

    return newPos;
  }

  end(duration) {
    let momentumInfo = { duration: 0 };

    const absDist = Math.abs(this.currentPos - this.startPos);

    if (
      this.options.momentum &&
      duration < this.options.momentumLimitTime &&
      absDist > this.options.momentumLimitDistance
    ) {
      const wrapperSize =
        (this.direction === Direction.Negative && this.options.bounces[0]) ||
        (this.direction === Direction.Positive && this.options.bounces[1])
          ? this.wrapperSize
          : 0;

      momentumInfo = this.hasScroll
        ? this.momentum(
            this.currentPos,
            this.startPos,
            duration,
            this.maxScrollPos,
            this.minScrollPos,
            wrapperSize,
            this.options
          )
        : this.hooks.trigger(this.hooks.eventTypes.end, momentumInfo);
    } else {
      this.hooks.trigger(this.hooks.eventTypes.end, momentumInfo);
    }
    return momentumInfo;
  }

  momentum(
    current,
    start,
    time,
    lowerMargin,
    upperMargin,
    wrapperSize,
    options = this.options
  ) {
    const distance = current - start;
    const speed = Math.abs(distance) / time;

    const { deceleration, swipeBounceTime, swipeTime } = options;
    const momentumData = {
      destination: current + (speed / deceleration) * (distance < 0 ? -1 : 1),
      duration: swipeTime,
      rate: 15
    };

    this.hooks.trigger(this.hooks.eventTypes.momentum, momentumData, distance);

    if (momentumData.destination < lowerMargin) {
      momentumData.destination = wrapperSize
        ? Math.max(
            lowerMargin - wrapperSize / 4,
            lowerMargin - (wrapperSize / momentumData.rate) * speed
          )
        : lowerMargin;
      momentumData.duration = swipeBounceTime;
    } else if (momentumData.destination > upperMargin) {
      momentumData.destination = wrapperSize
        ? Math.min(
            upperMargin + wrapperSize / 4,
            upperMargin + (wrapperSize / momentumData.rate) * speed
          )
        : upperMargin;
      momentumData.duration = swipeBounceTime;
    }
    momentumData.destination = Math.round(momentumData.destination);

    return momentumData;
  }

  updateDirection() {
    const absDist = Math.round(this.currentPos) - this.absStartPos;
    this.direction =
      absDist > 0
        ? Direction.Negative
        : absDist < 0
        ? Direction.Positive
        : Direction.Default;
  }

  async refresh() {
    const { size, position } = this.options.rect;
    const threshold = this.options.pullDownRefresh.threshold;

    const wrapperRect = await this.options.getRect(this.classNameW);
    this.wrapperSize = wrapperRect[size];

    const contentRect = await this.options.getRect(this.classNameC);
    this.contentSize = contentRect[size];

    this.relativeOffset = contentRect[position];

    this.minScrollPos = 0;
    this.maxScrollPos = this.wrapperSize - this.contentSize;

    if (this.maxScrollPos < 0) {
      this.maxScrollPos -= this.relativeOffset;
      this.minScrollPos = -this.relativeOffset;
    }

    this.hasScroll =
      this.options.scrollable && this.maxScrollPos < this.minScrollPos;
    if (!this.hasScroll) {
      this.maxScrollPos = this.minScrollPos;
      this.contentSize = this.wrapperSize;
    }

    this.direction = 0;
  }

  updatePosition(pos) {
    this.currentPos = pos;
  }

  getAbsDist(delta) {
    this.dist += delta;
    return Math.abs(this.dist);
  }

  getCurrentPos() {
    return Math.round(this.currentPos);
  }

  updateStartPos() {
    this.startPos = this.currentPos;
  }

  updateAbsStartPos() {
    this.absStartPos = this.currentPos;
  }

  resetStartPos() {
    this.updateStartPos();
    this.updateAbsStartPos();
  }

  destroy() {
    this.hooks.destroy();
  }
}
