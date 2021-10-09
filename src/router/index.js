import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home'
import signup from '@/components/signup'
import login from '@/components/login'
import map from '@/components/map'
import profile from '@/components/profile'
import cars from '@/components/cars'
import refresh from '@/components/refresh'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [{
            path: '/',
            name: 'home',
            component: home,
            meta: {
                requiresVisitor: true
            }
        },
        {
            path: '/signup',
            name: 'signup',
            component: signup,
            meta: {
                requiresVisitor: true
            }
        },
        {
            path: '/login',
            name: 'login',
            component: login,
            meta: {
                requiresVisitor: true
            }
        },
        {
            path: '/map',
            name: 'map',
            component: map,
            meta: {
                requiresCar: true
            }
        },
        {
            path: '/profile',
            name: 'profile',
            component: profile,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/cars',
            name: 'cars',
            component: cars,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/refresh',
            name: 'refresh',
            component: refresh,
            meta: {
                requiresAuth: true
            }
        }
    ]
})