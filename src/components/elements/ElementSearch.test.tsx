import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ElementSearch } from "./ElementSearch";

describe("<ElementSearch />", () => {
  it("renders the current value and an accessible label", () => {
    render(<ElementSearch value="oxy" onChange={() => {}} resultCount={1} />);
    const input = screen.getByRole("searchbox", { name: /search elements/i });
    expect(input).toHaveValue("oxy");
  });

  it("emits each keystroke through onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ElementSearch value="" onChange={onChange} resultCount={118} />);

    await user.type(screen.getByRole("searchbox"), "Fe");

    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenNthCalledWith(1, "F");
    expect(onChange).toHaveBeenNthCalledWith(2, "e");
  });

  it("pluralizes the match count correctly", () => {
    const { rerender } = render(
      <ElementSearch value="" onChange={() => {}} resultCount={1} />,
    );
    expect(screen.getByText("1 match")).toBeInTheDocument();

    rerender(<ElementSearch value="" onChange={() => {}} resultCount={5} />);
    expect(screen.getByText("5 matches")).toBeInTheDocument();
  });
});
