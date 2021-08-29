import React from 'react';
import { Box, HStack } from '@chakra-ui/react';
// import { useTranslation } from 'react-i18next';
import SideMenu from '../components/sideMenu';

interface Props {
  children: React.ReactNode;
  title: string;
}

const Layout = ({ children }: Props) => {
  // const { t } = useTranslation();
  return (
    <HStack pt={20} px={8}>
      <SideMenu />
      {children}
    </HStack>
  );
};

export default Layout;
