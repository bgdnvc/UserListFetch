export async function fetchUsers(amount, seed) {
	const response = await fetch(
		`https://randomuser.me/api/?results=${amount}&seed=${seed}`,
		{
			method: "GET",
		}
	);
	if (!response.ok) {
		throw new Error("Failed to fetch users");
	}
	return response.json();
}
export async function fetchUsersPaginated(pageParam = 1) {
	const amount = 20;
	const seed = "abc";

	const response = await fetch(
		`https://randomuser.me/api/?page=${pageParam}&results=${amount}&seed=${seed}`,
		{
			method: "GET",
		}
	);
	if (!response.ok) {
		throw new Error("Failed to fetch users");
	}

	return response.json();
}
