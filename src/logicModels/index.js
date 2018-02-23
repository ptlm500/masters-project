import React from 'react';
import generateANDGate from './gates/ANDGate';
import ANDGate from '../components/logic/ANDGate/ANDGate';
import generateORGate from './gates/ORGate';
import ORGate from '../components/logic/ORGate/ORGate';
import generateXORGate from './gates/XORGate';
import XORGate from '../components/logic/XORGate/XORGate';
import generateNANDGate from './gates/NANDGate';
import NANDGate from '../components/logic/NANDGate/NANDGate';
import generateNORGate from './gates/NORGate';
import NORGate from '../components/logic/NORGate/NORGate';
import generateXNORGate from './gates/XNORGate';
import XNORGate from '../components/logic/XNORGate/XNORGate';
import { generateToggleSwitch, ToggleSwitchIcon } from './inputs/ToggleSwitch';
import { generateLED, LEDIcon } from './outputs/LED';

const models = {
  'AND Gate': {
    generator: generateANDGate,
    icon: <ANDGate height={30} colour="black" />,
  },
  'OR Gate': {
    generator: generateORGate,
    icon: <ORGate height={30} colour="black" />,
  },
  'XOR Gate': {
    generator: generateXORGate,
    icon: <XORGate height={30} colour="black" />,
  },
  'NAND Gate': {
    generator: generateNANDGate,
    icon: <NANDGate height={30} colour="black" />,
  },
  'NOR Gate': {
    generator: generateNORGate,
    icon: <NORGate height={30} colour="black" />,
  },
  'XNOR Gate': {
    generator: generateXNORGate,
    icon: <XNORGate height={30} colour="black" />,
  },
  'Toggle Switch': {
    generator: generateToggleSwitch,
    icon: <ToggleSwitchIcon />,
  },
  'LED': {
    generator: generateLED,
    icon: <LEDIcon />,
  },
};

export default models;
