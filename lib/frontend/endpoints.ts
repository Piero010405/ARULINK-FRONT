export const API_FRONTEND_ENDPOINTS = {
    AUTH: {
        LOGIN: "/api/auth/login",
        LOGOUT: "/api/auth/logout",
        REGISTER: "/api/auth/register",
        ME: "/api/auth/me",
        REFRESH: "/api/auth/refresh",
        CHANGE_PASSWORD: "/api/auth/change-password",
    },
    CHATS: {
        OVERVIEW: "/api/chats/overview",
        INTERACTION: (id: string) => `/api/chats/interaction/${id}`,
        INTERACTION_STREAM: (id: string) =>
        `/api/chats/interaction/${id}/stream`,
        INTERACTION_STATE: (id: string) =>
        `/api/chats/interaction/${id}/state`,
        CHAT_MESSAGES: (chatId: string) =>
        `/api/chats/chat/${chatId}/messages`,
        STREAM_ASSIGNED: "/api/chats/stream/assigned",
    },
};
