import {
  Goal,
  Volleyball,
  Zap,
  BetweenHorizontalEnd,
  Footprints,
  ChessKnight,
  Users,
  PersonStanding,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

interface SportCardStyle {
  cardColor: string;
  cardLight: string;
  cardIcon: LucideIcon;
}

export const sportCardStyles: Record<string, SportCardStyle> = {
  cricket: {
    cardColor: "#10a66a",
    cardLight: "#e4f8d9",
    cardIcon: Goal,
  },

  football: {
    cardColor: "#1677ff",
    cardLight: "#dceaff",
    cardIcon: Volleyball,
  },

  volleyball: {
    cardColor: "#8338ec",
    cardLight: "#eee3ff",
    cardIcon: Volleyball,
  },

  basketball: {
    cardColor: "#ff8500",
    cardLight: "#ffebd5",
    cardIcon: Volleyball,
  },

  badminton: {
    cardColor: "#ff3185",
    cardLight: "#ffe0ef",
    cardIcon: Zap,
  },

  "table tennis": {
    cardColor: "#08bfc3",
    cardLight: "#d9f8f8",
    cardIcon: BetweenHorizontalEnd,
  },

  athletics: {
    cardColor: "#ffad00",
    cardLight: "#fff2cf",
    cardIcon: Footprints,
  },

  chess: {
    cardColor: "#5146f5",
    cardLight: "#e2e0ff",
    cardIcon: ChessKnight,
  },

  kabaddi: {
    cardColor: "#ef4444",
    cardLight: "#fee2e2",
    cardIcon: Users,
  },

  "kho kho": {
    cardColor: "#f97316",
    cardLight: "#ffedd5",
    cardIcon: Footprints,
  },

  "tug of war": {
    cardColor: "#8b5cf6",
    cardLight: "#ede9fe",
    cardIcon: Users,
  },

  yoga: {
    cardColor: "#0ea5e9",
    cardLight: "#e0f2fe",
    cardIcon: PersonStanding,
  },

  "power lifting": {
    cardColor: "#d97706",
    cardLight: "#fef3c7",
    cardIcon: Goal,
  },
};