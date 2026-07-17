import instance from "./axios_Instance";


export const LoginUser = async (data) => {
    return await instance.post('/admin/login', data)
}

export const CreateUser = async (data) => {
    return await instance.post('/users/subscriber', data)
}