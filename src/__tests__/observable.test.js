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

  describe('timeout', () => {
    jest.useFakeTimers();

    it('should call next and complete methods when setTimeout is completed', () => {
      const mockNext = jest.fn();
      const mockComplete = jest.fn();
      const timer = 500;

      Observable.timeout(timer).subscribe({
        next: mockNext,
        complete: mockComplete,
      });

      jest.runAllTimers();

      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), timer);
      expect(mockNext).toHaveBeenCalled();
      expect(mockComplete).toHaveBeenCalled();
    });

    it('should remove timeout when call unsubscribe method', () => {
      const timeout = Observable.timeout(500).subscribe();

      expect(clearTimeout).not.toHaveBeenCalled();
      timeout.unsubscribe();
      expect(clearTimeout).toHaveBeenCalled();
    });
  });
});
