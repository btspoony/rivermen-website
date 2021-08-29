import React from 'react';
import {
  Box,
  Flex,
  Modal,
  Text,
  Center,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  Image,
} from '@chakra-ui/react';
import { globalStore } from 'rekv';
import { switchNetwork } from '../../utils/web3';
import { t } from '../../i18n';
// import xdaiIcon from '../../assets/xdai.svg';
import ethIcon from '../../assets/eth.svg';

const SwitchNetworkModal = (props: any) => {
  // const { ...rest } = props;
  const { switchModalShow } = globalStore.useState('switchModalShow');
  const { appState } = globalStore.useState('appState', 'profile');
  const { chainId } = appState;

  const onClose = () => {
    globalStore.setState({
      switchModalShow: false,
    });
  };

  const handleChange = async (id: number) => {
    if (chainId === id) {
      onClose();
    } else {
      await switchNetwork(id);
      setTimeout(() => {
        // window.location.reload()
      }, 2000);
    }
  };
  return (
    <Modal isOpen={switchModalShow} onClose={onClose} autoFocus={false} isCentered size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex justify="center">
            <Text color="text" fontWeight="bold" textColor="textPrimary">
              {t('switch.modal')}
            </Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody px={{ base: 6, xl: 10 }} py={6} mt={1}>
          <VStack spacing={6} align="stretch">
            <Flex
              boxShadow="0px 3px 6px rgba(0, 0, 0, 0.16);"
              onClick={() => handleChange(4)}
              border="1px solid #EEEEEE"
              cursor="pointer"
              p={2}
              justify="center"
            >
              <Image
                src={ethIcon}
                h={{ base: '48px', lg: '60px' }}
                w={{ base: '48px', lg: '60px' }}
              />
              <Text
                m={3}
                as="div"
                fontSize={{ base: 16, lg: 20 }}
                fontWeight="bold"
                textColor="textPrimary"
                minW={{ base: '136px', lg: '172px' }}
                textAlign="center"
              >
                {t('switch.to', { network: 'Rinkeby' })}
              </Text>
            </Flex>
            <Flex
              boxShadow="0px 3px 6px rgba(0, 0, 0, 0.16);"
              onClick={() => handleChange(100)}
              border="1px solid #EEEEEE"
              cursor="pointer"
              p={2}
              justify="center"
            >
              <Image
                src={ethIcon}
                h={{ base: '48px', lg: '60px' }}
                w={{ base: '48px', lg: '60px' }}
              />
              <Text
                m={3}
                as="div"
                fontSize={{ base: 16, lg: 20 }}
                fontWeight="bold"
                textColor="textPrimary"
                minW={{ base: '136px', lg: '172px' }}
                textAlign="center"
              >
                {t('switch.to', { network: 'xDai' })}
              </Text>
            </Flex>
          </VStack>
          <Text
            mt={4}
            fontSize={{ base: 12, lg: 14 }}
            fontWeight="400"
            textColor="textLable"
            textAlign="center"
          >
            {t('switch.modal.tip')}
          </Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SwitchNetworkModal;
