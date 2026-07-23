// In-memory access-token holders.
//
// Tokens are NEVER written to localStorage — the durable session lives in an
// HttpOnly cookie the backend sets at login (which JavaScript, and therefore any
// XSS payload, cannot read). These variables just mirror the current access
// token so plain (non-React) fetch helpers can attach the Authorization header.
// On a full page reload they start empty and are repopulated by a silent
// cookie-based refresh (see refreshAccessToken and the boot effect in App.jsx).
let _userAccess = null;
let _adminAccess = null;

export const setUserAccess = (t) => { _userAccess = t || null; };
export const getUserAccess = () => _userAccess;

export const setAdminAccess = (t) => { _adminAccess = t || null; };
export const getAdminAccess = () => _adminAccess;
