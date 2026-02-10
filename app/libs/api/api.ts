import axios from "axios";

const api = axios.create({
	baseURL: import.meta.env.VITE_PUBLIC_BACKEND_API,
});

api.interceptors.request.use(async (config) => {
	const token = localStorage.getItem("token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		// if token expired, use refresh token
		// const refreshToken = storage.getItem('refreshToken');
		// if (error.response.status === 401 && refreshToken) {
		// const res = await api.post('token/refresh/', {
		//    refresh: refreshToken,
		//  });
		// set the access token in storage with an expiry time
		// retry the original request with the new access token
		// error.config.headers.Authorization = `Bearer ${res.data.access}`;
		// return api.request(error.config);
		// if it had failed to get a refresh token, logout
		return Promise.reject(error);
	},
);

export default api;
