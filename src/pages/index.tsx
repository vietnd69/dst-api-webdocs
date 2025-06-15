import React from "react";
import { Redirect } from "@docusaurus/router";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Head from "@docusaurus/Head";

const Home: React.FC = () => {
	// useBaseUrl will automatically add baseUrl to the path
	const docsPath = useBaseUrl("/docs/api-vanilla/getting-started");
	return (
		<>
			<Head>
				<meta name="algolia-site-verification" content="3760C30573B7EC98" />
			</Head>
			<Redirect to={docsPath} />
		</>
	);
};

export default Home;
