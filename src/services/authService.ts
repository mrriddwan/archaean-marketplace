import axios from "axios";

class AuthService {
    async fetchUserInfo(access_token: string) {
        const userInfo = axios.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
                params: {
                    access_token,
                    access_type: "offline",
                },
            }
        );

        return userInfo
    };
}

export const authService = new AuthService();