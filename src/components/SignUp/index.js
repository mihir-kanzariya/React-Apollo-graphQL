import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import * as routes from '../../constants/routes';
import ErrorMessage from '../Error';
import {
  Input,
  Select,
  Button,
  Checkbox,
  Row,
  Col,
  DatePicker,
  Layout,
} from 'antd';

import 'antd/dist/antd.css';

const { Option } = Select;
const { Content } = Layout;

const SIGN_UP = gql`
  mutation(
    $username: String!
    $email: String!
    $password: String!
    $state: String!
    $country: String!
    $city: String!
    $dob: String!
    $gender: String!
    $skills: [String!]!
  ) {
    signUp(
      username: $username
      email: $email
      password: $password
      state: $state
      country: $country
      city: $city
      dob: $dob
      skills: $skills
      gender: $gender
    ) {
      token
    }
  }
`;

const INITIAL_STATE = {
  username: '',
  email: '',
  password: '',
  passwordConfirmation: '',
  states: [],
  skills: ['Develop', 'QA', 'BDE', 'BA', 'HR'],
  CheckedSkills: [],
  dob: '2019-28-12',
};

const SignUpPage = ({ history, refetch, session }) => (
  <div>
    <h1>SignUp</h1>
    <SignUpForm
      history={history}
      refetch={refetch}
      session={session}
    />
  </div>
);

class SignUpForm extends Component {
  state = { ...INITIAL_STATE };

  // Defined different types of handler to handle change, select and change event
  onChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  onChecked = checkedValues => {
    this.setState({
      CheckedSkills: checkedValues,
    });
  };

  onCityChange = async (name, event) => {
    this.setState({
      [name]: {
        name: event.props.value,
        id: event.props.id,
      },
    });
  };

  onCountryChange = async (name, event) => {
    let states = await this.getDropdownData('states');
    this.setState({
      [name]: {
        name: event.props.value,
        id: event.props.id,
      },
      states:
        states.filter(state => state.country_id === event.props.id) ||
        this.state.states,
    });
  };

  onStateChange = async (name, event) => {
    let cities = await this.getDropdownData('cities');
    this.setState({
      [name]: {
        name: event.props.value,
        id: event.props.id,
      },
      cities:
        cities.filter(city => city.country_id === event.props.id) ||
        this.state.cities,
    });
  };

  onSubmit = (event, signUp) => {
    signUp()
      .then(async ({ data }) => {
        this.setState({ ...INITIAL_STATE });

        localStorage.setItem('token', data.signUp.token);

        await this.props.refetch();

        this.props.history.push(routes.LANDING);
      })
      .catch(err => console.log(err));

    event.preventDefault();
  };

  getDropdownData = async name => {
    let response = await fetch(
      `https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/${name}.json`,
    );
    let data = await response.json();
    return data;
  };

  componentDidMount = async () => {
    let data = await this.getDropdownData('countries');
    this.setState({
      countries: data,
    });
  };

  onDateChange = (date, dateString) => {
    this.setState({
      dob: dateString,
    });
  };

  SelectOption = data => {
    return (data || []).map(ele => {
      return (
        <Option key={ele.name} id={ele.id} value={ele.name}>
          {ele.name}
        </Option>
      );
    });
  };

  render() {
    const {
      username,
      email,
      password,
      passwordConfirmation,
      state,
      states,
      country,
      countries,
      city,
      cities,
      skills,
      dob,
      CheckedSkills,
    } = this.state;
    const { session } = this.props;

    const isInvalid =
      password !== passwordConfirmation ||
      password === '' ||
      email === '' ||
      country === '' ||
      state === '' ||
      city === '' ||
      dob === '' ||
      (CheckedSkills && CheckedSkills.length === 0) ||
      username === '';
    return (
      <>
        {session && session.me ? (
          this.props.history.push('/')
        ) : (
          <Mutation
            mutation={SIGN_UP}
            variables={{
              username: username,
              email: email,
              password: password,
              gender: 'Male',
              skills: CheckedSkills,
              state: state && state.name,
              country: country && country.name,
              dob: dob,
              city: city && city.name,
            }}
          >
            {(signUp, { data, loading, error }) => (
              <Content
                style={{
                  background: '#fff',
                  padding: 24,
                  margin: 25,
                  minHeight: 280,
                }}
              >
                <form
                  onSubmit={event => this.onSubmit(event, signUp)}
                >
                  <Input
                    name="username"
                    value={username}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Full Name"
                  />
                  <Input
                    name="email"
                    value={email}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Email Address"
                  />
                  <Input
                    name="password"
                    value={password}
                    onChange={this.onChange}
                    type="password"
                    placeholder="Password"
                  />
                  <Input
                    name="passwordConfirmation"
                    value={passwordConfirmation}
                    onChange={this.onChange}
                    type="password"
                    placeholder="Confirm Password"
                  />
                  <Select
                    name="country"
                    value={country && country.name}
                    defaultValue={country && country.name}
                    placeholder="Please Select Country"
                    onSelect={(value, event) =>
                      this.onCountryChange('country', event)
                    }
                  >
                    {this.SelectOption(countries)}
                  </Select>
                  <Select
                    name="state"
                    value={state && state.name}
                    placeholder="Please Select State"
                    defaultValue={state && state.name}
                    disabled={states.length > 0 ? false : true}
                    onSelect={(value, event) =>
                      this.onStateChange('state', event)
                    }
                  >
                    {this.SelectOption(states)}
                  </Select>
                  <Select
                    name="city"
                    value={city && city.name}
                    defaultValue={city && city.name}
                    placeholder="Please Select City"
                    disabled={
                      cities && cities.length > 0 ? false : true
                    }
                    onSelect={(value, event) =>
                      this.onCityChange('city', event)
                    }
                  >
                    {this.SelectOption(cities)}
                  </Select>
                  <Checkbox.Group
                    style={{ width: '100%' }}
                    onChange={this.onChecked}
                  >
                    <Row>
                      {skills.map(skill => (
                        <Col span={8}>
                          <Checkbox value={skill}>{skill}</Checkbox>
                        </Col>
                      ))}
                    </Row>
                  </Checkbox.Group>
                  <DatePicker onChange={this.onDateChange} />
                  <Button
                    htmlType="submit"
                    type="primary"
                    disabled={isInvalid || loading}
                  >
                    Sign Up
                  </Button>
                  {error && <ErrorMessage error={error} />}
                </form>
              </Content>
            )}
          </Mutation>
        )}
      </>
    );
  }
}

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={routes.SIGN_UP}>Sign Up</Link>
  </p>
);

export default withRouter(SignUpPage);

export { SignUpForm, SignUpLink };
