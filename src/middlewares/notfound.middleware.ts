import { RequestHandler } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { sendResponse } from '../utils/response.util';
import { StatusEnum } from '../constraints/types/responseStatus.enum';

export const notFound: RequestHandler = (req, res): void => {
    sendResponse({
        res,
        status: StatusEnum.ERROR,
        message: ReasonPhrases.NOT_FOUND,
        code: StatusCodes.NOT_FOUND,
    });
};
