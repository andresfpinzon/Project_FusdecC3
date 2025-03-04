import { CreateCertificateDTO } from "@dtos/certificate.dto";
import certificateModel from "@models/certificate.model";


export const createCertificateService = async (data: CreateCertificateDTO) => {
    const {codigoVerify} = data
    try {
        const certificateExist = await certificateModel.findOne({codigoVerify}).exec()
        if(certificateExist) return {status: 400, message: "Certificate already exists"}
        const certificate = new certificateModel(data)
        await certificate.save()
        return {status: 201, message: "Certificate created successfully", data: certificate}
    } catch (error) {
        console.error(`Error creating certificate in services: ${error}`)
        throw new Error(`Error creating certificate in services: ${error}`)
    }
}

export const updateCertificateService = async (id: string, data: CreateCertificateDTO) => {
    try {
        const certificate = await certificateModel.findByIdAndUpdate(id, data, {new: true}).exec()
        if(!certificate) return {status: 404, message: "Certificate not found"}
        return {status: 200, message: "Certificate updated successfully", data: certificate}
    } catch (error) {
        console.error(`Error updating certificate in services: ${error}`)
        throw new Error(`Error updating certificate in services: ${error}`)
    }
}

export const getAllCertificatesService = async () => {
    try {
        const certificates = await certificateModel.find().exec()
        if(!certificates) return {status: 404, message: "Certificates not found"}
        return {status: 200, message: "Certificates found successfully", data: certificates}
    } catch (error) {
        console.error(`Error getting certificates in services: ${error}`)
        throw new Error(`Error getting certificates in services: ${error}`)
    }
}

export const getCertificateByIdService = async (id: string) => {
    try {
        const certificate = await certificateModel.findById(id).exec()
        if(!certificate) return {status: 404, message: "Certificate not found"}
        return {status: 200, message: "Certificate found successfully", data: certificate}
    } catch (error) {
        console.error(`Error getting certificate in services: ${error}`)
        throw new Error(`Error getting certificate in services: ${error}`)
    }
}

export const toggleStateCertificateService = async (id: string) => {
    try {
        const certificate = await certificateModel.findById(id).exec()
        if(!certificate) return {status: 404, message: "Certificate not found"}
        certificate.isActive = !certificate.isActive
        await certificate.save()
        return {status: 200, message: "Certificate updated successfully", data: certificate}
    } catch (error) {
        console.error(`Error toggling state certificate in services: ${error}`)
        throw new Error(`Error toggling state certificate in services: ${error}`)
    }
}



export const deleteCertificateService = async (id: string) => {
    try {
        const certificate = await certificateModel.findByIdAndDelete(id).exec()
        if(!certificate) return {status: 404, message: "Certificate not found"}
        return {status: 200, message: "Certificate deleted successfully"}
    } catch (error) {
        console.error(`Error deleting certificate in services: ${error}`)
        throw new Error(`Error deleting certificate in services: ${error}`)
    }
}