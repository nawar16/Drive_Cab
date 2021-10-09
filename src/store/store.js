import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios'
import { createFlashStore } from 'vuex-flash';
import jwtDecode from 'jwt-decode';

Vue.use(Vuex);
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('access_driver_token');


export const store = new Vuex.Store({
    state: {
        token: localStorage.getItem('access_driver_token'),
        carChosen: false,
        ActualCar: { ActualPlate: null },
        myservice: null,
        profile: { first_name: null, last_name: null, phone: null },
        travelsinfo: { kms: 0, travels: 0, balance: 0, average: 0 },
        driverData: { first_name: null, last_name: null, phone: null },
        cliinfo: { fname: null, lname: null, phone: null },
        cars: [
            { license_plate: 200, brand: 'Lamborghini', model: 'Gallardo', seat: '123', year: '2018' },
            { license_plate: 201, brand: 'Audi', model: 'A4', seat: '123', year: '2018' },
            { license_plate: 202, brand: 'Chevrolet', model: 'Camaro', seat: '123', year: '2018' },
        ],
        origin: [34.7324, 36.7137],
        destiny: [33.5138, 36.2765],
        driver_position: [34.7324, 36.7137],
        destinyAndTime: [],
        youllbeawoman: true,
        status_working: 'Available'
    },
    getters: {
        token: state => {
            return state.token;
        },
        loggedIn: state => {
            return state.token !== null;
        },
        carChosen: state => {
            return state.carChosen;
        },
        ActualCar: state => {
            return state.ActualCar.ActualPlate;
        },
        profile: state => {
            return state.profile;
        },
        travelsinfo: state => {
            return state.travelsinfo;
        },
        myservice: state => {
            return state.myservice;
        },
        cliinfo: state => {
            return state.cliinfo;
        },
        cars: state => {
            return state.cars;
        },
        origin: state => {
            return state.origin;
        },
        destiny: state => {
            return state.destiny;
        },
        driver_position: state => {
            return state.driver_position;
        },
        destinyAndTime: state => {
            return state.destinyAndTime;
        },
        driverData: state => {
            return state.driverData;
        },
        youllbeawoman: state => {
            return state.youllbeawoman;
        },
        status_working: state => {
            return state.status_working;
        }
    },
    mutations: {
        tokenMutation: (state, token) => {
            state.token = token;
        },
        destroyToken: state => {
            state.token = null;
        },
        setCarChosenTrue: state => {
            state.carChosen = true;
        },
        setActualCar: (state, actual) => {
            console.log(actual);
            state.ActualCar = { ActualPlate: actual };
        },
        setProfile: (state, pro) => {
            state.profile = pro;
        },
        setTravelsinfo: (state, val) => {
            state.travelsinfo = val;
        },
        setcars: (state, fav) => {
            state.cars = fav;
        },
        removeProfile: state => {
            state.profile = null;
        },
        setOrigin: (state, coor) => {
            state.origin = coor;
        },
        setDestiny: (state, coor) => {
            state.destiny = coor;
        },
        setDriver_position: (state, coor) => {
            state.driver_position = coor;
        },
        removeMapdata: state => {
            state.mapdata = [];
        },
        myservice: (state, data) => {
            state.myservice = data;
        },
        cliinfo: (state, data) => {
            state.cliinfo = data;
        },
        destinyAndTime: (state, arr) => {
            state.destinyAndTime = arr;
            state.firstTimeForAInterval = !state.firstTimeForAInterval;
        },
        driverData: (state, data) => {
            state.driverData = data;
        },
        youllbeawoman: (state) => {
            state.youllbeawoman = !state.youllbeawoman;
        },
        set_status_working: (state, val) => {
            state.status_working = val;
        }
    },
    actions: {
        api_register: (context, credentials) => {
            return new Promise((resolve, reject) => {
                axios.post('http://localhost:8010/api/driver/signup', credentials)
                    .then(res => {
                        console.log(res.data);
                        resolve(res);
                    })
                    .catch(err => {
                        //console.log(err);
                        reject(err);
                    })
            })
        },
        api_login: (context, credentials) => {
            return new Promise((resolve, reject) => {
                axios.post('http://localhost:8010/api/driver/login', { phone: credentials.phone, password: credentials.password })
                    .then(res => {
                        const token = res.data.data._token;
                        localStorage.setItem('access_driver_token', token);
                        context.commit('tokenMutation', token);
                        const { phone } = jwtDecode(context.getters.token)
                        console.log(localStorage.getItem('access_driver_token'))
                        resolve(res);
                    })
                    .catch(err => {
                        reject(err);
                    })
            });
        },
        logout: context => {
            if (context.getters.loggedIn) {
                const token = localStorage.getItem('access_driver_token');
                context.commit('removeMapdata');
                localStorage.removeItem('access_driver_token');
                context.commit('removeProfile');
                context.commit('destroyToken');
                return new Promise((resolve, reject) => {
                    axios.post('http://localhost:8010/api/driver/logout', { token: token })
                        .then(res => {
                            context.commit('removeMapdata');
                            localStorage.removeItem('access_driver_token');
                            context.commit('removeProfile');
                            context.commit('destroyToken');
                            resolve(res);
                        })
                        .catch(err => {
                            reject(err);
                        })
                });
            }
        },
        profileInfo: context => {
            return new Promise((resolve, reject) => {
                console.log('Profile consulted');
                const decoded = jwtDecode(context.getters.token);
                console.log(decoded);
                axios.post('http://localhost:8010/api/driver/profile', decoded)
                    .then(res => {
                        console.log(res.data.data);
                        context.commit('setProfile', res.data.data.profileInfo);
                        context.commit('setTravelsinfo', res.data.data.travelsInfo);
                        resolve(res);
                    })
                    .catch(err => {
                        reject(err);
                    })
            });
        },
        updateProfileInfo: (context, newProfile) => {
            return new Promise((resolve, reject) => {
                const decoded = jwtDecode(context.getters.token);
                const object = { newProfile: newProfile, phone: decoded.phone }
                axios.post('http://localhost:8010/api/driver/update-profile', object)
                    .then(res => {
                        resolve(res);
                    })
                    .catch(err => {
                        reject(err);
                    })
            });
        },
        changePassword: (context, obj) => {
            return new Promise((resolve, reject) => {
                const decoded = jwtDecode(context.getters.token);
                axios.post('http://localhost:8010/api/driver/change-password', { phone: decoded.phone, pass: obj.new_pass })
                    .then(res => {
                        resolve(res);
                    })
                    .catch(err => {
                        reject(err);
                    })
            });
        },
        changePicture: (context, obj) => {
            return new Promise((resolve, reject) => {
                const decoded = jwtDecode(context.getters.token);
                axios.post('http://localhost:8010/api/driver/change-pic', { phone: decoded.phone, pic: obj.new_pic })
                    .then(res => {
                        resolve(res);
                    })
                    .catch(err => {
                        reject(err);
                    })
            });
        },
        carsInfo: context => {
            return new Promise((resolve, reject) => {
                console.log('cars consulted');
                const decoded = jwtDecode(context.getters.token);
                axios.post('http://localhost:8010/api/driver/cars', decoded)
                    .then(res => {
                        var data = res.data.data;
                        var array = [];
                        for (var i in data) {
                            var plate = data[i].license_plate;
                            var brand = data[i].info_car.brand;
                            var model = data[i].info_car.model;
                            var aseat = data[i].info_car.seat;
                            var ayear = data[i].info_car.year;
                            array.push({ license_plate: plate, brand: brand, model: model, seat: aseat, year: ayear });
                        }
                        context.commit('setcars', array);

                        //context.commit('setcars', array);
                        resolve(res);
                    })
                    .catch(err => {
                        reject(err);
                    })
            });
        },
        sendNewCar: (context, item) => {
            return new Promise((resolve, reject) => {
                //console.log(context.getters.token);
                const decoded = jwtDecode(context.getters.token);
                // const phoneNumber = context.getters.profile.phone;
                const obj = { carInfo: item, phone: decoded.phone };
                axios.post('http://localhost:8010/api/driver/new-car', obj)
                    .then(res => {
                        console.log(res.data);
                        resolve(res);
                    })
                    .catch(err => {
                        reject(err);
                    })
            });
        },
        deleteCar: (context, license_plate) => {
            return new Promise((resolve, reject) => {
                //console.log(context.getters.token);
                const decoded = jwtDecode(context.getters.token);
                const obj = { plate: license_plate, phone: decoded.phone };
                axios.post('http://localhost:8010/api/driver/delete-car', obj)
                    .then(res => {
                        console.log(res.data);
                        resolve(res);
                    })
                    .catch(err => {
                        reject(err);
                    })
            });
        },
        updateCar: (context, obj) => {
            return new Promise((resolve, reject) => {
                //console.log(context.getters.token);
                const decoded = jwtDecode(context.getters.token);
                const object = { fav: obj.id, phone: decoded, newTitle: obj.newtitle };
                axios.post('http://localhost:8010/api/profile/update-favorite', object)
                    .then(res => {
                        console.log(res.data);
                        resolve(res);
                    })
                    .catch(err => {
                        reject(err);
                    })
            });
        },
        newPosition: (context) => {
            const decoded = jwtDecode(context.getters.token);
            var taxiactual = context.getters.ActualCar;
            var obj = { phone: decoded.phone, coordinates: context.getters.driver_position, taxi: taxiactual };
            //console.log(obj);
            if (context.getters.status_working == 'Available') {
                axios.post('http://localhost:8010/api/driver/new-position', obj)
                    .then(res => {
                        console.log(res.data.msg);
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
        },
        busyPosition: (context) => {
            const decoded = jwtDecode(context.getters.token);
            axios.post('http://localhost:8010/api/driver/busy-position', decoded)
                .then(res => {
                    console.log(res.data.msg);
                })
                .catch(err => {
                    console.log(err);
                })
        },
        service_accepted: (context) => {
            const decoded = jwtDecode(context.getters.token);
            //console.log(obj);
            axios.post('http://localhost:8010/api/driver/ok-service', decoded)
                .then(res => {
                    console.log(res.data.msg);
                })
                .catch(err => {
                    console.log(err);
                })
        },
        infoService: context => {
            const decoded = jwtDecode(context.getters.token);
            var obj = { phone: decoded.phone };
            console.log("new service modal....");
            axios.post('http://localhost:8010/api/driver/my-services', obj)
                .then(res => {
                    if (res.data.msg == 'No services') {
                        console.log(res.data.msg);
                    } else {
                        context.commit('myservice', res.data.data[0].all);
                        context.commit('setOrigin', context.getters.myservice.origin_geom);
                        context.commit('setDestiny', context.getters.myservice.destination_geom);
                        context.commit('cliinfo', res.data.data[0].cli)
                        console.log(res.data.data[0].cli);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
    },
    plugins: [
        createFlashStore()
    ]
})