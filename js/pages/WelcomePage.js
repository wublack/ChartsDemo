/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import Swiper from 'react-native-swiper';
let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;
import { NavigationActions, StackActions } from 'react-navigation'
import FirstEnterDao from '../dao/FirstEnterDao';
import LoginInfoDao from '../dao/LoginInfoDao';
import FetchUtils, { LoginUrl } from '../utils/FetchUtils'
import { Loading, EasyLoading } from '../components/Loading';
import PopupDialog, {
  SlideAnimation,
} from 'react-native-popup-dialog';
import md5 from "react-native-md5";
const fadeAnimation = new SlideAnimation({ animationDuration: 150 });
const NAV_BAR_HEIGHT_IOS = 44;
const NAV_BAR_HEIGHT_ANDROID = 50;
type Props = {};
export default class App extends Component<Props> {

  constructor(props) {
    super(props)
    this.fetchUtils = new FetchUtils()
    this.firstEnterDao = new FirstEnterDao()
    this.loginInfoDao = new LoginInfoDao()
    this.state = {
      showSwiper: true,
      userName: '',
      userPwd: '',
      errorInfo: ''
    }

  }

  componentDidMount() {
    this.loginInfoDao.getLoginInfo().then((result) => {
      if (result && result.Result === 200) {
        this.setState({
          userName: result.userName,
          userPwd: result.userPwd
        })
        // EasyLoading.show('正在自动登录...');
        // this.timer = setTimeout(() => {
        //   this.otherGetData()
        // }, 1000)
      }
    }).catch((error) => {

    })
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
    EasyLoading.dismis()
  }

  componentWillMount() {
    this.firstEnterDao.getFirstEnterInfo().then((result) => {
      if (result && !result.isFirst) {
        this.setState({
          showSwiper: false
        })
      } else {
        this.firstEnterDao.setFirstEnterInfo({ 'isFirst': false })
      }
    }).catch((error) => {
      this.firstEnterDao.setFirstEnterInfo({ 'isFirst': false })
    })

  }

