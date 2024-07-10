import EnvironmentConfig from 'src/00-config/enviromentConfig';
import TYPES from 'src/00-config/identifiers';
import ApiRouter from '@rest/routes/api.router';
import express, { Application } from 'express';
import { inject, injectable } from 'inversify';
import path from 'path';

@injectable()
class ExpressServer {
  constructor(
    @inject(TYPES.Application) private readonly _app: Application,
    @inject(TYPES.ApiRouter) private readonly _apiRouter: ApiRouter,
    @inject(TYPES.EnvironmentConfig) private readonly _env: EnvironmentConfig
  ) {
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  private initializeMiddlewares() {
    this._app.use(express.json());
    this._app.use(express.urlencoded({ extended: true }));
    this._app.use(express.static(this._env.publicPath));
  }

  private initializeRoutes() {
    this._app.use('/api', this._apiRouter.router);

    this._app.get('*', (req, res) => {
      const indexPath = path.join(
        __dirname,
        `../../${this._env.publicPath}`,
        'index.html'
      );
      res.sendFile(indexPath);
    });
  }
  public async start(): Promise<void> {
    this._app.listen(this._env.port, () => {
      console.log(`Server running at ${this._env.port}`);
    });
  }
}
export default ExpressServer;
