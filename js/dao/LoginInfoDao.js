/*
 * @Author: Wu Liang
 * @Date: 2018-09-14 17:22:44
 * @LastEditors: Wu Liang
 * @LastEditTime: 2018-09-14 17:28:14
 * @Description:  获取是否有登录信息
 */

import React from 'react'
import { AsyncStorage, DeviceEventEmitter } from 'react-native'
const LOGIN_INFO_KEY = 'LOGIN_INFO_KEY'

export default class LoginInfoDao {
    //获取是否
    getLoginInfo() {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(LOGIN_INFO_KEY, (error, result) => {
                if (!error) {
                    if (result) {
                        resolve(JSON.parse(result))
                    } else {
                        reject(result)
                    }
                } else {
                    reject(error)
                }
            })
        })
    }

    //设置登录信息
    setLoginInfo(item, callBack) {
        AsyncStorage.setItem(LOGIN_INFO_KEY, JSON.stringify(item), callBack)
    }
}