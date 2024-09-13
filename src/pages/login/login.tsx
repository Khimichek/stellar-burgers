import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';

import { loginUserThunk, selectError } from '../../services/slices/userSlice';

import { useDispatch } from '../../services/store';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const error = useSelector(selectError) || undefined; //und-d точно надо????
  const dispatch = useDispatch();
  //const navigate = useNavigate();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUserThunk({ email, password }));
    //navigate('/');
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
