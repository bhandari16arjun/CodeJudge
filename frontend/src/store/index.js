import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore, createTransform } from "redux-persist";
import authReducer from "./authSlice";
import editorReducer from "./editorSlice";

const dayMs = 24 * 60 * 60 * 1000;

const pruneExpired = createTransform(
  (inbound) => inbound,
  (outbound) => {
    if (!outbound || !outbound.snippets) {
      return { snippets: {} };
    }

    const now = Date.now();
    const fresh = { snippets: {} };
    Object.entries(outbound.snippets).forEach(([userId, userSnips]) => {
      Object.entries(userSnips).forEach(([problemNumber, langMap]) => {
        Object.entries(langMap).forEach(([lang, entry]) => {
          if (now - entry.savedAt < dayMs) {
            fresh.snippets[userId] = fresh.snippets[userId] || {};
            fresh.snippets[userId][problemNumber] = fresh.snippets[userId][problemNumber] || {};
            fresh.snippets[userId][problemNumber][lang] = entry;
          }
        });
      });
    });

    return fresh;
  },
  { whitelist: ["editor"] }
);

const rootReducer = combineReducers({
  auth: authReducer,
  editor: editorReducer,
});

const persistConfig = {
  key: "root",
  storage,
  transforms: [pruneExpired],
  whitelist: ["auth", "editor"],
};

export const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
