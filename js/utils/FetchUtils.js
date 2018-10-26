import { NavigationActions, StackActions } from 'react-navigation'
import { DeviceEventEmitter } from 'react-native'
export const LoginUrl = 'http://47.106.64.130:56090/Caiot/Check'
export const BaseUrl = 'http://47.106.64.130:56090/Caiot/Project'
export default class FetchUtils {

    getFetchData(url) {
        return new Promise((resolve, reject) => {
            fetch(url).then((response) => {
                response.json()
            }).then((result) => { resolve(result) })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    postFetchData(url, data, self) {
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            }).then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson && responseJson.Result === 104) {
                        // alert('登录超时')
                        DeviceEventEmitter.emit('loginTimeOut')
                        const resetAction = StackActions.reset({
                            index: 0,
                            actions: [
                                NavigationActions.navigate({
                                    routeName: "WelcomePage"
                                })
                            ]
                        });
                        self.props.navigation.dispatch(resetAction);
                    }
                    resolve(responseJson)
                })
                .catch((error) => {
                    console.error(error);
                    reject(error)
                })
        })
    }

}