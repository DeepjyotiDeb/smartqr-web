export function isAuthenticated(): boolean {
	if (typeof window === "undefined") return false;
	const token = localStorage.getItem("token");
	const user = localStorage.getItem("user");
	return !!(token && user);
}

export function getUser() {
	if (typeof window === "undefined") return null;
	const user = localStorage.getItem("user");
	return user ? JSON.parse(user) : null;
}

export function requireAuth() {
	if (!isAuthenticated()) {
		throw new Response("Unauthorized", {
			status: 401,
			statusText: "You must be logged in to access this page",
		});
	}
}
