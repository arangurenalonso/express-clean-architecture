import { Router } from 'express';
import AuthRoutes from './auth/auth.router';
import TYPES from '@config/identifiers';
import { inject, injectable } from 'inversify';

@injectable()
class ApiRouter {
  constructor(
    @inject(TYPES.Router) private readonly _router: Router,
    @inject(TYPES.AuthRoutes) private readonly _authRoutes: AuthRoutes
  ) {
    this.init();
    this._router = this._router.bind(this);
  }

  private init(): void {
    this._router.use('/auth', this._authRoutes.router);
  }
  get router(): Router {
    return this._router;
  }
}

export default ApiRouter;
