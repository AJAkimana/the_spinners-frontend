import { combineReducers } from 'redux';
import loginReducer from './loginReducer';
import signupReducer from './signupReducer';
import resetPasswordReducer from './resetPasswordReducer';
import profileReducer from './updateProfile';
import logoutReducer from './logoutReducer';
import userReducer from './userReducer';

export default combineReducers({
	auth: loginReducer,
	signupReducer,
	resetPasswordReducer,
	profileData: profileReducer,
	logoutReducer,
	userReducer,
});
