import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";
import { Auctions } from "./auctions";

@Entity('favorites')
export class Favorites {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Users, (user) => user.id, { cascade: true, onDelete: "CASCADE" })
    user: Users;

    @ManyToOne(() => Auctions, (auction) => auction.id, { cascade: true, onDelete: "CASCADE" })
    auction: Auctions;

    @Column('boolean', { comment: '좋아요 여부', default: true })
    status: boolean;
}