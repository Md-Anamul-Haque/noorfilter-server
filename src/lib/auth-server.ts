import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth, User } from "./auth";

// get role from session
export async function getRole() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user.role;
}

export async function getUserSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

export const withRoleAuth = <T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  allowedRole: "admin" | "user" | "*Authorized" = "admin"
): ((...args: T) => Promise<R>) => {
  return async (...args: T): Promise<R> => {
    const role = await getRole();

    if (!role) {
      throw new Error("Unauthorized: No active session");
    }

    if (allowedRole !== "*Authorized" && role !== allowedRole) {
      redirect("/login");
    }

    return await fn(...args);
  };
};

// A curry function that passes the user to the wrapped function
export const withAuthCurry = <T extends unknown[], R>(
  fn: (user: User, ...args: T) => Promise<R>,
  allowedRole: "admin" | "user" | "*Authorized" = "*Authorized"
): ((...args: T) => Promise<R>) => {
  return async (...args: T): Promise<R> => {
    const session = await getUserSession();
    if (!session?.user) {
      throw new Error("Unauthorized: No active session");
    }

    if (allowedRole !== "*Authorized" && session.user.role !== allowedRole) {
      redirect("/login");
    }

    return fn(session.user, ...args);
  };
};
