import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar', length: 120 })
  public name: string;


  @Column({ type: 'varchar', length: 120 })
  public image_url: string;

  @Column({ type: 'varchar',length:120})
  public isActive: string;

  @Column({ type: 'varchar', length: 120 })
  public id42: string;
//   @Column({ type: 'boolean', default: false })
//   public isDeleted: boolean;

//   /*
//    * Create and Update Date Columns
//    */

//   @CreateDateColumn({ type: 'timestamp' })
//   public createdAt!: Date;

//   @UpdateDateColumn({ type: 'timestamp' })
//   public updatedAt!: Date;
}