export function getCookie(name) {
  if (typeof document === "undefined") return "";
  const pattern = `(?:^|; )${encodeURIComponent(name)}=`;
  const match = document.cookie.match(new RegExp(pattern + "([^;]*)"));
  return match ? decodeURIComponent(match[1]) : "";
}

export function setCookie(name, value, options = {}) {
  if (typeof document === "undefined") return;

  const {
    path = "/",
    maxAge, // seconds
    expires, // Date
    sameSite = "Lax",
    secure,
  } = options;

  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value ?? "")}`;
  if (path) cookie += `; Path=${path}`;
  if (typeof maxAge === "number") cookie += `; Max-Age=${maxAge}`;
  if (expires instanceof Date) cookie += `; Expires=${expires.toUTCString()}`;
  if (sameSite) cookie += `; SameSite=${sameSite}`;
  if (secure) cookie += `; Secure`;

  document.cookie = cookie;
}

export function deleteCookie(name, options = {}) {
  setCookie(name, "", { ...options, maxAge: 0 });
}
