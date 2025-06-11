import React, { useEffect } from 'react';
import { useHistory } from '@docusaurus/router';

export default function Home() {
  const history = useHistory();
  
  useEffect(() => {
    history.replace('/getting-started');
  }, [history]);
  
  return (
    <div>
      <p>Redirecting to Getting Started...</p>
    </div>
  );
} 