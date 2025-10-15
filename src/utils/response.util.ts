
import { Response } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { StatusEnum } from '../constraints/types/responseStatus.enum';


interface ApiResponseOptions {
    res: Response;
    status?: StatusEnum;
    message?: string;
    data?: any;
    code?: number;
    errors?: any;
}

export const sendResponse = ({
    res,
    status = StatusEnum.SUCCESS,
    message = ReasonPhrases.OK,
    data = null,
    code = StatusCodes.OK,
    errors = null,
}: ApiResponseOptions) => {
    const responseBody: any = {
        status,
        message,
        code,
    };

    if (data) responseBody.data = data;
    if (errors) responseBody.errors = errors;

    return res.status(code).json(responseBody);
};
