import React from 'react';
import {StatusBar} from 'react-native';
import {QueryClientProvider} from '@tanstack/react-query';

import queryClient from '@/api/queryClient';
import RootNavigator from '@/navigations/root/RootNavigator';

function App(): React.JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar />
      <RootNavigator />
    </QueryClientProvider>
  );
}

export default App;
