import { IRequest } from 'mediatr-ts';

class ValidateEmailCommand implements IRequest<void> {
  constructor(public readonly token: string) {}
}

export default ValidateEmailCommand;
