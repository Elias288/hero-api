import { ObjectId } from 'mongoose';

export default class CharacterDto {
  heroId: number;
  name: string;
  description?: string;
  image: string;
  comics: ObjectId[];
}
