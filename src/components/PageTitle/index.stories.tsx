import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PageTitle } from ".";

const meta = {
  title: "Components/PageTitle",
  component: PageTitle,
  tags: ["autodocs"],
  args: {
    title: "Events",
  },
} satisfies Meta<typeof PageTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSubtitle: Story = {
  args: { subtitle: "Schedule" },
};
