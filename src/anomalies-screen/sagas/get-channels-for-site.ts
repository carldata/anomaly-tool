import * as _ from 'lodash';
import { put, takeEvery } from 'redux-saga/effects';
import { anomaliesScreenActionCreators, anomaliesScreenActionTypes } from '../action-creators';
import { Requests } from '../../requests';
import { IChannel } from '../../model';

function* getChannelsForSite(action) {
  try {
    yield put({ type: anomaliesScreenActionTypes.GET_CHANNELS_FOR_SITE_ANOMALIES_FETCHING });
    const channels: IChannel[] = yield Requests.getChannels(action.payload);
    yield put({ type: anomaliesScreenActionTypes.GET_CHANNELS_FOR_SITE_ANOMALIES_FULFILED, payload: channels });
  } catch (error) {
    // todo notify error
  }
}

export function* watchGetChannelsForSiteAnomalies() {
  yield takeEvery(anomaliesScreenActionTypes.GET_CHANNELS_FOR_SITE_ANOMALIES_START, getChannelsForSite);
}