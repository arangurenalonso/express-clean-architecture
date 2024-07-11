import AuthController from '@rest/controllers/auth.controller';
import { Router } from 'express';
import LoginValidation from './validators/login.validator';
import ValidatorMiddleware from '@rest/middlewares/validator.middleware';
import RegisterValidation from './validators/register.validator';
import { inject, injectable } from 'inversify';
import TYPES from '@config/identifiers';
import asyncHandlerMiddleware from '@rest/middlewares/asyncHandler.middleware';

@injectable()
export class AuthRoutes {
  constructor(
    @inject(TYPES.Router) private readonly _router: Router,
    @inject(TYPES.AuthController)
    private readonly _authController: AuthController
  ) {
    this.initRoutes();
    this._router = this._router.bind(this);
  }

  private initRoutes(): void {
    this._router.post(
      '/login',
      LoginValidation,
      ValidatorMiddleware.validate,
      asyncHandlerMiddleware(this._authController.login)
    );
    this._router.post(
      '/register',
      RegisterValidation,
      ValidatorMiddleware.validate,
      asyncHandlerMiddleware(this._authController.register)
    );

    this._router.get(
      '/validate-email/:token',
      asyncHandlerMiddleware(this._authController.validateEmail)
    );
  }
  get router(): Router {
    return this._router;
  }
}
export default AuthRoutes;
