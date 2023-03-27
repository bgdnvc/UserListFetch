import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchUsers, fetchUsersPaginated } from "../api/userApi";

export const useFetchUsers = (queryKey, cachedData) => {
	const data = useQuery({
		queryKey: [queryKey],
		queryFn: () => {
			const users = fetchUsers(40, "abc");
			return users;
		},
		initialData: () => cachedData(),
	});
	return data;
};
export const useFetchUsersPaginated = (queryKey, cachedData) => {
	const data = useInfiniteQuery({
		queryKey: [queryKey],
		queryFn: ({ pageParam = 1 }) => {
			const users = fetchUsersPaginated(pageParam);
			return users;
		},
		getNextPageParam: (lastPage) => {
			return lastPage.info.page + 1;
		},
		initialData: () => cachedData(),
	});
	return data;
};
