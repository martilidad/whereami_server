

export interface GfycatResponse {
  gfycats: Array<Gfycat>
}

export interface Gfycat {
  webmUrl: string
  title: string
}

export interface TaggedVideo {
  src: string
  tag: string
}