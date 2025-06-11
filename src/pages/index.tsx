import React from 'react';
import { Redirect } from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';

const Home: React.FC = () => {
  // useBaseUrl sẽ tự động thêm baseUrl vào đường dẫn
  const docsPath = useBaseUrl('/docs/getting-started');
  return <Redirect to={docsPath} />;
};

export default Home; 