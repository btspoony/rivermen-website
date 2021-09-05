import React, { FC, useEffect } from 'react';
import { Flex, Image, Heading, Spacer, Center, Text } from '@chakra-ui/react';
import { globalStore } from 'rekv';
import { useHistory } from 'react-router-dom';

import NavLink from '../navlink';
// import ChangeLanguage from '../changeLanguage';
// import { ColorModeSwitcher } from './ColorModeSwitcher';
import Web3Com from '../web3';
import themes from '../../themes';
import logoIcon from '../../assets/logo_sandao.svg';

export interface HeaderProps {
  sticky?: boolean;
}

// const formatAddress = (addr: string) => `${addr.slice(0, 4)}...${addr.slice(-4)}`;

const Header: FC<HeaderProps> = ({ sticky }) => {
  const history = useHistory();
  const { account, api } = globalStore.useState('account', 'api');

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
      alignItems="center"
      backgroundColor={themes.bgColor}
      boxShadow="md"
      height="65px"
      zIndex={9999}
      px={8}
      position={sticky ? 'fixed' : 'initial'}
      top={0}
      left={0}
      right={0}
      bgColor="white"
    >
      <Flex
        justify="space-between"
        mr={8}
        onClick={() => {
          history.push('/');
        }}
      >
        <Image borderRadius="lg" src={logoIcon} h={{ base: '48px' }} w={{ base: '48px' }} />
        <Center pl={4} h={{ base: '48px' }}>
          <Heading size="md">SanDAO</Heading>
          <Text pl={2} fontSize="sm">
            for Rivermen
          </Text>
        </Center>
      </Flex>
      <NavLink />
      <Spacer />
      <Flex>
        {/* <ColorModeSwitcher /> */}
        {/* <ChangeLanguage /> */}
        <Web3Com />
      </Flex>
    </Flex>
  );
};

export default Header;
