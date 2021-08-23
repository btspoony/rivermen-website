import React from 'react';
import { Box } from '@chakra-ui/react';
// import { useTranslation } from 'react-i18next';

interface Props {
  children: React.ReactNode;
  title: string;
}

const Layout = ({ children }: Props) => {
  // const { t } = useTranslation();
  return (
    <Box pt={20} px={8}>
      {children}
    </Box>
  );
};

export default Layout;
