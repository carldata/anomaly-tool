import { put, takeEvery } from 'redux-saga/effects';
import { anomaliesScreenActionTypes } from '../action-creators';
import { Requests } from '../../requests';

function* saveProject(action) {
  yield put({type: anomaliesScreenActionTypes.SAVE_PROJECT_FETCHING});
  try {
    yield Requests.saveProject(action.payload);
    yield put({type: anomaliesScreenActionTypes.SAVE_PROJECT_FULFILED});
  } catch(error) {
    yield put({type: anomaliesScreenActionTypes.SAVE_PROJECT_REJECTED});
  }
}

export function* watchSaveProject() {
  yield takeEvery(anomaliesScreenActionTypes.SAVE_PROJECT_START, saveProject);
}