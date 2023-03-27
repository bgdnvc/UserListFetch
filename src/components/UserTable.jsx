import styled from "@emotion/styled";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUsersPaginated } from "../api/userApi";
import { tableHeaders as headerData } from "../data/headerData";
import { useFetchUsers, useFetchUsersPaginated } from "../hooks/fetchUsers";
import { useGetCachedData } from "../hooks/getCachedData";

const StyledTable = styled.table`
	border-collapse: collapse;
	width: 100%;
	table-layout: fixed;
	border: 1px solid #4e6e81;
	box-shadow: rgba(188, 188, 188, 0.15) 0px 2px 8px;
`;
const TableHead = styled.thead`
	position: sticky;
`;
const TableHeader = styled.th`
	padding: 1em 0.5em;
	text-align: left;
	position: sticky;
	top: 0px;
	background-color: #385a6e;
	color: white;
	-webkit-touch-callout: none; /* iOS Safari */
	-webkit-user-select: none; /* Safari */
	-khtml-user-select: none; /* Konqueror HTML */
	-moz-user-select: none; /* Old versions of Firefox */
	-ms-user-select: none; /* Internet Explorer/Edge */
	user-select: none;
	word-wrap: break-word;
	:hover {
		background-color: #fa991a;
		cursor: pointer;
	}
`;
const TableRow = styled.tr`
	border: 1px solid #afbec6;
	padding: 0.35em;
	:hover {
		background-color: #fa991a;
	}
`;
const TableData = styled.td`
	padding: 0.625em;
	text-align: left;
	word-wrap: break-word;
	cursor: pointer;
`;
const StyledCaption = styled.caption`
	font-size: 1.5em;
	margin: 0.5em 0 0.75em;
	font-weight: 600;
	color: #4e6e81;
`;
const Thumbnail = styled.img`
	border-radius: 30px;
`;
const TableBody = styled.tbody``;

const UserTable = () => {
	let navigate = useNavigate();

	const cachedDataPaginated = useGetCachedData("userDataPaginated");

	const { data, isError, isLoading, isFetching, fetchNextPage } =
		useFetchUsersPaginated("userDataPaginated", () =>
			useGetCachedData("userDataPaginated")
		);

	const [modifiedUserListPaginated, setModifiedUserListPaginated] = useState(
		[]
	);
	const [sortField, setSortField] = useState("");
	const [order, setOrder] = useState("asc");
	const arrowDirection = order === "asc" ? "\u2193" : "\u2191";
	const tableHeaders = headerData;
	const lastElementRef = useRef();

	useEffect(() => {
		if (data || cachedDataPaginated) {
			let sourceData = cachedDataPaginated ?? data;
			if (data) localStorage.setItem("userDataPaginated", JSON.stringify(data));
			setModifiedUserListPaginated(() => {
				let allData = [];
				sourceData.pages.forEach((page) => {
					allData.push(...page.results);
				});
				return allData;
			});
		}
		return () => {};
	}, [data]);
	// Infinite scroll werkt nog niet naar behoren
	// useEffect(() => {
	// 	const observer = new IntersectionObserver(
	// 		(entries) => {
	//
	// 			entries.forEach((entry) => {
	// 				if (entry.isIntersecting) {
	//
	// 					fetchNextPage();
	// 				}
	// 			});
	// 		},
	// 		{ threshold: 1 }
	// 	);

	// 	if (lastElementRef.current) {
	// 		observer.observe(lastElementRef.current);
	//
	// 	}

	// 	return () => {
	// 		if (lastElementRef.current) {
	// 			observer.unobserve(lastElementRef.current);
	// 		}
	// 	};
	// }, [lastElementRef.current]);

	// const handleGetNextPage = () => {
	// 	fetchNextPage();
	// };
	const routeChange = (id) => {
		let path = `/user/${id}`;
		navigate(path);
	};

	const sortCulomnPaginated = (e) => {
		let sortedData;
		if (e.target.id === "name.first" || e.target.id === "name.last") {
			const accessor = e.target.id.split(".");

			sortedData = [...modifiedUserListPaginated].sort((a, b) =>
				a[accessor[0]][accessor[1]]
					.toString()
					.localeCompare(b[accessor[0]][accessor[1]].toString(), {
						numeric: true,
					})
			);
		} else {
			sortedData = [...modifiedUserListPaginated].sort((a, b) =>
				a[e.target.id]
					.toString()
					.replace(/-|\s|\(|\)/g, "")
					.localeCompare(b[e.target.id].toString().replace(/-|\s|\(|\)/g, ""), {
						numeric: true,
					})
			);
		}
		if (sortField === e.target.id && order === "asc") {
			sortedData.reverse();
			setOrder("desc");
		} else {
			setOrder("asc");
		}
		setSortField(e.target.id);
		setModifiedUserListPaginated(() => {
			return sortedData;
		});
	};

	const shouldDisplayTable =
		!isError && !isLoading && !cachedDataPaginated && !data ? false : true;

	return (
		<>
			{shouldDisplayTable && (
				<StyledTable>
					<StyledCaption>USERLIST </StyledCaption>
					<TableHead>
						<TableRow>
							{tableHeaders.map((header) => {
								return (
									<TableHeader
										colSpan={header.id === "nameHeader" ? 2 : 1}
										style={
											header.id === "nameHeader"
												? { textAlign: "center", paddingLeft: "70px" }
												: {}
										}
										onClick={sortCulomnPaginated}
										key={header.id}
										id={header.accessor}
										accessor2={header.accessor2}>
										{header.text}
										{header.accessor === sortField ? arrowDirection : ""}
									</TableHeader>
								);
							})}
						</TableRow>
					</TableHead>
					<TableBody>
						{modifiedUserListPaginated &&
							modifiedUserListPaginated.map((user, index) => {
								return (
									<TableRow
										onClick={() => {
											routeChange(user.login.uuid);
										}}
										key={user.login.uuid}>
										<TableData>
											<Thumbnail
												alt='user thumbnail small'
												src={user.picture?.thumbnail}></Thumbnail>
										</TableData>
										<TableData>{user.name?.first}test</TableData>
										<TableData>{user.name?.last}</TableData>
										<TableData>{user.phone}</TableData>
										<TableData>{user.email}</TableData>
										<TableData>
											{user.nat}
											{index === modifiedUserListPaginated.length - 3 && (
												<div ref={lastElementRef}>{user.name.first}</div>
											)}
										</TableData>
									</TableRow>
								);
							})}
					</TableBody>
				</StyledTable>
			)}
		</>
	);
};

export default UserTable;
