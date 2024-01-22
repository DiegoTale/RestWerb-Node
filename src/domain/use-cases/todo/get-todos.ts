import { TodoEntity } from "../../entities/todo.entity";
import { TodoRespository } from "../../repositories/todo.respository";

export interface GetTodosUseCase {
  execute(): Promise<TodoEntity[]>;
}

export class GetTodos implements GetTodosUseCase {
  constructor(private readonly repository: TodoRespository) {}

  execute(): Promise<TodoEntity[]> {
    return this.repository.getAll();
  }
}
