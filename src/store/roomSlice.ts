import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { APICall } from './APICall';

export interface IRoomObj {
  id: string;
  photo: string;
  roomNumber: number;
  roomName: string;
  bedType: string;
  roomFloor: string;
  facilities: Array<string>;
  ratePerNight: number;
  roomDescription?: string;
  roomType: string;
  status: string;
  offerPrice: number | null;
}

interface IRoomState {
  roomList: IRoomObj[] | IRoomObj;
  status: 'idle' | 'loading' | 'failed';
  fetchStatus: 'idle' | 'loading' | 'failed';
}

interface IFetchPayload {
  url: URL;
  fetchObjProps: RequestInit;
}

const initialState: IRoomState = {
  roomList: [],
  status: 'idle',
  fetchStatus: 'loading',
};

export const fetchRooms = createAsyncThunk(
  'room/fetchRooms',
  async ({
    url,
    fetchObjProps,
  }: IFetchPayload): Promise<{ result: IRoomObj[] }> => {
    const response = await APICall({ url, fetchObjProps });
    return response.json();
  }
);

export const fetchSingleRoom = createAsyncThunk(
  'room/fetchRoom',
  async ({
    url,
    fetchObjProps,
  }: IFetchPayload): Promise<{ result: IRoomObj }> => {
    const response = await APICall({ url, fetchObjProps });
    return response.json();
  }
);

export const createRoom = createAsyncThunk(
  'room/createRoom',
  async ({ url, fetchObjProps }: IFetchPayload): Promise<IRoomObj> => {
    const response = await APICall({ url, fetchObjProps });
    return response.json();
  }
);

export const updateRoom = createAsyncThunk(
  'room/updateRoom',
  async ({ url, fetchObjProps }: IFetchPayload): Promise<IRoomObj[]> => {
    const response = await APICall({ url, fetchObjProps });
    return response.json();
  }
);

export const deleteRoom = createAsyncThunk(
  'room/deleteRoom',
  async ({ url, fetchObjProps }: IFetchPayload): Promise<void> => {
    await APICall({ url, fetchObjProps });
  }
);

export const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        isAnyOf(fetchRooms.pending, fetchSingleRoom.pending),
        (state) => {
          state.fetchStatus = 'loading';
        }
      )
      .addMatcher(
        isAnyOf(createRoom.pending, updateRoom.pending, deleteRoom.pending),
        (state) => {
          state.status = 'loading';
        }
      )
      .addMatcher(
        isAnyOf(
          updateRoom.fulfilled,
          deleteRoom.fulfilled,
          createRoom.fulfilled
        ),
        (state) => {
          state.status = 'idle';
        }
      )
      .addMatcher(
        isAnyOf(fetchRooms.fulfilled, fetchSingleRoom.fulfilled),
        (state, action) => {
          state.fetchStatus = 'idle';
          state.roomList = action.payload.result;
        }
      )
      .addMatcher(
        isAnyOf(fetchRooms.rejected, fetchSingleRoom.rejected),
        (state) => {
          state.fetchStatus = 'failed';
        }
      )
      .addMatcher(
        isAnyOf(createRoom.rejected, updateRoom.rejected, deleteRoom.rejected),
        (state) => {
          state.status = 'failed';
        }
      );
  },
});

export default roomSlice.reducer;
