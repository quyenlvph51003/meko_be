const jwt = require('jsonwebtoken');


//authenticate
const authenticate = (req, res, next) => {
    try {
        // Lấy token từ header
        const token = req.headers.authorization;
        
        if (!token) {
            return res.status(401).json({ 
                datetime: new Date(),
                errorCode: 401,
                message: 'Không có token',
                data: null,
                success: false
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Gắn thông tin user vào request
        req.user = decoded;
        
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                datetime: new Date(),
                errorCode: 401,
                message: 'Token không hợp lệ',
                data: null,
                success: false,
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                datetime: new Date(),
                errorCode: 401,
                message: 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại',
                data: null,
                success: false,
            });
        }
        return res.status(500).json({ 
            datetime: new Date(),
            errorCode: 500,
            data: null,
            message: 'Lỗi hệ thống, vui lòng liên hệ quản trị viên',
            success: error.message 
        });
    }
};


//role

// authorize.js
const authorize = (roles = []) => {
    return (req, res, next) => {
        try {
            const role = req.user?.role;

            // Nếu không có role trong token => xem như không đủ quyền
            if (!role) {
                return res.status(403).json({
                    datetime: new Date(),
                    errorCode: 403,
                    message: 'Bạn không có quyền truy cập',
                    data: null,
                    success: false,
                });
            }

            // Nếu roles truyền vào rỗng => nghĩa là chấp nhận tất cả
            if (roles.length === 0 || roles.includes(role)) {
                return next();
            }

            // Nếu role không nằm trong danh sách cho phép
            return res.status(403).json({
                datetime: new Date(),
                errorCode: 403,
                message: 'Bạn không đủ quyền để truy cập tài nguyên này',
                data: null,
                success: false,
            });

        } catch (error) {
            return res.status(500).json({
                datetime: new Date(),
                errorCode: 500,
                data: null,
                message: 'Lỗi hệ thống, vui lòng liên hệ quản trị viên',
                success: error.message
            });
        }
    };
};


module.exports = {authenticate,authorize};