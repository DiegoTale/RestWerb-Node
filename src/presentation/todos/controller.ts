import { Request, Response } from "express";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos";
import { TodoRespository } from "../../domain";
import { GetTodos } from "../../domain/use-cases/todo/get-todos";
import { GetTodo } from "../../domain/use-cases/todo/get-todo";
import { CreateTodo } from "../../domain/use-cases/todo/create-todo";
import { DeleteTodo } from "../../domain/use-cases/todo/delete-todo";
import { UpdateTodo } from "../../domain/use-cases/todo/update-todo";

export class TodosController {
  //* DI
  constructor(private readonly todoRepository: TodoRespository) {}

  public getTodos = (req: Request, res: Response) => {
    /** Este metodo es para realizar el CRUD normal
     * const todos = await prisma.todo.findMany();
     * return res.json(todos);
     */

    /** Usando la inyeccion de dependencias y arquitectura limpia */
    // const todos = await this.todoRepository.getAll();
    // console.log(todos);
    // return res.json(todos);

    // consumir los casos de usos
    new GetTodos(this.todoRepository)
      .execute()
      .then((todos) => res.json(todos))
      .catch((error) => res.status(400).json({ error }));
  };

  public getTodoById = async (req: Request, res: Response) => {
    const id = +req.params.id;
    // En este metodo se uso la inyeccion de dependencias
    // try {
    //   const todo = await this.todoRepository.findById(id);
    //   res.json(todo);
    // } catch (error) {
    //   res.status(400).json({ error });
    // }

    /** Este metodo se utilizo en el todo.datasource.impl.ts
     * if (isNaN(id))
      return res.status(400).json({ error: "ID argument is not a number" });

    const todo = await prisma.todo.findFirst({
      where: { id },
    });

    todo
      ? res.json(todo)
      : res.status(404).json({ error: `TODO with id ${id} not found` });
     * 
     */
    // se consume los casos de usos
    new GetTodo(this.todoRepository)
      .execute(id)
      .then((todo) => res.json(todo))
      .catch((error) => res.status(400).json({ error }));
  };

  public createTodo = (req: Request, res: Response) => {
    const [error, createTodoDto] = CreateTodoDto.create(req.body);
    if (error) return res.status(400).json({ error });

    // const todo = await this.todoRepository.create(createTodoDto!);
    /** Este pedazo de codigo se implemento en todo.datasource.impl.ts ya que se esta usando arquitectura limpia 
     * const todo = await prisma.todo.create({
      data: createTodoDto!,
    });
     * 
     */
    // res.json(todo);

    // se consume los casos de usos implementados
    new CreateTodo(this.todoRepository)
      .execute(createTodoDto!)
      .then((todo) => res.json(todo))
      .catch((error) => res.status(400).json({ error }));
  };

  public updateTodo = (req: Request, res: Response) => {
    const id = +req.params.id;
    const [error, updateTodoDto] = UpdateTodoDto.create({ ...req.body, id });
    if (error) return res.status(400).json({ error });

    // Aca usamos la inyeccion de dependencias
    // const uptatedTodo = await this.todoRepository.updateById(updateTodoDto!);
    // return res.json(uptatedTodo);

    // aca en este apartado consumimos los casos de uso
    new UpdateTodo(this.todoRepository)
      .execute(updateTodoDto!)
      .then((todo) => res.json(todo))
      .catch((error) => res.status(400).json({ error }));
  };

  public deleteTodo = async (req: Request, res: Response) => {
    const id = +req.params.id;

    // const deleteTodo = await this.todoRepository.deleteById(id);
    // res.json(deleteTodo);
    // const todo = await prisma.todo.findFirst({
    //   where: { id },
    // });

    // if (!todo)
    //   return res.status(404).json({ error: `Todo with id ${id} not found` });

    // const deleted = await prisma.todo.delete({
    //   where: { id },
    // });

    // deleted
    //   ? res.json(deleted)
    //   : res.status(400).json({ error: `Todo with id ${id} not found` });

    // se consume los casos de uso
    new DeleteTodo(this.todoRepository)
      .execute(id)
      .then((todo) => res.json(todo))
      .catch((error) => res.status(400).json({ error }));
  };
}
