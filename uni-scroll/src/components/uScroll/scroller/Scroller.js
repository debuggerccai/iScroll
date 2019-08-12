import Behavior from "./Behavior";
import ScrollerActions from "./Actions";
import EventEmitter from "../base/EventEmitter";
import { createBehaviorOptions } from "./createOptions";

import { Direction } from "../enums";
import { bubbling } from "../utils";

export default class Scroller {
  constructor(classNameW, classNameC, options) {
    this.classNameW = classNameW;
    this.classNameC = classNameC;
    this.options = options;

    this.startTime = undefined;
    this.endTime = undefined;

    this.hooks = new EventEmitter([
      "scrollTo",
      "beforeStart",
      "touchEnd",
      "end"
    ]);

    const {
      left = true,
      right = true,
      top = true,
      bottom = true
    } = this.options.bounce;
    // direction X
    this.scrollBehaviorX = new Behavior(
      classNameW,
      classNameC,
      createBehaviorOptions(options, "scrollX", [left, right], {
        size: "width",
        position: "left"
      })
    );

    // direction Y
    this.scrollBehaviorY = new Behavior(
      classNameW,
      classNameC,
      createBehaviorOptions(options, "scrollX", [top, bottom], {
        size: "height",
        position: "top"
      })
    );

    this.actions = new ScrollerActions(
      this.scrollBehaviorX,
      this.scrollBehaviorY,
      this.options
    );

    this.init();
  }

  init() {
    this.bindActions();
  }

  bindActions() {
    const actions = this.actions;

    bubbling(actions.hooks, this.hooks, [
      {
        source: actions.hooks.eventTypes.start,
        target: this.hooks.eventTypes.beforeStart
      },
    ]);

    actions.hooks.on("scrollTo", this.scrollTo.bind(this));

    actions.hooks.on(actions.hooks.eventTypes.end, (e, pos) => {
      this.hooks.trigger(this.hooks.eventTypes.touchEnd, pos);

      if (this.hooks.trigger(this.hooks.eventTypes.end, pos)) {
        return true;
      }
    });

    actions.hooks.on(actions.hooks.eventTypes.scrollEnd, () => {});
  }

  /*
	-------------------------------------------------------
		TOUCH EVENT
	-------------------------------------------------------
	*/
  doTouchStart(e) {
    const touch = e.touches[0];
    const timestamp = +new Date();

    this.pointX = touch.pageX;
    this.pointY = touch.pageY;

    this.actions.handleStart(e);
  }

  doTouchMove(e) {
    let touch = e.touches[0];
    let point = e.changedTouches[0];
    let deltaX = point.pageX - this.pointX;
    let deltaY = point.pageY - this.pointY;
    this.pointX = point.pageX;
    this.pointY = point.pageY;

    this.actions.handlerMove(deltaX, deltaY, e);
  }

  doTouchEnd(e) {
    this.actions.handlerEnd(e);
  }

  /*
	-------------------------------------------------------
		EXEC PULL-DOWN && PULL-UP
	-------------------------------------------------------
	*/
  triggerPullToRefresh() {
    if (!this.options.pullDownRefresh) {
      return false;
    }
  }

  finishPullToRefresh() {
    this.pulling = false;
  }

  checkPullDown() {
    if (!this.options.pullDownRefresh) {
      return false;
    }

    const { threshold = 90, stop = 40 } = this.options.pullDownRefresh;

    if (
      this.scroll.directionY !== Direction.Negative ||
      this.scroll.Y < threshold
    ) {
      return false;
    }

    if (!this.pulling) {
      this.pulling = true;

      this.scroll.trigger("pullingDown");
    }

    this.scrollTo(
      this.scroll.x,
      stop,
      this.scroll.options.bounceTime,
      "bounce"
    );

    return this.pulling;
  }

  scrollTo(x, y, time, easying) {
    this.hooks.trigger(this.hooks.eventTypes.scrollTo, x, y, time, easying);
  }

  enable() {
    //   this.actions.enabled = true
  }

  resize() {
    if (!this.options.enable) {
      return;
    }

    clearTimeout(this.resizeTimeout);

    this.resizeTimeout = setTimeout(() => {
      this.refresh();
    }, this.options.resizePolling);
  }

  refresh() {
    this.scrollBehaviorX.refresh();
    this.scrollBehaviorY.refresh();
  }
}
