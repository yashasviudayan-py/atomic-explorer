import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LessonCheckpoint } from "./LessonCheckpoint";
import type { LessonStep } from "@/types/lesson";

const checkpoint: NonNullable<LessonStep["checkpoint"]> = {
  question: "Which particles sit in the nucleus?",
  options: [
    {
      id: "a",
      text: "Protons and neutrons",
      isCorrect: true,
      explanation: "Right — the nucleus holds protons and neutrons.",
    },
    {
      id: "b",
      text: "Electrons only",
      isCorrect: false,
      explanation: "Electrons occupy energy levels around the nucleus.",
    },
  ],
};

describe("<LessonCheckpoint />", () => {
  it("renders the question and options as a radiogroup before answering", () => {
    render(
      <LessonCheckpoint
        checkpoint={checkpoint}
        selectedOptionId={null}
        onSelect={() => {}}
      />,
    );
    expect(
      screen.getByRole("radiogroup", { name: checkpoint.question }),
    ).toBeInTheDocument();
    const options = screen.getAllByRole("radio");
    expect(options).toHaveLength(2);
    // Nothing selected yet, so no explanation is shown.
    expect(screen.queryByText(/^Correct$/)).not.toBeInTheDocument();
    expect(screen.getByText(/pick an answer/i)).toBeInTheDocument();
  });

  it("reports the chosen option id through onSelect", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <LessonCheckpoint
        checkpoint={checkpoint}
        selectedOptionId={null}
        onSelect={onSelect}
      />,
    );
    await user.click(screen.getByRole("radio", { name: /electrons only/i }));
    expect(onSelect).toHaveBeenCalledWith("b");
  });

  it("locks the options and shows the correct explanation once answered", () => {
    render(
      <LessonCheckpoint
        checkpoint={checkpoint}
        selectedOptionId="a"
        onSelect={() => {}}
      />,
    );
    // All options disabled after answering.
    for (const option of screen.getAllByRole("radio")) {
      expect(option).toBeDisabled();
    }
    expect(screen.getByText("Correct")).toBeInTheDocument();
    expect(
      screen.getByText(/the nucleus holds protons and neutrons/i),
    ).toBeInTheDocument();
    // The selected option is marked checked.
    expect(
      screen.getByRole("radio", { name: /protons and neutrons/i }),
    ).toHaveAttribute("aria-checked", "true");
  });

  it("surfaces a corrective explanation for a wrong answer", () => {
    render(
      <LessonCheckpoint
        checkpoint={checkpoint}
        selectedOptionId="b"
        onSelect={() => {}}
      />,
    );
    expect(screen.getByText("Not quite")).toBeInTheDocument();
    expect(
      screen.getByText(/electrons occupy energy levels/i),
    ).toBeInTheDocument();
  });
});
