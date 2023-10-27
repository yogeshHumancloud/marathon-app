import axios from "axios";
import { baseURL } from "../constants";
import { store } from "../reduxToolkit/store";
import { deleteUser, setUser } from "../reduxToolkit/user/userSlice";

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

export const getEvents = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await client.get(
        `/v1/events${data && data?.type ? `?type=${data?.type}` : ""}`
      );
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const getEventData = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await client.get(`/v1/events/${data.event_id}`);
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const getWorkoutList = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await client.get(`/v1/activity/workout`);
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const addActivity = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await client.post(`/v1/activity`, data);
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
        `/v1/events/${body.event_id}/getBibs${
          queryParams.length > 0 ? "?" + queryParams.join("&") : ""
        }`
      );
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const getRefreshToken = async (originalConfig) => {
  const refreshToken = await getToken(true);
  return new Promise(async (resolve, reject) => {
    try {
      const response = await client.post("v1/auth/refresh-tokens", {
        refreshToken: refreshToken?.token,
      });
      const respo = response.data;

      store.dispatch(setUser({ ...refreshToken?.user, tokens: { ...respo } }));
      const newConfig = {
        ...originalConfig,
        env: {
          ...originalConfig.env,
          headers: {
            ...originalConfig.env.headers,
            Authorization: `Bearer ${respo.access.token}`,
          },
        },
      };
      resolve(newConfig);
    } catch (error) {
      store.dispatch(deleteUser());
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
      if (status === 401 && !originalConfig.url?.includes("refresh-tokens")) {
        originalConfig._retry = true;
        try {
          const updatedConfig = await getRefreshToken(originalConfig);
          return client(updatedConfig);
        } catch (_error) {
          if (_error.code === 401) {
            store.dispatch(deleteUser());
          }
          return Promise.reject(_error);
        }
      }
    }
    return Promise.reject(error);
  }
);
