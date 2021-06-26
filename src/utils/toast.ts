import toast from 'react-hot-toast';
export function showToast(type: string, message: string) {
  switch (type) {
    case 'success':
      toast.success(message,
        {
          style: {
            background: '#835afd',
            color: '#fff',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#835afd',
          },
        }
      );
      break;
    case 'error':
      toast.error(message,
        {
          style: {
            background: '#db5656',
            color: '#fff',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#db5656',
          },
        }
      );
      break;

    default:
      break;
  }
}