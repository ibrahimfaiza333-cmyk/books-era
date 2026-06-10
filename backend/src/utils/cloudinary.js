import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary = async (fileBuffer) => {
    //buffer use kiahai
    try {
        if (!fileBuffer) return null;

        return await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "auto",
                    folder: "sulemanbookstore"
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );

            stream.end(fileBuffer);
        });

    } catch (error) {
        console.log("Cloudinary upload error:", error);
        return null;
    }
};


const deleteFromCloudinary = async (publicId) => {
    try {
        if (!publicId) return null;

        const response = await cloudinary.uploader.destroy(publicId);
        return response;

    } catch (error) {
        console.log("Cloudinary delete error:", error);
        return null;
    }
};

export { uploadOnCloudinary, deleteFromCloudinary };