import { InstagramLink } from "@/components/InstagramLink";

export default function BottomContent() {
  return (
    <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 text-xs">
      <p className="text-center md:text-left text-gray-400">
        NPO yosemic Japan ©Copyright 2025 yosemic Ltd. All rights reserved
      </p>
      <InstagramLink color="white" />
    </div>
  );
}
