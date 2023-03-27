import BaseService from './BaseService'

interface UserProfile {
  name: string
  website: string
  bio: string
}

interface NewPassword {
  oldPassword: string
  password: string
  password2: string
}

export default class UserService extends BaseService {
  getUserProfile() {
    return this.client.get('/account/profile')
  }

  updateUserProfile(profile: UserProfile) {
    return this.client.post(`/account/profile`, profile)
  }

  updatePassword(form: NewPassword) {
    return this.client.post('/account/change_password', form)
  }
}
