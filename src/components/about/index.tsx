import { Box, Link, SimpleGrid, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import React, { FC, useState } from 'react';
import { t } from '../../i18n';

const Comp: FC = (props) => {
  // TODO

  return (
    <Box width="80%" h="100vh">
      <Link
        color="teal.500"
        href="https://boydtang.feishu.cn/docs/doccne4TvQAUk5QuoLTCdc7vPwx"
        isExternal
      >
        Document
      </Link>
    </Box>
  );
};

export default Comp;
