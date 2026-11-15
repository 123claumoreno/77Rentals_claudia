import {loadFont as loadOutfit} from '@remotion/google-fonts/Outfit';
import {loadFont as loadCormorant} from '@remotion/google-fonts/CormorantGaramond';

export const outfit = loadOutfit('normal', {weights: ['300', '500', '600'], subsets: ['latin']}).fontFamily;
export const serif = loadCormorant('normal', {weights: ['500', '600'], subsets: ['latin']}).fontFamily;

export const C = {
  purpleDark: '#3A1248',
  purpleDeep: '#5E2370',
  purple: '#8B3FA1',
  gold: '#E3B23C',
  goldSoft: '#F2D58A',
  cream: '#FBF7F0',
};

export const FPS = 30;
