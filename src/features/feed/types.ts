export interface Post {
  text: string
  user: {
    id: number
    username: string
  }
  createdAt: string
}
