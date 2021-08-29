import { Box, VStack, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import React, { FC } from 'react';
import { t } from '../../i18n';
import Layout from '../../layouts/common';

const Comp: FC = (props) => {
  return (
    <Box width="80%" h="100vh">
      <Tabs
        onChange={(idx) => {
          console.log(idx);
        }}
      >
        <TabList>
          <Tab>{t('pawns')}</Tab>
          <Tab>{t('scenes')}</Tab>
          <Tab>{t('parts')}</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <p>one!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Comp;
