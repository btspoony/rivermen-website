import { Box, SimpleGrid, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import React, { FC, useState } from 'react';
import { t } from '../../i18n';
import { getAddrState, useAccountAssets } from '../../api/query';
import NFT from '../nfts';
import { getPawnContractAddr } from '../../utils/web3';

const Comp: FC = (props) => {
  const [index, setIndex] = useState(0);
  const addr = getAddrState();
  const { data = [] } = useAccountAssets(addr, index);

  const getContractAddr = (idx: number) => {
    let contractAddr = '';
    switch (idx) {
      case 1:
        contractAddr = getPawnContractAddr();
        break;
      default:
        contractAddr = getPawnContractAddr();
    }

    return contractAddr;
  };
  return (
    <Box width="80%" h="100vh">
      <Tabs
        onChange={(idx) => {
          setIndex(idx);
        }}
      >
        <TabList>
          <Tab>{t('pawns')}</Tab>
          <Tab>{t('scenes')}</Tab>
          <Tab>{t('parts')}</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <SimpleGrid minChildWidth="265px" spacing="20px">
              {data.map((asset: any, idx: number) => {
                return <NFT key={idx} {...asset} address={getContractAddr(index)} />;
              })}
            </SimpleGrid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Comp;
