/*
 * @Author: Wu Liang
 * @Date: 2018-09-14 16:33:12
 * @LastEditors: Wu Liang
 * @LastEditTime: 2018-09-14 17:17:57
 * @Description: 获取是否第一次进入App
 */

import React from 'react'
import { AsyncStorage, DeviceEventEmitter } from 'react-native'
const FirstEnter_KEY = 'FirstEnter_KEY'

export default class FirstEnterDao {
    //获取是否
    getFirstEnterInfo() {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(FirstEnter_KEY, (error, result) => {
                if (!error) {
                    if (result) {
                        resolve(JSON.parse(result))
                    } else {
                        resolve(result)
                    }
                } else {
                    reject(error)
                }
            })
        })
    }

    //设置
    setFirstEnterInfo(item) {
        return new Promise((resolve, reject) => {
            AsyncStorage.setItem(FirstEnter_KEY, JSON.stringify(item), (error) => {
                if (!error) {
                    // alert('true')
                    DeviceEventEmitter.emit('TOAST_ACTION', '发送了个通知');
                } else {
                    // alert('error')
                    DeviceEventEmitter.emit('TOAST_ACTION', '错误通知');
                }
            })
        })
    }
}