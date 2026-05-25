import instance from "./axios_Instance";


export const LoginUser = async (data) => {
    return await instance.post('/admin/login', data)
}
