import { warn } from "../utils";

export default class EventEmitter {
  constructor(names = []) {
    this.events = {};
    this.eventTypes = {};
    this.registerType(names);
  }

  on(type, fn, context = this) {
    this._checkInTypes(type);
    if (!this.events[type]) {
      this.events[type] = [];
    }

	// Warn: 直接引用参数 context 在小程序环境下会造成报错
    // this.events[type].push([fn, context]);
    this.events[type].push([fn]);
    return this;
  }

  once(type, fn, context = this) {
    this._checkInTypes(type);
    const magic = (...args) => {
      this.off(type, magic);

      fn.apply(context, args);
    };
    magic.fn = fn;

    this.on(type, magic);
    return this;
  }

  off(type, fn) {
    if (!type && !fn) {
      this.events = {};
      return this;
    }

    if (type) {
      this._checkInTypes(type);
      if (!fn) {
        this.events[type] = [];
        return this;
      }

      let events = this.events[type];
      if (!events) {
        return this;
      }

      let count = events.length;
      while (count--) {
        if (
          events[count][0] === fn ||
          (events[count][0] && events[count][0].fn === fn)
        ) {
          events.splice(count, 1);
        }
      }

      return this;
    }
  }

  trigger(type, ...args) {
    this._checkInTypes(type);
    let events = this.events[type];
    if (!events) {
      return;
    }

    let len = events.length;
    let eventsCopy = [...events];
    let ret;
    for (let i = 0; i < len; i++) {
      let event = eventsCopy[i];
      let [fn, context] = event;
      if (fn) {
        ret = fn.apply(context, args);
        if (ret === true) break;
      }
    }
    return ret;
  }

  registerType(names) {
    names.forEach(type => {
      this.eventTypes[type] = type;
    });
  }

  destory() {
    this.events = {};
    this.eventTypes = {};
  }

  _checkInTypes(type) {
    const types = this.eventTypes;
    const inTypes = types[type] === type;
    if (!inTypes) {
      warn(
        `EventEmitter has used unknown event type: "${type}", should be oneof [${Object.keys(
          types
        )}]`
      );
    }
  }
}
