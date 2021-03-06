/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
import { combineReducers } from 'redux';
import { initialState, reducer } from '../../redux/reducers/returnTripReducer';

describe('Test the reducers and actions', () => {
  it('should load the locations', () => {
    expect(
      reducer(undefined, {
        type: 'GET_LOCATIONS_FULFILLED',
        payload: { data: { data: ['data', 4, 5] } }
      })
    ).toEqual({
      ...initialState,
      locations: ['data', 4, 5]
    });
  });
  it('should return initial state', () => {
    expect(
      reducer(undefined, {
        type: 'GET_LOCATIONS_REJECTED'
      })
    ).toEqual({
      ...initialState
    });
  });
  it('should display errors from backend', () => {
    expect(
      reducer(undefined, {
        type: 'CREATE_RETURN_TRIP_REJECTED',
        payload: { response: { data: { message: 'error' } } }
      })
    ).toEqual({
      ...initialState,
      messages: 'error'
    });
  });
  it('should display errors from backend', () => {
    expect(
      reducer(undefined, {
        type: 'CREATE_RETURN_TRIP_FULFILLED',
        payload: { data: { message: 'trip created' } }
      })
    ).toEqual({
      ...initialState,
      messages: 'trip created'
    });
  });
});
