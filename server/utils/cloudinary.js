import {v2 as cloudinary} from "cloudinary";
export const uploadImage = async (file) => {
    try {
    const image = file;
    const base64Image = Buffer.from(image.buffer).toString("base64");
    const dataURI = `data:${image.mimetype};base64,${base64Image}`;

    const uploadResponse = await cloudinary.uploader.upload(dataURI);
    return uploadResponse;
    } catch (error) {
        throw error;
    }
};