import axios from 'axios';
import { push } from 'react-router-redux';
import { put, takeEvery } from 'redux-saga/effects';
import { projectsScreenActionTypes } from './action-creators';
import { IProject } from './state';

const apiAddress = 'http://13.91.93.221:8080'; // this is only for testing purposes 13.91.93.221:8080/config/anomaly-tool

export function* watchGoToAnomalies() {
  yield takeEvery(projectsScreenActionTypes.GO_TO_ANOMALIES, function*() { yield put(push('/anomalies')); });
}

function* testAsyncCall() {
  try {
    const response = yield axios.get(`${apiAddress}/items?app=real-time-job-tests`);
    const data = yield JSON.stringify(response.data);
    yield put({ type: projectsScreenActionTypes.TEST_ASYNC_CALL_FULFILED, payload: data });
  } catch (error) {
    yield put({ type: projectsScreenActionTypes.TEST_ASYNC_CALL_REJECTED, payload: error.message });
  }
}

export function* watchTestAsyncCall() {
  yield takeEvery(projectsScreenActionTypes.TEST_ASYNC_CALL_START, testAsyncCall);
}

function* getAllProjectsAsyncCall() {
  try
  {
    var projectsArray = [];
    const response = yield axios.get(`${apiAddress}/config/anomaly-tool`);
    
    for(let element of response.data){
      projectsArray.push({id: element.data.channel, name: element.data.name})
    }

    yield put({ type: projectsScreenActionTypes.GET_ALL_PROJECTS_ASYNC_CALL_FULFILED, payload: projectsArray });
  } catch (error) {
    yield put({ type: projectsScreenActionTypes.GET_ALL_PROJECTS_ASYNC_CALL_REJECTED, payload: error.message });
  }
}

export function* watchGetAllProjectsAsyncCall() {
  yield takeEvery(projectsScreenActionTypes.GET_ALL_PROJECTS_ASYNC_CALL_START, getAllProjectsAsyncCall);
}