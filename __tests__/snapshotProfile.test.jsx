/**
 * @jest-environment jsdom
 */

import React from 'react';

import { render } from '@testing-library/react';
import Profile from '../pages/profile';

it('renders homepage unchanged', () => {
  const { container } = render(<Profile />);
  expect(container).toMatchSnapshot();
});
