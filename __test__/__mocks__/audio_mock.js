jest.mock("tone", () => {
  const mockGainNode = {
    gain: {
      value: 1,
      setValueAtTime: jest.fn(),
    },
    connect: jest.fn(),
    disconnect: jest.fn(),
  };

  const mockContext = {
    createGain: jest.fn(() => mockGainNode),
    destination: {
      hasOwnProperty: jest.fn(() => true),
    },
  };

  return {
    getContext: jest.fn(() => mockContext),
    Gain: jest.fn(),
    PitchShift: jest.fn(),
    GrainPlayer: jest.fn(),
  };
});

function AudioContextMock() {
  this.destination = {};
  this.createGain = function () {
    return {};
  };
  this.createBufferSource = function () {
    return {};
  };
}

function AudioBufferMock() {}

window.AudioContext = window.AudioContext || AudioContextMock;
window.AudioBuffer = window.AudioBuffer || AudioBufferMock;
