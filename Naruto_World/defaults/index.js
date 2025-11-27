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

import { CITIES } from './parts/cities.js';

export const DEFAULT_MODEL = {
  lands: {
    Land01, Land02, Land03, Land04, Land05, Land06, Land07, Land08, Land09, Land10,
    Land11, Land12, Land13, Land14, Land15, Land16, Land17, Land18, Land19, Land20,
    Land21, Land22, Land23, Land24, Land25, Land26,
    Land22_Island01: Island01, 
    Land22_Island02: Island02, 
    Land22_Island03: Island03, 
    Land22_Island04: Island04, 
    Land22_Island05: Island05, 
    Land22_Island06: Island06, 
    Land22_Island07: Island07, 
    Land22_Island08: Island08, 
    Land22_Island09: Island09, 
    Land22_Island10: Island10, 
    Land22_Island11: Island11
  },
  roads: [
    {
      "id": "bridge-1",
      "name": "Great Naruto Bridge",
      "type": "bridge",
      "width": 10,
      "points": [
        [55.26600895789845, 33.48376061305527],
        [57.89008899381446, 33.37482736130391]
      ],
      "desc": ""
    }
  ],
  poi: [
    ...CITIES
  ],
  walls: [],
  rivers: [],
  grass: [],
  forest: [],
  mountains: []
};


