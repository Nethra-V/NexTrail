import API from "./api"

export const getTagInventory = () => API.get("/tags/inventory")

export const registerTag = (data) => API.post("/tags/register", data)

export const assignTag = (data) => API.post("/tags/assign", data)