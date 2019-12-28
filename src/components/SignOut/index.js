import React from 'react';
import { ApolloConsumer } from 'react-apollo';
import { Button } from 'antd';
import * as routes from '../../constants/routes';
import history from '../../constants/history';

const SignOutButton = () => (
  <ApolloConsumer>
    {client => (
      <Button type="primary" onClick={() => signOut(client)}>
        Sign Out
      </Button>
    )}
  </ApolloConsumer>
);

const signOut = client => {
  localStorage.removeItem('token');
  client.resetStore();
  console.log('here');
  history.push(routes.SIGN_IN);
};

export { signOut };

export default SignOutButton;
