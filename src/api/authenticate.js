import axios from "axios";

const fflApiUrl = "http://localhost:39826/api/Authenticate";

export async function authenticateLogin(username, password) {

    const result =
        await axios
            .post(`${fflApiUrl}/login`, { username, password })
            .catch((error) => {
                return error?.response;
            });
    return result?.data;
}

export async function getAccessTokenFromRefreshToken(accessToken, refreshToken) {

    const result =
        await axios
            .post(`${fflApiUrl}/refreshToken`, { accessToken, refreshToken })
            .catch((error) => {
                return error?.response;
            });
    return result?.data;
}

export async function sendEmailwithUserName(email) {

    const urlToPage = "http://localhost:3000/Login";
    const result =
        await axios
            .post(`${fflApiUrl}/send-forgot-username-email`, { email, urlToPage })
            .catch((error) => {
                return error?.response;
            });
    return result?.data;
}

export async function sendEmailwithPasswordReset(email) {

    const urlToPage = "http://localhost:3000/ResetPassword";
    const result =
        await axios
            .post(`${fflApiUrl}/send-reset-password-email`, { email, urlToPage })
            .catch((error) => {
                return error?.response;
            });
    return result?.data;
}

export async function resetPassword(email, code, password) {

    const result =
        await axios
            .post(`${fflApiUrl}/reset-password-from-code`, { email, code, password })
            .catch((error) => {
                return error?.response;
            });
    return result?.data;
}

export async function changePassword(userId, oldPassword, newPassword) {

    const result =
        await axios
            .post(`${fflApiUrl}/change-password/${userId}`, { oldPassword, newPassword })
            .catch((error) => {
                return error?.response;
            });
    return result?.data;
}