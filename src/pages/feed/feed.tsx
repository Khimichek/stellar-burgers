import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectFeedOrders,
  getFeedsThunk
} from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectFeedOrders);

  useEffect(() => {
    dispatch(getFeedsThunk());
  }, []);

  const handleGetFeeds = () => {
    dispatch(getFeedsThunk());
  };

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
