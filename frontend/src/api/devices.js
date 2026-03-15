import API from "./api"

export const getDevices = () => API.get("/devices")

export const getDeviceDetail = (id) => API.get(`/device/${id}`)