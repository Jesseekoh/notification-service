interface User {
  _id: string;
  name: string;
  email: string;
}
interface NotificationPreference {
  emailNotifications: boolean;
  smsNotifications?: boolean;
}
