import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFetchUsers, useFetchUsersPaginated } from "../hooks/fetchUsers";
import { useGetCachedData } from "../hooks/getCachedData";
import Container from "./Container";

const UserTable = styled.table`
	table-layout: auto;
	width: 100%;
	border-collapse: collapse;
	box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
`;
const UserRow = styled.tr`
	border: 1px solid #cee6f4;
`;
const HeaderData = styled.td`
	padding: 5px;
	background-color: #4e6e81;
	color: white;
`;
const UserData = styled.td`
	padding: 5px;
`;

const ProfilePicture = styled.img`
	height: 250px;
	margin-right: 2rem;
	box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
`;
const BackArrow = styled.h1`
	color: #4e6e81;
	font-size: 50px;
	display: inline-block;
	cursor: pointer;
	:hover {
		color: #fa991a;
	}
`;
const Card = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	border-radius: 10px;
`;
const User = () => {
	let uuId = useParams();
	let navigate = useNavigate();
	const cachedDataPaginated = useGetCachedData("userDataPaginated");
	const { data, isError, isLoading } = useFetchUsersPaginated(
		"userDataPaginated",
		() => useGetCachedData("userDataPaginated")
	);
	const [user, setUser] = useState({});
	const dateString = user?.dob?.date;
	const date = new Date(dateString);
	const options = {
		month: "long",
		day: "numeric",
		year: "numeric",
	};
	const readableDate = date.toLocaleDateString("nl-NL", options);
	const handleBackArrow = (e) => {
		navigate(-1);
	};

	const canDisplay = !isError && !isLoading ? true : false;
	const filterAndSetUserPaginated = (data) => {
		setUser(() => {
			let aggregatedData = [];
			data.pages.forEach((page) => {
				aggregatedData.push(...page.results);
			});

			const filteredUser = aggregatedData.find((user) => {
				return user.login.uuid === uuId.userId;
			});

			return filteredUser;
		});
	};
	useEffect(() => {
		if (data) filterAndSetUserPaginated(data);
		else if (cachedDataPaginated)
			filterAndSetUserPaginated(cachedDataPaginated);

		return () => {};
	}, [data]);

	return (
		<>
			{canDisplay && (
				<Container>
					<BackArrow onClick={handleBackArrow}>{"\u2190"}</BackArrow>
					<Card>
						<ProfilePicture
							alt='user thumbnail large'
							src={user.picture?.large}></ProfilePicture>

						<UserTable>
							<tbody>
								<UserRow>
									<HeaderData>Firstname</HeaderData>
									<UserData>{user.name?.first}</UserData>
								</UserRow>
								<UserRow>
									<HeaderData>Lastname</HeaderData>
									<UserData>{user.name?.last}</UserData>
								</UserRow>
								<UserRow>
									<HeaderData>Phone</HeaderData>
									<UserData>{user?.phone}</UserData>
								</UserRow>
								<UserRow>
									<HeaderData>Email</HeaderData>
									<UserData>{user?.email}</UserData>
								</UserRow>
								<UserRow>
									<HeaderData>Date of birth</HeaderData>
									<UserData>{readableDate}</UserData>
								</UserRow>
								<UserRow>
									<HeaderData>State</HeaderData>
									<UserData>{user?.location?.state}</UserData>
								</UserRow>
								<UserRow>
									<HeaderData>City</HeaderData>
									<UserData>{user?.location?.city}</UserData>
								</UserRow>
								<UserRow>
									<HeaderData>Postcode</HeaderData>
									<UserData>{user?.location?.postcode}</UserData>
								</UserRow>

								<UserRow>
									<HeaderData>Street</HeaderData>
									<UserData>
										{user?.location?.street?.name}
										{user.location?.street?.number}
									</UserData>
								</UserRow>
								<UserRow>
									<HeaderData>Country</HeaderData>
									<UserData>{user?.location?.country}</UserData>
								</UserRow>
							</tbody>
						</UserTable>
					</Card>
				</Container>
			)}
		</>
	);
};

export default User;
