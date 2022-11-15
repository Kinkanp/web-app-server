import { injectable, inject, Container } from "inversify";
import "reflect-metadata";

type data = string[];
const TYPES = {
  Repository: Symbol.for("Repository"),
  Service: Symbol.for("Service"),
  Controller: Symbol.for("Controller"),
  VALUE: Symbol.for('value')
};

const VALUE = 333;

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
  constructor(
    @inject(TYPES.VALUE) private value: number,
  ) {
  }

  getDataFromDB(): data {
    return ['test', 'test3', 'test5'];
  }
}

@injectable()
class Service implements IService {
  constructor(
    @inject(TYPES.Repository) private repo: IRepository,
  ) {
  }

  getDataFromRepo(): data {
    return this.repo.getDataFromDB();
  }
}

@injectable()
class Controller implements IController {
  constructor(
    @inject(TYPES.Service) private service: IService,
  ) {
  }

  getData(): data {
    return this.service.getDataFromRepo();
  }
}

const globalContainer = new Container();

globalContainer.bind<number>(TYPES.VALUE).toConstantValue(VALUE);

// const container = new Container();
//
// container.bind<IRepository>(TYPES.Repository).to(Repository);
// container.bind<IService>(TYPES.Service).to(Service);
// container.bind<IController>(TYPES.Controller).to(Controller);
// container.parent = globalContainer;
// const controller = container.get<IController>(TYPES.Controller);
// console.log(controller.getData());

const container2 = new Container();

container2.parent = globalContainer;