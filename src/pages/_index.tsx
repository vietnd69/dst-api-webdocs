// File này sẽ không tạo ra route vì có tiền tố gạch dưới '_'
// Chỉ dùng để tham khảo và lưu lại code

import React from 'react';
import { Redirect } from '@docusaurus/router';

const Home: React.FC = () => {
  return <Redirect to="/getting-started" />;
};

export default Home; 