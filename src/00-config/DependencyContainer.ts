import express, { Application, Router } from 'express';
import { Container } from 'inversify';
import { Mediator, IRequestHandler, INotificationHandler } from 'mediatr-ts';
import TYPES from './identifiers';
import LoginCommandHandler from '@application/features/auth/command/login/login.command.handler';
import ApiRouter from '@rest/routes/api.router';
import ExpressServer from '@rest/express.server';
import EnvironmentConfig from './enviromentConfig';
import AuthController from '@rest/controllers/auth.controller';
import AuthRoutes from '@rest/routes/auth/auth.router';
import LoginCommand from '@application/features/auth/command/login/login.command';
import AuthenticationResult from '@application/models/authentication-result.model';
import IUserRepository from '@domain/repositories/IUser.repository';
import UserRepository from '@persistence/repositories/user.repository.impl';
import TypeORMInitializer from '@persistence/config/typeorm.config';
import { DataSource } from 'typeorm';
import RegisterCommand from '@application/features/auth/command/register/register.command';
import UnitOfWork from '@persistence/repositories/commun/UnitOfWork';
import RegisterCommandHandler from '@application/features/auth/command/register/register.command.handler';
import IUnitOfWork from '@domain/repositories/commun/IUnitOfWork';
import UserCreatedDomainEvent from '@domain/user/events/user-created.domain-event';
import UserCreatedDomainEventHandler from '@application/features/auth/command/register/user-create.domain-event-handler';
import IPasswordService from '@application/contracts/Ipassword.service';
import PasswordService from '@service/Password.service.impl';
import TokenService from '@service/token.service.impl';
import ITokenService from '@application/contracts/IToken.service';
import IOutboxMessageRepository from '@domain/repositories/IOutboxMessage.repository';
import OutboxMessageRepository from '@persistence/repositories/OutboxMessage.repository.impl';
import ExecOutboxMessagesCommand from '@application/features/outboxMessages/command/exec-outboxMessages.command';
import ExecOutboxMessagesCommandHandler from '@application/features/outboxMessages/command/exec-outboxMessages.command.handler';
import JobServer from '@job/job.server';
import IEmailService from '@application/contracts/IEmail.service';
import EmailService from '@service/emial.service.impl';
import ValidateEmailCommand from '@application/features/auth/command/validate-email/validate-email.command';
import ValidateEmailCommandHandler from '@application/features/auth/command/validate-email/validate-email.command.handler';
import OutboxMessageJob from '@job/cronJobs/outbox-message.job';
import CronService from '@job/cron.service';
import AuthenticationMiddleware from '@rest/middlewares/authentication.middleware';
import ResultT from '@domain/abstract/result/resultT';

class DependencyContainer {
  private readonly _container: Container;

  constructor() {
    this._container = new Container();
    this.setupDependencies();
  }

  private setupDependencies(): void {
    this.bindMiddelwares();
    this.bindDatabase();
    this.bindDomainEvents();
    this.bindServices();
    this.bindJobs();
    this.bindRepositories();
    this.bindUseCase();
    this.bindControllers();
    this.bindRouters();
    this.bindCore();
    this.bindServer();
  }
  private bindMiddelwares(): void {
    this._container
      .bind<AuthenticationMiddleware>(TYPES.AuthenticationMiddleware)
      .to(AuthenticationMiddleware);
  }
  private bindCore(): void {
    this._container
      .bind<Application>(TYPES.Application)
      .toConstantValue(express());

    this._container
      .bind<Router>(TYPES.Router)
      .toDynamicValue(() => express.Router());

    this._container
      .bind<Mediator>(TYPES.Mediator)
      .toConstantValue(new Mediator());
    this._container
      .bind<CronService>(TYPES.CronService)
      .toConstantValue(new CronService());

    this._container
      .bind<EnvironmentConfig>(TYPES.EnvironmentConfig)
      .to(EnvironmentConfig);
  }

  private bindControllers(): void {
    this._container
      .bind<AuthController>(TYPES.AuthController)
      .to(AuthController);
  }
  private bindRouters(): void {
    this._container.bind<AuthRoutes>(TYPES.AuthRoutes).to(AuthRoutes);
    this._container.bind<ApiRouter>(TYPES.ApiRouter).to(ApiRouter);
  }

  private bindJobs(): void {
    this._container
      .bind<OutboxMessageJob>(TYPES.OutboxMessageJob)
      .to(OutboxMessageJob);
  }
  private bindUseCase(): void {
    this._container
      .bind<IRequestHandler<LoginCommand, AuthenticationResult>>('LoginCommand')
      .to(LoginCommandHandler);
    this._container
      .bind<IRequestHandler<RegisterCommand, ResultT<AuthenticationResult>>>(
        'RegisterCommand'
      )
      .to(RegisterCommandHandler);
    this._container
      .bind<IRequestHandler<ExecOutboxMessagesCommand, void>>(
        'ExecOutboxMessagesCommand'
      )
      .to(ExecOutboxMessagesCommandHandler);
    this._container
      .bind<IRequestHandler<ValidateEmailCommand, void>>('ValidateEmailCommand')
      .to(ValidateEmailCommandHandler);
  }
  private bindServices(): void {
    this._container
      .bind<IPasswordService>(TYPES.IPasswordService)
      .to(PasswordService);

    this._container.bind<ITokenService>(TYPES.ITokenService).to(TokenService);
    this._container.bind<IEmailService>(TYPES.IEmailService).to(EmailService);
  }
  private bindRepositories(): void {
    this._container.bind<IUnitOfWork>(TYPES.IUnitOfWork).to(UnitOfWork);
    this._container
      .bind<IOutboxMessageRepository>(TYPES.IOutboxMessageRepository)
      .to(OutboxMessageRepository);

    this._container
      .bind<IUserRepository>(TYPES.IUserRepository)
      .to(UserRepository);
  }
  private bindDomainEvents(): void {
    this._container
      .bind<INotificationHandler<UserCreatedDomainEvent>>(
        'UserCreatedDomainEventHandler'
      )
      .to(UserCreatedDomainEventHandler);
  }
  private bindDatabase(): void {
    this._container
      .bind<TypeORMInitializer>(TYPES.TypeORMInitializer)
      .to(TypeORMInitializer)
      .inSingletonScope();

    this._container
      .bind<DataSource>(TYPES.DataSource)
      .toDynamicValue(() => {
        const dataBase = this._container.get<TypeORMInitializer>(
          TYPES.TypeORMInitializer
        );
        return dataBase.dataSource;
      })
      .inSingletonScope();
  }
  private bindServer(): void {
    this._container.bind<ExpressServer>(TYPES.ExpressServer).to(ExpressServer);

    this._container.bind<JobServer>(TYPES.JobServer).to(JobServer);
  }
  get container(): Container {
    return this._container;
  }
}
export default DependencyContainer;
