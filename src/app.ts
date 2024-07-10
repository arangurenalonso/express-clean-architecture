import 'reflect-metadata';
import ExpressServer from './01-presentation/rest/express.server';
import DependencyContainer from 'src/00-config/DependencyContainer';
import TYPES from 'src/00-config/identifiers';
import InversifyResolver from 'src/00-config/inversify.resolver';
import TypeORMInitializer from '@persistence/config/typeorm.config';
import { mediatorSettings } from 'mediatr-ts';
import JobServer from './01-presentation/job/job.server';

async function main() {
  const dependencyContainer = new DependencyContainer();

  const container = dependencyContainer.container;
  mediatorSettings.resolver = new InversifyResolver(container);

  const dataBase = container.get<TypeORMInitializer>(TYPES.TypeORMInitializer);
  const expressServer = container.get<ExpressServer>(TYPES.ExpressServer);

  const jobServer = container.get<JobServer>(TYPES.JobServer);

  jobServer.initialize();
  await dataBase.initialize();
  await expressServer.start();
}

(async () => {
  await main();
})();
