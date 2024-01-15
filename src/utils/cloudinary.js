import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET, 
});

const uploadOnCloudinary = async (localFilePath) => {
  try{
    if(!localFilePath) return null;
    //upload the file on cloudinary
    const respnose = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    })
    //file has been uploaded succcessfull
    console.log("File has uploaded on Cloudinary",respnose.url);
    return respnose;
    
  }catch(error){
    fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
}

export {uploadOnCloudinary}