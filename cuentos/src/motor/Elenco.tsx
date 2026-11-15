/* The cast line-up: dad, mom (with and without hat), girl, boy and the golden dog. */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Dog, Filters, LOOKS, P, Paper, Person, Sketch} from '../story/kit';
import {Mom} from '../cuento/people';

export const Elenco: React.FC = () => (
  <AbsoluteFill style={{background: P.paper}}>
    <Filters />
    <Sketch>
      <Person look={LOOKS.dad} x={200} y={1100} s={1.15} />
      <Mom x={470} y={1100} s={1.15} wave smile="open" />
      <Person look={LOOKS.girl} x={720} y={1100} s={1.2} smile="open" />
      <Person look={LOOKS.boy} x={890} y={1100} s={1.2} armsUp smile="open" />
      <Mom x={330} y={1720} s={1.15} hat />
      <Mom x={680} y={1720} s={1.15} face={-1} breeze={1} armsUp smile="open" />
      <Dog x={930} y={1720} s={1.1} face={-1} />
    </Sketch>
    <Paper />
  </AbsoluteFill>
);
