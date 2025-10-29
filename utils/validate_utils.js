
import { PostStatus } from "./enum.common.js";
import {ReportStatus} from "./enum.common.js";
function isValidEmail(email) {
    // Regex chuẩn để check email
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
  
function isValidPostStatus(status) {
  if (!status) return false; // tránh null/undefined
  return Object.values(PostStatus).includes(status.toUpperCase());
}

function isValidVietnamPhone(phone) {
  return /^(?:\+84|0)(?:3|5|7|8|9)\d{8}$/.test(phone);
}

function isValidReportStatus(status) {
  if (!status) return false; // tránh null/undefined
  return Object.values(ReportStatus).includes(status.toUpperCase());
}

export default { isValidEmail,isValidPostStatus,isValidVietnamPhone,isValidReportStatus};  
  