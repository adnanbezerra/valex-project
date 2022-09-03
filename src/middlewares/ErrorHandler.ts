import { NextFunction, Request, Response } from "express"

export default async function errorHandler(error: any, req: Request, res: Response, next: NextFunction) {
    if (error.type === "error_company_notFound") {
        return res.status(404).send({ message: error.message });
    }
    if (error.type === "error_employee_notFound") {
        return res.status(404).send({ message: error.message });
    }
    if (error.type === "error_employee_hasCard") {
        return res.status(422).send({ message: error.message });
    }
    // res.sendStatus(500)
}