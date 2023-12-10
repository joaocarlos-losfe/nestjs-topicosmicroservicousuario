import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { UserCreate } from './dto/create-user.dto';
import { User } from './entities/user.entity';

import { Bcrypt } from '../../utils/security';
import { UserUpdate } from './dto/update-user.dto';


@Injectable()
export class UserService {
    constructor(private prisma: PrismaService){}

    async create(data: UserCreate): Promise<User>{
        const foundUser = await this.prisma.user.findFirst({
            where: {
                OR:[{username: data.username}, {email: data.email}]
            }
        })

        if(foundUser)
            throw new HttpException('Usuário ou email já cadastrado', HttpStatus.CONFLICT);

        return await this.prisma.user.create({
            data:{
                ...data,
                password: await Bcrypt.hash(data.password)
            }
        });
    }

    async readAll(): Promise<User[]>{
        return await this.prisma.user.findMany();
    }

    async read(id: string): Promise<User>{

        console.log('data')
        console.log(id)
        const user = await this.prisma.user.findUnique({where:{id}});

        if(!user)
            throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);

        return user;
    }

    async update(id: string, data: UserUpdate): Promise<User>{
        const user = await this.prisma.user.findUnique({where:{id}});

        if(!user)
            throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);

        if(data.password){
            data.password = await Bcrypt.hash(data.password)
        }

        return this.prisma.user.update({
            data:{
                ...data,
                updated_at: new Date()
            },
            where:{ id }
        });
    }

    async delete(id: string): Promise<User>{
        const user = await this.prisma.user.findUnique({where:{id}});

        if(!user)
            throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);

        return this.prisma.user.delete({where:{id}});
    }

}
