import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EventType } from "@/domain/entities";
import { BubleLabel } from ".";

const meta = {
  title: "Components/BubleLabel",
  component: BubleLabel,
  tags: ["autodocs"],
  args: {
    variant: EventType.Music,
    size: 48,
  },
  argTypes: {
    variant: {
      control: "select",
      options: Object.values(EventType),
    },
  },
} satisfies Meta<typeof BubleLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllVariants: Story = {
  render: ({ size }) => (
    <div className="flex flex-wrap gap-4">
      {Object.values(EventType).map((variant) => (
        <BubleLabel key={variant} variant={variant} size={size} />
      ))}
    </div>
  ),
};
