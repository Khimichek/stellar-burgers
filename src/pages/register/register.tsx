import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import {
  registerUserThunk,
  selectError
} from '../../services/slices/userSlice';

import { useDispatch } from '../../services/store';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const error = useSelector(selectError) || undefined; //und-d точно надо????
  const dispatch = useDispatch();
  //const navigate = useNavigate();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(registerUserThunk({ email, name: userName, password }));
    //navigate('/');
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
