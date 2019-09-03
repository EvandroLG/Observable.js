import Observable from '../observable';

function simulateChange(input, value) {
  input.value = value;
  input.dispatchEvent(new Event('change'));
}

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
        },
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
        },
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

  describe('map', () => {
    it('should receive the new value on every change', () => {
      document.body.innerHTML = `
        <input type="text">
      `;

      const input = document.querySelector('input');
      const changes = Observable.fromEvent(input, 'change');
      const mockNext = jest.fn();
      changes.map(e => e.target.value).subscribe({
        next: mockNext,
      });

      const firstValue = 'javascript';
      simulateChange(input, firstValue);
      const secondValue = 'lua';
      simulateChange(input, secondValue);

      expect(mockNext).toHaveBeenCalledTimes(2);
      expect(mockNext).toHaveBeenNthCalledWith(1, firstValue);
      expect(mockNext).toHaveBeenNthCalledWith(2, secondValue);
    });
  });

  describe('filter', () => {
    it('should', () => {
      document.body.innerHTML = `
        <input type="text">
      `;

      const input = document.querySelector('input');
      const changes = Observable.fromEvent(input, 'change');
      const mockNext = jest.fn();
      const firstValue = 'javascript';

      changes.filter(e => e.target.value === firstValue).subscribe({
        next: mockNext,
      });

      simulateChange(input, firstValue);

      const secondValue = 'lua';
      simulateChange(input, secondValue);

      expect(mockNext).toHaveBeenCalledTimes(1);
    });
  });
});
