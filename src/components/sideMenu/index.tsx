import { Box, VStack, Container, Heading, Stack, Button, Text } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import { t } from '../../i18n';

const Com: FC = (props) => {
  const location = useLocation();
  const params = useParams();
  const history = useHistory();
  console.log(location);
  console.log(params);

  const jump = (path: any) => {
    history.push(`/${path}`);
  };
  return (
    <>
      <VStack align="center" h="100vh" w="200px">
        <Button onClick={() => jump('inventory')}>{t('inventory')}</Button>
        <Button onClick={() => jump('pools')}>{t('pools')}</Button>
        <Button onClick={() => jump('synthesis')}>{t('synthesis')}</Button>
      </VStack>
    </>
  );
};

export default Com;
