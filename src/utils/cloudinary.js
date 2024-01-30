// import {v2 as cloudinary} from "cloudinary"
// import fs from "fs"
          
// cloudinary.config({ 
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//   api_key: process.env.CLOUDINARY_API_KEY, 
//   api_secret: process.env.CLOUDINARY_API_SECRET, 
// });

// const uploadOnCloudinary = async (localFilePath) => {
//   try{
//     if(!localFilePath) return null;
//     //upload the file on cloudinary
//     const respnose = await cloudinary.uploader.upload(localFilePath, {
//       resource_type: "auto"
//     })
//     //file has been uploaded succcessfull
//     console.log("File has uploaded on Cloudinary",respnose.url);
//     return respnose;
    
//   }catch(error){
//     fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
//     return null;
//   }
// }

// export {uploadOnCloudinary}

import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
 });
 
 const uploadOnCloudinary = async (localFilePath) => {
    try {
       if (!localFilePath) return null;
       //upload the file on cloudinary
       const response = await cloudinary.uploader.upload(localFilePath, {
          resource_type: "auto", //automatically identify the uploaded file type
       });
       //file has been uploaded
       // console.log("File uploaded Successfully", response.url);
       fs.unlinkSync(localFilePath); // only after the unlink we will proceed further
       return response;
    } catch (error) {
       fs.unlinkSync(localFilePath); //remove the locally saved temperory file as the operation failed
    }
 };

 const deleteFromCloudinary = async (public_id, resource_type = "image") => {
    try {
       if (!public_id) return null;
 
       const response = await cloudinary.uploader.destroy(public_id, {
          resource_type: `${resource_type}`,
       });
 
       console.log("file deleted from Cloudinary");
       return response;
    } catch (error) {
       console.log("Failed while deleting the file from Cloudinary", error);
    }
 };

export {uploadOnCloudinary, deleteFromCloudinary}