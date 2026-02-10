import useSWR from "swr";
import api from "~/libs/api/api";

async function fetchGroups() {
	const response = await api.get(`/classes/user`);
	return response.data;
}

export function useGroup() {
	const { data, error, isLoading } = useSWR("groups", fetchGroups);

	return {
		groups: data,
		isLoading,
		error,
	};
}
