import { NotFoundException } from '@nestjs/common';
import {
  assign,
  difference,
  find,
  join,
  keys,
  map,
  omit,
  pullAll,
} from 'lodash';
import {
  FindManyOptions,
  FindOneOptions,
  getManager,
  getRepository,
  Repository,
} from 'typeorm';

export type QuickOrmRelationMetadata = {
  inverseRelationJoinColumnReference?: string;
  inverseRelationJoinColumn?: string;
  junctionClass?: any;
  junctionName?: string;
  joinColumn?: string;
  joinColumnReference?: string;
  inverseJoinColumn?: string;
  inverseJoinColumnReference?: string;
};
export type QuickOrmRelation = {
  type: string;
  class: any;
  repository: Repository<any>;
  metadata: QuickOrmRelationMetadata;
  pivotColumn: string;
  active: boolean;
  entities: any[];
  oldEntities: any[];
};

export type QuickOrmRelations = {
  [name: string]: QuickOrmRelation;
};

export type QuickOrmRelationParamObject = {
  name: string;
  pivotColumn: string;
};
// Typeguard
export const isQuickOrmRelationParamObject = (
  x: any,
): x is QuickOrmRelationParamObject =>
  (<QuickOrmRelationParamObject>x).name !== undefined;

export type QuickOrmRelationParam = string[] | QuickOrmRelationParamObject[];

// interface HookParam<T1, T2 = void> {
//   (entity: T1): T2;
//   T1: any;
// }
export type HookParam =
  | Record<string, any>
  | ((entity?: any) => void)
  | ((relation?: string, entity?: any) => void);

export class QuickOrm {
  public repository: Repository<any>;
  public entityClass: any;
  public entity: any;
  public relations: QuickOrmRelations = {};
  public transaction: any;

  private beforeCreateHook: HookParam;
  private afterCreateHook: HookParam;
  private beforeRelationCreateHook: HookParam;
  private afterRelationCreateHook: HookParam;

  private beforeUpdateHook: HookParam;
  private afterUpdateHook: HookParam;
  private beforeRelationUpdateHook: HookParam;
  private afterRelationUpdateHook: HookParam;

  constructor(repository: Repository<any>, relations?: QuickOrmRelationParam) {
    this.repository = repository;
    this.entityClass = repository.metadata.target;
    this.loadRelations();
    this.setActiveRelations(relations);

    return this;
  }

  addRelation(relation: string, pivotColumn = 'id'): this {
    if (this.relations.hasOwnProperty(relation)) {
      this.relations[relation].active = true;
      this.relations[relation].pivotColumn = pivotColumn;
    }

    return this;
  }

  setActiveRelations(relations: QuickOrmRelationParam): this {
    if (typeof relations === 'boolean' && relations) {
      for (const relation in this.relations) {
        this.relations[relation].active = true;
        this.relations[relation].pivotColumn = 'id';
      }
    } else if (relations instanceof Array) {
      relations.forEach((relation) => {
        if (
          typeof relation === 'string' &&
          this.relations.hasOwnProperty(relation)
        ) {
          this.relations[relation].active = true;
          this.relations[relation].pivotColumn = 'id';
        } else if (
          isQuickOrmRelationParamObject(relation) &&
          this.relations.hasOwnProperty(relation.name)
        ) {
          this.relations[relation.name].active = true;
          this.relations[relation.name].pivotColumn = relation.pivotColumn;
        }
      });
    }

    return this;
  }

  beforeCreate(param: HookParam): void {
    this.beforeCreateHook = param;
  }

  afterCreate(param: HookParam): void {
    this.afterCreateHook = param;
  }

  beforeRelationCreate(param: HookParam): void {
    this.beforeRelationCreateHook = param;
  }

  afterRelationCreate(param: HookParam): void {
    this.afterRelationCreateHook = param;
  }

  beforeUpdate(param: HookParam): void {
    this.beforeUpdateHook = param;
  }

  afterUpdate(param: HookParam): void {
    this.afterUpdateHook = param;
  }

  beforeRelationUpdate(param: HookParam): void {
    this.beforeRelationUpdateHook = param;
  }

  afterRelationUpdate(param: HookParam): void {
    this.afterRelationUpdateHook = param;
  }

