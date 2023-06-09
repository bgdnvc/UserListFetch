import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router-dom";
import User from "./components/User";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

const router = createBrowserRouter(
	createRoutesFromElements(
		<>
			<Route path='/' element={<App />}></Route>
			<Route path='/user/:userId' element={<User />}></Route>
		</>
	)
);
ReactDOM.createRoot(document.getElementById("root")).render(
	<QueryClientProvider client={queryClient}>
		<RouterProvider router={router} />
		{/* <ReactQueryDevtools initialIsOpen={false} /> */}
	</QueryClientProvider>
);
