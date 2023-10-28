import type { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHashHistory } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/App.vue'),
        redirect: '/test',
        children: [  
            {
                path: '/test',
                name: 'test',
                component: () => import(''),
                meta: {
                    title: 'test',
                },
            },
        ],
    },
];

const router = createRouter({
    history: createWebHashHistory('/yqh5/'),
    routes,
});

router.beforeEach((to: any, from: any, next) => {
    window.document.title = to.meta.title;
    next();
});

export default router;
