import BaseService from './BaseService'


export default class PostService extends BaseService {
  getAllPosts() {
    return this.client.get('/posts')
  }

  addPost(text: string) {
    return this.client.post(`/posts`, { text })
  }
}