  otherGetData() {
    if (this.state.userName && this.state.userPwd) {
      // let url = 'http://47.106.64.130:56090/Caiot/Check'
      let md5Pwd = md5.hex_md5(this.state.userPwd);
      let data = { "FUserName": this.state.userName, "FAction": "APP", "FVersion": "1.0.0", "FPassword": md5Pwd }
      this.fetchUtils.postFetchData(LoginUrl, data, this).then(result => {
        if (result) {
          if (result.Result === 200) {
            result.userName = this.state.userName
            result.userPwd = this.state.userPwd
            this.loginInfoDao.setLoginInfo(result)
            const resetAction = StackActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({
                  routeName: "MainPage"
                })
              ]
            });
            this.props.navigation.dispatch(resetAction);
          } else if (result.Result === 103) {
            // alert('用户名或密码错误')
            this.setState({
              errorInfo: '账号或密码错误，请重新填写'
            })
            this.showFadeAnimationDialog()
          } else {
            // alert(result.Result)
            this.setState({
              errorInfo: '系统异常，请稍后重试'
            })
            this.showFadeAnimationDialog()
          }
        } else {
          // alert('系统异常，请稍后重试')
          this.setState({
            errorInfo: '系统异常，请稍后重试'
          })
          this.showFadeAnimationDialog()
        }
      }).catch(error => {
        // alert(error)
        this.setState({
          errorInfo: '系统异常，请稍后重试'
        })
        this.showFadeAnimationDialog()
      })
    } else {
      if (!this.state.userName) {
        // alert('请输入用户名')
        this.setState({
          errorInfo: '请输入用户名'
        })
        this.showFadeAnimationDialog()
      } else if (!this.state.userPwd) {
        // alert('请输入密码')
        this.setState({
          errorInfo: '请输入密码'
        })
        this.showFadeAnimationDialog()
      }
    }
  }

  showFadeAnimationDialog = () => {
    this.fadeAnimationDialog.show();
  }

  render() {
    let swiper =
      <View style={styles.container}>
        <StatusBar style={styles.statusBar} hidden={true}></StatusBar>
        <Swiper style={styles.wrapper} showsPagination={false} showsButtons={false} loop={false}  >
          <Image style={styles.splashImage} source={require('../../img/index1.png')}></Image>
          {/* <IndexPage1 width={screenW} height={screenH} /> */}
          <TouchableOpacity activeOpacity={1} onPress={() => {
            this.setState({
              showSwiper: false
            })
          }} >
            <Image style={styles.splashImage} source={require('../../img/index2.png')}></Image>
          </TouchableOpacity>
        </Swiper>
      </View>
    let main = <View style={[styles.container, { backgroundColor: 'white' }]}>
      <StatusBar barStyle='dark-content'
        hidden={false} backgroundColor="white" />
      <Image style={styles.headerImg} source={require('../../img/login_header.png')}></Image>
      <Text style={{ color: '#666666', marginTop: 3, fontSize: 13, alignSelf: 'center' }}>细心、精心、用心、让您永保称心</Text>
      <View style={[styles.inputContainer, { marginTop: 35 }]}>
        <Image style={styles.inputImg} source={require('../../img/login_name.png')}></Image>
        <TextInput value={this.state.userName} maxLength={30} style={styles.inputStyle} onChangeText={(text) => this.setState({
          userName: text
        })} underlineColorAndroid="transparent"></TextInput>
      </View>
      <View style={[styles.inputContainer, { marginTop: 15 }]}>
        <Image style={styles.inputImg} source={require('../../img/login_pwd.png')}></Image>
        <TextInput value={this.state.userPwd} secureTextEntry={true} maxLength={30} style={styles.inputStyle} onChangeText={(text) => this.setState({
          userPwd: text
        })} underlineColorAndroid="transparent"></TextInput>
      </View>
      <TouchableOpacity activeOpacity={0.8} onPress={() => this.otherGetData()} style={[styles.inputContainer, { marginTop: 35, backgroundColor: '#0EAFF8', justifyContent: 'center' }]}>
        <Text style={styles.loginText}>登录</Text>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.8} style={{ width: 60, alignSelf: 'center', marginTop: 14 }} onPress={() => {
        // this.props.navigation.push('MessageLogin')
      }}>
        <Text style={{ color: 'transparent' }}>短信登录</Text>
      </TouchableOpacity>
      <Text style={styles.companyText}>深圳市中物互联技术发展有限公司</Text>
    </View >
    let content = this.state.showSwiper ? swiper : main
    return (
      <View style={styles.container}>
        {content}
        <Loading />
        <PopupDialog
          width={256}
          height={168}
          dialogAnimation={fadeAnimation}
          ref={(fadeAnimationDialog) => {
            this.fadeAnimationDialog = fadeAnimationDialog;
          }}
        >
          <View style={styles.dialogContentView}>
            <Text style={styles.dialogTitle}>登入失败</Text>
            <Text style={styles.dialogContent}>{this.state.errorInfo}</Text>
            <TouchableOpacity style={styles.rightButton} activeOpacity={0.7} onPress={() => {
              this.fadeAnimationDialog.dismiss()
            }}>
              <Text style={styles.sureText}>确定</Text>
            </TouchableOpacity>
          </View>
        </PopupDialog>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  companyText: {
    textAlign: 'center',
    marginTop: 85
  },
  loginText: {
    textAlign: 'center',
    color: 'white'
  },
  splashImage: {
    width: screenWidth,
    height: screenHeight,
    alignItems: 'center',
    //垂直居中
    justifyContent: 'center',
  },
  headerImg: {
    alignSelf: 'center',
    marginTop: 101
  },
  inputContainer: {
    height: 45,
    marginLeft: 35,
    marginRight: 35,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#0EAFF8',
    borderRadius: 28,
    borderWidth: 1
  },
  inputStyle: {
    width: 300,
    color: '#4E4E4E'
  },
  inputImg: {
    marginLeft: 10
  },
  statusBar: {
    height: Platform.OS === 'ios' ? NAV_BAR_HEIGHT_IOS : NAV_BAR_HEIGHT_ANDROID
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  dialogContentView: {
    flex: 1,
  },
  dialogTitle: {
    marginTop: 45,
    marginLeft: 38,
    fontSize: 18,
    color: '#666666'
  },
  dialogContent: {
    fontSize: 13,
    color: '#666666',
    marginLeft: 33,
    marginTop: 16
  },
  rightButton: {
    alignSelf: 'flex-end',
    marginRight: 25,
    marginTop: 29
  },
  sureText: {
    color: '#0EAFF8',
    fontSize: 13
  }
});
