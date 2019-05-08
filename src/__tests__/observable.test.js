import Observable from '../observable';

describe('observable', () => {
  describe('fromEvent', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <button>click me</button>
      `;
    });

    it('should receive a message when event was trigged', () => {
      const button = document.querySelector('button');
      const clicks = Observable.fromEvent(button, 'click');

      let result = null;
      clicks.subscribe({
        next(value) {
          result = value;
        }
      });

      button.click();

      expect(result).toBeDefined();
    });

    it('should remove event listener when call unsubscribe method', () => {
      const button = document.querySelector('button');
      const clicks = Observable.fromEvent(button, 'click');

      const observable = clicks.subscribe();
      observable.unsubscribe();

      let result = null;
      clicks.subscribe({
        next(value) {
          result = value;
        }
      });

      expect(result).toBeNull();
    });
  });
});