  relation(relation: string): QuickOrm {
    if (!this.relations.hasOwnProperty(relation)) {
      throw new Error(`Relation ${relation} not found`);
    }

    return new QuickOrm(this.relations[relation].repository);
  }

  async findOne(id: any, options: FindOneOptions = {}): Promise<any> {
    options.relations = this.getActiveRelationNames();

    this.entity = await this.repository.findOne(id, options);

    if (!this.entity) {
      throw new NotFoundException(
        `Unable to find ${this.repository.metadata.name} with id: ${id}`,
      );
    }

    return this.entity;
  }

  async find(options: FindManyOptions = {}): Promise<any> {
    options.relations = this.getActiveRelationNames();

    this.entity = await this.repository.find(options);

    return this.entity;
  }

  get(): any {
    return this.entity;
  }

  async save(): Promise<any> {
    // if (this.transaction) {
    //   return this.transaction.save(this.entity);
    // }

    return this.repository.save(this.entity);
  }

  async create(data: any, relations?: QuickOrmRelationParam): Promise<any> {
    this.parseIdsToInt(data);

    if (relations) {
      this.setActiveRelations(relations);
    }

    await Promise.resolve(
      getManager().transaction(async (transaction) => {
        this.transaction = transaction;

        this.entity = this.repository.create();
        assign(this.entity, omit(data, keys(this.relations)));

        await this.callHook(this.beforeCreateHook, this.entity);
        await this.transaction.save(this.entity);
        await this.callHook(this.afterCreateHook, this.entity);

        for (const relation in this.relations) {
          if (
            data.hasOwnProperty(relation) &&
            this.relations[relation].active
          ) {
            if (this.relations[relation].type === 'one-to-many') {
              await this.createOneToManyRelationSave(relation, data[relation]);
            } else {
              await this.createManyToManyRelationSave(relation, data[relation]);
            }
          }
        }
      }),
    );

    return this.entity;
  }

  async update(
    data: any,
    conditions: any = {},
    relations?: QuickOrmRelationParam,
  ): Promise<any> {
    this.parseIdsToInt(data);

    if (relations) {
      this.setActiveRelations(relations);
    }

    const options: FindOneOptions = {
      relations: this.getActiveRelationNames(),
    };
    if (conditions) options.where = conditions;

    this.entity = await this.repository.findOne(data.id, options);

    if (!this.entity) {
      throw new NotFoundException(
        `Unable to find ${this.repository.metadata.name} with id: ${data.id}`,
      );
    }

    this.loadRelationOldEntities();

    assign(this.entity, omit(data.update, keys(this.relations)));
    await Promise.resolve(
      getManager().transaction(async (transaction) => {
        this.transaction = transaction;

        await this.callHook(this.beforeUpdateHook, this.entity);
        await this.transaction.save(this.entity);
        await this.callHook(this.afterUpdateHook, this.entity);

        for (const relation in this.relations) {
          if (
            data.update.hasOwnProperty(relation) &&
            this.relations[relation].active
          ) {
            if (this.relations[relation].type === 'one-to-many') {
              await this.updateOneToManyRelationSave(
                relation,
                data.update[relation],
              );
            } else {
              await this.updateManyToManyRelationSave(
                relation,
                data.update[relation],
              );
            }
          }
        }
      }),
    );

    return this.entity;
  }

  assign(values): this {
    assign(this.entity, values);
    return this;
  }

  private async createOneToManyRelationSave(
    relation: string,
    data: any[],
  ): Promise<void> {
    await Promise.all(
      data.map(async (item) => {
        const newRelationEntity = this.relations[relation].repository.create();

        newRelationEntity[
          this.relations[relation].metadata.inverseRelationJoinColumn
        ] = this.entity.id;

        assign(newRelationEntity, item);

        await this.callRelationHook(
          this.beforeRelationCreateHook,
          relation,
          newRelationEntity,
        );
        await this.transaction.save(newRelationEntity);
        await this.callRelationHook(
          this.afterRelationCreateHook,
          relation,
          newRelationEntity,
        );

        this.relations[relation].entities.push(newRelationEntity);
      }),
    );
  }

