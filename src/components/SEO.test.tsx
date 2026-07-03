
import React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { SEO } from './SEO';

test('renders SEO component with correct title', async () => {
  render(
    <HelmetProvider>
      <SEO title="Test Title" description="Test Description" />
    </HelmetProvider>
  );

  await new Promise(resolve => setTimeout(resolve, 100)); // Wait for Helmet to update

  expect(document.title).toBe('Test Title | BackSolutions');
});
