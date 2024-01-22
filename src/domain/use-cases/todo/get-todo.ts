import { TodoEntity } from "../../entities/todo.entity";
import { TodoRespository } from "../../repositories/todo.respository";

export interface GetTodoUseCase {
  execute(id: number): Promise<TodoEntity>;
}

export class GetTodo implements GetTodoUseCase {
  constructor(private readonly repository: TodoRespository) {}

  execute(id: number): Promise<TodoEntity> {
    return this.repository.findById(id);
  }
}
