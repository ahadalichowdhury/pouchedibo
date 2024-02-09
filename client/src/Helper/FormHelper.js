import { toast } from 'react-toastify';

let emailRegex =/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

let mobileNumberRegex = /(^(\+88|0088)?(01){1}[3456789]{1}(\d){8})$/;

let passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/;

class FormHelper {
  isEmpty(value) {
    return value.length === 0;
  }

  isMobile(value) {
    return !mobileNumberRegex.test(value);
  }

  isEmailValid(value) {
    return !emailRegex.test(value);
  }

  isPasswordValid(value) {
    return !passwordRegex.test(value);
  }
  errorToast(message) {
    toast.error(message, { position: "top-right" });
  }
  successToast(message) {
    toast.success(message, { position: "top-right" });
  }
}

export const { isEmpty, isMobile, isEmailValid,isPasswordValid, errorToast, successToast } =
  new FormHelper();