  private async createManyToManyRelationSave(
    relation: string,
    data: any[],
  ): Promise<void> {
    this.relations[relation].entities = await Promise.all(
      data.map(async (item) => {
        let newRelationEntity = await this.relations[
          relation
        ].repository.findOne({
          where: { id: item[this.relations[relation].pivotColumn] },
        });

        if (!newRelationEntity) {
          newRelationEntity = this.relations[relation].repository.create();
        }
        assign(newRelationEntity, item);

        await this.callRelationHook(
          this.beforeRelationCreateHook,
          relation,
          newRelationEntity,
        );
        await this.transaction.save(newRelationEntity);
        await this.callRelationHook(
          this.afterRelationCreateHook,
          relation,
          newRelationEntity,
        );
        return newRelationEntity;
      }),
    );

    await Promise.all(
      this.relations[relation].entities.map(async (entity) => {
        // INSERT INTO "customer_tag"("customer_id", "tag_id") VALUES ([customerId], [tagId]) RETURNING "id"
        const query = `INSERT INTO "${this.relations[relation].metadata.junctionName}"("${this.relations[relation].metadata.joinColumn}", "${this.relations[relation].metadata.inverseJoinColumn}") VALUES (${this.entity.id}, ${entity.id}) RETURNING "id"`;

        await this.transaction.query(query);
      }),
    );
  }

  private async updateOneToManyRelationSave(
    relation: string,
    data: any[],
  ): Promise<void> {
    const oldEntityIds = map(this.relations[relation].oldEntities, 'id');

    data.forEach((item) => {
      const pivotColumn = this.relations[relation].pivotColumn;

      let relationEntity = find(this.relations[relation].oldEntities, {
        [pivotColumn]: item[pivotColumn],
      });

      if (relationEntity) {
        assign(relationEntity, omit(item, [pivotColumn]));
        this.relations[relation].entities.push(relationEntity);
      } else {
        if (pivotColumn !== 'id' || !item[pivotColumn]) {
          relationEntity = this.relations[relation].repository.create();
          relationEntity[
            this.relations[relation].metadata.inverseRelationJoinColumn
          ] = this.entity.id;
          assign(relationEntity, item);
          this.relations[relation].entities.push(relationEntity);
        }
      }
    });

    const newEntityIds = map(this.relations[relation].entities, 'id');
    const orphanedEntityIds = difference(oldEntityIds, newEntityIds);

    // Should delete first before update
    // Confirming that if pivotColum value is null means create new record
    if (orphanedEntityIds.length > 0) {
      // @todo: Consider deletion through transaction query
      await this.relations[relation].repository.delete(orphanedEntityIds);
    }

    await Promise.all(
      this.relations[relation].entities.map(async (entity) => {
        await this.callRelationHook(
          this.beforeRelationUpdateHook,
          relation,
          entity,
        );
        await this.transaction.save(entity);
        await this.callRelationHook(
          this.afterRelationUpdateHook,
          relation,
          entity,
        );
      }),
    );
  }

  private async updateManyToManyRelationSave(
    relation: string,
    data: any[],
  ): Promise<void> {
    const oldEntityIds = map(this.relations[relation].oldEntities, 'id');
    const updatedIds = [];

    this.relations[relation].entities = await Promise.all(
      data.map(async (item) => {
        const pivotColumn = this.relations[relation].pivotColumn;

        let relationEntity = find(this.relations[relation].oldEntities, {
          [pivotColumn]: item[pivotColumn],
        });

        if (relationEntity) {
          assign(relationEntity, omit(item, [pivotColumn]));
          updatedIds.push(relationEntity.id);
        } else {
          relationEntity = await this.relations[relation].repository.findOne({
            [pivotColumn]: item[pivotColumn],
          });
          if (relationEntity) {
            assign(relationEntity, omit(item, [pivotColumn]));
          } else if (pivotColumn !== 'id' || !item[pivotColumn]) {
            relationEntity = this.relations[relation].repository.create();
            relationEntity[
              this.relations[relation].metadata.inverseRelationJoinColumn
            ] = this.entity.id;
            assign(relationEntity, item);
          }
        }
        return relationEntity;
      }),
    );

    await Promise.all(
      this.relations[relation].entities.map(async (entity) => {
        await this.callRelationHook(
          this.beforeRelationUpdateHook,
          relation,
          entity,
        );
        await this.transaction.save(entity);
        await this.callRelationHook(
          this.afterRelationUpdateHook,
          relation,
          entity,
        );
      }),
    );

    const newEntityIds = map(this.relations[relation].entities, 'id');
    const orphanedEntityIds = difference(oldEntityIds, newEntityIds);
    pullAll(newEntityIds, updatedIds);

    if (orphanedEntityIds.length > 0) {
      // DELETE FROM "customer_tag" WHERE "customer_id" = [customerId] AND "tag_id" = [tagId]"
      const query = `DELETE FROM "${
        this.relations[relation].metadata.junctionName
      }" WHERE "${this.relations[relation].metadata.joinColumn}" = ${
        this.entity.id
      } AND "${this.relations[relation].metadata.inverseJoinColumn}" IN (${join(
        orphanedEntityIds,
        ', ',
      )})`;
      await this.transaction.query(query);
    }

    await Promise.all(
      newEntityIds.map(async (newEntityId) => {
        // INSERT INTO "customer_tag"("customer_id", "tag_id") VALUES ([customerId], [tagId])"
        const query = `INSERT INTO "${this.relations[relation].metadata.junctionName}"("${this.relations[relation].metadata.joinColumn}", "${this.relations[relation].metadata.inverseJoinColumn}") VALUES (${this.entity.id}, ${newEntityId})`;

        await this.transaction.query(query);
      }),
    );
  }

