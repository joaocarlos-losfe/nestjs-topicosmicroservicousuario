import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { UserCreate } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Bcrypt } from '../../utils/security';
import { UserUpdate } from './dto/update-user.dto';

import axios from 'axios';

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

        const user = await this.prisma.user.findUnique({where:{id}});

        if(!user)
            throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);

        return user;
    }

    async readByUsername(username: string): Promise<User>{

        const user = await this.prisma.user.findUnique({where:{username}});

        if(!user)
            throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);

        return user;
    }

    async update(id: string, data: UserUpdate): Promise<User | null>{

        try{
            const user = await this.prisma.user.findUnique({where:{id}});
          
            if(!user)
                throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);

            if(data.password)
                data.password = await Bcrypt.hash(data.password);
            
            const updatedUser = await this.prisma.user.update({
                data:{
                    ...data,
                    updated_at: new Date()
                },
                where:{ id }
            });

        
            if(user.username != updatedUser.username){
                await axios.put(`http://messageapi:5000/messages/${user.username}/${updatedUser.username}`);
                await axios.put(`http://messageapi:5000/responses/${user.username}/${updatedUser.username}`);
            }
                
            return updatedUser;
            
        }
        catch(e){
            throw new HttpException('Usuário não encontrado', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        
    }

    async delete(id: string): Promise<User>{
        const user = await this.prisma.user.findUnique({where:{id}});

        if(!user)
            throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);

        await axios.delete(`http://messageapi:5000/messages/delete-all-messages-by-user/${user.username}`);

        return this.prisma.user.delete({where:{id}});
    }

}
