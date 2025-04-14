import {HTTPClient} from '../core/HTTPClient';

export interface UserProfileData {
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
}

export interface UserPasswordData {
  oldPassword: string;
  newPassword: string;
}

export interface UserSearchData {
  login: string;
}

export class UserService {
  private readonly apiUrl = 'https://ya-praktikum.tech/api/v2';

  async updateProfile(data: UserProfileData): Promise<UserProfileData> {
    const response = await HTTPClient.put(`${this.apiUrl}/user/profile`, {
      data,
    });
    return JSON.parse(response.responseText);
  }

  async updatePassword(data: UserPasswordData): Promise<void> {
    await HTTPClient.put(`${this.apiUrl}/user/password`, {
      data,
    });
  }

  async updateAvatar(data: FormData): Promise<UserProfileData> {
    const response = await HTTPClient.put(`${this.apiUrl}/user/profile/avatar`, {
      data,
    });
    return JSON.parse(response.responseText);
  }

  async searchUser(data: UserSearchData): Promise<UserProfileData[]> {
    const response = await HTTPClient.post(`${this.apiUrl}/user/search`, {
      data,
    });
    return JSON.parse(response.responseText);
  }
}
