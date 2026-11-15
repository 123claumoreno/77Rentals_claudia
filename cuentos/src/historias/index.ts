/* Every story here becomes a video: Cuento-<id> (or the style's own prefix, e.g. Plantilla-<id>).
   Add new stories as files in this folder (copy macondo.ts or bienvenida.ts) and list them below. */
import {macondo} from './macondo';
import {bienvenida} from './bienvenida';
import {ejemploPlantilla} from './ejemplo-plantilla';
import type {Historia} from './tipos';

export const HISTORIAS: Historia[] = [macondo, bienvenida, ejemploPlantilla];
