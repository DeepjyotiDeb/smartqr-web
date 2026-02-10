import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { isAuthenticated, getUser } from "~/libs/auth/authUtils";

export function useAuthGuard(redirectTo: string = "/") {
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		if (!isAuthenticated()) {
			navigate(redirectTo, {
				replace: true,
				state: { from: location.pathname },
			});
		}
	}, [navigate, redirectTo, location.pathname]);

	return isAuthenticated();
}

export function useGuestGuard(redirectTo: string = "/classes") {
	const navigate = useNavigate();

	useEffect(() => {
		if (isAuthenticated()) {
			navigate(redirectTo, { replace: true });
		}
	}, [navigate, redirectTo]);

	return !isAuthenticated();
}

export function useUser() {
	return getUser();
}
