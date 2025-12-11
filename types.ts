import { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface CharacterClass {
  name: string;
  role: string;
  description: string;
  image: string;
  stats: {
    power: number;
    speed: number;
    magic: number;
  };
}

export interface GalleryItem {
  id: number;
  src: string;
  title: string;
  category: string;
}