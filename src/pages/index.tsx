import React from "react";
import { Redirect } from "@docusaurus/router";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Head from "@docusaurus/Head";

const Home: React.FC = () => {
	// useBaseUrl sẽ tự động thêm baseUrl vào đường dẫn
	const docsPath = useBaseUrl("/docs/getting-started");
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
