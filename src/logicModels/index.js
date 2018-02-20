import generateANDGate from './gates/ANDGate';
import generateORGate from './gates/ORGate';
import generateXORGate from './gates/XORGate';
import generateToggleSwitch from './inputs/ToggleSwitch';
import generateLED from './outputs/LED';

const models = {
  'AND Gate': generateANDGate,
  'OR Gate': generateORGate,
  'XOR Gate': generateXORGate,
  'Toggle Switch': generateToggleSwitch,
  'LED': generateLED,
};

export default models;
