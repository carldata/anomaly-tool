import * as actionTypes from './action-types';
import { IConfigurationState } from '@business-logic/configuration/models/state';
import { ConfigurationLoadStartedAction,
  ConfigurationLoadSucceededAction,
  SetTokenSucceededAction,
 } from '@business-logic/configuration/actions';

const initialState: IConfigurationState = {
  apiAddress: '',
  appName: '',
  token: '',
  gaTrackingNumber: '',
  loaded: false,
} as IConfigurationState;

export type ConfigurationActionTypes = ConfigurationLoadStartedAction |
                                       ConfigurationLoadSucceededAction |
                                       SetTokenSucceededAction;

export const configurationReducer = (state: IConfigurationState = initialState, action: ConfigurationActionTypes): IConfigurationState => {
  switch (action.type) {
    case actionTypes.CONFIGURATION_LOAD_SUCCEEDED:
      return { ...action.configuration, loaded: true } as IConfigurationState;
     case actionTypes.SET_TOKEN_SUCCEEDED:
      return { ...state, token: action.token} as IConfigurationState;
    default:
      return state;
  }
};