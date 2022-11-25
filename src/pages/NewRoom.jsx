import {
  InputText,
  ButtonGreen,
  InputSelect,
  MainCard,
} from '../components/Styles';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createRoom } from '../store/roomSlice';
import styled from 'styled-components';
import roomData from '../assets/data/rooms.json';

const StyledForm = styled.form`
  div {
    margin-bottom: 10px;
  }
  label {
    display: block;
  }
`;

const StyledLabel = styled.label`
  color: ${({ theme }) => theme.darkGreyToLightGrey};
`;

const DescriptionTextArea = styled.textarea`
  padding: 5px;
  border-radius: 4px;
  background: transparent;
  color: ${({ theme }) => theme.mainColor};
  border: 1px solid ${({ theme }) => theme.buttonGreenBground};
  min-width: 175px;
`;

const CheckBoxContainer = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  input {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    border: 1px solid #135846;
    outline: none;
    cursor: pointer;
    &:checked {
      background-color: #135846;
      position: relative;
      &::before {
        font-size: 19px;
        color: #fff;
        content: '✔';
        position: absolute;
        right: 1px;
        top: -5px;
      }
    }
  }
`;

const roomTypeOptionsSelect = [
  {
    label: 'Single Bed',
  },
  {
    label: 'Double Bed',
  },
  {
    label: 'Double Superior',
  },
  {
    label: 'Suite',
  },
];

const roomAmenitiesOptionsSelect = [
  {
    label: 'Double Bed',
  },
  {
    label: 'LED TV',
  },
  {
    label: 'Coffee Set',
  },
  {
    label: 'Air Conditioner',
  },
  {
    label: 'Free WiFi',
  },
  {
    label: '2 Bathrooms',
  },
];

const NewRoom = () => {
  const [roomNameInput, setRoomNameInput] = useState('');
  const [roomTypeSelect, setRoomTypeSelect] = useState('Single Bed');
  const [roomNumberInput, setRoomNumberInput] = useState('');
  const [roomFloorInput, setRoomFloorInput] = useState('');
  const [roomDescription, setRoomDescription] = useState('');
  const [checkOffer, setCheckOffer] = useState(false);
  const [roomPriceInput, setRoomPriceInput] = useState(0);
  const [roomDiscountInput, setRoomDiscountInput] = useState(0);
  const [amenitiesSelect, setAmenitiesSelect] = useState([]);
  const [imagesInput, setImagesInput] = useState([]);
  const roomsListRedux = useSelector((state) => state.rooms.roomList);
  const statusAPI = useSelector((state) => state.rooms.status);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  console.log('roomsListRedux', roomsListRedux);

  const submitHandler = (e) => {
    e.preventDefault();

    const imagesUploadArray = [];
    for (let i = 0; i < imagesInput.length; i++) {
      imagesUploadArray.push(imagesInput[i]);
    }
    // console.log('imagesUploadArray', imagesUploadArray);

    const objToSave = {
      roomName: roomNameInput,
      bedType: roomTypeSelect,
      roomNumber: roomNumberInput,
      roomFloor: roomFloorInput,
      roomDescription,
      checkOffer,
      ratePerNight: +roomPriceInput,
      discount: checkOffer ? +roomDiscountInput : 0,
      facilities: amenitiesSelect,
      // images: imagesUploadArray,
    };

    if (
      !roomNameInput.trim() ||
      !roomNumberInput ||
      !roomFloorInput.trim() ||
      !roomPriceInput ||
      amenitiesSelect.length === 0
      // imagesUploadArray.length < 3
    ) {
      return alert('Please, fill all the required inputs');
    }

    // console.log('new room objToSave', objToSave);

    dispatch(createRoom({ roomsList: roomData, objToInsert: objToSave }));
    // navigate('/rooms', { replace: true });
  };

  const amenitiesHandler = (e) => {
    const value = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setAmenitiesSelect(value);
  };

  if (statusAPI === 'loading') return <h1>Saving room data...</h1>;

  return (
    <MainCard borderRadius='16px'>
      <h1>Create new room</h1>
      <StyledForm onSubmit={submitHandler}>
        <div>
          <StyledLabel htmlFor='room-name'>
            Name<span style={{ color: 'red' }}>*</span>
          </StyledLabel>
          <InputText
            borderRadius='4px'
            padding='5px'
            name='room-name'
            placeholder='name...'
            value={roomNameInput}
            id='room-name'
            type='text'
            onChange={(e) => setRoomNameInput(e.target.value)}
          />
        </div>
        <div>
          <StyledLabel htmlFor='room-images'>
            Upload images<span style={{ color: 'red' }}>*</span>{' '}
            <span style={{ fontSize: '12px' }}>
              (Hold down the Ctrl (windows) or Command (Mac) button to select
              multiple images to upload)
            </span>
          </StyledLabel>
          <input
            type='file'
            id='room-images'
            onChange={(e) => setImagesInput(e.target.files)}
            multiple='multiple'
            accept='image/jpg,image/png'
          />
        </div>
        <div>
          <StyledLabel htmlFor='room-type'>
            Type<span style={{ color: 'red' }}>*</span>
          </StyledLabel>
          <InputSelect
            style={{
              borderRadius: '4px',
              paddingRight: '62px',
              fontWeight: '400',
            }}
            id='room-type'
            padding='8px 5px'
            positionArrowY='0'
            value={roomTypeSelect}
            onChange={(e) => setRoomTypeSelect(e.target.value)}
          >
            {roomTypeOptionsSelect.map((option) => (
              <option key={option.label} value={option.label}>
                {option.label}
              </option>
            ))}
          </InputSelect>
        </div>
        <div>
          <StyledLabel htmlFor='room-number'>
            Number<span style={{ color: 'red' }}>*</span>
          </StyledLabel>
          <InputText
            borderRadius='4px'
            padding='5px'
            name='room-number'
            placeholder='number...'
            value={roomNumberInput}
            id='room-number'
            type='number'
            min='1'
            onChange={(e) => setRoomNumberInput(e.target.value)}
          />
        </div>
        <div>
          <StyledLabel htmlFor='room-floor'>
            Floor<span style={{ color: 'red' }}>*</span>
          </StyledLabel>
          <InputText
            borderRadius='4px'
            padding='5px'
            name='room-floor'
            placeholder='floor...'
            value={roomFloorInput}
            id='room-floor'
            type='text'
            onChange={(e) => setRoomFloorInput(e.target.value)}
          />
        </div>
        <div>
          <StyledLabel htmlFor='room-price'>
            Price<span style={{ color: 'red' }}>*</span>
          </StyledLabel>
          <InputText
            borderRadius='4px'
            padding='5px'
            name='room-price'
            placeholder='price...'
            value={roomPriceInput}
            id='room-price'
            type='number'
            min='1'
            step='0.01'
            onChange={(e) => setRoomPriceInput(e.target.value)}
          />
        </div>
        <div>
          <StyledLabel htmlFor='room-discount'>Discount</StyledLabel>
          <InputText
            style={{ minWidth: '175px' }}
            borderRadius='4px'
            padding='5px'
            name='room-discount'
            value={roomDiscountInput}
            id='room-discount'
            type='number'
            min='0'
            max='100'
            onChange={(e) => setRoomDiscountInput(e.target.value)}
          />
        </div>
        <CheckBoxContainer>
          <input
            id='room-offer'
            type='checkbox'
            checked={checkOffer}
            onChange={() => setCheckOffer((prevState) => !prevState)}
          />
          <StyledLabel htmlFor='room-offer'>
            Offer{' '}
            <span style={{ fontSize: '12px' }}>
              (need to check it in order to add a discount)
            </span>
          </StyledLabel>
        </CheckBoxContainer>
        <div>
          <StyledLabel htmlFor='room-description'>Description</StyledLabel>
          <DescriptionTextArea
            placeholder='Enter description...'
            id='room-description'
            rows='5'
            value={roomDescription}
            onChange={(e) => setRoomDescription(e.target.value)}
          ></DescriptionTextArea>
        </div>
        <div style={{ marginBottom: '25px' }}>
          <StyledLabel htmlFor='room-amenities'>
            Amenities<span style={{ color: 'red' }}>*</span>{' '}
            <span style={{ fontSize: '12px' }}>
              (Hold down the Ctrl (windows) or Command (Mac) button to select
              multiple options)
            </span>
          </StyledLabel>
          <InputSelect
            style={{
              borderRadius: '4px',
              paddingRight: '62px',
              fontWeight: '400',
              backgroundImage: 'none',
              width: '175px',
              minHeight: '140px',
            }}
            id='room-amenities'
            padding='9px 5px'
            positionArrowY='0'
            onChange={amenitiesHandler}
            multiple
            value={amenitiesSelect}
          >
            {roomAmenitiesOptionsSelect.map((option) => (
              <option
                style={{ background: 'transparent' }}
                key={option.label}
                value={option.label}
              >
                {option.label}
              </option>
            ))}
          </InputSelect>
          <p>
            <b>Selecteds</b>: {amenitiesSelect.join(', ')}
          </p>
        </div>
        <div>
          <ButtonGreen padding='10px 52px' type='submit'>
            Save room
          </ButtonGreen>
        </div>
      </StyledForm>
    </MainCard>
  );
};

export default NewRoom;
