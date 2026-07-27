import instance from "./axios_Instance";


export const LoginUser = async (data) => {
    return await instance.post('/admin/login', data)
}

export const GetDashboardStats = async () => {
    return await instance.get('/admin/dashboard-stats')
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

export const GetUserDetail = async (id) => {
    return await instance.get(`/admin/users/${id}`)
}

export const GetUserPayments = async (id, data) => {
    return await instance.get(`/admin/users/${id}/payments`, { params: data })
}

export const GetUserSalarySlips = async (id, data) => {
    return await instance.get(`/admin/users/${id}/salary-slips`, { params: data })
}

export const GetUserSalarySlipFile = async (id, slipId) => {
    return await instance.get(`/admin/users/${id}/salary-slips/${slipId}/file`, { responseType: 'blob' })
}

// Profile
export const GetProfile = async () => {
    return await instance.get('/admin/profile')
}

export const UpdateProfile = async (data) => {
    return await instance.put('/admin/profile', data)
}