import React from 'react';
// import { groupBy } from 'ramda';
// import { Flex, HStack, Box, Stack, StackDivider } from '@chakra-ui/react';
// import { useQuery } from 'react-query';
// import { globalStore } from 'rekv';
import CommLayout from '../../layouts/common';
import About from '../../components/about';

const Page = () => {
  return (
    <CommLayout title="title.home">
      <About />
    </CommLayout>
  );
};

export default Page;
