export type Role = "Owner" | "Developer" | "Moderator" | "BuilderPro" | "Default"

export interface UserProfile {
  uid:         string
  displayName: string
  username:    string
  email:       string
  avatarUrl:   string
  role:        Role
  createdAt:   number
}

export interface Board {
  id:        string
  title:     string
  slug:      string 
  iconName:  string
  color:     string
  cardCount: number
  order:     number
  createdAt: number
  updatedAt: number
}

export type CardType = "note" | "todo" | "link" | "heading"

export interface BoardCard {
  id:        string
  type:      CardType
  content:   string
  title?:    string
  checked?:  boolean[]
  x:         number
  y:         number
  width:     number
  order:     number
  createdAt: number
  updatedAt: number
}