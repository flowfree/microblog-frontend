import BaseService from './BaseService'

interface UserProfile {
  name: string
  website: string
  bio: string
}

export default class UserService extends BaseService {
  getUserProfile() {
    return this.client.get('/account/profile')
  }

  updateUserProfile(profile: UserProfile) {
    return this.client.post(`/account/profile`, profile)
  }
}
