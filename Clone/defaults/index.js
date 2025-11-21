import { Land01 } from './parts/lands/Land01.js';
import { Land02 } from './parts/lands/Land02.js';
import { Land03 } from './parts/lands/Land03.js';
import { Land04 } from './parts/lands/Land04.js';
import { Land05 } from './parts/lands/Land05.js';
import { Land06 } from './parts/lands/Land06.js';
import { Land07 } from './parts/lands/Land07.js';
import { Land08 } from './parts/lands/Land08.js';
import { Land09 } from './parts/lands/Land09.js';
import { Land10 } from './parts/lands/Land10.js';
import { Land11 } from './parts/lands/Land11.js';
import { Land12 } from './parts/lands/Land12.js';
import { Land13 } from './parts/lands/Land13.js';
import { Land14 } from './parts/lands/Land14.js';
import { Land15 } from './parts/lands/Land15.js';
import { Land16 } from './parts/lands/Land16.js';
import { Land17 } from './parts/lands/Land17.js';
import { Land18 } from './parts/lands/Land18.js';
import { Land19 } from './parts/lands/Land19.js';
import { Land20 } from './parts/lands/Land20.js';
import { Land21 } from './parts/lands/Land21.js';
import { Land22 } from './parts/lands/Land22.js';
import { Land23 } from './parts/lands/Land23.js';
import { Land24 } from './parts/lands/Land24.js';
import { Land25 } from './parts/lands/Land25.js';
import { Land26 } from './parts/lands/Land26.js';

import { Island01 } from './parts/lands/Island01.js';
import { Island02 } from './parts/lands/Island02.js';
import { Island03 } from './parts/lands/Island03.js';
import { Island04 } from './parts/lands/Island04.js';
import { Island05 } from './parts/lands/Island05.js';
import { Island06 } from './parts/lands/Island06.js';
import { Island07 } from './parts/lands/Island07.js';
import { Island08 } from './parts/lands/Island08.js';
import { Island09 } from './parts/lands/Island09.js';
import { Island10 } from './parts/lands/Island10.js';
import { Island11 } from './parts/lands/Island11.js';

export const DEFAULT_MODEL = {
  lands: {
    Land01, Land02, Land03, Land04, Land05, Land06, Land07, Land08, Land09, Land10,
    Land11, Land12, Land13, Land14, Land15, Land16, Land17, Land18, Land19, Land20,
    Land21, Land22, Land23, Land24, Land25, Land26,
    Island01, Island02, Island03, Island04, Island05, Island06, Island07, Island08, Island09, Island10, Island11
  },
  roads: [],
  poi: [],
  walls: [],
  rivers: [],
  grass: [],
  forest: [],
  mountains: [
    {
      "id": "mt-fire-west",
      "points": [[32, 30], [33, 38], [32, 46]],
      "width": 25
    },
    {
      "id": "mt-fire-north",
      "points": [[35, 22], [42, 23], [48, 22]],
      "width": 20
    },
    {
      "id": "mt-fire-east",
      "points": [[55, 35], [56, 40], [54, 45]],
      "width": 18
    },
    {
      "id": "mt-fire-central",
      "points": [[40, 32], [42, 29], [44, 32]],
      "shape": "triangle"
    }
  ]
};