  private loadRelationOldEntities(): void {
    for (const relation in this.relations) {
      if (
        this.relations[relation].active &&
        this.entity.hasOwnProperty(relation)
      ) {
        this.relations[relation].oldEntities = this.entity[relation];
      }
    }
  }

  private loadRelations(): void {
    this.repository.metadata.ownRelations.forEach((el) => {
      const relationType = el.relationType;
      if (relationType === 'one-to-many') {
        this.relations[el.propertyName] = {
          type: 'one-to-many',
          class: el.type,
          repository: getRepository(el.type),
          metadata: {
            inverseRelationJoinColumn:
              el.inverseRelation.joinColumns[0].propertyName,
            inverseRelationJoinColumnReference:
              el.inverseRelation.joinColumns[0].referencedColumn.propertyName,
          },
          pivotColumn: null,
          active: false,
          entities: [],
          oldEntities: [],
        };
      } else if (relationType === 'many-to-many') {
        this.relations[el.propertyName] = {
          type: 'many-to-many',
          class: el.type,
          repository: getRepository(el.type),
          metadata: {
            junctionName: el.junctionEntityMetadata.name,
            junctionClass: el.junctionEntityMetadata.target,
            joinColumn: el.joinColumns[0].propertyName,
            joinColumnReference:
              el.joinColumns[0].referencedColumn.propertyName,
            inverseJoinColumn: el.inverseJoinColumns[0].propertyName,
            inverseJoinColumnReference:
              el.inverseJoinColumns[0].referencedColumn.propertyName,
          },
          pivotColumn: null,
          active: false,
          entities: [],
          oldEntities: [],
        };
      }
    });
  }

  private getActiveRelationNames(): string[] {
    const relationNames = [];
    for (const relation in this.relations) {
      if (this.relations[relation].active) {
        relationNames.push(relation);
      }
    }
    return relationNames;
  }

  private async callHook(hook: HookParam, entity: any): Promise<void> {
    if (hook) {
      if (hook instanceof Function) {
        await Promise.resolve(hook(entity));
      } else assign(entity, hook);
    }
  }

  private async callRelationHook(
    hook: HookParam,
    relation: string,
    entity: any,
  ): Promise<void> {
    if (hook) {
      if (hook instanceof Function) {
        await Promise.resolve(hook(relation, entity));
      } else assign(entity, hook);
    }
  }

  private async parseIdsToInt(obj) {
    if (obj instanceof Array) {
      obj.map((el) => this.parseIdsToInt(el));
    } else if (typeof obj === 'object' && obj !== null) {
      for (const key of Object.keys(obj)) {
        this.parseIdsToInt(obj[key]);
        if (obj[key] instanceof Array) {
          this.parseIdsToInt(obj[key]);
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          this.parseIdsToInt(obj[key]);
        } else {
          const re = /id|\w+Id$/;
          const isNumber = /\d+/;
          if (re.test(key) && isNumber.test(obj[key])) {
            obj[key] = parseInt(obj[key], 10);
          }
        }
      }
    }
  }
}
