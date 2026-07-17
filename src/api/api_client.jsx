import instance from "./axios_Instance";


export const LoginUser = async (data) => {
    return await instance.post('/admin/login', data)
}

export const GetSubscriber = async (data) => {
    return await instance.get('/admin/subscriber-list', { params: data })
}

export const SubscriberGraph = async (data) => {
    return await instance.get('/admin/subscriber-graph', { params: data })
}

export const GetUsers = async (data) => {
    return await instance.get('/admin/user-list', { params: data })
}

// Profile
export const GetProfile = async () => {
    return await instance.get('/admin/profile')
}

export const UpdateProfile = async (data) => {
    return await instance.put('/admin/profile', data)
}