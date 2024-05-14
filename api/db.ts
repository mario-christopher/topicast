import "reflect-metadata";
import "dotenv/config";
import { DataSource, Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm"
import { Topic, TopicState } from "./types.js";

let initializing = 0;

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'integer'
  })
  fid: number

  @Column({
    type: 'integer'
  })
  castId: number

  @Column({
    type: 'varchar'
  })
  requesterCustodyAddress: string

  @Column({
    type: 'varchar'
  })
  userName: string

  @Column({
    type: 'varchar'
  })
  topicName: string

  @Column({
    type: "timestamp",
  })
  startDateTime: Date;

  @Column({
    type: 'varchar'
  })
  status: string;

  @Column({
    type: "timestamp",
    nullable: true,
  })
  endDateTime: Date;

  @OneToMany(() => ItemResponse, (item) => item.user, { cascade: true })
  itemResponses: ItemResponse[]
}

@Entity()
export class ItemResponse {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    type: 'integer'
  })
  frameId: number

  @Column({
    type: 'varchar'
  })
  response: string

  @ManyToOne(() => User, (user) => user.itemResponses)
  @JoinColumn({ name: 'user_id' })
  user?: User;
}

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,

  synchronize: true,
  entities: [User, ItemResponse],
  migrations: []
});

export async function initializeDB() {
  if (!AppDataSource.isInitialized && !initializing) {
    initializing = 1
    await AppDataSource.initialize();
    console.log("DB Initialized");
  }
}

export async function saveTopiCast(topic: Topic, state: TopicState) {
  if (!topic || !state.fid) return;

  await initializeDB();
  const userRepo = AppDataSource.getRepository(User);
  let userCast = await getUserCast(state.fid, state.castId, topic.name);

  if (!userCast) {
    userCast = new User();
    userCast.itemResponses = [];
    userCast.fid = state.fid;
    userCast.castId = state.castId;
    userCast.requesterCustodyAddress = state.requesterCustodyAddress;
    userCast.userName = state.userName;
    userCast.topicName = topic.name;
    userCast.startDateTime = state.startDateTime;
  }
  userCast.status = state.status;
  userCast.endDateTime = state.endDateTime as Date;

  if (state.itemResponse) {
    Object.keys(state.itemResponse).forEach(i => {
      const item = userCast.itemResponses.find(uc => uc.frameId == +i)
      if (!item) {
        //  New Item, so add
        const itemResponse = new ItemResponse();
        itemResponse.frameId = +i;
        itemResponse.response = (state.itemResponse as any)[i];
        userCast.itemResponses.push(itemResponse);
      } else {
        item.response = (state.itemResponse as any)[i];
      }
    })
  }
  await userRepo.save(userCast);
}

export async function getUserCast(fid: number, castId: number, topicName: string) {
  const userRepo = AppDataSource.getRepository(User);
  const savedData = await userRepo.findOne({
    where: {
      fid, castId, topicName
    },
    relations: {
      itemResponses: true
    }
  });
  return savedData;
}