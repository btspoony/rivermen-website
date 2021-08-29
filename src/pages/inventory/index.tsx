import React from 'react';
// import { groupBy } from 'ramda';
import { Flex, HStack, Box, Stack, StackDivider } from '@chakra-ui/react';
// import { useTranslation } from 'react-i18next';
// import { useQuery } from 'react-query';
// import { globalStore } from 'rekv';
import CommLayout from '../../layouts/common';
import AssetList from '../../components/assetList';
// import {

// } from '../../api/contracts';
// import { useAssetsQuery } from '../../api/query';

const Page = () => {
  // const { data: assetsData, isLoading, error, refetch } = useAssetsQuery();
  // FIXME: Add type instead of any
  // const {  } = store.useState('assets', 'filteredAssets');

  // const { t } = useTranslation();

  // const { account } = globalStore.useState('account');

  // const [stickyFilter] = useState(false);

  // Update filters when mount
  // useEffect(() => {

  // }, []);

  return (
    <CommLayout title="title.home">
      <AssetList />
    </CommLayout>
  );
};

export default Page;