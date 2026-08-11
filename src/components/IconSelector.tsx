"use client";

import {
  BookOpen,
  Code2,
  Compass,
  Rocket,
  Settings,
  Database,
  Globe,
  Shield,
} from "lucide-react";

export const AVAILABLE_ICONS = [
  { id: "BookOpen", label: "Book", icon: BookOpen },
  { id: "Code2", label: "Code", icon: Code2 },
  { id: "Compass", label: "Compass", icon: Compass },
  { id: "Rocket", label: "Rocket", icon: Rocket },
  { id: "Settings", label: "Settings", icon: Settings },
  { id: "Database", label: "Database", icon: Database },
  { id: "Globe", label: "Globe", icon: Globe },
  { id: "Shield", label: "Shield", icon: Shield },
];

interface IconSelectorProps {
  selectedIcon: string | null;
  onSelect: (icon: string) => void;
}

export default function IconSelector({
  selectedIcon,
  onSelect,
}: IconSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2 pt-1">
      {AVAILABLE_ICONS.map((item) => {
        const IconComponent = item.icon;
        const isSelected = selectedIcon === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-all border ${
              isSelected
                ? "bg-primary text-primary-foreground border-primary font-semibold ring-2 ring-primary/30 shadow-sm"
                : "bg-surface border-border text-text-secondary font-medium hover:text-text hover:bg-accent/20"
            }`}
          >
            <IconComponent size={14} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}