// utils/response.js

/**
 * Success response helper
 * @param {Object} res - Express response object
 * @param {*} data - Data to return
 * @param {String} message - Success message
 * @param {Number} statusCode - HTTP status code (default: 200)
 */
const successResponse = (res, data = null, message = 'Thành công', statusCode = 200) => {
    return res.status(statusCode).json({
        datetime: new Date(),
        errorCode: 200,
        message: message,
        data: data,
        success: true
    });
};

/**
 * Error response helper
 * @param {Object} res - Express response object
 * @param {String} message - Error message
 * @param {Number} errorCode - Error code (default: 500)
 * @param {*} data - Additional error data (optional)
 */
const errorResponse = (res, message = 'Có lỗi xảy ra', errorCode = 500, data = null) => {
    return res.status(errorCode).json({
        datetime: new Date(),
        errorCode: errorCode,
        message: message,
        data: data,
        success: false
    });
};

/**
 * Validation error response
 * @param {Object} res - Express response object
 * @param {String} message - Validation error message
 */
const validationErrorResponse = (res, message = 'Dữ liệu không hợp lệ') => {
    return res.status(400).json({
        datetime: new Date(),
        errorCode: 400,
        message: message,
        data: null,
        success: false
    });
};

/**
 * Not found response
 * @param {Object} res - Express response object
 * @param {String} message - Not found message
 */
const notFoundResponse = (res, message = 'Không tìm thấy tài nguyên') => {
    return res.status(404).json({
        datetime: new Date(),
        errorCode: 404,
        message: message,
        data: null,
        success: false
    });
};

/**
 * Unauthorized response
 * @param {Object} res - Express response object
 * @param {String} message - Unauthorized message
 */
const unauthorizedResponse = (res, message = 'Không có quyền truy cập') => {
    return res.status(401).json({
        datetime: new Date(),
        errorCode: 401,
        message: message,
        data: null,
        success: false
    });
};

/**
 * Forbidden response
 * @param {Object} res - Express response object
 * @param {String} message - Forbidden message
 */
const forbiddenResponse = (res, message = 'Bạn không có quyền thực hiện hành động này') => {
    return res.status(403).json({
        datetime: new Date(),
        errorCode: 403,
        message: message,
        data: null,
        success: false
    });
};

/**
 * Server error response
 * @param {Object} res - Express response object
 * @param {String} message - Error message
 * @param {*} error - Error object (optional, for development)
 */
const serverErrorResponse = (res, message = 'Lỗi hệ thống, vui lòng liên hệ quản trị viên', error = null) => {
    return res.status(500).json({
        datetime: new Date(),
        errorCode: 500,
        message: message,
        data: error,
        success: false
    });
};

export default {
    successResponse,
    errorResponse,
    validationErrorResponse,
    notFoundResponse,
    unauthorizedResponse,
    forbiddenResponse,
    serverErrorResponse
};