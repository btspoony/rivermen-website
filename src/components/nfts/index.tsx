import React, { FC, useState } from 'react';
import {
  Box,
  Flex,
  IconButton,
  Image,
  VStack,
  StackDivider,
  Text,
  Heading,
  Spacer,
} from '@chakra-ui/react';
import { UnlockIcon, MinusIcon } from '@chakra-ui/icons';
import ReactGA from 'react-ga';

import { t } from '../../i18n';
import colors from '../../themes/colors';
import { RMApi } from '../../api/contracts';
import { toast, formatBalance } from '../../utils';
import { getPawnContractAddr } from '../../utils/web3';
import { getAddrState, useApproval } from '../../api/query';
import { ToastProps } from '../../utils/types';
import { zeroAddr, APP_ENABLED } from '../../config/constants';

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
    <Box p={2} borderRadius="lg" borderWidth="1px" boxShadow="0px 4px 6px rgba(123, 70, 0, 0.1)">
      <VStack maxH="430px">
        <Flex w="100%" justify="space-between" h="40px">
          <Box p="2">
            <Heading
              size="md"
              as="a"
              href={`https://rivermen.io/allProducts/product?id=${props.token_id}`}
              target="_blank"
            >
              #{props.token_id}
            </Heading>
          </Box>
          <Spacer />
          <Box>
            {!data && (
              <IconButton
                mr={2}
                isLoading={loading}
                aria-label="Approve"
                icon={<UnlockIcon />}
                onClick={() => {
                  if (APP_ENABLED) {
                    approve(props.token_id);
                  } else {
                    console.error('App Disabled');
                  }
                }}
              />
            )}
            {data && (
              <IconButton
                isLoading={loading}
                aria-label="Cancel approve"
                icon={<MinusIcon />}
                onClick={() => {
                  if (APP_ENABLED) {
                    approve(props.token_id, true);
                  } else {
                    console.error('App Disabled');
                  }
                }}
              />
            )}
          </Box>
        </Flex>

        <Box>
          <Image borderRadius="lg" src={props.image_preview_url} />
        </Box>

        <Box p="2">
          <Heading as="h4" size="sm">
            {props.name}
          </Heading>
        </Box>
      </VStack>
    </Box>
  );
};

export default NFT;
