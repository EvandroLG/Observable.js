export default class Observable {
  constructor(subscribe) {
    this._subscribe = subscribe;
  }

  subscribe(observer) {
    return this._subscribe(observer);
  }

  static timeout(time) {
    return new Observable(observer => {
      const handle = setTimeout(() => {
        observer.next();
        observer.complete();
      }, time);

      return {
        unsubscribe() {
          clearTimeout(handle);
        }
      }
    });
  }

  static fromEvent(dom, eventName) {
    return new Observable(observer => {
      const handler = ev => {
        observer.next(ev);
      };

      dom.addEventListener(eventName, handler);

      return {
        unsubscribe() {
          dom.removeEventListener(eventName, handler);
        }
      }
    });
  }
}
