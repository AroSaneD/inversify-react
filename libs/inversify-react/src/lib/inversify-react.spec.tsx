import React from 'react';
import { render } from '@testing-library/react';

import InversifyReact from './inversify-react';

describe('InversifyReact', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<InversifyReact />);
    expect(baseElement).toBeTruthy();
  });
});
