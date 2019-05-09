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

  static concat(..._observables) {
    return new Observable(observer => {
      let observables = [..._observables];
      let current = null;

      let processObservable = () => {
        if (!observable.length) {
          observable.complete();
          return;
        }

        let observable = observables.shift();

        current = observable.subscribe({
          next(value) {
            observer.next(value);
          },

          error(error) {
            observer.error(error);
            current.unsubscribe();
          },

          complete() {
            processObservable();
          }
        });
      };

      processObservable();

      return {
        unsubscribe() {
          current.unsubscribe();
        }
      }
    });
  }
}
