import instance from "./axios_Instance";


export const LoginUser = async (data) => {
    return await instance.post('/admin/login', data)
}

export const CreateUser = async (data) => {
    return await instance.post('/users/subscriber', data)
}

// Account creation (email + password -> OTP -> verify)
export const RegisterUser = async (data) => {
    return await instance.post('/users/register', data)
}

export const VerifyOtp = async (data) => {
    return await instance.post('/users/verify-otp', data)
}

export const ResendOtp = async (data) => {
    return await instance.post('/users/resend-otp', data)
}

export const GoogleLogin = async (data) => {
    return await instance.post('/users/google-login', data)
}

// Profile
export const GetProfile = async () => {
    return await instance.get('/users/profile')
}

export const UpdateProfile = async (data) => {
    return await instance.put('/users/profile', data)
}

// Salary slip analysis
export const UploadSalarySlip = async (file) => {
    const formData = new FormData();
    formData.append('slip', file);
    // Don't set Content-Type manually - the browser needs to add its own multipart boundary.
    return await instance.post('/users/salary-slips', formData)
}

export const GetSalarySlips = async (params) => {
    return await instance.get('/users/salary-slips', { params })
}

export const GetSalarySlipStats = async () => {
    return await instance.get('/users/salary-slips/stats')
}

export const GetSalarySlip = async (id) => {
    return await instance.get(`/users/salary-slips/${id}`)
}

export const GetSalarySlipFile = async (id) => {
    return await instance.get(`/users/salary-slips/${id}/file`, { responseType: 'blob' })
}

export const RetrySalarySlip = async (id) => {
    return await instance.post(`/users/salary-slips/${id}/retry`)
}

// Billing
export const GetBillingStatus = async () => {
    return await instance.get('/users/billing/status')
}

export const CreateCheckoutSession = async () => {
    return await instance.post('/users/billing/checkout')
}

export const CreatePortalSession = async () => {
    return await instance.post('/users/billing/portal')
}

// Payroll integration (Finch, Pro-only)
export const GetPayrollStatus = async () => {
    return await instance.get('/users/payroll/status')
}

export const ConnectPayroll = async (code) => {
    return await instance.post('/users/payroll/connect', { code })
}

export const DisconnectPayroll = async () => {
    return await instance.post('/users/payroll/disconnect')
}
