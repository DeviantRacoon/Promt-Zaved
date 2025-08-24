import { useState } from 'preact/hooks';

export function useToast() {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);

  const show = (msg: string) => {
    setMessage(msg);
    setVisible(true);
    setTimeout(() => setVisible(false), 2000);
  };

  const Toast = visible ? (
    <div className="toast-android">{message}</div>
  ) : null;

  return { show, Toast };
}
