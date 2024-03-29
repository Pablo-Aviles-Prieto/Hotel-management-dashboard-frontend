import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../store/typedHooks';
import { fetchSingleContact, deleteContact } from '../store/contactSlice';
import { MainCard, ButtonGreen } from '../components/Styles';
import { PulseSpinner } from '../components';
import styled from 'styled-components';

const RedButton = styled(ButtonGreen)`
  background-color: rgb(226, 52, 40);
  margin-left: 10px;
`;

const ColorContainer = styled.div`
  strong {
    color: #135846;
  }
`;

const ContactDetails = () => {
  const contactRedux = useAppSelector((state) => state.contacts.contactList);
  const fetchStatusAPI = useAppSelector((state) => state.contacts.statusPost);
  const statusAPI = useAppSelector((state) => state.contacts.status);
  const errorMessageAPI = useAppSelector((state) => state.contacts.error);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    dispatch(fetchSingleContact({ id }));
  }, [dispatch, id]);

  useEffect(() => {
    if (
      errorMessageAPI &&
      (fetchStatusAPI === 'failed' || statusAPI === 'failed')
    ) {
      toast.error(errorMessageAPI);
    }
  }, [errorMessageAPI, fetchStatusAPI, statusAPI]);

  const deleteContactHandler = async () => {
    if (
      window.confirm('Are you sure you want to delete this contact?') === false
    )
      return;

    const result = await dispatch(deleteContact({ id }));

    const hasError = result.meta.requestStatus === 'rejected';
    if (hasError) return;

    toast.success('Contact deleted successfully');
    navigate('/contacts/', { replace: true });
  };

  const dataChecked = useMemo(
    () => (Array.isArray(contactRedux) ? contactRedux[0] : contactRedux),
    [contactRedux]
  );

  if (fetchStatusAPI === 'failed')
    return (
      <h1>
        We couldn't find the contact selected. Please check the ID and if it's
        correct try again later!
      </h1>
    );

  return (
    <MainCard borderRadius='16px'>
      {fetchStatusAPI === 'loading' || statusAPI === 'loading' ? (
        <PulseSpinner isLoading />
      ) : (
        <>
          <h1>
            Contacts details of <span>{dataChecked.message.subject}</span>{' '}
            message
          </h1>
          <ColorContainer>
            <ul>
              <li>
                <strong>Subject:</strong> {dataChecked.message.subject}
              </li>
              <li>
                <strong>Message:</strong> {dataChecked.message.body}
              </li>
              <li>
                <strong>Posted date:</strong> {dataChecked.date}
              </li>
              <li>
                <strong>Posted by:</strong> {dataChecked.user.name}
              </li>
            </ul>
          </ColorContainer>
          <div style={{ marginTop: '50px' }}>
            <ButtonGreen
              padding='10px 52px'
              onClick={() => navigate(`/contacts/${id}/edit`)}
            >
              Edit contact
            </ButtonGreen>
            <RedButton padding='10px 52px' onClick={deleteContactHandler}>
              Delete contact
            </RedButton>
          </div>
        </>
      )}
    </MainCard>
  );
};

export default ContactDetails;
