import {
  LayoutGrid, Rocket, Star, Zap, Code2, BookOpen,
  Briefcase, Camera, Music, Globe, Heart, Coffee,
  Flame, Target, Trophy, Lightbulb, Palette, Package,
  ShoppingCart, Users, FileText, Map, Cpu, Database,
  type LucideIcon,
} from "lucide-react"

export const BOARD_ICONS: { name: string; Icon: LucideIcon }[] = [
  { name: "LayoutGrid",   Icon: LayoutGrid },
  { name: "Rocket",       Icon: Rocket },
  { name: "Star",         Icon: Star },
  { name: "Zap",          Icon: Zap },
  { name: "Code2",        Icon: Code2 },
  { name: "BookOpen",     Icon: BookOpen },
  { name: "Briefcase",    Icon: Briefcase },
  { name: "Camera",       Icon: Camera },
  { name: "Music",        Icon: Music },
  { name: "Globe",        Icon: Globe },
  { name: "Heart",        Icon: Heart },
  { name: "Coffee",       Icon: Coffee },
  { name: "Flame",        Icon: Flame },
  { name: "Target",       Icon: Target },
  { name: "Trophy",       Icon: Trophy },
  { name: "Lightbulb",    Icon: Lightbulb },
  { name: "Palette",      Icon: Palette },
  { name: "Package",      Icon: Package },
  { name: "ShoppingCart", Icon: ShoppingCart },
  { name: "Users",        Icon: Users },
  { name: "FileText",     Icon: FileText },
  { name: "Map",          Icon: Map },
  { name: "Cpu",          Icon: Cpu },
  { name: "Database",     Icon: Database },
]

export const DEFAULT_ICON = BOARD_ICONS[0]

export const getIcon = (name: string): LucideIcon =>
  BOARD_ICONS.find(i => i.name === name)?.Icon ?? DEFAULT_ICON.Icon

export const BOARD_COLORS = [
  { hex: "#f97316", label: "Orange" },
  { hex: "#3b82f6", label: "Blue" },
  { hex: "#10b981", label: "Green" },
  { hex: "#8b5cf6", label: "Purple" },
  { hex: "#ec4899", label: "Pink" },
  { hex: "#f59e0b", label: "Amber" },
  { hex: "#ef4444", label: "Red" },
  { hex: "#06b6d4", label: "Cyan" },
  { hex: "#64748b", label: "Slate" },
  { hex: "#1e2433", label: "Dark" },
]

export const DEFAULT_COLOR = BOARD_COLORS[0].hex