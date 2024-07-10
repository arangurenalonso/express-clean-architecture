import { INotification } from 'mediatr-ts';

class UserCreatedDomainEvent implements INotification {
  constructor(public value?: string) {}
}
export default UserCreatedDomainEvent;
