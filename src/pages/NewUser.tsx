import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/typedHooks';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PulseSpinner } from '../components';
import { MainCard } from '../components/Styles';
import { UserForm } from '../components/Forms/UserForm';
import { IUserData } from '../interfaces/IUserData';
import { createUser } from '../store/userSlice';

interface IUserJobData {
  position?: string;
  description?: string;
  schedule?: string;
}

const userDataSkeleton = {
  contact: '',
  email: '',
  name: '',
  password: '',
  photo: new File([], ''),
  status: 'Active',
};

const userJobDataSkeleton = {
  position: 'Manager',
  description: '',
  schedule: '',
};

const NewUser = () => {
  const [userData, setUserData] = useState<IUserData>(userDataSkeleton);
  const [userJobData, setUserJobData] =
    useState<IUserJobData>(userJobDataSkeleton);
  const statusAPI = useAppSelector((state) => state.users.status);
  const errorMessageAPI = useAppSelector((state) => state.users.error);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (errorMessageAPI && statusAPI === 'failed') {
      toast.error(errorMessageAPI);
    }
  }, [errorMessageAPI, statusAPI]);

  const userDataHandler = ({
    userDataProp,
    newValue,
  }: {
    userDataProp: keyof IUserData;
    newValue: IUserData[keyof IUserData];
  }) => {
    setUserData((prevState) => {
      const newState: IUserData = { ...prevState };
      newState[userDataProp] = newValue;
      return newState;
    });
  };

  const userJobHandler = ({
    userJobProp,
    newValue,
  }: {
    userJobProp: keyof IUserJobData;
    newValue: IUserJobData[keyof IUserJobData];
  }) => {
    setUserJobData((prevState) => {
      const newState: IUserJobData = { ...prevState };
      newState[userJobProp] = newValue;
      return newState;
    });
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !userData.name.trim() ||
      !userData.email.trim() ||
      (userData.password && !userData.password.trim()) ||
      !userData.contact.trim()
    ) {
      toast.warn('Fill all the required inputs', {
        autoClose: 3000,
        hideProgressBar: true,
      });
      return;
    }
    const formData = new FormData();
    formData.append('photo', userData.photo as File);
    formData.append('name', userData.name);
    formData.append('job', JSON.stringify(userJobData));
    formData.append('email', userData.email);
    formData.append('password', userData.password || '');
    formData.append('contact', userData.contact);
    formData.append('startDate', new Date().toISOString().substring(0, 10));
    formData.append('status', userData.status);

    const result = await dispatch(createUser({ objToSave: formData }));

    const hasError = result.meta.requestStatus === 'rejected';
    if (hasError) return;

    toast.success('User created successfully');
    navigate('/users', { replace: true });
  };

  if (statusAPI === 'loading') return <PulseSpinner isLoading />;

  return (
    <MainCard borderRadius='16px'>
      <h1>Create new user</h1>
      <UserForm
        submitHandler={submitHandler}
        userDataHandler={userDataHandler}
        userJobHandler={userJobHandler}
        userData={userData}
        userJobData={userJobData}
      />
    </MainCard>
  );
};

export default NewUser;
