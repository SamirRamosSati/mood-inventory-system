export function getAvatarInitials(name: string): string {
  return name.charAt(0).toUpperCase();
}

const avatarColors = [
  "bg-gradient-to-br from-blue-500 to-purple-600",
  "bg-gradient-to-br from-pink-500 to-rose-600",
  "bg-gradient-to-br from-green-500 to-emerald-600",
  "bg-gradient-to-br from-yellow-500 to-orange-600",
  "bg-gradient-to-br from-indigo-500 to-blue-600",
  "bg-gradient-to-br from-purple-500 to-pink-600",
  "bg-gradient-to-br from-teal-500 to-cyan-600",
  "bg-gradient-to-br from-red-500 to-pink-600",
];

export function getAvatarStyle(avatarColor?: string): string {
  return avatarColor || "bg-gradient-to-br from-blue-500 to-purple-600";
}

export function getRandomAvatarColor(): string {
  return avatarColors[Math.floor(Math.random() * avatarColors.length)];
}
