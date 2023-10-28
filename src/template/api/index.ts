import http from '@/utils/request';

export function test(params: any) {
    return http.get('/test', params);
}
