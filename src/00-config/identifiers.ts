const TYPES = {
  Application: Symbol.for('Application'),
  ExpressServer: Symbol.for('ExpressServer'),
  JobServer: Symbol.for('JobServer'),
  Router: Symbol.for('Router'),
  Mediator: Symbol.for('Mediator'),
  TypeORMInitializer: Symbol.for('TypeORMInitializer'),
  EnvironmentConfig: Symbol.for('EnvironmentConfig'),
  DataSource: Symbol.for('DataSource'),
  EntityManager: Symbol.for('EntityManager'),

  CronService: Symbol.for('CronService'),
  //Jobs
  OutboxMessageJob: Symbol.for('OutboxMessageJob'),
  // Middlewares
  AuthenticationMiddleware: Symbol.for('AuthenticationMiddleware'),
  // Routers
  ApiRouter: Symbol.for('ApiRouter'),
  AuthRoutes: Symbol.for('AuthRoutes'),
  // Controllers
  AuthController: Symbol.for('AuthController'),
  // UseCases
  //Services
  IPasswordService: Symbol.for('IPasswordService'),
  ITokenService: Symbol.for('ITokenService'),
  IEmailService: Symbol.for('IEmailService'),
  // Repositories
  IUnitOfWork: Symbol.for('IUnitOfWork'),
  IBaseRepository: Symbol.for('IBaseRepository'),
  IUserRepository: Symbol.for('IUserRepository'),
  IOutboxMessageRepository: Symbol.for('IOutboxMessageRepository'),
};
export default TYPES;
