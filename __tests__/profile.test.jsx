import React, { useContext } from 'react';
import { Store } from '../utils/Store';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, prettyDOM, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Profile from '../pages/profile';

describe('Layout', () => {
  test('shoul render Layout component', () => {
    render;
  });
});

describe('Render form', () => {
  let component;
  beforeEach(() => {
    const mockHandler = jest.fn();
    component = render(function Profile() {
      const { state, dispatch } = useContext(mockHandler);
    });
  });

  test('has a form', () => {
    const component = render(<Profile />);
    const formlabel = component.container.querySelector('form');
    console.log(prettyDOM(formlabel));
  });
});

test('render the content', () => {
  const component = render(<Profile />);
  const li = component.container.querySelector('li');
  console.log(prettyDOM(li));
});

// test('clicking the button calls event handler once', () => {
//   const mockHandler = jest.fn();
//   const component = render(<Profile addToCartHandler={mockHandler} />);

//   const button = component.getByText('Actualizar');
//   fireEvent.click(button);

//   expect(mockHandler).toHaveBeenCalledTimes(1);

//   // render(<Profile addToCartHandler={() => {}} />);

//   // userEvent.click(screen.getByRole('button', { name: /submit/i }));
// });

describe('render the content button', () => {
  let component;

  beforeEach(() => {
    component = render(
      <div className="col-span-3">
        <div className="card p-6">
          <ul>
            <li>
              <h1 className="testh1">Perfil de usuario</h1>
            </li>
          </ul>
        </div>
      </div>
    );
  });

  test('render its children', () => {
    component.getByText('Perfil de usuario');
  });
});
