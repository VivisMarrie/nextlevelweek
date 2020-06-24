import knex from "../database/connection";
import { Request, Response} from "express";

class PointsController{
    async create(request: Request, response: Response){

        const {
            name,
            email,
            whats,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;
      
        const trx = await knex.transaction();

        const point = {
            image: request.file.filename,
                name,
                email,
                whats,
                latitude,
                longitude,
                city,
                uf        
        }
      
        const inserted_ids = await trx('points').insert(point);
       const point_id = inserted_ids[0];

        const pointItems = items
        .split(',')
        .map((item_id: number) =>{
            return {
                item_id,
                point_id
            }
        });

        await trx('point_items').insert(pointItems);

        await trx.commit();

        return response.json({id: point_id,
        ...point});
    }

    async show(request: Request, response: Response){
    const { id } = request.params;

    const pointBD = await knex('points').where('id', id).first();
    
    const items = await knex('items').join('point_items',
    'items.id', '=', 'point_items.item_id')
    .where('point_items.point_id', id).select('items.title');
        
    const point = {        
              ...pointBD,
          image_url: `http://192.168.1.7:3333/uploads/${pointBD.image}`,
      };
    
    if(!point){
        return response.status(400)
        .json({ message: 'not found' });
    }

    return response.json({point, items});
}

async index(request: Request, response: Response){
    const { city, uf, items } = request.query;
    
    const parsedItems = String(items).split(',')
        .map(item => Number(item.trim()));

    const points = await knex('points')
    .join('point_items', 'points.id', '=', 'point_items.point_id')
    .whereIn('point_items.item_id', parsedItems)
    .where('city', String(city))
    .where('uf', String(uf))
    .distinct()
    .select('points.*');

    const serializedPoints = points.map((point) => {
        return {
              ...point,
          image_url: `http://192.168.1.7:3333/uploads/${point.image}`,
        };
    });
    return response.json(serializedPoints);
}

}

export default PointsController;