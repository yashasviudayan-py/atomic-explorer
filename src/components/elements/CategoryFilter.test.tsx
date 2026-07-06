import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CategoryFilter } from "./CategoryFilter";
import { CATEGORY_META, CATEGORY_ORDER } from "@/lib/elementCategories";

describe("<CategoryFilter />", () => {
  it("renders an 'All' chip plus one per category", () => {
    render(<CategoryFilter active="all" onChange={() => {}} />);
    const chips = screen.getAllByRole("button");
    expect(chips).toHaveLength(CATEGORY_ORDER.length + 1);
    expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument();
  });

  it("marks the active chip with aria-pressed", () => {
    render(<CategoryFilter active="noble-gas" onChange={() => {}} />);
    const active = screen.getByRole("button", {
      name: CATEGORY_META["noble-gas"].label,
    });
    expect(active).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("reports the selected category through onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<CategoryFilter active="all" onChange={onChange} />);

    await user.click(
      screen.getByRole("button", { name: CATEGORY_META["alkali-metal"].label }),
    );
    expect(onChange).toHaveBeenCalledWith("alkali-metal");
  });

  it("emits 'all' when the All chip is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<CategoryFilter active="metalloid" onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "All" }));
    expect(onChange).toHaveBeenCalledWith("all");
  });
});
