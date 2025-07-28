import React from 'react';
import Header from './src/shared/components/Header';
import Final from './src/shared/components/Final';

const withLayout = (Component) => {
  return function WrappedComponent() {
    return (
      <>
        <Header />
        <Component />
        <Final />
      </>
    );
  };
};

export default withLayout;
