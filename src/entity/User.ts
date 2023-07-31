import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, BeforeInsert } from "typeorm";
import { hashPassword } from "../utils/passwordService";

@Entity("users")
export class User extends BaseEntity {

    @PrimaryGeneratedColumn("uuid") id: string;

    @Column("varchar", { length: 255 })
    email: string;

    @Column("text")
    password: string;

    @Column("boolean", { default: false })
    confirmed: boolean;

    @BeforeInsert()
    async hashPasswordBeforeInsert() { 
        this.password = await hashPassword(this.password);
    }
}
