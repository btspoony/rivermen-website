import React, { FC, useState } from 'react';
import { Box, Flex, IconButton, Image, VStack, StackDivider, Text } from '@chakra-ui/react';
import { UnlockIcon, MinusIcon } from '@chakra-ui/icons';
import ReactGA from 'react-ga';

import { t } from '../../i18n';
import colors from '../../themes/colors';
import { RMApi } from '../../api/contracts';
import { toast, formatBalance } from '../../utils';
import { getPawnContractAddr } from '../../utils/web3';
import { getAddrState, useApproval } from '../../api/query';
import { ToastProps } from '../../utils/types';
import { zeroAddr } from '../../config/constants';

const NFT: FC = (props: any) => {
  const [loading, setLoading] = useState(false);
  const { refetch = null, cb } = props;
  const pawnPoolAddr = getPawnContractAddr();
  const currentAddr = getAddrState();

  const { data } = useApproval(props.token_id);

  const approve = async (id: number, isCancle = false) => {
    try {
      const rivermenContract = RMApi();

      const toastProps: ToastProps = {
        title: 'Transaction',
        desc: '',
        status: 'success',
      };
      setLoading(true);
      const cbs = {
        receipt: () => {
          toastProps.desc = t(`approve.success`);
          toast(toastProps);
          setLoading(false);
          // ReactGA.event({
          // 	category: formType,
          // 	action: `${formType} fund success`,
          // 	value: amount,
          // });
          if (refetch) {
            refetch();
          }
          if (cb) {
            cb();
          }
        },
        error: () => {
          setLoading(false);
          if (refetch) {
            refetch();
          }
        },
      };

      const addr = isCancle ? zeroAddr : pawnPoolAddr;
      const res = await rivermenContract.approve(addr, id, cbs);
    } catch (error) {
      const toastProps = {
        title: '',
        desc: '',
        duration: 6000,
        status: 'info',
      };
      toastProps.title = 'Error';
      toastProps.desc = error.message;
      toastProps.status = 'error';
      toast(toastProps);
      setLoading(false);
    }
  };

  return (
    <VStack maxH="430px" p={2} boxShadow="0px 4px 6px rgba(123, 70, 0, 0.1)">
      <Box>
        <Image src={props.image_preview_url} />
      </Box>

      <Flex w="100%" justify="space-between" h="50px">
        <Text fontSize="10px" fontWeight={400}>
          {props.name}
        </Text>
      </Flex>

      <Flex w="100%" justify="space-between">
        <Box>
          {!data && (
            <IconButton
              mr={2}
              isLoading={loading}
              aria-label="Approve"
              icon={<UnlockIcon />}
              onClick={() => approve(props.token_id)}
            />
          )}
          {data && (
            <IconButton
              isLoading={loading}
              aria-label="Cancel approve"
              icon={<MinusIcon />}
              onClick={() => approve(props.token_id, true)}
            />
          )}
        </Box>
        <Text
          colorScheme="green"
          as="a"
          href={`https://rivermen.io/allProducts/product?id=${props.token_id}`}
          target="_blank"
        >
          {props.token_id}
        </Text>
      </Flex>
    </VStack>
  );
};

export default NFT;
