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
