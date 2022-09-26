import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1645160799380 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE OR REPLACE FUNCTION random_string(length integer)
    RETURNS text
    LANGUAGE plpgsql
    AS $function$
    declare
      chars text[] := '{1,2,3,4,5,6,7,8,9,a,b,c,d,e,f,g,h,j,k,m,n,p,q,r,s,t,u,v,w,x,y,z}';
      result text := '';
      i integer := 0;
    begin
      if length < 0 then
        raise exception 'Given length cannot be less than 0';
      end if;
      for i in 1..length loop
        result := result || chars[1+random()*(array_length(chars, 1)-1)];
      end loop;
      return result;
    end;
    $function$
   `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP FUNCTION IF EXISTS random_string`);
  }
}
