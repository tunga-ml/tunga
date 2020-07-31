import { observable, action, reaction } from "mobx";
import jwt_decode from 'jwt-decode';

class _AuthStore {
	@observable accessToken = window.localStorage.getItem('accessToken');
	@observable userData = JSON.parse(window.localStorage.getItem('userData'));
	@observable isLogged = this.isLoggedIn();

	constructor() {
		reaction(
			() => this.accessToken,
			accessToken => {
				if (accessToken) {
					window.localStorage.setItem('accessToken', accessToken);
				} else {
					window.localStorage.removeItem('accessToken');
				}
			}
		);
	}

	@action setToken(token) {
		window.localStorage.setItem('accessToken', token);
		this.accessToken = token;
	}

	@action getToken() {
		return this.accessToken;
	}

	@action setUser = (userData) => {
		window.localStorage.setItem('userData', JSON.stringify(userData));
		this.userData = userData;
	}

	@action getUser = () => {
		return this.userData;
	}

	@action getUserRole = () => {
		const decodedToken = jwt_decode(this.accessToken);
		return decodedToken.data.role;
	}

	@action isLoggedIn = () => {
		if (this.accessToken !== '' && this.accessToken !== null && !this.isExpiredToken(this.accessToken)) {
			return true;
		}
		window.localStorage.removeItem('accessToken');
		return false;
	}

	@action setLoginProps = (token, user) => {
		const decodedToken = jwt_decode(token);
		this.setToken(token);
		this.setUser(decodedToken.username);
		this.isLogged = true;
	}

	@action isExpiredToken = (token) => {
		const decodedToken = jwt_decode(token);
		const now = new Date().getTime();
		decodedToken.exp *= 1000;
		if (decodedToken.exp < now) {
			return true;
		}
		return false;
	}

	@action clearLoginProps = () => {
		this.setToken('');
		this.setUser([]);
		this.isLogged = false;
	}
}



const AuthStore = new _AuthStore();
export default AuthStore;
