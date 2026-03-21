const handleError = (error) => {
  if (error.message) return error.message;
  return "Đã xảy ra lỗi, vui lòng thử lại";
};

export default handleError;