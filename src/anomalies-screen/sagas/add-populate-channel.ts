import * as _ from 'lodash';
import * as Papa from 'papaparse';
import axios from 'axios';
import * as dateFns from 'date-fns';
import { takeEvery, call, all, put } from 'redux-saga/effects';
import { anomaliesScreenActionTypes } from '../action-creators';
import { csvLoadingCalculations, EnumRawCsvFormat, IExtractUnixTimePointsConfig } from 'time-series-scroller/lib/out/hp-time-series-chart/csv-loading/calculations';
import {
  EnumTimeSeriesType, hpTimeSeriesChartAuxiliary, hpTimeSeriesChartReducerAuxFunctions, IExternalSourceTimeSeries, IHpTimeSeriesChartState,
} from 'time-series-scroller';
import { Requests } from '../../requests';

function* addAndPopulateChannel(action: any) {
  try {
    yield put({ type: anomaliesScreenActionTypes.ADD_AND_POPULATE_CHANNEL_FETCHING })

    const site: string = action.payload.siteChannelInfo.site;
    const channel: string = action.payload.siteChannelInfo.channel;
    const startDate: string = action.payload.startDate;
    const endDate: string = action.payload.endDate;

    const channelData = yield Requests.getChannelData(site + '-' + channel, startDate, endDate);
    const channelParseResult = Papa.parse(channelData.data, { header: true });

    let channelChartState: IHpTimeSeriesChartState;
    if (channelParseResult.errors.length === 0) {
      channelChartState =
        hpTimeSeriesChartAuxiliary.buildStateFromExternalSource([{
          color: 'steelblue',
          name: site + ' ' + channel,
          points: csvLoadingCalculations.extractUnixTimePoints(channelParseResult.data, {
            rawFormat: EnumRawCsvFormat.DateTimeThenValue,
            timeStampColumnName: 'time',
            valueColumnName: 'value',
          } as IExtractUnixTimePointsConfig),
          type: EnumTimeSeriesType.Line,
        } as IExternalSourceTimeSeries]);
    } else {
      channelChartState = hpTimeSeriesChartReducerAuxFunctions.buildInitialState();
      channelChartState.dateRangeUnixFrom = dateFns.parse(startDate).getMilliseconds();
      channelChartState.dateRangeUnixTo = dateFns.parse(endDate).getMilliseconds();
    }

    yield put({
      type: anomaliesScreenActionTypes.ADD_AND_POPULATE_CHANNEL_FULFILED, payload: {
        siteChannelInfo: action.payload.siteChannelInfo,
        channelChartState,
      },
    });
  }
  catch (error) {
    yield put({ type: anomaliesScreenActionTypes.ADD_AND_POPULATE_CHANNEL_REJECTED, payload: error })
  }
}

export function* watchAddAndPopulateChannel() {
  yield takeEvery(anomaliesScreenActionTypes.ADD_AND_POPULATE_CHANNEL_START, addAndPopulateChannel);
}