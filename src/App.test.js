import { render, screen } from '@testing-library/react';
import App from './App';
import { store } from './redux/store.ts';
import { Provider } from 'react-redux';

test('renders learn react link', () => {
  render(<Provider store={store}>
      <App />
  </Provider>
  );
  const linkElement = screen.getByText(/Todos/i);
  expect(linkElement).toBeInTheDocument();
});
