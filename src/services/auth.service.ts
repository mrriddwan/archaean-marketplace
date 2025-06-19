import axios from "axios";

export interface IRefreshTokenResponse {
    access_token: string,
    expires_in: number,
    id_token: string,
    refresh_token: string,
    scope: string,
    token_type: string,
}

export interface IAuthCodeResponse {
    authuser: string,
    code: string,
    hd: string,
    prompt: "consent",
}

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const googleClientSecret = import.meta.env.VITE_GOOGLE_CLIENT_SECRET;
class AuthService {
    async getUserGoogleInfo(access_token: string) {
        const userInfo = axios.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
                params: {
                    access_token,
                },
            }
        );

        return userInfo
    };

    async getRefreshToken(authCode: string) {
        let payload = {
            grant_type: 'authorization_code',
            code: authCode,
            client_id: googleClientId,
            client_secret: googleClientSecret,
            redirect_uri: 'http://localhost:5173',
        };

        try {
            const res = await axios.post(`https://oauth2.googleapis.com/token`, payload, {
                headers: {
                    'Content-Type': 'application/json;',
                },
            })

            return res
        } catch (error) {
            console.log(error)
        }


    };

    async getNewAccessToken(refresh_token: string) {
        // get new access token using refresh token
        let payloadForAccessToken = {
            grant_type: 'refresh_token',
            refresh_token,
            client_id: googleClientId,
            client_secret: googleClientSecret,
        };

        axios
            .post(`https://oauth2.googleapis.com/token`, payloadForAccessToken, {
                headers: {
                    'Content-Type': 'application/json;',
                },
            })
            .then((res: any) => {
                return res;
            })
            .then((res) => {
                console.log('new token response: ', res);
            })
            .catch((err) => console.log('err: ', err));
    };
}

export const authService = new AuthService();