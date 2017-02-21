import { Option } from './Option';

export class Question {
	Id: string;
	HashID: string;

	Question: string;
	Options: Option[];
	Answer: string;

	//Next: string;
	Latitude: number;
	Longitude: number;
	//QuestId: string;
}
