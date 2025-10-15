import { ErrorRequestHandler } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { sendResponse } from '../utils/response.util';
import { StatusEnum } from '../constraints/types/responseStatus.enum';

export const errorHandler: ErrorRequestHandler = (err, req, res, next): void => {
    console.error(err);
    sendResponse({
        res,
        status: StatusEnum.ERROR,
        message: err.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
        code: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        errors: err.stack || err,
    });
};
