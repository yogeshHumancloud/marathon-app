import axios from "axios";
import { baseURL } from "../constants";
import { store } from "../reduxToolkit/store";

const getToken = async (isRefreshToken) => {
  try {
    // const value = await AsyncStorage.getItem('persist:rempo');
    // const jsonValue = JSON.parse(value);
    const jsonValue = store.getState()?.user;

    if (jsonValue !== null) {
      // const user = JSON.parse(jsonValue.userData);
      const user = jsonValue.user;

      if (isRefreshToken && user?.tokens?.refresh?.token) {
        return { token: user?.tokens?.refresh?.token, user };
      }
      if (user?.tokens?.access?.token) {
        return user?.tokens?.access?.token;
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (e) {
    console.log(e);
    return null;
  }
};

const client = axios.create({
  baseURL: baseURL,
  responseType: "json",
  headers: {
    Accept: "application/json",
  },
});

// getToken().then(e => {
//   console.log(e);
//   client = axios.create({
//     baseURL: baseURL,
//     responseType: 'json',
//     headers: {
//       Accept: 'application/json',
//       Authorization: `Bearer ${e}`,
//     },
//   });
// });

// Login
export const login = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await client.post("v1/auth/login/", body);
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const sendOTP = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await client.post("v1/auth/send-otp-sms/", body);
      resolve(response.data);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

export const verifyOTP = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await client.post("v1/auth/verify-otp-sms/", body);
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const getEventData = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await client.get("/v1/events/651ffd270eadceeba1ba2fda");
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const getEventBibs = async (body) => {
  return new Promise(async (resolve, reject) => {
    const queryParams = [];

    if (body.query) {
      queryParams.push(`query=${encodeURIComponent(body.query)}`);
    }

    if (body.type) {
      queryParams.push(`type=${encodeURIComponent(body.type)}`);
    }

    if (body.page) {
      queryParams.push(`page=${encodeURIComponent(body.page)}`);
    }

    if (body.sortBy) {
      queryParams.push(`sortBy=${encodeURIComponent(body.sortBy)}`);
    }

    if (body.limit) {
      queryParams.push(`limit=${encodeURIComponent(body.limit)}`);
    }
    try {
      const response = await client.get(
        `/v1/events/651ffd270eadceeba1ba2fda/getBibs${
          queryParams.length > 0 ? "?" + queryParams.join("&") : ""
        }`
      );
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const getRefreshToken = async () => {
  const refreshToken = await getToken(true);
  console.log(refreshToken);
  return new Promise(async (resolve, reject) => {
    try {
      const response = await client.post("v1/auth/refresh-tokens", {
        refreshToken: refreshToken?.token,
      });
      const respo = response.data;
      store.dispatch({
        type: "updateUser",
        payload: { ...refreshToken?.user, tokens: { ...respo } },
      });
      resolve();
    } catch (error) {
      console.log(error);
      store.dispatch({
        type: "deleteUser",
      });
      reject(error?.response?.data || error);
    }
  });
};

client.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
client.interceptors.response.use(
  async (response) => {
    /* console.log(
      `%c ${response.status} - ${getUrl(response.config)}:`,
      'color: #008000; font-weight: bold',
      response,
    ); */

    return response;
  },
  async (error) => {
    /* console.log(
      `%c ${error.response.status} - ${getUrl(error.response.config)}:`,
      'color: #a71d5d; font-weight: bold',
      error.response,
    ); */
    const originalConfig = error.config;
    if (error.response && !originalConfig._retry) {
      const { status } = error.response;
      if (status === 401) {
        originalConfig._retry = true;
        try {
          if (originalConfig.headers.Authorization) {
            await getRefreshToken();
          }
          return client(originalConfig);
        } catch (_error) {
          return Promise.reject(_error);
        }
      }
    }
    return Promise.reject(error);
  }
);
