/**
 * Minimal ambient typings for `astronomia` (no official @types package).
 * Only the surface used by planetary-calculations.ts is declared.
 */
declare module 'astronomia' {
  export namespace planetposition {
    class Planet {
      constructor(data: unknown);
    }
  }
  export namespace solar {
    function apparentVSOP87(earth: planetposition.Planet, jde: number): { lon: number; lat: number; range: number };
  }
  export namespace moonposition {
    function position(jde: number): { lon: number; lat: number; range: number };
  }
  export namespace elliptic {
    function position(
      planet: planetposition.Planet,
      earth: planetposition.Planet,
      jde: number
    ): { ra: number; dec: number };
  }
  export namespace nutation {
    function meanObliquity(jde: number): number;
    function nutation(jde: number): [number, number];
  }
  export namespace coord {
    class Equatorial {
      constructor(ra: number, dec: number);
      toEcliptic(obliquity: number): { lon: number; lat: number };
    }
  }
  export namespace deltat {
    function deltaT(decimalYear: number): number;
  }
}

declare module 'astronomia/data/*' {
  const data: unknown;
  export default data;
}
