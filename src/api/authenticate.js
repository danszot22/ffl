import axios from "axios";
import { fflapiurl, fflurl } from "./ffl";

export async function authenticateLogin(username, password) {
  const result = await axios
    .post(`${fflapiurl}/Authenticate/login`, { username, password })
    .catch((error) => {
      return error?.response;
    });
  return result?.data;
}

export async function getAccessTokenFromRefreshToken(
  accessToken,
  refreshToken
) {
  const result = await axios
    .post(`${fflapiurl}/Authenticate/refreshToken`, {
      accessToken,
      refreshToken,
    })
    .catch((error) => {
      return error?.response;
    });
  return result?.data;
}

export async function sendEmailwithUserName(email) {
  const urlToPage = `${fflurl}/Login`;
  const result = await axios
    .post(`${fflapiurl}/Authenticate/send-forgot-username-email`, {
      email,
      urlToPage,
    })
    .catch((error) => {
      return error?.response;
    });
  return result?.data;
}

export async function sendEmailwithPasswordReset(email) {
  const urlToPage = `${fflurl}/ResetPassword`;
  const result = await axios
    .post(`${fflapiurl}/Authenticate/send-reset-password-email`, {
      email,
      urlToPage,
    })
    .catch((error) => {
      return error?.response;
    });
  return result?.data;
}

export async function resetPassword(email, code, password) {
  const result = await axios
    .post(`${fflapiurl}/Authenticate/reset-password-from-code`, {
      email,
      code,
      password,
    })
    .catch((error) => {
      return error?.response;
    });
  return result?.data;
}

export async function changePassword(userId, oldPassword, newPassword) {
  const result = await axios
    .post(`${fflapiurl}/Authenticate/change-password/${userId}`, {
      oldPassword,
      newPassword,
    })
    .catch((error) => {
      return error?.response;
    });
  return result?.data;
}
