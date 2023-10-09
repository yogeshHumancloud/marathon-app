import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistStore, persistReducer } from "redux-persist";

const rootReducer = combineReducers({
  user: userReducer,
});

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
