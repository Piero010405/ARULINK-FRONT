// src/lib/api/endpoints.ts
// Endpoints de la API en FAST API - BACKEND
export const API_BACKEND_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    CHANGE_PASSWORD: '/auth/change-password',
    REFRESH: '/auth/refresh',
  },
  CHATS: {
    DELETE_CACHE: '/api/v1/chats/cache',
    OVER_VIEW: '/api/v1/chats/overview',
    GET_INTERACTION_BY_ID: (interaction_id: string) => `/api/v1/chats/${interaction_id}`,
    GET_INTERACTION_STREAM_BY_ID: (interaction_id: string) => `/api/v1/chats/${interaction_id}/stream`,
    UPDATE_INTERACTION_STATE_BY_ID: (interaction_id: string) => `/api/v1/chats/interactions/${interaction_id}/state`,
    POST_CHAT_BY_ID: (interaction_id: string) => `/api/v1/chats/${interaction_id}/messages`,
  },
  WEBHOOKS: {
    WAHA_POST : '/api/v1/webhooks/waha',
    EVENTOS_RECIENTES: '/api/v1/webhooks/events/recent',
    DELETE_EVENTO:'/api/v1/webhooks/events',
  },
  PRESENCE: {
    CONTACTOS: '/api/v1/presence/contacts',
    CONTACTOS_BY_ID: (contact_id: string) => `/api/v1/presence/contacts/${contact_id}`,
    DELETE_CONTACTOS: '/api/v1/presence/cache',
  }
} as const;