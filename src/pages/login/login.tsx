import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';

import { loginUserThunk, selectError } from '../../services/slices/userSlice';

import { useDispatch, useSelector } from '../../services/store';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const error = useSelector(selectError) || '';
  const dispatch = useDispatch();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUserThunk({ email, password }));
  };

  return (
    <LoginUI
      errorText={error}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
