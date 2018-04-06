import axios from 'axios';
import * as Papa from 'papaparse';
import { push } from 'react-router-redux';
import { takeEvery } from 'redux-saga/effects';
import { put } from 'redux-saga/effects';
import { anomaliesScreenActionTypes } from './action-creators';
import { csvLoadingCalculations, EnumRawCsvFormat, IExtractUnixTimePointsConfig } from 'time-series-scroller/lib/out/hp-time-series-chart/csv-loading/calculations';
import { EnumTimeSeriesType, hpTimeSeriesChartAuxiliary, hpTimeSeriesChartReducerAuxFunctions, IExternalSourceTimeSeries,
  IHpTimeSeriesChartState } from 'time-series-scroller';
import { IDataGridState } from './controls/data-grid/state';
import _ = require('lodash');

const apiUrl = 'http://13.91.93.221:8080';

export function* watchGoToProjects() {
  yield takeEvery(anomaliesScreenActionTypes.GO_TO_PROJECTS, function*() { yield put(push('/projects')); });
}

function* getAnomaliesForChannel(action: any) {

  try {
    // const timeseriesResponse = yield axios.get(`${apiUrl}/data/channel/${action.payload}/data`);
    // const anomaliesResponse = yield axios.get(`${apiUrl}/anomalies/find?series=${action.payload}`);

    const rawChannelResponse = yield axios.get(`http://13.91.93.221:8080/data/channel/7880-11732/data?startDate=2017-06-01&endDate=2017-06-30`);
    const fixedAnomaliesResponse = yield axios.get(`http://13.91.93.221:8080/anomalies/find?series=7880-11732&startDate=2017-06-01&endDate=2017-06-31`);
    const editedChannelResponse = yield axios.get(`http://13.91.93.221:8080/data/channel/7880-11734/data?startDate=2017-06-01&endDate=2017-06-30`);

    const rawChannel = Papa.parse(rawChannelResponse.data, { header: true});
    const fixedAnomalies = Papa.parse(fixedAnomaliesResponse.data, { header: true});
    const editedChannel = Papa.parse(editedChannelResponse.data, { header: true});

    const sourceTimeSeries: IExternalSourceTimeSeries[] = [];

    sourceTimeSeries.push({
      color: 'steelblue',
      name: 'raw',
      points: csvLoadingCalculations.extractUnixTimePoints(rawChannel.data, {
        rawFormat: EnumRawCsvFormat.DateTimeThenValue,
        timeStampColumnName: 'time',
        valueColumnName: 'value',
      } as IExtractUnixTimePointsConfig),
      type: EnumTimeSeriesType.Line,
    } as IExternalSourceTimeSeries);

    sourceTimeSeries.push({
      color: 'red',
      name: 'anomalies',
      points: csvLoadingCalculations.extractUnixTimePoints(fixedAnomalies.data, {
        rawFormat: EnumRawCsvFormat.DateTimeThenValue,
        timeStampColumnName: 'time',
        valueColumnName: 'value',
      } as IExtractUnixTimePointsConfig),
      type: EnumTimeSeriesType.Dots,
    } as IExternalSourceTimeSeries);

    const newChartState = hpTimeSeriesChartAuxiliary.buildStateFromExternalSource(sourceTimeSeries) as IHpTimeSeriesChartState;
    var newGridState: IDataGridState = { series: [] };
    for(let i = 0; i < rawChannel.data.length; i++){

      let fixedValue = _.find(fixedAnomalies.data, x => x.time == rawChannel.data[i].time);
      let editedValue = _.find(editedChannel.data, x => x.time == rawChannel.data[i].time);
      
      if(_.isUndefined(fixedValue)){
        fixedValue = '';
      }

      if(_.isUndefined(editedValue)){
        editedValue = '';
      }

      newGridState.series.push({
        date: rawChannel.data[i].time,
        rawValue: rawChannel.data[i].value,
        fixedValue: fixedValue.value,
        editedValue: editedValue.value
      })
    }

    yield put({ type: anomaliesScreenActionTypes.GET_ANOMALIES_FOR_CHART_FULFILED, payload: newChartState });
    yield put({ type: anomaliesScreenActionTypes.GET_ANOMALIES_FOR_GRID_FULFILED, payload: newGridState });

  } catch (error) {
    yield put({ type: anomaliesScreenActionTypes.GET_ANOMALIES_REJECTED, payload: error.message });
  }
}

export function* watchGetAnomaliesForChannel() {
  yield takeEvery(anomaliesScreenActionTypes.GET_ANOMALIES_START, getAnomaliesForChannel);
}