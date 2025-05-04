import {HTTPClient} from '../core/HTTPClient';

export interface SignUpData {
  first_name: string;
  second_name: string;
  login: string;
  email: string;
  password: string;
  phone: string;
}

export interface SignInData {
  login: string;
  password: string;
}

export interface UserData {
  id: number;
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
  avatar: string;
}

export class AuthService {
  private readonly apiUrl = 'https://ya-praktikum.tech/api/v2';

  async signUp(data: SignUpData): Promise<{id: number}> {
    const response = await HTTPClient.post(`${this.apiUrl}/auth/signup`, {
      data,
    });
    return JSON.parse(response.responseText);
  }

  async signIn(data: SignInData): Promise<void> {
    await HTTPClient.post(`${this.apiUrl}/auth/signin`, {
      data,
    });
  }

  async getUser(): Promise<UserData> {
    const response = await HTTPClient.get(`${this.apiUrl}/auth/user`);
    return JSON.parse(response.responseText);
  }

  async logout(): Promise<void> {
    await HTTPClient.post(`${this.apiUrl}/auth/logout`);
  }
}
