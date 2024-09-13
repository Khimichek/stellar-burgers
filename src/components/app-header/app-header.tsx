import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from 'react-redux';
import { selectUser } from '../../services/slices/userSlice';

export const AppHeader: FC = () => {
  const userName = useSelector(selectUser)?.name;

  return <AppHeaderUI userName={userName} />;
};
