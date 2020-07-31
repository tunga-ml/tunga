import _superagent from 'superagent';
import superagentPromise from 'superagent-promise';
import AuthStore from '../stores/AuthStore';
import AlertService from './AlertService';

const superagent = superagentPromise(_superagent, Promise);

//const API_ROOT = 'http://localhost:8080/';
const API_ROOT = process.env.REACT_APP_API_ROOT

const handleErrors = res => {
	if (res !== null){
		if (res.response && res.response.status === 401) {
			AuthStore.clearLoginProps();
		} else if (res.response) {
			AlertService.Add({
				type: 'console',
				message: res.response.body,
				level: 'error',
				autoDismiss: 5
			});
		}
		if (typeof res.response !== 'undefined') {
			return res.response.body;
		}
		return {
			error: {
				code: 'error_response',
				message: 'error response data'
			}
		};
	}
	return null;
};

const responseBody = res => {
	return res.body;
};

const response = res => {
	return res;
};


const tokenPlugin = req => {
	req.set('Access-Control-Allow-Origin', '*');
	if (AuthStore.isLoggedIn()) {
		req.set('Authorization', `Bearer ${AuthStore.getToken()}`);
	}
};

const requests = {
	del: url =>
		superagent
			.del(`${API_ROOT}${url}`)
			.use(tokenPlugin)
			.on('error', handleErrors)
			.end(handleErrors)
			.then(responseBody),
	get: url =>
		superagent
			.get(`${API_ROOT}${url}`)
			.use(tokenPlugin)
			.on('error', handleErrors)
			.end(handleErrors)
			.then(responseBody),
	put: (url, body) =>
		superagent
			.put(`${API_ROOT}${url}`, body)
			.use(tokenPlugin)
			.on('error', handleErrors)
			.end(handleErrors)
			.then(responseBody),
	post: (url, body) =>
		superagent
			.post(`${API_ROOT}${url}`)
			.send(body)
			.use(tokenPlugin)
			.on('error', handleErrors)
			.then(responseBody),
	// .catch(handleErrors);
	getByParam: (url,params) =>
		superagent
			.get(`${API_ROOT}${url}`,params)
			.use(tokenPlugin)
			.on('error', handleErrors)
			.end(handleErrors)
			.then(responseBody),
	download: (url) =>
		superagent
			.get(`${API_ROOT}${url}`)
			.use(tokenPlugin)
			.on('error', handleErrors)
			.end(handleErrors)
			.then(response),
};


export default {
	requests
};