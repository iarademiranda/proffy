import {Request, Response}  from 'express'
import db from '../database/connection';
import convertHourToMinutes from '../utils/convertHourToMinutes';
interface IClass {
    subject: string;
    cost: number;
    id: number;
    user_id: number;
  }
  
  interface IClassSchedule {
    week_day: number;
    from: number;
    to: number;
    id: number;
    class_id: number;
  }
interface ScheduleItem {
    week_day:number,
    from: string;
    to: string;

}
export default class ClassesController{
//listagem de aulas com filtros
async index(req: Request, res: Response) {
    const filters = req.query;
    if (!filters.subject || !filters.week_day || !filters.time) {
      return res
        .status(400)
        .json({ error: 'Não foram enviados os filtros corretos' });
    }
    const { subject, week_day, time } = filters as {
      subject: string;
      week_day: string;
      time: string;
    };
    const timeInMinutes = convertHourToMinutes(time);
     
    const classes = await db('classes')
      .whereExists(function () {
        this.select('class_schedule.*')
          .from('class_schedule')
          .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
          .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)])
          .whereRaw('`class_schedule`.`from` <= ??', [timeInMinutes])
          .whereRaw('`class_schedule`.`to` > ??', [timeInMinutes]);
      })
      .where('classes.subject', '=', subject)
      .join('users', 'classes.user_id', '=', 'users.id')
      .select(['classes.*', 'users.*']);
    return res.send(classes);
    
    }
//criação de aulas
    async create(request: Request, response:Response){
        const {
            name,
            avatar,
            whatsapp,
            bio,
            subject,
            cost,
            schedule
        } = request.body;
    
        const trx = await db.transaction();
    try {
        const insertdUsersIds= await trx('users').insert({
                 name,
                 avatar,
                 whatsapp,
                 bio,
         });
         const user_id = insertdUsersIds[0];
         const insertedClassesIds =await trx('classes').insert({
             subject,
             cost,
             user_id,
         });
     
         const class_id = insertedClassesIds[0];
         const classSchedule = schedule.map( (scheduleItem:ScheduleItem)=>{
                return{
                    class_id,
                     week_day: scheduleItem.week_day,
                     from: convertHourToMinutes(scheduleItem.from),
                     to: convertHourToMinutes(scheduleItem.to)
                 };
             })
             await trx('class_schedule').insert(classSchedule);
             await trx.commit();
             return response.status(201).send();
        
    } catch (err) {
        console.log(err);
        await trx.rollback();
        return response.status(400).json({
            error:'Unexpected error while creating new class'
            
        })
        
    }
    };
}