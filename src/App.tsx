import * as React from 'react';
import { HashRouter, Switch, Route, useLocation } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';
// import { globalStore } from 'rekv';
import { ChakraProvider, CSSReset } from '@chakra-ui/react';

import Home from './pages/home';
import NotFound from './pages/404';
import Header from './components/header';
import Footer from './components/footer';
import TranslateHOC from './components/translate';
import theme from './themes';
import './i18n';

import { queryClient } from './api/query';
import { scrollTo } from './utils/ui';

require('dotenv').config();

const ControlledLayout = () => {
  const location = useLocation();

  // Scroll on top when route changes
  React.useEffect(() => {
    scrollTo(0);
  }, [location.pathname, location.search]);

  return (
    <>
      <Header sticky />
      <Switch>
        <Route exact strict path="/" component={Home} />
        <Route exact strict path="*" component={NotFound} />
      </Switch>
      <Footer />
    </>
  );
};

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <ChakraProvider theme={theme}>
      <CSSReset />
      <HashRouter>
        <TranslateHOC>
          <ControlledLayout />
        </TranslateHOC>
      </HashRouter>
    </ChakraProvider>
  </QueryClientProvider>
);

export default {};
