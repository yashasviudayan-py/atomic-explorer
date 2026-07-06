import { describe, it, expect } from "vitest";
import { ELEMENTS, ELEMENTS_BY_SYMBOL, getElementBySymbol } from "./elements";
import { CATEGORY_META } from "@/lib/elementCategories";
import { parseAtomicMass } from "@/components/atom/atomUtils";
import type { ElementCategory, ElementBlock } from "@/types/element";

const VALID_BLOCKS: ElementBlock[] = ["s", "p", "d", "f"];

describe("ELEMENTS dataset", () => {
  it("contains exactly 118 elements", () => {
    expect(ELEMENTS).toHaveLength(118);
  });

  it("has contiguous atomic numbers 1..118 in order", () => {
    ELEMENTS.forEach((el, i) => {
      expect(el.atomicNumber).toBe(i + 1);
    });
  });

  it("has unique symbols and unique names", () => {
    const symbols = new Set(ELEMENTS.map((e) => e.symbol));
    const names = new Set(ELEMENTS.map((e) => e.name));
    expect(symbols.size).toBe(118);
    expect(names.size).toBe(118);
  });

  it("assigns every element a known category and block", () => {
    for (const el of ELEMENTS) {
      expect(Object.keys(CATEGORY_META)).toContain(el.category);
      expect(VALID_BLOCKS).toContain(el.block);
    }
  });

  it("keeps shell electron totals sane and positive", () => {
    for (const el of ELEMENTS) {
      expect(el.shells.length).toBeGreaterThan(0);
      expect(el.shells.every((n) => n > 0)).toBe(true);
      const total = el.shells.reduce((a, b) => a + b, 0);
      // A neutral atom's electrons equal its atomic number.
      expect(total).toBe(el.atomicNumber);
    }
  });

  it("has a parseable atomic mass at least as large as the proton count", () => {
    for (const el of ELEMENTS) {
      const mass = parseAtomicMass(el.atomicMass);
      expect(mass, `mass for ${el.symbol}`).not.toBeNull();
      expect(mass!).toBeGreaterThanOrEqual(el.atomicNumber);
    }
  });

  it("uses valid grid coordinates and period/group ranges", () => {
    for (const el of ELEMENTS) {
      expect(el.x).toBeGreaterThanOrEqual(1);
      expect(el.x).toBeLessThanOrEqual(18);
      expect(el.y).toBeGreaterThanOrEqual(1);
      expect(el.period).toBeGreaterThanOrEqual(1);
      expect(el.period).toBeLessThanOrEqual(7);
      if (el.group !== null) {
        expect(el.group).toBeGreaterThanOrEqual(1);
        expect(el.group).toBeLessThanOrEqual(18);
      }
    }
  });

  it("does not place two elements on the same grid cell", () => {
    const cells = new Set(ELEMENTS.map((e) => `${e.x},${e.y}`));
    expect(cells.size).toBe(ELEMENTS.length);
  });

  it("attaches a properties object with a name origin and uses to each element", () => {
    for (const el of ELEMENTS) {
      expect(el.properties, `properties for ${el.symbol}`).toBeDefined();
      expect(el.properties.nameOrigin.length).toBeGreaterThan(0);
      expect(el.properties.uses.length).toBeGreaterThan(0);
    }
  });

  it("gives f-block (lanthanide/actinide) elements a null group", () => {
    const fBlockCategories: ElementCategory[] = ["lanthanide", "actinide"];
    for (const el of ELEMENTS) {
      if (fBlockCategories.includes(el.category)) {
        expect(el.group, `${el.symbol} group`).toBeNull();
      }
    }
  });
});

describe("symbol lookup", () => {
  it("maps every element into ELEMENTS_BY_SYMBOL", () => {
    expect(Object.keys(ELEMENTS_BY_SYMBOL)).toHaveLength(118);
  });

  it("resolves symbols case-insensitively", () => {
    expect(getElementBySymbol("fe")?.name).toBe("Iron");
    expect(getElementBySymbol("FE")?.name).toBe("Iron");
    expect(getElementBySymbol("Fe")?.atomicNumber).toBe(26);
  });

  it("returns undefined for an unknown symbol", () => {
    expect(getElementBySymbol("Zz")).toBeUndefined();
  });
});
