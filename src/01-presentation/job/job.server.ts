import TYPES from '@config/identifiers';
import { inject, injectable } from 'inversify';
import OutboxMessageJob from './cronJobs/outbox-message.job';

@injectable()
class JobServer {
  constructor(
    @inject(TYPES.OutboxMessageJob) private _outboxMessageJob: OutboxMessageJob
  ) {}
  public initialize() {
    this._outboxMessageJob.start();
  }
}

export default JobServer;
