import * as _ from 'lodash';
import { put, takeEvery } from 'redux-saga/effects';
import { requests } from '../../requests';
import { IChannel, IProject } from '../../models';
import { ShowModalAction, HideModalAction } from '../../components/modal';
import { GetAllProjectsFulfilledAction, GetAllProjectsRejectedAction, GetSitesForProjectStartedAction, ShowProjectDefinitionModalAction } from '../actions';
import { GET_ALL_PROJECTS_STARTED } from '../action-types';

interface IConfigurationEntry {
  id: string;
  data: IProject;
}

function* getAllProjectsAsyncCall() {
  try {
    yield put(_.toPlainObject(new ShowModalAction()));
    const response: IConfigurationEntry[] = yield requests.getConfiguration();
    yield put(_.toPlainObject(new GetAllProjectsFulfilledAction(_.map(response, (el) => ({ ...el.data, id: el.id } as IProject)))));
  } catch (error) {
    yield put(_.toPlainObject(new GetAllProjectsRejectedAction()));
  } finally {
    yield put(_.toPlainObject(new HideModalAction()));
  }
}

export function* watchGetAllProjectsAsyncCall() {
  yield takeEvery(GET_ALL_PROJECTS_STARTED, getAllProjectsAsyncCall);
}