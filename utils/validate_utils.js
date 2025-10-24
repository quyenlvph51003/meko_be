
import { PostStatus } from "./enum.common.js";
function isValidEmail(email) {
    // Regex chuẩn để check email
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
  
function isValidPostStatus(status) {
  if (!status) return false; // tránh null/undefined
  return Object.values(PostStatus).includes(status.toUpperCase());
}

  export default { isValidEmail,isValidPostStatus };  
  