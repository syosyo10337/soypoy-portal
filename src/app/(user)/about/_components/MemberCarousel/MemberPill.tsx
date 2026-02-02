import type { StaticImageData } from "next/image";
import Image from "next/image";
import { cn } from "@/utils/cn";

export interface MemberPillProps {
  name: string;
  role: string;
  profileImage?: string | StaticImageData;
  color: string;
}

export default function MemberPill({
  name,
  role,
  profileImage,
  color,
}: MemberPillProps) {
  const roles = role.split(/\s*\/\s*/);
  const names = name.split(/\s+/).filter((n) => n.trim() !== "");

  return (
    <div
      className={cn(
        "relative",
        "w-39 h-103",
        "rounded-[78px]",
        "pt-9 pb-10 px-6",
        "shrink-0",
        "transition-transform duration-200 ease-out",
        "hover:scale-105 active:scale-105",
      )}
      style={{ backgroundColor: color }}
    >
      {/* 役職（絶対配置・上部固定） */}
      <div
        className={cn(
          "absolute top-9 left-6 right-6 z-0",
          "font-display font-normal",
          "text-sm",
          "leading-4",
          "text-white text-center",
          "tracking-wide",
          "line-clamp-3",
        )}
      >
        {roles.map((role) => (
          <p key={role}>{role}</p>
        ))}
      </div>

      {/* 画像（絶対配置・中央固定） */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div
          className={cn(
            "relative",
            "w-28 h-28",
            "rounded-full",
            "overflow-hidden",
            "shrink-0",
            "bg-white/20",
          )}
        >
          {profileImage ? (
            <Image
              src={profileImage}
              alt={`${name}のプロフィール画像`}
              fill
              sizes="110px"
              className="object-cover"
              draggable={false}
            />
          ) : (
            <div className="w-full h-full bg-white/30" />
          )}
        </div>
      </div>

      {/* 名前（絶対配置・下部固定） */}
      <div
        className={cn(
          "absolute bottom-10 left-6 right-6 z-0",
          "font-display font-normal",
          "text-xl leading-5",
          "text-white text-center",
          "line-clamp-3",
        )}
      >
        {names.map((name) => (
          <p key={name}>{name}</p>
        ))}
      </div>
    </div>
  );
}
