import React, { FC, useEffect } from 'react';
import { Container, Flex } from '@chakra-ui/react';
import { globalStore } from 'rekv';
// import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import NavLink from '../navlink';
import ChangeLanguage from '../changeLanguage';
// import { ColorModeSwitcher } from './ColorModeSwitcher';
import Web3Com from '../web3';
import themes from '../../themes';

export interface HeaderProps {
  sticky?: boolean;
}

// const formatAddress = (addr: string) => `${addr.slice(0, 4)}...${addr.slice(-4)}`;

const Header: FC<HeaderProps> = ({ sticky }) => {
  const history = useHistory();
  const { account, api } = globalStore.useState('account', 'api');
  // const { t } = useTranslation();
  useEffect(() => {
    return () => {
      // cleanup
    };
  }, [account?.address, api]);

  return (
    <Flex
      as="header"
      flex={1}
      justify="space-between"
      backgroundColor={themes.bgColor}
      boxShadow="md"
      height="55px"
      px={8}
      position={sticky ? 'fixed' : 'initial'}
      top={0}
      left={0}
      right={0}
    >
      <Container display="flex" justifyContent="space-between" alignItems="center">
        <Flex
          justify="center"
          mr={8}
          onClick={() => {
            history.push('/');
          }}
        >
          logo
        </Flex>

        <Flex flex="1 1 auto">
          <NavLink />
        </Flex>

        <Flex>
          {/* <ColorModeSwitcher /> */}
          {/* <ChangeLanguage /> */}
          <Web3Com />
        </Flex>
      </Container>
    </Flex>
  );
};

export default Header;
