import {
  BookOpen,
  Code2,
  Compass,
  Rocket,
  Settings,
  Terminal,
  Database,
  Globe,
  Shield,
  Puzzle,
  Layers,
  FileText,
  LucideIcon,
} from "lucide-react";

export const ICON_MAP: Record<string, LucideIcon> = {
  BookOpen,
  Code2,
  Compass,
  Rocket,
  Settings,
  Terminal,
  Database,
  Globe,
  Shield,
  Puzzle,
  Layers,
  FileText,
};

export function getDocIcon(iconName?: string | null): LucideIcon | null {
  if (!iconName) return null;
  return ICON_MAP[iconName] || null;
}