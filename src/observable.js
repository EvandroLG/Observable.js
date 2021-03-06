export default class Observable {
  constructor(subscribe) {
    this._subscribe = subscribe;
  }

  subscribe(observer) {
    return this._subscribe(observer);
  }

  retry(attempt) {
    return new Observable(observer => {
      let current = null;

      const processRequest = (currentAttempt) => {
        current = this.subscribe({
          next(value) {
            observer.next(value);
          },

          complete() {
            observer.complete();
          },

          error(err) {
            if (currentAttempt === 0) {
              observer.error(err);
            }

            processRequest(attempt - 1);
          },
        });
      };

      processRequest(attempt);

      return {
        unsubscribe() {
          current.unsubscribe();
        },
      };
    });
  }

  map(callback) {
    return new Observable(observer => {
      const subscription = this.subscribe({
        next(value) {
          observer.next(callback(value));
        },

        error(fail) {
          observer.error(fail);
        },
      });

      return {
        unsubscribe() {
          subscription.unsubscribe();
        },
      };
    });
  }

  filter(callback) {
    return new Observable(observer => {
      const subscription = this.subscribe({
        next(value) {
          if (callback(value)) {
            observer.next(value);
          }
        },

        error(fail) {
          observer.error(fail);
        },
      });
    });

    return {
      unsubscribe() {
        subscription.unsubscribe();
      },
    };
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
        },
      };
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
        },
      };
    });
  }


  static concat(..._observables) {
    return new Observable(observer => {
      const observables = [..._observables];
      let current = null;

      const processObservable = () => {
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
          },
        });
      };

      processObservable();

      return {
        unsubscribe() {
          current.unsubscribe();
        },
      };
    });
  }
}
