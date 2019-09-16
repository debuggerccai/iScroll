import EventEmitter from "./base/EventEmitter";
import { Options } from "./Options";
import Scroller from "./scroller/Scroller";
import { bubbling } from "./utils";

export default class UScroll extends EventEmitter {
  constructor(classNameW, classNameC, options) {
    super([
      "scrollTo",
      "refresh",
      "enable",
      "disable",
      "beforeScrollStart",
      "scrollStart",
      "scroll",
      "scrollEnd",
      "scrollCancel",
      "touchEnd",
      "flick",
      "destroy"
    ]);

    this.options = new Options().merge(options).process();
    this.hooks = new EventEmitter(["refresh", "enable", "disable", "destroy"]);

    this.init(classNameW, classNameC, this.options);
  }

  init(classNameW, classNameC, options) {
    this.scroller = new Scroller(classNameW, classNameC, options);

    this.eventBubbling();
    this.handleAutoBlur();
    this.innerRefresh();

    this.scroller.scrollTo(this.options.startX, this.options.startY);
    this.enable();
    this.proxy();
  }

  eventBubbling() {
    bubbling(this.scroller.hooks, this, [
      "scrollTo",
      "beforeScrollStart",
      "scrollStart",
      "scroll",
      "scrollEnd",
      "scrollCancel",
      "touchEnd",
      "flick"
    ]);
  }

  handleAutoBlur() {}

  proxy() {}

  refresh() {
    this.innerRefresh();
    this.scroller.resetPosition();
  }

  innerRefresh() {
    this.scroller.refresh();
    this.hooks.trigger(this.hooks.eventTypes.refresh);
    this.trigger(this.eventTypes.refresh);
  }

  resize() {
    this.scroller.resize();
  }

  enable() {
    this.scroller.enable();
    this.hooks.trigger(this.hooks.eventTypes.enable);
    this.trigger(this.eventTypes.enable);
  }

  disable() {
    this.scroller.disable();
    this.hooks.trigger(this.hooks.eventTypes.disable);
    this.trigger(this.eventTypes.disable);
  }

  destroy() {
    this.scoller.destroy();
    this.hooks.trigger(this.hooks.eventTypes.destroy);
    this.trigger(this.eventTypes.destroy);
  }
}
