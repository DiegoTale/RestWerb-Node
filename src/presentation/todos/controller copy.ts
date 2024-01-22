import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos";
import { TodoRespository } from "../../domain";

export class TodosController {
  //* DI
  constructor(private readonly todoRepository: TodoRespository) {}

  public getTodos = async (req: Request, res: Response) => {
    /** Este metodo es para realizar el CRUD normal
     * const todos = await prisma.todo.findMany();
     * return res.json(todos);
     */

    /** Usando la inyeccion de dependencias y arquitectura limpia */
    const todos = await this.todoRepository.getAll();
    console.log(todos);
    return res.json(todos);
  };

  public getTodoById = async (req: Request, res: Response) => {
    const id = +req.params.id;
    try {
      const todo = await this.todoRepository.findById(id);
      res.json(todo);
    } catch (error) {
      res.status(400).json({ error });
    }

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
  };

  public createTodo = async (req: Request, res: Response) => {
    const [error, createTodoDto] = CreateTodoDto.create(req.body);
    if (error) return res.status(400).json({ error });

    const todo = await this.todoRepository.create(createTodoDto!);
    /** Este pedazo de codigo se implemento en todo.datasource.impl.ts ya que se esta usando arquitectura limpia 
     * const todo = await prisma.todo.create({
      data: createTodoDto!,
    });
     * 
     */

    res.json(todo);
  };

  public updateTodo = async (req: Request, res: Response) => {
    const id = +req.params.id;
    const [error, updateTodoDto] = UpdateTodoDto.create({ ...req.body, id });
    if (error) return res.status(400).json({ error });

    const uptatedTodo = await this.todoRepository.updateById(updateTodoDto!);
    return res.json(uptatedTodo);
  };

  public deleteTodo = async (req: Request, res: Response) => {
    const id = +req.params.id;

    const deleteTodo = await this.todoRepository.deleteById(id);
    res.json(deleteTodo);
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
  };
}
