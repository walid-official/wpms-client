// src/constants/role.ts

export const ROLE = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  USER: "USER",
} as const

// Optional: for type safety
export type RoleType = (typeof ROLE)[keyof typeof ROLE]
