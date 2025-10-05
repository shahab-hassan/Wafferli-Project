export type Author = "me" | "them"

export type ChatMessage =
  | {
      id: string
      author: Author
      type: "text"
      text: string
      createdAt: Date
    }
  | {
      id: string
      author: Author
      type: "location"
      location: {
        lat: number
        lng: number
        label?: string
        address?: string
        mapImageUrl: string
        mapsLink: string
      }
      createdAt: Date
    }
