//import CommonStore from '../stores/CommonStore';

class AlertService {
	Add(settings){
		if (settings.type === 'console'){
			console.log(settings.message);
		} else {
			settings.check = false;
			//CommonStore.errors.push(settings);
		}
	}
	Remove(){
		//CommonStore.errors = [];
	}
}

export default new AlertService();
