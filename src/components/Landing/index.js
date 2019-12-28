import React from 'react';

import withSession from '../Session/withSession';

import { Users } from '../User';

const Landing = ({ session }) => (
  <div>
    <h2>User list</h2>

    {session && session.me && <Users limit={2} />}
  </div>
);

export default withSession(Landing);
