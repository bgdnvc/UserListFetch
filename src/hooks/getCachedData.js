export const useGetCachedData = (key) => {
	const data = JSON.parse(localStorage.getItem(key));
	return data;
};
