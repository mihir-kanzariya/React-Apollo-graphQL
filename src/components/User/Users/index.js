import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Table } from 'antd';

import Loading from '../../Loading';
import withSession from '../../Session/withSession';

const columns = [
  {
    title: 'Name',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Country',
    dataIndex: 'country',
    key: 'country',
  },
  {
    title: 'State',
    dataIndex: 'state',
    key: 'state',
  },
  {
    title: 'city',
    dataIndex: 'city',
    key: 'city',
  },
];
// To get list of users
const GET_USERS = gql`
  query {
    users {
      username
      email
      country
      city
      state
    }
  }
`;

const Users = ({ limit }) => (
  <Query query={GET_USERS}>
    {({ data, loading, error, fetchMore, subscribeToMore }) => {
      if (!data) {
        return (
          <div>
            There are no users yet ... Try to create one by yourself.
          </div>
        );
      }

      const { users } = data;

      if (loading || !users) {
        return <Loading />;
      }

      return (
        <>
          <Table
            dataSource={users}
            columns={columns}
            scroll={{ x: 500, y: 1500 }}
          />
          ;
        </>
      );
    }}
  </Query>
);

export default withSession(Users);
