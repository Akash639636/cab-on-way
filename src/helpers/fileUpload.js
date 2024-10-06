const path = require('path')
const {error} = require("./response");

const fileUpload = async (file, directoryName, acceptedSize = 500000, acceptedTypes = ['image/jpeg']) => {

    const fileName = file.md5 + +new Date + 1;
    const extension = path.extname(file.name);

    if (acceptedTypes.find((e) => e === file.mimetype)) {
        if (file.size > acceptedSize){
            return {fileName, extension, success: false, errorMessage: `File size must be less than ${acceptedSize/1000} kb`};
        }
        await file.mv(`assets/${directoryName}/` + fileName + extension);
        return {fileName, extension, success: true, errorMessage: ''};
    }else{
        return {fileName, extension, success: false, errorMessage: 'file type not accepted'};
    }
}
module.exports = {
    fileUpload
}