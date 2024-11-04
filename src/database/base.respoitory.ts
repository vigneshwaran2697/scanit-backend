import { Repository } from 'typeorm';

export interface ConditionsObj {
  where?: any;
  relations?: [string];
  take?: number;
  skip?: number;
  order?: any;
}

export class BaseRepository<T> extends Repository<T> {
  public getConditions(conditionObj: ConditionsObj, conditions: any) {
    if (conditions) {
      conditionObj.where = conditions;
    }
    return conditionObj;
  }

  public getRelations(conditionsObj, relations: any) {
    if (relations && relations.length !== 0) {
      conditionsObj.relations = relations;
    }
    return conditionsObj;
  }

  public getPaginationCond(
    conditionObj: ConditionsObj,
    page = 0,
    perPage = 25,
  ) {
    if (page) {
      conditionObj.skip = (page - 1) * perPage;
      conditionObj.take = perPage;
    }
    return conditionObj;
  }

  public getOrderCond(conditionObj: ConditionsObj, orderBy: any) {
    if (orderBy) {
      conditionObj.order = orderBy;
    } else {
      conditionObj.order = {
        createdAt: 'DESC',
      };
    }
    return conditionObj;
  }

  public getFindAllCond(
    conditions?: any,
    relations?: any,
    orderBy?: any,
    page?: number | null,
    perPage?: number,
  ) {
    let conditionsObj: ConditionsObj = {};
    conditionsObj = this.getConditions(conditionsObj, conditions);
    conditionsObj = this.getRelations(conditionsObj, relations);
    conditionsObj = this.getPaginationCond(conditionsObj, page, perPage);
    conditionsObj = this.getOrderCond(conditionsObj, orderBy);
    return conditionsObj;
  }

  public async findAll(
    conditions?: any,
    relations?: any,
    orderBy?: any,
    page?: number,
    perPage?: number,
  ): Promise<T[]> {
    return this.find(
      this.getFindAllCond(conditions, relations, orderBy, page, perPage),
    );
  }

  public async findById(id, relations?: any) {
    return this.findOne({
      where: {
        id,
        ...this.getRelations({}, relations),
      },
    });
  }

  public async findByIdWithRel(id, relations: any) {
    return this.findById(id, relations);
  }

  public async findOneRecord(
    conditions?: any,
    relations?: any,
    orderBy?: any,
    page?: number,
    perPage?: number,
  ): Promise<T> {
    return this.findOne(
      this.getFindAllCond(conditions, relations, orderBy, page, perPage),
    );
  }

  public async findByCond(conditions: any) {
    return this.findAll(conditions);
  }

  public async findByCondRel(conditions: any, relations: any) {
    return this.findAll(conditions, relations);
  }

  public async findByQueryBuilder(
    entityName: string,
    conditions: any,
    relations = [],
    orCondition = null,
  ) {
    let queryBuilder = this.createQueryBuilder(entityName).where(conditions);
    for (const relation of relations) {
      queryBuilder = queryBuilder.leftJoinAndSelect(
        `${entityName}.${relation}`,
        `${relation}s`,
      );
    }
    if (orCondition) {
      queryBuilder.andWhere(orCondition);
    }
    return queryBuilder.getMany();
  }

  public async findByPagination(
    conditions: any,
    page: number,
    perPage: number,
  ) {
    return this.findAll(conditions, [], {}, page, perPage);
  }

  public async findByCondOrder(
    conditions: any,
    orderByField: string,
    orderByType: 'ASC' | 'DESC',
  ) {
    const orderBy: any = {};
    orderBy[orderByField] = orderByType;
    return this.findAll(conditions, [], orderBy);
  }

  public async findOneByCond(conditions: any) {
    return this.findOneRecord(conditions);
  }

  public async findOneByCondRel(conditions: any, relations: any) {
    return this.findOneRecord(conditions, relations);
  }

  public async saveRecord(attributes: any) {
    return this.save(attributes);
  }

  public async createRecord(createInput: any) {
    return this.saveRecord(createInput);
  }

  public async updateRecord(updateInput: any) {
    return this.saveRecord(updateInput);
  }

  public async updateByObj(object, updateAttributes: any) {
    return this.saveRecord({ ...object, ...updateAttributes });
  }

  public async updateById(id, updateAttributes: any) {
    return this.saveRecord({ id, ...updateAttributes });
  }

  public async updateByCond(condition, updateAttributes: any) {
    return this.update(condition, updateAttributes);
  }

  public async deleteRec(recordId) {
    return this.delete(recordId);
  }

  public async softDeleteRec(record, deletedById?) {
    this.updateByObj(record, {
      deletedById,
      deletedAt: new Date(),
    });
    return 'Deleted Successfully!';
  }

  public async softDeleteRecords(entityName: string, deleteIds = []) {
    const softDeleteQuery = this.createQueryBuilder(entityName)
      .softDelete()
      .andWhereInIds(deleteIds);
    console.log(softDeleteQuery);
    return softDeleteQuery.execute();
  }
}
