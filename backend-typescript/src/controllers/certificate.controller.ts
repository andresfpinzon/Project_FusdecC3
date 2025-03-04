import { createCertificateService, deleteCertificateService, getAllCertificatesService, getCertificateByIdService, toggleStateCertificateService, updateCertificateService } from '@services/certificate.services'
import {Response, Request} from 'express'

export const createCertificateController = async(req: Request, res: Response) => {
    try {
        const result = await createCertificateService(req.body)
        res.status(result.status).json(result)
    } catch (error) {
        console.error(`Error in createController ${error}`)
        throw new Error(`Error in createController`)
    }
}

export const updateCertificateController = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const data = req.body
        const result = await updateCertificateService(id, data)
        res.status(result.status).json(result)
    } catch (error) {
        console.error(`Error in update controller ${error}`)
        throw new Error(`Error in update controller`)
    }
}

export const getAllCertificatesController = async ( res: Response) => {
    try {
        const result = await getAllCertificatesService()
        res.status(result.status).json(result)
    } catch (error) {
        console.error(`Error in getAll controller ${error}`)
        throw new Error(`Error in getAll controller`)
    }
}

export const getCertificateByIdController = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const result = await getCertificateByIdService(id)
        res.status(result.status).json(result)
    } catch (error) {
        console.error(`Error in getCertificate by id controller ${error}`)
        throw new Error(`Error in getCertificate by id controller`)
    }
}

export const toggleStateCertificateController = async (req: Request, res: Response) =>{
    try {
        const id = req.params.id
        const result = await toggleStateCertificateService(id)
        res.status(result.status).json(result)
    } catch (error) {
        console.error(`Error in toggleStateController ${error}`)
        throw new Error(`Error in toggleStateController`)
    }
}

export const deleteCertificateController = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const result = await deleteCertificateService(id)
        res.status(result.status).json(result)
    } catch (error) {
        console.error(`Error in deleteCertificateController ${error}`)
        throw new Error(`Error in deleteCertificateController`)
    }
}