import React from 'react';
import { Box, Flex } from '@chakra-ui/react';

export default function Footer() {
  return (
    <Box as="footer" flex={1} display="flex" justifyContent="center" height="auto">
      <Flex
        display="flex"
        paddingX={6}
        justifyContent="space-around"
        flexWrap="wrap"
        paddingBottom={5}
      >
        <Box maxW="80%" minW="40%" mt="60px" mr="20px"></Box>
      </Flex>
    </Box>
  );
}
