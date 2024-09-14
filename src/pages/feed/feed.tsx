import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch } from '../../services/store';
import {
  selectFeedOrders,
  getFeedsThunk
} from '../../services/slices/feedSlice';
import { useSelector } from 'react-redux';

export const Feed: FC = () => {
  const orders: TOrder[] = useSelector(selectFeedOrders);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getFeedsThunk());
  }, []);

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={() => {}} />;
};
