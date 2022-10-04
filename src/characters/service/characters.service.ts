import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import fetch from 'node-fetch';

import { CreateCharactersDto } from '../dto/create.characters.dto';

@Injectable()
export class CharactersService {
    async getCharacters(): Promise<{}> {
        const ts = process.env.TS, 
            privateKey = process.env.PRIVATE_KEY, 
            publicKey = process.env.PUBLIC_KEY;

        const md5 = createHash('md5').update(ts+privateKey+publicKey).digest("hex")
        const uri = `https://gateway.marvel.com:443/v1/public/characters?apikey=${publicKey}&ts=${ts}&hash=${md5}`;
        // console.log(uri);
        
        const characters = await fetch(uri)
            .then(res => res.json())
            .then((data) => {
                // console.log(data);
                const list: [] = data.data.results;
                const DtoList = [];
                list.forEach((characterInfo: any) => {
                    const characterDto = new CreateCharactersDto();
                    characterDto.id = characterInfo.id;
                    characterDto.name = characterInfo.name;
                    characterDto.description = characterInfo.description;
                    characterDto.image = characterInfo.thumbnail.path+'.'+characterInfo.thumbnail.extension;
                    DtoList.push(characterDto);
                });

                console.log(DtoList);
                return DtoList;
            });
            

        return { 'characters': characters }
    }
}
