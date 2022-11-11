import { injectable, inject, Container } from "inversify";
import "reflect-metadata";

type data = string[];
const TYPES = {
  Repository: Symbol.for("Repository"),
  Service: Symbol.for("Service"),
  Controller: Symbol.for("Controller")
};

interface IRepository {
  getDataFromDB(): data;
}

interface IService {
  getDataFromRepo(): data;
}

interface IController {
  getData(): data;
}

@injectable()
class Repository implements IRepository {
  getDataFromDB(): data {
    return ['test', 'test3', 'test5'];
  }
}

@injectable()
class Service implements IService {
  constructor(@inject(TYPES.Repository) private repo: IRepository) {
  }

  getDataFromRepo(): data {
    return this.repo.getDataFromDB();
  }
}

@injectable()
class Controller implements IController {
  constructor(@inject(TYPES.Service) private service: IService) {
  }

  getData(): data {
    return this.service.getDataFromRepo();
  }
}

const container = new Container();

container.bind<IRepository>(TYPES.Repository).to(Repository);
container.bind<IService>(TYPES.Service).to(Service);
container.bind<IController>(TYPES.Controller).to(Controller);

const controller = container.get<IController>(TYPES.Controller);

console.log(controller.getData());