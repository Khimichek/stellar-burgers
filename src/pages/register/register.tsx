import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import {
  registerUserThunk,
  selectError
} from '../../services/slices/userSlice';

import { useDispatch, useSelector } from '../../services/store';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const error = useSelector(selectError) || '';
  const dispatch = useDispatch();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(registerUserThunk({ email, name: userName, password }));
  };

  return (
    <RegisterUI
      errorText={error}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
