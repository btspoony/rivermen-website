import React from 'react';
import { Box, HStack } from '@chakra-ui/react';
import SideMenu from '../components/sideMenu';

interface Props {
  children: React.ReactNode;
  title: string;
}

const Layout = ({ children }: Props) => {
  return (
    <HStack pt={20} px={8}>
      <SideMenu />
      {children}
    </HStack>
  );
};

export default Layout;
