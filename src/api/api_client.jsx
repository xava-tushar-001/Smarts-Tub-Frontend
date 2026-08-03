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

// User account actions
export const SuspendUser = async (id) => {
    return await instance.post(`/admin/users/${id}/suspend`)
}

export const ReactivateUser = async (id) => {
    return await instance.post(`/admin/users/${id}/reactivate`)
}

export const DeleteUser = async (id) => {
    return await instance.delete(`/admin/users/${id}`)
}

export const OverrideUserPlan = async (id, plan) => {
    return await instance.put(`/admin/users/${id}/plan`, { plan })
}

// Payroll / Finch connection monitoring
export const GetPayrollConnections = async (data) => {
    return await instance.get('/admin/payroll-connections', { params: data })
}

export const RetryPayrollSync = async (id) => {
    return await instance.post(`/admin/payroll-connections/${id}/sync`)
}

export const AdminDisconnectPayroll = async (id) => {
    return await instance.post(`/admin/payroll-connections/${id}/disconnect`)
}

// Salary slip manual correction
export const GetAdminSalarySlip = async (id) => {
    return await instance.get(`/admin/salary-slips/${id}`)
}

export const OverrideSalarySlip = async (id, data) => {
    return await instance.put(`/admin/salary-slips/${id}`, data)
}

export const RetryAdminSalarySlip = async (id) => {
    return await instance.post(`/admin/salary-slips/${id}/retry`)
}

// Profile
export const GetProfile = async () => {
    return await instance.get('/admin/profile')
}

export const UpdateProfile = async (data) => {
    return await instance.put('/admin/profile', data)
}

// Support tickets
export const GetTickets = async (data) => {
    return await instance.get('/admin/support-tickets', { params: data })
}

export const GetTicketDetail = async (id) => {
    return await instance.get(`/admin/support-tickets/${id}`)
}

export const UpdateTicketStatus = async (id, status) => {
    return await instance.put(`/admin/support-tickets/${id}`, { status })
}

export const ReplyToTicket = async (id, message) => {
    return await instance.post(`/admin/support-tickets/${id}/messages`, { message })
}