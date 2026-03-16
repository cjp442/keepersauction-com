import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

type NotifyFn = (type: string, message: string) => void;

let activeNotifyFn: NotifyFn = () => {};

const Notifications = () => {
    const [notifications, setNotifications] = React.useState<{type: string; message: string; id: number}[]>([]);

    React.useEffect(() => {
        activeNotifyFn = (type, message) => {
            const newNotification = { type, message, id: Date.now() };
            setNotifications((prev) => [...prev, newNotification]);
            setTimeout(() => {
                setNotifications((prev) => prev.filter(n => n.id !== newNotification.id));
            }, 5000);
        };
        return () => { activeNotifyFn = () => {}; };
    }, []);

    return (
        <ToastContainer position="top-end">
            {notifications.map((notification) => (
                <Toast key={notification.id} bg={notification.type}>
                    <Toast.Body>{notification.message}</Toast.Body>
                </Toast>
            ))}
        </ToastContainer>
    );
};

export default Notifications;

export const notifyPurchaseSuccess = (message: string) => activeNotifyFn('success', message);
export const notifyPlayerJoined = (message: string) => activeNotifyFn('info', message);
export const notifyStreamStarted = (message: string) => activeNotifyFn('success', message);
export const notifyError = (message: string) => activeNotifyFn('danger', message);
export const notifyAdminAction = (message: string) => activeNotifyFn('warning', message);