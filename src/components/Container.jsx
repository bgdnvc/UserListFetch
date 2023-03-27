import styled from "@emotion/styled";
import React from "react";

const StyledContainer = styled.div`
	width: 90%;
	margin: auto;
	margin-top: 3rem;
`;
const Container = ({ children }) => {
	return <StyledContainer>{children}</StyledContainer>;
};

export default Container;
