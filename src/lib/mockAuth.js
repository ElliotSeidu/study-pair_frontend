const USERS_KEY = "studypair_mock_users";
const SESSION_KEY = "studypair_current_user";

export class AuthError extends Error {
  constructor(field, message) {
    super(message);
    this.field = field; // lets us attach the error to the right form field
  }
}

function delay(ms = 600) {
  return new Promise((r) => setTimeout(r, ms));
}

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function setSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export async function mockSignUp({ fullName, email, referenceId, password }) {
  await delay();
  const users = readUsers();

  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new AuthError("email", "An account with this email already exists. Try signing in instead.");
  }
  if (users.some((u) => u.referenceId === referenceId)) {
    throw new AuthError("referenceId", "This index number is already registered to another account.");
  }

  const newUser = {
    id: crypto.randomUUID(),
    fullName,
    email,
    referenceId,
    password, // ⚠️ plain-text, mock-only — never do this with a real backend
    profileComplete: false,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  writeUsers(users);

  const safeUser = { ...newUser };
  delete safeUser.password;
  setSession(safeUser);
  return safeUser;
}

export async function mockSignIn({ email, password }) {
  await delay();
  const users = readUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    throw new AuthError("email", "No account found with this email. Try creating one instead.");
  }
  if (user.password !== password) {
    throw new AuthError("password", "Incorrect password. Please try again.");
  }

  const safeUser = { ...user };
  delete safeUser.password;
  setSession(safeUser);
  return safeUser;
}

export async function mockUpdateProfile(userId, updates) {
  await delay(400);
  const users = readUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) throw new Error("User not found");

  users[idx] = { ...users[idx], ...updates, profileComplete: true };
  writeUsers(users);

  const safeUser = { ...users[idx] };
  delete safeUser.password;
  setSession(safeUser);
  return safeUser;
}