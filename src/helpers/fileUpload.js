const path = require('path')

const fileValidation = (file, acceptedTypes = ['image/jpeg'], acceptedSize = 500000) => {
    if (acceptedTypes.find((e) => e === file.mimetype)) {
        if (file.size > acceptedSize) {
            return {success: false, errorMessage: `File size must be less than ${acceptedSize / 1000} kb`};
        }
        return {success: true, errorMessage: ''};
    } else {
        return {success: false, errorMessage: 'file type not accepted'};
    }
}



const fileUpload = async (file, directoryName, acceptedSize = 500000, acceptedTypes = ['image/jpeg'], applyValidation = true) => {

    const fileName = file.md5 + +new Date + 1;
    const extension = path.extname(file.name);
    let validationRes;

    if (applyValidation) {
        validationRes = await fileValidation(file, acceptedTypes, acceptedSize);
    }
    if (validationRes?.success || !applyValidation) {
        await file.mv(`assets/${directoryName}/` + fileName + extension);
        return {fileName, extension, success: true, errorMessage: ''};
    } else {
        return validationRes;
    }
}

const multiFileUpload = async (files, directoryName, acceptedSize = 500000, acceptedTypes = ['image/jpeg'], applyValidation = true) => {

    try {
        let fileNames = [];
        if (applyValidation) {
            for (const key in files) {
                const res = fileValidation(files[key], acceptedTypes, acceptedSize);
                if (!res.success) return res;
            }
        }
        for (const filesKey in files) {
            const fileName = files[filesKey].md5 + +new Date + 1;
            const extension = path.extname(files[filesKey].name);
            await files[filesKey].mv(`assets/${directoryName}/` + fileName + extension);
            fileNames.push(fileName + extension);
        }
        return {fileNames, success: true, errorMessage: ''};

    } catch (e) {

        return {success: false, errorMessage: e.message};
    }
}


module.exports = {
    fileUpload,
    fileValidation,
    multiFileUpload
}