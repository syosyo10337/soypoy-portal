"use client";

import type { StaticImageData } from "next/image";
import kenProfile from "./assets/amaken-profile.jpg";
import godoProfile from "./assets/godo-profile.webp";
import hibikiProfile from "./assets/hibiki-profile.png";
import hiromuProfile from "./assets/hiromu-profile.jpg";
import hisProfile from "./assets/his-profile.jpg";
import kazaneProfile from "./assets/kazane-profile.jpg";
import masaProfile from "./assets/masa-profile.png";
import michaelProfile from "./assets/michael-profile.jpg";
import miyachiProfile from "./assets/miyachi-profile.jpg";
import mizukiProfile from "./assets/mizuki-profile.jpg";
import niinoProfile from "./assets/niino-profile.jpg";
import okutaniProfile from "./assets/okutani-profile.png";
import taitoProfile from "./assets/taito-profile.webp";

export interface Member {
  id: string;
  name: string;
  role: string[];
  profileImage?: string | StaticImageData;
}

export const MEMBERS: Member[] = [
  {
    id: "1",
    name: "Taito Katsumata",
    role: ["Writer"],
    profileImage: taitoProfile,
  },
  {
    id: "2",
    name: "Hisaaki Matsuda",
    role: ["Back Officer"],
    profileImage: hisProfile,
  },
  {
    id: "3",
    name: "Michael Yoshioka",
    role: ["Director"],
    profileImage: michaelProfile,
  },
  {
    id: "4",
    name: "Genki Miyachi",
    role: ["Engineer"],
    profileImage: miyachiProfile,
  },
  {
    id: "5",
    name: "Hibiki Ueda",
    role: ["Jazz Musician"],
    profileImage: hibikiProfile,
  },
  {
    id: "6",
    name: "Mizuki Araki",
    role: ["Manager"],
    profileImage: mizukiProfile,
  },
  {
    id: "7",
    name: "Masanao Takahashi",
    role: ["Drummer", "Engineer"],
    profileImage: masaProfile,
  },
  {
    id: "8",
    name: "Mizuki Niino",
    role: ["Communication Designer"],
    profileImage: niinoProfile,
  },
  {
    id: "9",
    name: "Hina Okutani",
    role: ["Art Director"],
    profileImage: okutaniProfile,
  },
  {
    id: "10",
    name: "Kazane",
    role: ["Actor", "Script Writer"],
    profileImage: kazaneProfile,
  },
  {
    id: "11",
    name: "Hiromu Kondo",
    role: ["Pianist"],
    profileImage: hiromuProfile,
  },
  {
    id: "12",
    name: "Godo Ouchi",
    role: ["Comedian"],
    profileImage: godoProfile,
  },
  {
    id: "13",
    name: "Ken Amanome",
    role: ["Dancer", "Physical Therapist"],
    profileImage: kenProfile,
  },
];
