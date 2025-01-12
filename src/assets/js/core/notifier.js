import Swal from 'sweetalert2';

export function initiateNotifier() {
  salla.notify.setNotifier(function (message, type, data) {
    if (typeof message == 'object') {
      return Swal.fire(message).then(type);
    }

    return Swal.mixin({
      toast: true,
      position: salla.config.get('theme.is_rtl') ? 'top-start' : 'top-end',
      showConfirmButton: false,
      timer: 3500,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    }).fire({
      icon: type,
      title: message,
      showCloseButton: true,
      timerProgressBar: true
    });
  });
}