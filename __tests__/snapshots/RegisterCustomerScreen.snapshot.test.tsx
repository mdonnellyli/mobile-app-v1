import React from 'react';
import renderer from 'react-test-renderer';
import { NavigationContainer } from '@react-navigation/native';
import RegisterCustomerScreen from '../../screens/RegisterCustomerScreen';

const mockNavigation = {
  replace: jest.fn(),
};

describe('RegisterCustomerScreen Snapshot', () => {
  it('matches snapshot', () => {
    const tree = renderer
      .create(
        <NavigationContainer>
          <RegisterCustomerScreen
            navigation={mockNavigation}
            route={{
              params: {
                user: {
                  id: 1,
                  name: 'Jane',
                  phoneNumber: '+15555555555',
                  location: 'Springfield',
                  email: 'jane@example.com',
                  roles: ['customer'],
                },
              },
            }}
          />
        </NavigationContainer>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
